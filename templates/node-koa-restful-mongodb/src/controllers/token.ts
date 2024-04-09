import type { ParameterizedContext } from "koa";
import Joi from "joi";
import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcrypt";

import { users } from "@models/index";

class TokenController {
  /**
   * 通过用户名查找用户信息
   * @param username
   * @returns
   */
  private _findUserByUsername = async (username: string) => {
    const userData = await users.findOne({
      username,
    });

    return userData;
  };

  login = async (ctx: ParameterizedContext) => {
    interface Schema {
      username: string;
      password: string;
    }
    const schema = Joi.object<Schema>({
      username: Joi.string().required(),
      password: Joi.string().required(),
    });

    const validateResult = schema.validate(ctx.request.body);
    if (validateResult.error) {
      ctx.throw(400, "请输入正确的用户名和密码");
    }

    const value = validateResult.value as Schema;
    const userData = await this._findUserByUsername(value.username);
    if (!userData) {
      ctx.throw(401, "当前用户名不存在");
    }

    // 校验用户输入的密码是否与数据库中存储的一致
    const hash = userData.password;
    const isSame = await bcrypt.compare(value.password, hash);
    if (!isSame) {
      ctx.throw(401, "当前用户名对应密码不正确");
    }

    // 生成 token
    const token = jsonwebtoken.sign(
      {
        _id: userData._id,
        name: userData.username,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    ctx.body = {
      token,
    };
  };
}

export default new TokenController();
