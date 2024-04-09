import jwt = require("koa-jwt");
import type { Next, ParameterizedContext } from "koa";

/**
 * 检查用户是否已被认证
 */
export const checkAuthentication = jwt({
  secret: process.env.JWT_SECRET as string,
});

export async function getPaginationInfo(ctx: ParameterizedContext, next: Next): Promise<void> {
  let limit = 10;
  let skip = 0;

  const { perPage, page } = ctx.query as {
    perPage?: string;
    page?: string;
  };

  if (perPage) {
    limit = Math.max(parseInt(perPage), 1);
  }

  if (page) {
    const tmpPage = Math.max(parseInt(page), 1);
    skip = (tmpPage - 1) * limit;
  }

  ctx.state.pagination = {
    limit,
    skip,
  };

  await next();
}
