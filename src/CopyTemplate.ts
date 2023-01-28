import path from "node:path";
import fs from "node:fs";
import ora from "ora";
import { fileURLToPath } from "node:url";

import { recurseDir } from "./fsUtils.js";
import { errMsg } from "./errMsg.js";

export default class CopyTemplate {
  private templateName: string;
  private get templateFolderPath() {
    return fileURLToPath(new URL(`../templates/${this.templateName}`, import.meta.url));
  }
  private projectName: string;
  private get projectFolderPath() {
    return path.resolve(process.cwd(), this.projectName);
  }

  constructor(templateName: string, projectName: string) {
    this.templateName = templateName;
    this.projectName = projectName;
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

      // copy template from unzip folder to current working directory
      recurseDir(this.templateFolderPath, this.templateFolderPath, (fileInfo) => {
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

      spinner.succeed();
    } catch (error) {
      console.error("🚀 ~ file: CopyTemplate.ts ~ line 134 ~ CopyTemplate ~ copy ~ error", error);
      spinner.fail();
    }
  }
}
