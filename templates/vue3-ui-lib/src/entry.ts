import type { Plugin } from "vue";
import { Button } from "./components/index";

export const installAllComponents: Plugin = {
  install(app) {
    app.component(Button.name, Button);
  },
};
