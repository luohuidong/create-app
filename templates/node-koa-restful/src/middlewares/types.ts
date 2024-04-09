import type Koa from "koa";

export type App = Koa<Koa.DefaultState, Koa.DefaultContext>;
