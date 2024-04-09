# Koa Mongodb Template

快速创建使用 TypeScript 编写的 Koa 项目

- 使用 TypeScript 进行代码编写，ts 代码请于 src 中进行编写，执行 `npm run dev:build` 后，编译后的代码将存放于 dist 目录。
- git 提交规范使用 [cz-cli](https://github.com/commitizen/cz-cli) 因此提交代码时，请执行 `npm run commit`。
- 测试框架使用 Jest，运行 `npm run test` 后，报告将存放在 coverage 目录中。
- 使用 ESLint 作为代码检测工具
- 使用 prettier 美化代码格式，推荐使用 VSCode 进行开发，并下载 Prettier 扩展，代码在保存的时候将自动进行格式化。

## 如何使用

### 开发前准备

根目录下的 .env 文件的内容如下：

```plain
CONNECTION_STRING=
JWT_SECRET=
```

- 第一个是连接到 mongodb 的 url，这个再开发之前是需要补充。
- 另外 JWT_SECRET 是 [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) `jwt.sign` 方法的第二个参数，自己根据情况设定某个字符串。

### Development

由于项目是使用 TypeScript 进行开发，因此需要运行时需要先将 TypeScript 编译成 JavaScript，通过执行下面的命令，监听 src 目录下的代码变化，自动将代码编译成 JavaScript。

```bash
npm run dev:build
```

只是将 TypeScript 的代码编译成 JavaScript 是还不够的，还需要将它运行起来，通过执行下面的命令，会监听编译后的 JavaScript 变化，并自动重启 node 服务：

```bash
npm run dev:serve
```

这个命令主要是用到 nodemon 去监听 dist 目录的变化，当 dist 目录发生变化的时候，nodemon 会重启 node 服务。

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
