import express from "express";

import router from "./router";

const app = express();
const port = 8000;

router(app);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
