import path from "node:path";
import fs from "node:fs";
import { Octokit } from "@octokit/core";
import inquirer from "inquirer";
import ora from "ora";
import AdmZip from "adm-zip";

import { recurseDir } from "./fsUtils.js";
import { errMsg } from "./errMsg.js";

const octokit = new Octokit();

export default class CopyTemplate {
  private _templateNames = [
    "template-node-typescript",
    "template-express-typescript",
    "template-koa-mongodb",
    "template-hexo-blog",
  ];

  /**
   * download repository zipball
   * @param repoName repository name
   * @returns
   */
  private async _downloadRepoArchiveZip(repoName: string): Promise<string> {
    try {
      const response = await octokit.request("GET /repos/{owner}/{repo}/zipball/", {
        owner: "web-app-template",
        repo: repoName,
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      });

      // get zipball file name
      const contentDisposition = response.headers["content-disposition"] as string;
      const regexp = /filename=([\w-]+\.zip)/;
      const result = regexp.exec(contentDisposition) as RegExpExecArray;
      const filename = result[1];

      // save the zipball file
      const unit8Array = response.data;
      const fileAbsolutePath = path.resolve(process.cwd(), filename);
      fs.writeFileSync(fileAbsolutePath, Buffer.from(unit8Array));

      return fileAbsolutePath;
    } catch (error) {
      throw new Error(errMsg(error));
    }
  }

  private _unZipFile(fileAbsolutePath: string): void {
    // reading archives
    const zip = new AdmZip(fileAbsolutePath);
    zip.extractAllTo(process.cwd());
  }

  async copy(): Promise<void> {
    const answers = await inquirer.prompt([
      {
        name: "templateName",
        type: "list",
        message: "please select template",
        choices: this._templateNames,
      },
    ]);

    const templateName = answers.templateName;

    const spinner = ora("project initialization").start();

    try {
      // download template repository zipball
      const zipFileAbsolutePath = await this._downloadRepoArchiveZip(templateName);

      this._unZipFile(zipFileAbsolutePath);
      // the folder location of unzipping
      const upzipFolderAbsolutePath = zipFileAbsolutePath.replace(".zip", "");

      // copy template from unzip folder to current working directory
      recurseDir(upzipFolderAbsolutePath, upzipFolderAbsolutePath, (fileInfo) => {
        const currentWorkDir = process.cwd();

        if (fileInfo.type === "dir") {
          try {
            fs.mkdirSync(path.resolve(currentWorkDir, fileInfo.relativePath));
          } catch (error) {
            console.error(errMsg(error));
          }
        } else {
          fs.copyFileSync(
            fileInfo.absolutePath,
            path.resolve(currentWorkDir, fileInfo.relativePath)
          );
        }
      });

      // delete zipball and the folder of unzipping
      fs.rmSync(zipFileAbsolutePath);
      fs.rmSync(upzipFolderAbsolutePath, {
        recursive: true,
      });
      spinner.succeed();
    } catch (error) {
      console.error("🚀 ~ file: CopyTemplate.ts ~ line 134 ~ CopyTemplate ~ copy ~ error", error);
      spinner.fail();
    }
  }
}
