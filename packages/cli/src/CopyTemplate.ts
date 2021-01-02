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

const timeout = 100000;

export default class CopyTemplate {
  url: string;
  dist: string;

  constructor(url: string, dist: string) {
    this.url = url;
    this.dist = dist;
  }

  /** 获取仓库中的应用模板列表 */
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
      console.log(
        "🚀 ~ file: CopyTemplate.ts ~ line 91 ~ CopyTemplate ~ getRepoTreeBySha ~ err",
        err.message
      );

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
          },
          (res) => {
            const writeStream = fs.createWriteStream(path.resolve(process.cwd(), treeItemPath));
            res.pipe(writeStream);

            res.on("end", () => {
              spinner.succeed();
              resolve(null);
            });
            res.on("error", (err) => {
              spinner.fail();
              reject(err.message);
            });
          }
        );
        req.on("error", (err) => {
          spinner.fail();
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
