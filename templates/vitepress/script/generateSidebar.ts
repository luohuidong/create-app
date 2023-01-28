import * as fs from "node:fs";
import * as url from "node:url";
import * as path from "node:path";
import type { DefaultTheme } from "vitepress";

const docsFolder = url.fileURLToPath(new URL("../docs/", import.meta.url));
const docsSubItems = fs.readdirSync(docsFolder);

const sidebar: DefaultTheme.Sidebar = {};

docsSubItems.forEach((docsSubItem) => {
  const docsSubItemPath = url.fileURLToPath(
    new URL(`../docs/${docsSubItem}`, import.meta.url)
  );
  const stat = fs.statSync(docsSubItemPath);

  if (stat.isDirectory() && docsSubItem !== ".vitepress") {
    const projectFolders = fs.readdirSync(docsSubItemPath);

    for (let projectFolder of projectFolders) {
      const projectSidebarData = JSON.parse(
        fs.readFileSync(
          path.resolve(docsSubItemPath, projectFolder, "sidebar.json"),
          {
            encoding: "utf-8",
          }
        )
      ) as DefaultTheme.SidebarGroup;

      projectSidebarData.items = projectSidebarData.items.map((item) => ({
        ...item,
        link:
          item.link === "index"
            ? `/${docsSubItem}/${projectFolder}/`
            : `/${docsSubItem}/${projectFolder}/${item.link}`,
      }));

      sidebar[`/${docsSubItem}/${projectFolder}/`] = [
        Object.assign({}, projectSidebarData, {}),
      ];
    }
  }
});

fs.writeFileSync(
  path.resolve(docsFolder, ".vitepress", "sidebar.json"),
  JSON.stringify(sidebar, null, 2)
);
