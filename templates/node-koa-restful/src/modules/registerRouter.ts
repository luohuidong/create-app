import type Koa from "koa";
import * as fs from "node:fs";
import * as path from "node:path";
import Router from "@koa/router";
import { fileURLToPath } from "node:url";

/**
 * Dynamic loading of all route-related files in the 'routes' folder.
 * @param app
 */
export default function registerRouter(app: Koa<Koa.DefaultState, Koa.DefaultContext>): void {
  const currentDir = fileURLToPath(new URL(".", import.meta.url));

  const modules = fs
    .readdirSync(currentDir)
    .filter((module) => fs.statSync(path.resolve(currentDir, module)).isDirectory());

  // Dynamic loading of routes defined in files based on their filenames.
  modules.forEach(async (module) => {
    const route = (await import(`./${module}/router.js`)).default as Router;
    app.use(route.routes()).use(route.allowedMethods());
  });
}
