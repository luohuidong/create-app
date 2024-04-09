import express from "express";

import middleware from "./middleware";
import router from "./router";

const app = express();
const port = 8000;

middleware(app).then(() => {
  router(app);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
