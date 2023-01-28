import * as fs from "node:fs";
import * as url from "node:url";
import * as path from "node:path";

const docsFolder = url.fileURLToPath(new URL("../docs/", import.meta.url));
const docsSubItems = fs.readdirSync(docsFolder);

const nav: {
  text: string;
  items: {
    text: string;
    link: string;
  }[];
}[] = [];

docsSubItems.forEach((docsSubItem) => {
  const docsSubItemPath = url.fileURLToPath(
    new URL(`../docs/${docsSubItem}`, import.meta.url)
  );
  const stat = fs.statSync(docsSubItemPath);

  if (stat.isDirectory() && docsSubItem !== ".vitepress") {
    const projectFolders = fs.readdirSync(docsSubItemPath);

    nav.push({
      text: docsSubItem,
      items: projectFolders.map((project) => ({
        text: project,
        link: `/${docsSubItem}/${project}/`,
      })),
    });
  }
});

fs.writeFileSync(
  path.resolve(docsFolder, ".vitepress", "nav.json"),
  JSON.stringify(nav, null, 2)
);
