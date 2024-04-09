import error from "koa-json-error";
import _ from "lodash";
import type { App } from "./types";

export default function jsonError(app: App): void {
  app.use(
    error({
      postFormat: (e, obj) =>
        process.env.NODE_ENV === "production" ? _.omit(obj, "stack") : obj,
    })
  );
}
