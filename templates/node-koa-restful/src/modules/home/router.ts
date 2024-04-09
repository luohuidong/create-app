import Router from "@koa/router";

const router = new Router();

router.get("/", (ctx) => {
  ctx.body = "Home page";
});

export default router;
