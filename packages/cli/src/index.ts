#!/usr/bin/env node

import fs from "node:fs";
import inquirer from "inquirer";

import CopyTemplate from "./CopyTemplate.js";
import { errMsg } from "./errMsg.js";

const result = fs.readdirSync(process.cwd());

function copy() {
  const copyTemplate = new CopyTemplate();
  copyTemplate.copy();
}

if (result.length > 0) {
  try {
    const answers = await inquirer.prompt([
      {
        name: "folderNotEmpty",
        type: "confirm",
        message: "当前目录不是一个空目录，是否继续？",
      },
    ]);

    if (answers.folderNotEmpty) {
      copy();
    }
  } catch (err) {
    console.log(errMsg(err));
  }
} else {
  copy();
}
