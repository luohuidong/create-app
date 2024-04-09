import Router from "@koa/router";

import usersController from "@controllers/users";
import { getPaginationInfo } from "@middlewares/utilitiMiddleware";

const usersRouter = new Router({
  prefix: "/users",
});

usersRouter.get("/", getPaginationInfo, usersController.getUserList);
usersRouter.get("/:userId", usersController.getUserInfo);

export default usersRouter;
