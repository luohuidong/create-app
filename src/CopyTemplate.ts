import path from "node:path";
import fs from "node:fs";
import { Octokit } from "@octokit/core";
import ora from "ora";
import AdmZip from "adm-zip";

import { recurseDir } from "./fsUtils.js";
import { errMsg } from "./errMsg.js";

const octokit = new Octokit();

export default class CopyTemplate {
  private templateName: string;
  private projectName: string;
  private get projectFolderPath() {
    return path.resolve(process.cwd(), this.projectName);
  }

  constructor(templateName: string, projectName: string) {
    this.templateName = templateName;
    this.projectName = projectName;
  }

  /**
   * download repository zipball
   * @returns zipball file absolute path
   */
  private async _downloadRepoArchiveZip(): Promise<string> {
    try {
      const response = await octokit.request("GET /repos/{owner}/{repo}/zipball/", {
        owner: "web-app-template",
        repo: this.templateName,
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
      const fileAbsolutePath = path.resolve(this.projectFolderPath, filename);
      fs.writeFileSync(fileAbsolutePath, Buffer.from(unit8Array));

      return fileAbsolutePath;
    } catch (error) {
      throw new Error(errMsg(error));
    }
  }

  private _unZipFile(fileAbsolutePath: string): void {
    // reading archives
    const zip = new AdmZip(fileAbsolutePath);
    zip.extractAllTo(this.projectFolderPath);
  }

  private _changeProjectName() {
    const packagejsonFilePath = path.resolve(this.projectFolderPath, "package.json");

    const data = fs.readFileSync(packagejsonFilePath, {
      encoding: "utf-8",
    });

    const tmp = JSON.parse(data) as {
      name: string;
    };
    tmp.name = this.projectName;
    fs.writeFileSync(packagejsonFilePath, JSON.stringify(tmp, null, 2));
  }

  async copy(): Promise<void> {
    const spinner = ora("project initialization").start();

    try {
      fs.mkdirSync(this.projectFolderPath);

      // download template repository zipball
      const zipFileAbsolutePath = await this._downloadRepoArchiveZip();
      this._unZipFile(zipFileAbsolutePath);
      // the folder location of unzipping
      const upzipFolderAbsolutePath = zipFileAbsolutePath.replace(".zip", "");

      // copy template from unzip folder to current working directory
      recurseDir(upzipFolderAbsolutePath, upzipFolderAbsolutePath, (fileInfo) => {
        if (fileInfo.type === "dir") {
          try {
            fs.mkdirSync(path.resolve(this.projectFolderPath, fileInfo.relativePath));
          } catch (error) {
            console.error(errMsg(error));
          }
        } else {
          fs.copyFileSync(
            fileInfo.absolutePath,
            path.resolve(this.projectFolderPath, fileInfo.relativePath)
          );
        }
      });

      this._changeProjectName();

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
