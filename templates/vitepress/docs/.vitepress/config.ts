import { defineConfig } from "vitepress";
import nav from "./nav.json";
import sidebar from "./sidebar.json";

export default defineConfig({
  title: "docs",
  themeConfig: {
    nav,
    sidebar,
  },
});
