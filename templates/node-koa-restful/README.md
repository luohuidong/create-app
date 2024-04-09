# Koa Template

## Scaffolding your Koa project

With NPM:

```bash
npm create @app-template/app@latest my-koa-project -- --template node-koa
```

With PNPM:

```bash
pnpm create @app-template/app@latest my-koa-project --template node-koa
```

## How to use

### Development

compile typescript to javascript:

```bash
pnpm build:dev
```

run the server:

```bash
pnpm serve:dev
```

### Production

compile typescript to javascript:

```bash
pnpm build
```

run the server:

```bash
node dist/index.js
```
