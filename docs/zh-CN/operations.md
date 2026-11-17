# 发布与运营

[English](../operations.md) | **简体中文**

[返回文档导航](README.md)

## 部署约定

| 项目         | 当前约定                         |
| ------------ | -------------------------------- |
| 网站         | `https://yutaozhou.com/finance/` |
| 源代码分支   | `main`                           |
| 静态发布分支 | `gh-pages`                       |
| 构建目录     | `dist/`，由 Vite 生成            |
| Vite base    | `/finance/`                      |
| 发布命令     | `npm run deploy`                 |

发布流程是 `main` 源代码 → 本地构建 → `gh-pages` 分支 → GitHub Pages。仓库没有自带的晨报生成／发布 GitHub Actions 配置；GitHub Pages 平台的部署作业与生成新晨报是两件事。

## 发布网站

### 1. 同步源代码

先检查工作区，确认位于 `main`，并妥善保存已有修改。以下同步命令应在可安全更新的工作区执行，不要用重置或强推覆盖其他工作。

```bash
git status --short
git branch --show-current
git pull --ff-only origin main
```

同步很重要：自动内容更新可能已推送新的晨报。从旧 checkout 部署会把网站内容回退到旧快照，即使自己的 UI 修改是最新的。

### 2. 修改并验证

- 新增或更正晨报：遵循[晨报数据格式](report-data.md)。
- 更新服务安排或发布功能说明：遵循[公告维护](site-announcements.md)。
- 修改前端：执行源码检查，并验证受影响的交互。

```bash
npx eslint src
npm run build
npm run preview
```

打开终端给出的 `/finance/` 预览地址，核对最新晨报、目标历史日期和修改内容。前台预览服务按 `Ctrl+C` 停止。

### 3. 提交源代码

只暂存本次需要的文件。以新增一份晨报为例，先将下面日期换为实际日期：

```bash
git add data/2026-11-13.json
git diff --cached --check
git diff --cached --stat
git commit -m "Add daily market insight for 2026-11-13"
git push origin main
```

UI、公告或文档变更应使用对应的文件列表与提交说明。`dist/` 不提交到 `main`，也不要把无关的工作区文件一起暂存。

### 4. 发布静态文件

```bash
npm run deploy
```

此命令等价于 `npm run build && gh-pages -d dist`，会推送生成文件到远端 `gh-pages` 分支。执行前需要 Node.js、已安装的依赖，以及有效的 Git 推送权限。

命令显示 `Published` 说明发布分支已推送，**还需等待 GitHub Pages 部署完成**。普通 `git push origin main` 不会替代这一步。

### 5. 验证线上结果

1. 在 GitHub 仓库的 Actions 中确认本次 `pages build and deployment` 成功；必要时在 Settings → Pages 核对发布来源。
2. 打开生产地址，刷新后检查目标功能、最新一期日期、目标历史晨报和主要链接。
3. 若仍像旧版本，查看线上页面源代码中 `assets/index-*.js` / `assets/index-*.css` 的文件名，与本次 `dist/index.html` 比较，区分部署未生效与本地缓存。
4. 确认 `git status --short` 没有意外的源文件变动。

不要仅凭本地构建成功或 `Published` 输出宣称线上已经更新。

## 只更新文档

只修改 README、`docs/`、CONTRIBUTING 或 CHANGELOG 时，检查链接与示例，提交并推送到 `main` 即可。它们不会打包成网站页面，通常不需要 `npm run deploy`。

`CHANGELOG.md` 是仓库更新记录，不会自动变成读者可见的公告。希望在网站显示的通知需要修改 `src/data/announcements.js` 并部署。

## 失败恢复与回退

| 情况                    | 处理方式                                                                     |
| ----------------------- | ---------------------------------------------------------------------------- |
| 构建失败                | 保留源文件，定位构建错误；不要发布半成品或直接修改 `dist/`                   |
| `git push` 被拒绝       | 检查远端新提交，按项目 Git 流程同步与解决冲突，再推送；不要强推              |
| `main` 已推送但部署失败 | 修复网络、权限或构建问题，从确认过的同一源代码重试 `npm run deploy`          |
| Pages 作业失败          | 打开该次作业日志定位错误，修复后重新发布                                     |
| 已上线的代码需要撤回    | 确认问题提交，用 `git revert` 创建撤回提交，检查构建后推送 `main` 并重新部署 |
| 已上线的晨报需要更正    | 修正对应日期 JSON，重新核对内容并发布；重大更正同步说明                      |

回退前先用 `git log --oneline` 和 `git show` 确认范围。一个功能提交之外可能还有新晨报；整棵目录回退或直接部署旧构建，可能把这些新内容一起移除。需要保留当前晨报时，优先撤回明确的问题变更。

## 暂停与恢复晨报更新

### 暂停前

1. 发布服务公告，说明预计时间、影响范围、仍可访问的内容；日期未确定时明确写待确认。
2. 重要安排设置 `pinned: true` 和 `banner: true`。公开说明以服务影响为主，无需披露私人行程或设备信息。
3. 部署并确认线上横幅与公告内容正确，再停止外部生成任务。

已发布内容由 GitHub Pages 托管。停止生成任务不会关闭网站，也不会产生新的晨报。当前 2027 年 1 月的暂停安排尚未确认具体起止日期，以[公告数据](../../src/data/announcements.js)中的实际通知为准。

### 恢复时

1. 确认外部生成流程与最新晨报数据正常，先检查日期、信息截点、来源和行情基准。
2. 给恢复通知使用新的稳定 ID，使其成为新的未读消息。
3. 撤下旧暂停通知的 `banner` / `pinned`，保留历史公告并注明安排已更新。
4. 发布并验证线上晨报与公告。程序不会按日历自动恢复，也不会自动清除旧横幅。

## 自动生成与调度的边界

仓库中的 `scripts/stocks-morning-brief.ps1` 使用硬编码示例行情，输出到特定机器的 Markdown 路径，不生成网站所需的 `data/YYYY-MM-DD.json`。`crontab.txt` 的内容是注释示例，不是已安装的定时任务，不能据此确认生产任务的运行时间。

完整的行情采集、AI 生成、凭据、任务调度与失败告警不在当前仓库实现。维护外部流程时，应另外记录实际执行环境、任务入口、命名时区、日志位置和负责维护的人；不要把凭据写进前端或文档。调度使用 `America/New_York` 或 `America/Los_Angeles` 等命名时区，避免把 EST／PST 的固定 UTC 换算套用全年。
