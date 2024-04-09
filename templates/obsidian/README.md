# Obsidian Template

## Scaffolding Your Obsidian Project

With NPM:

```bash
npm create @app-template/app@latest my-obsidian-project -- --template obsidian
```

With PNPM:

```bash
pnpm create @app-template/app@latest my-obsidian-project --template obsidian
```

## How to use

Using Obsidian, open the folder `content` and start editing your notes.

## Quartz Custom Configuration

There is a config.yaml file in the root of the project that you can use to customize the Quartz. See https://quartz.jzhao.xyz/configuration#general-configuration for more information.

## Building for production

1. `npm install`
1. run `npm run build` to build the project.
1. The build artifacts will be stored in the `public` directory.
1. run `npx http-server public` to preview the production build.
