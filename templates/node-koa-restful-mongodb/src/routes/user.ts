import Router from "@koa/router";

import userController from "@controllers/user";
import { checkAuthentication } from "@middlewares/utilitiMiddleware";

const userRouter = new Router({
  prefix: "/user",
});

userRouter.get("/", checkAuthentication, userController.getAuthenticatedUserInfo);
userRouter.post("/", userController.createUser);
userRouter.patch("/", checkAuthentication, userController.updateAuthenticatedUserInfo);
userRouter.delete("/", checkAuthentication, userController.deleteAuthenticatedUser);

export default userRouter;
