import { ObjectId } from "mongodb";
import type { ParameterizedContext, DefaultState } from "koa";

import { users } from "@models/index";

class UsersController {
  /** 获取用户列表 */
  async getUserList(
    ctx: ParameterizedContext<{
      pagination: {
        limit: number;
        skip: number;
      };
    }>
  ) {
    ctx.body = await users.find().limit(ctx.state.pagination.limit).skip(ctx.state.pagination.skip);
  }

  /** 获取某个用户的信息 */
  getUserInfo = async (
    ctx: ParameterizedContext<
      DefaultState,
      {
        params: {
          userId: string;
        };
      }
    >
  ) => {
    const userId = ctx.params.userId;
    const userInfo = await users.findOne({ _id: new ObjectId(userId) });
    if (userInfo) {
      ctx.body = userInfo;
    } else {
      ctx.throw(404, "未查询到指定用户信息");
    }
  };
}

export default new UsersController();
