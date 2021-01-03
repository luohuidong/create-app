import fs from "fs";
import inquirer from "inquirer";

import CopyTemplate from "./CopyTemplate";

const result = fs.readdirSync(process.cwd());

function copy() {
  const copyTemplate = new CopyTemplate();
  copyTemplate.copy();
}

if (result.length > 0) {
  inquirer
    .prompt([
      {
        name: "folderNotEmpty",
        type: "confirm",
        message: "当前目录不是一个空目录，是否继续？",
      },
    ])
    .then((answers) => {
      if (answers.folderNotEmpty) {
        copy();
      }
    })
    .catch((error) => {
      if (error.isTtyError) {
        // Prompt couldn't be rendered in the current environment
      } else {
        // Something else went wrong
      }
    });
} else {
  copy();
}
