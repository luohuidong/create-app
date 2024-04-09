import express from "express";
import fs from "fs";
import path from "path";

export default async function middleware(app: express.Application): Promise<void> {
  const files = fs.readdirSync(path.join(__dirname));
  const regExp = /\.js$/;

  const promises = [];

  for (let i = 0; i < files.length - 1; i++) {
    const filename = files[i];
    if (regExp.test(filename) && filename !== "index.js") {
      promises.push(import(path.join(__dirname, filename)));
    }
  }

  const results = await Promise.all(promises);
  results.forEach(({ default: injectMiddleware }) => {
    injectMiddleware(app);
  });
}
