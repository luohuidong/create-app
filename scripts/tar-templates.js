import "zx/globals";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

cd("templates");

const templateDir = fileURLToPath(new URL("../templates", import.meta.url));
const dirs = fs
  .readdirSync(templateDir)
  .filter((item) => fs.statSync(`${templateDir}/${item}`).isDirectory() && item !== "node_modules");

for (let dir of dirs) {
  await $`tar --exclude="node_modules" -czvf ../templates/${dir}.tar.gz ${dir}`;
}
