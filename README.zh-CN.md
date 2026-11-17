# ClawBot · 美股晨报

[English](README.md) | **简体中文**

一个中英双语的美股盘前阅读网站：汇总每日市场主线、焦点新闻、板块观察和行情快照，并保留历史晨报。

[访问网站](https://yutaozhou.com/finance/) · [文档导航](docs/zh-CN/README.md) · [参与开发](CONTRIBUTING.zh-CN.md) · [更新记录](CHANGELOG.zh-CN.md)

## 当前功能

- 今日晨报与历史归档，可按新闻、日期或股票代码搜索。
- 按月分组、支持搜索和键盘操作的日期选择器。
- 晨报中记录的行情快照，包括报价时间、参考时点和涨跌幅。
- 中英文、深浅色主题、小／中／大字号、精简／完整阅读模式。
- 支持手机、平板和桌面的阅读布局。
- 网站公告、重要服务横幅、功能更新记录和本地已读状态。

## 本地运行

需要 Git、Node.js 和 npm。当前锁定的 Vite 要求 Node.js `^20.19.0 || >=22.12.0`；可使用 Node.js 22.12 或更高的兼容版本。

```bash
git clone https://github.com/Yutao-Zhou/finance.git
cd finance
npm ci
npm run dev
```

打开终端显示的地址，默认是 `http://localhost:5173/finance/`。前端浏览与构建无需配置 API key 或 `.env` 文件。

```bash
npm run build
npm run preview
```

预览地址默认是 `http://localhost:4173/finance/`。端口占用时，以终端实际输出为准。

## 常用维护入口

| 要做的事                     | 文档                                         |
| ---------------------------- | -------------------------------------------- |
| 安装、启动、检查与预览       | [开发上手](docs/zh-CN/getting-started.md)    |
| 找到组件、状态和数据流       | [架构说明](docs/zh-CN/architecture.md)       |
| 新增或更正一份晨报           | [晨报数据格式](docs/zh-CN/report-data.md)    |
| 部署、回退、暂停与恢复更新   | [发布与运营](docs/zh-CN/operations.md)       |
| 发布服务通知或功能公告       | [公告维护](docs/zh-CN/site-announcements.md) |
| 排查页面、工具命令和部署问题 | [常见问题](docs/zh-CN/troubleshooting.md)    |

## 内容与部署方式

网站使用 React 19 和 Vite 8。晨报来自根目录的 `data/YYYY-MM-DD.json`，公告来自 `src/data/announcements.js`，两者都会在构建时打包进静态网站。

**推送 `main` 只更新源代码；网站发布还需要运行 `npm run deploy`。** 此命令构建 `dist/`，再通过 `gh-pages` 发布到 `gh-pages` 分支。具体步骤见[发布流程](docs/zh-CN/operations.md#发布网站)。

仓库中的脚本与调度示例不构成完整的晨报生成服务。生成任务停止时，已发布的网站和历史内容仍可访问；网站不会自行补发新晨报。

行情为各期晨报记录的快照，并非实时行情。内容由 AI 辅助生成，仅供信息参考。

文档默认使用英文，本页与中文版指南提供对应的中文说明。
