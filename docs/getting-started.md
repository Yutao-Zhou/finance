# 开发上手

[返回文档导航](README.md)

## 环境

需要 Git、Node.js 和 npm。版本以 [package.json](../package.json) 和 [package-lock.json](../package-lock.json) 为准，使用 `npm ci` 按锁文件安装。

当前锁文件中的 React 为 19.2.4、Vite 为 8.0.3。Vite 的 Node.js 范围是 `^20.19.0 || >=22.12.0`。核对本机环境：

```bash
node --version
npm --version
git --version
```

浏览页面或构建静态文件不需要行情 API 凭据、数据库或登录服务。发布网站还需要对 Git 远端有推送权限。

## 安装与启动

```bash
git clone https://github.com/Yutao-Zhou/finance.git
cd finance
npm ci
npm run dev
```

进入终端输出的 `/finance/` 地址。Vite 默认使用 5173 端口，端口被占用时可能改用其他端口。

需要固定端口或让开发服务器绑定指定地址时：

```bash
npm run dev -- --host 127.0.0.1 --port 5173 --strictPort
```

按 `Ctrl+C` 停止服务器。开发时修改 `src/` 文件会触发热更新；不要直接编辑 `dist/`。

## 命令参考

| 命令              | 当前行为                                                 |
| ----------------- | -------------------------------------------------------- |
| `npm ci`          | 根据锁文件安装依赖，适合新环境或恢复依赖                 |
| `npm run dev`     | 启动 Vite 开发服务器                                     |
| `npm run build`   | 构建生产静态文件到 `dist/`                               |
| `npm run preview` | 预览已经生成的 `dist/`，不会重新构建                     |
| `npm run lint`    | 检查整个仓库；目前会被历史文件阻断，见下文               |
| `npx eslint src`  | 检查当前前端源码                                         |
| `npm run deploy`  | 先构建，再将 `dist/` 发布到远端 `gh-pages` 分支          |
| `npm run sitemap` | 配置指向缺失的 `scripts/generate-sitemap.js`，目前不可用 |

当前没有 `npm test` 脚本、单元测试框架或仓库自带的浏览器测试流水线。根目录的 `test-screenshot.js` 是旧示例，不能当作可直接运行的测试命令。

## 构建与检查

```bash
npx eslint src
npm run build
npm run preview
```

预览默认地址是 `http://localhost:4173/finance/`，实际端口以输出为准。构建成功并不等于界面和内容正确，修改后还需要核对相关交互。

完整 `npm run lint` 当前会扫描旧的 `assets/index-RH8QDDtS.js` 和 `test-screenshot.js` 并报错。`npx eslint src` 是当前源码的检查入口，不能据此声称全仓库 lint 已通过。更多已知限制见[常见问题](troubleshooting.md)。

## 按修改类型验证

| 修改内容     | 最少需要确认的内容                                                            |
| ------------ | ----------------------------------------------------------------------------- |
| 晨报 JSON    | 格式正确、日期与文件名一致、双语内容与来源核对、构建与页面展示正常            |
| 公告         | 分类、排序、双语、横幅、未读与关闭状态，参考[公告维护](site-announcements.md) |
| React 或 CSS | 源码 lint、构建，以及受影响的桌面和手机交互                                   |
| 文档         | 相对链接、文件路径、命令与代码示例；纯 Markdown 修改通常无需构建网站          |

详细的界面回归项目见[参与开发](../CONTRIBUTING.md)。

## 接下来

- 修改 UI 前阅读[架构说明](architecture.md)，定位组件、主题变量和阅读设置。
- 新增内容前阅读[晨报数据格式](report-data.md)。
- 准备发布时使用[发布与运营](operations.md)；不要把 `npm run preview` 当作部署。
