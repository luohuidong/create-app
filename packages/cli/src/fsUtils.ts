import fs from "node:fs";
import path from "node:path";

interface FileInfo {
  name: string;
  relativePath: string;
  absolutePath: string;
  type: "dir" | "file";
}

/**
 * 递归目录
 * @param dirPath 需要递归的目录
 * @param rootDirPath 递归的根目录
 * @param cb 回调函数
 */
export function recurseDir(
  dirPath: string,
  rootDirPath: string,
  cb: (fileInfo: FileInfo) => void
): void {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const filePath = path.resolve(dirPath, file);
    const stat = fs.statSync(filePath);

    const isDir = stat.isDirectory();

    cb({
      name: file,
      type: isDir ? "dir" : "file",
      relativePath: path.relative(rootDirPath, filePath),
      absolutePath: filePath,
    });

    if (isDir) {
      recurseDir(filePath, rootDirPath, cb);
    }
  });
}
