import Router from "@koa/router";
import tokenController from "@controllers/token";

const router = new Router({
  prefix: "/token",
});

router.post("/login", tokenController.login);

export default router;
