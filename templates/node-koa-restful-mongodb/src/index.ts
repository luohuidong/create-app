import "module-alias/register";
import Koa from "koa";
import dotenv from "dotenv";

dotenv.config();

import middleware from "./middlewares";
import route from "./routes";
import { client } from "./db";

client.connect().then(() => {
  const app = new Koa();
  middleware(app);
  route(app);

  app.listen(8000, () => {
    console.log("server on 8000");
  });
});
