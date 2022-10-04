import Router from "@koa/router";

const router = new Router();

router.get("/", (ctx) => {
  ctx.body = "这是首页";
});

export default router;
