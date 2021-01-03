# App Template

App Template 可用于快速搭建项目。

## 使用

```bash
npx @luohuidong/template-cli
```

## 项目相关

- monorepos 使用 yarn workspaces 进行管理
- 项目组织
  - 项目有 cli 与模板代码构成。全部以子项目的形式存放在 packages 中
  - cli 工具用于将对应模板的代码下载到当前目录。
  - 不同技术栈的模板通过不同子项目的形式进行代码组织，相互独立。
