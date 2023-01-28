import express from "express";
import fs from "fs";
import path from "path";

export default async function (app: express.Application): Promise<void> {
  const fileBasenames = fs.readdirSync(path.join(__dirname));
  const jsFileBasenameRegExp = /\.js$/;
  const filenameRegExp = /(.+)\.js$/;

  const promises = [];

  for (let i = 0; i < fileBasenames.length - 1; i++) {
    const fileBasename = fileBasenames[i];

    if (jsFileBasenameRegExp.test(fileBasename) && fileBasename !== "index.js") {
      const filenameResult = filenameRegExp.exec(fileBasename);
      if (filenameResult) {
        const filename = filenameResult[1];
        const filePath = path.join(__dirname, fileBasename);
        const promise = import(filePath).then(({ default: router }) => ({
          path: filename === "root" ? "/" : `/${filename}`,
          router,
        }));
        promises.push(promise);
      }
    }
  }

  const results = await Promise.all(promises);
  results.forEach(({ path, router }) => {
    app.use(path, router);
  });
}
