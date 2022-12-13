#!/usr/bin/env node

import inquirer from "inquirer";

import CopyTemplate from "./CopyTemplate.js";
import { errMsg } from "./errMsg.js";
import fs from "node:fs";

try {
  const answers = await inquirer.prompt<{
    projectName: string;
    template: string;
  }>([
    {
      name: "projectName",
      type: "input",
      message: "project name:",
    },
    {
      name: "template",
      type: "list",
      message: "template:",
      choices: fs.readdirSync(new URL("../template", import.meta.url)),
    },
  ]);

  const { template, projectName } = answers;

  const copyTemplate = new CopyTemplate(template, projectName);
  copyTemplate.copy();
} catch (err) {
  console.log(errMsg(err));
}
