# Node TypeScript Template

快速创建使用 TypeScript 编写的 Node 项目

- 使用 TypeScript 进行代码编写，ts 代码请于 src 中进行编写，执行 `npm run build` 后，编译后的代码将存放于 dist 目录。
- git 提交规范使用 [cz-cli](https://github.com/commitizen/cz-cli) 因此提交代码时，请执行 `npm run commit`。
- 测试框架使用 Jest，运行 `npm run test` 后，报告将存放在 coverage 目录中。
- 使用 ESLint 作为代码检测工具
- 使用 prettier 美化代码格式，推荐使用 VSCode 进行开发，并下载 Prettier 扩展，代码在保存的时候将自动进行格式化。
- 使用 husky 配置 git 钩子，在提交的时候，将使用 ESLint 进行代码语法检测以及使用 Jest 执行代码测试。

## How to use

### Development

由于项目是使用 TypeScript 进行开发，因此需要运行时需要先将 TypeScript 编译成 JavaScript，通过执行下面的命令，监听 src 目录下的代码变化，自动将代码编译成 JavaScript。

```bash
npm run dev:build
```

### Production

执行下面的命令，会将 src 中的所有代码编译输出到 dist 目录中

```bash
npm run prd:build
```

## Tips

编辑器推荐使用 Visual Studio Code。

为了更好的开发体验，请安装一下 VS Code 插件：

- ESLint
- Jest
- Prettier - Code formatter
- EditorConfig for VS Code
