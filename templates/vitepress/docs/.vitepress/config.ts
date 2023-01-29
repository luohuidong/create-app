import { defineConfig } from "vitepress";

export default defineConfig({
  title: "docs",
  themeConfig: {
    sidebar: [
      {
        text: "Guide",
        items: [
          { text: "Introduction", link: "/" },
          { text: "docs1", link: "/docs1" },
          { text: "docs2", link: "/docs2" },
        ],
      },
    ],
  },
});
