import https from "https";
import path from "path";
import fs from "fs";
import AdmZip from "adm-zip";

export default class CopyTemplate {
  url: string;
  dist: string;
  filename = "repo.zip";

  constructor(url: string, dist: string) {
    this.url = url;
    this.dist = dist;
  }

  /**
   * 下载仓库 zip 压缩文件
   * @param url 下载地址
   * @param dist 存放目录
   * @param filename 文件名
   */
  private downloadRepoZipFile(url: string, dist: string, filename: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const req = https.get(
        url,
        {
          headers: {
            "User-Agent": "@luohuidong/template-cli",
          },
        },
        (res) => {
          if (res.statusCode === 200) {
            const filePath = path.resolve(dist, filename);
            const writableStream = fs.createWriteStream(filePath);
            res.pipe(writableStream);

            res.on("end", () => {
              resolve();
            });
          }

          // 如果为重定向，则再次进行下载仓库的操作
          if (res.statusCode === 302) {
            this.downloadRepoZipFile(res.headers.location as string, dist, filename);
          }

          res.on("error", (err) => {
            reject(err.message);
          });
        }
      );

      req.on("error", (e) => {
        reject(e.message);
      });

      req.end();
    });
  }

  /**
   * 将下载的压缩文件解压到当前执行命令的目录
   */
  private unzip(): void {
    const zip = new AdmZip(this.dist + this.filename);
    const cwd = process.cwd();
    zip.extractAllTo(cwd);
  }

  async copy(): Promise<void> {
    await this.downloadRepoZipFile(this.url, this.dist, this.filename);
    this.unzip();
  }
}
