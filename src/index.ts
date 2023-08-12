#!/usr/bin/env node

import inquirer from "inquirer";
import { program } from "commander";

import CopyTemplate from "./CopyTemplate.js";
import { errMsg } from "./errMsg.js";
import fs from "node:fs";
import path from "node:path";

program.name("create-app").description("CLI for creating a JavaScript new app");
program
  .argument("[name]", "project name")
  .option("--template <templateName>", "template name")
  .parse();

const { template } = program.opts();
const name = program.args[0];

if (template && name) {
  const copyTemplate = new CopyTemplate(template, name);
  await copyTemplate.copy();
} else {
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
        choices: fs
          .readdirSync(new URL("../tmp", import.meta.url))
          .map((filename) => path.basename(filename, ".tar.gz")),
      },
    ]);

    const { template, projectName } = answers;

    const copyTemplate = new CopyTemplate(template, projectName);
    await copyTemplate.copy();
  } catch (err) {
    console.log(errMsg(err));
  }
}
