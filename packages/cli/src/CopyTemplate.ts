import path from "path";
import fs from "fs";
import { Octokit } from "@octokit/core";
import inquirer from "inquirer";
import ora from "ora";
import AdmZip from "adm-zip";
import { recurseDir } from "./fsUtils";

import type { TemplatesInfo, TemplateInfo } from "./CopyTemplateTypes";

const octokit = new Octokit({
  userAgent: "@luohuidong/template-cli",
});

const timeout = 10000;

export default class CopyTemplate {
  private async getTemplatesInfo(): Promise<TemplatesInfo> {
    const spinner = ora("正在请求 GitHub 仓库中的应用模板列表").start();
    try {
      const response = await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
        owner: "luohuidong",
        repo: "app-template",
        path: "packages",
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
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

  async downloadZip(): Promise<string> {
    try {
      const response = await octokit.request("GET /repos/{owner}/{repo}/zipball/", {
        owner: "luohuidong",
        repo: "app-template",
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      });

      // 获取压缩的文件名称
      const contentDisposition = response.headers["content-disposition"] as string;
      const regexp = /filename=([\w-]+\.zip)/;
      const result = regexp.exec(contentDisposition) as RegExpExecArray;
      const filename = result[1];

      // 将压缩文件的内容保存到本地
      const unit8Array = response.data;
      const fileAbsolutePath = path.resolve(process.cwd(), filename);
      fs.writeFileSync(fileAbsolutePath, Buffer.from(unit8Array));
      return fileAbsolutePath;
    } catch (error) {
      console.log(
        "🚀 ~ file: CopyTemplate.ts ~ line 160 ~ CopyTemplate ~ downloadZip ~ error",
        error
      );
      throw new Error(error.message);
    }
  }

  unZipFile(fileAbsolutePath: string): void {
    // reading archives
    const zip = new AdmZip(fileAbsolutePath);
    zip.extractAllTo(process.cwd());
  }

  async copy(): Promise<void> {
    const templatesInfo = await this.getTemplatesInfo();
    const templateNames = Object.keys(templatesInfo);

    const answers = await inquirer.prompt([
      {
        name: "templateName",
        type: "list",
        message: "请选择模板",
        choices: templateNames,
      },
    ]);

    const templateName = answers.templateName;

    const spinner = ora("项目初始化中").start();

    try {
      // 下载仓库的 zip 包，并将该包压缩到当前目录
      const zipFileAbsolutePath = await this.downloadZip();
      this.unZipFile(zipFileAbsolutePath);
      /** 解压后的文件夹路径 */
      const upzipFolderAbsolutePath = zipFileAbsolutePath.replace(".zip", "");
      /** 模板目录 */
      const templateFolderDirPath = path.resolve(upzipFolderAbsolutePath, "packages", templateName);
      /** 复制模板目录中的所有文件到当前工作目录 */
      recurseDir(templateFolderDirPath, templateFolderDirPath, (fileInfo) => {
        const currentWorkDir = process.cwd();

        if (fileInfo.type === "dir") {
          try {
            fs.mkdirSync(path.resolve(currentWorkDir, fileInfo.relativePath));
          } catch (error) {}
        } else {
          fs.copyFileSync(
            fileInfo.absolutePath,
            path.resolve(currentWorkDir, fileInfo.relativePath)
          );
        }
      });

      // 删除 zip 包和 zip 包解压出来的文件
      fs.rmSync(zipFileAbsolutePath);
      fs.rmSync(upzipFolderAbsolutePath, {
        recursive: true,
      });
      spinner.succeed("项目初始化完毕");
    } catch (error) {
      spinner.fail("项目初始化失败");
      console.log("🚀 ~ file: CopyTemplate.ts ~ line 121 ~ CopyTemplate ~ copy ~ error", error);
    }
  }
}
