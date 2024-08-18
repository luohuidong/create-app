import path from "node:path";
import fs from "node:fs";
import ora from "ora";
import { fileURLToPath } from "node:url";
import * as tar from "tar";

export default class CopyTemplate {
  private templateName: string;
  private get templateTarFileName() {
    return `${this.templateName}.tar.gz`;
  }
  private get templateTarFilePath() {
    return fileURLToPath(new URL(`../templates/${this.templateTarFileName}`, import.meta.url));
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
      const tarFileDestPath = path.resolve(process.cwd(), this.templateTarFileName);

      // copy template tar.gz file to current working directory
      fs.copyFileSync(this.templateTarFilePath, tarFileDestPath);

      // unzip tar.gz file
      await tar.x({
        file: path.resolve(tarFileDestPath),
      });

      // delete tar.gz file
      fs.rmSync(tarFileDestPath);

      // modify folder name
      fs.renameSync(this.templateName, this.projectName);

      // delete .git file
      fs.rmSync(path.resolve(this.projectFolderPath, ".git"));

      // change project name in package.json
      this._changeProjectName();

      spinner.succeed();
    } catch (error) {
      console.error("error: ", error);
      spinner.fail();
    }
  }
}
