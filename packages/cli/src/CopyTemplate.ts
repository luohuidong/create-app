import path from "path";
import fs from "fs";
import { Octokit } from "@octokit/core";
import inquirer from "inquirer";
import ora from "ora";
import https from "https";

import type {
  TemplatesInfo,
  TemplateInfo,
  RepoTreeItemInfo,
  RepoTreeInfo,
} from "./CopyTemplateTypes";

const octokit = new Octokit({
  userAgent: "@luohuidong/template-cli",
});

const timeout = 10000;

export default class CopyTemplate {
  private async getTemplatesInfo(): Promise<TemplatesInfo> {
    const spinner = ora("正在请求应用模板列表").start();
    try {
      const response = await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
        owner: "luohuidong",
        repo: "app-template",
        path: "packages",
        request: {
          timeout,
        },
      });

      const templatesInfo: TemplatesInfo = {};
      const data = response.data as TemplateInfo[];
      data.forEach((templateInfo) => {
        if (templateInfo.name !== "cli") {
          templatesInfo[templateInfo.name] = templateInfo;
        }
      });

      spinner.succeed("请求应用模板列表成功");

      return templatesInfo;
    } catch (error) {
      spinner.fail("请求应用模板列表失败");
      throw new Error(error.message);
    }
  }

  /**
   * 通过 tree sha 获取模板中的文件列表
   * @param sha
   */
  private async getRepoTreeBySha(sha: string) {
    const spinner = ora("正在请求模板文件列表").start();
    try {
      const { data } = await octokit.request("GET /repos/{owner}/{repo}/git/trees/{tree_sha}", {
        owner: "luohuidong",
        repo: "app-template",
        tree_sha: sha,
        recursive: "true",
        request: {
          timeout,
        },
      });

      spinner.succeed("获取模板文件列表成功");
      return data.tree as RepoTreeInfo;
    } catch (err) {
      spinner.fail("获取模板文件列表失败");
      throw new Error(err.message);
    }
  }

  /**
   * 通过文件 url 下载文件
   * @param url
   */
  private download(repoTreeItemInfo: RepoTreeItemInfo) {
    return new Promise((resolve, reject) => {
      const { url, path: treeItemPath, type } = repoTreeItemInfo;

      if (type === "tree") {
        try {
          fs.statSync(treeItemPath);
        } catch (error) {
          fs.mkdirSync(treeItemPath);
        } finally {
          resolve(null);
        }
      } else {
        const spinner = ora(`正在下载 ${treeItemPath}`);
        const req = https.get(
          url,
          {
            timeout,
            headers: {
              "User-Agent": "@luohuidong/template-cli",
            },
          },
          (res) => {
            const buffers: Buffer[] = [];

            res.on("data", (buffer: Buffer) => {
              buffers.push(buffer);
            });

            res.on("end", () => {
              try {
                // decode baser64 的内容
                const result = Buffer.concat(buffers).toString();
                const content = JSON.parse(result).content;
                const buff = Buffer.from(content, "base64");

                // 将 decode 的内容写到文件中
                fs.writeFileSync(path.resolve(process.cwd(), treeItemPath), buff);

                spinner.succeed(`下载 ${treeItemPath} 完成`);
                resolve(null);
              } catch (error) {
                reject(error.message);
              }
            });

            res.on("error", (err) => {
              spinner.fail(`下载 ${treeItemPath} 失败`);
              reject(err.message);
            });
          }
        );

        req.on("error", (err) => {
          spinner.fail(`下载 ${treeItemPath} 失败`);
          reject(err.message);
        });
      }
    });
  }

  async copy(): Promise<void> {
    const templatesInfo = await this.getTemplatesInfo();
    const templateNames = Object.keys(templatesInfo);

    // 获取模板对应的 sha 值
    const answers = await inquirer.prompt([
      {
        type: "list",
        name: "template",
        message: "请选择应用模板",
        choices: templateNames,
      },
    ]);
    const template = answers.template;
    const templateHash = templatesInfo[template].sha;

    // 获取模板的文件列表
    const repoTreeInfo = await this.getRepoTreeBySha(templateHash);

    // 下载模板中的所有文件
    const promises = repoTreeInfo.map((info) => this.download(info));
    Promise.all(promises);
  }
}
