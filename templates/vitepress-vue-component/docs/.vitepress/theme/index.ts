// .vitepress/theme/index.js
import DefaultTheme from "vitepress/theme";
import type { EnhanceAppContext } from "vitepress";

export default {
  ...DefaultTheme,
  enhanceApp(ctx: EnhanceAppContext) {
    // extend default theme custom behaviour.
    DefaultTheme.enhanceApp(ctx);

    // register your custom global components
  },
};
