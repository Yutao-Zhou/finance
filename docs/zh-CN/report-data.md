# 晨报数据格式

[English](../report-data.md) | **简体中文**

[返回文档导航](README.md) · [发布流程](operations.md)

## 文件与日期

一份晨报对应根目录下的一个 `data/YYYY-MM-DD.json`，文件名与根字段 `date` 应一致，使用晨报所属的美国交易日。同一天应只有一个文件；更正内容时更新原文件。

前端目前只按 `date` 的 `YYYY-MM-DD` 正则过滤，并按字符串倒序排列，没有完整 JSON Schema 校验，也不会自动检查节假日、重复日期或不可能的日历日期。维护者需要在发布前检查这些内容。非法 JSON 会使构建失败。

## 示例

以下是**格式演示数据**，价格、新闻和来源地址都是占位示例，不能作为真实晨报发布。省略的板块和行情卡片不会自动补全。

```json
{
  "date": "2026-11-13",
  "asOf": "2026-11-13T14:00:00Z",
  "summary": {
    "zh": "示例：概括当日盘前最重要的市场主线。",
    "en": "Example: summarize the main premarket theme."
  },
  "topNews": [
    {
      "title": {
        "zh": "示例新闻标题",
        "en": "Example headline"
      },
      "url": "https://example.com/news",
      "impact": {
        "zh": "说明事实、发布时间，以及可能的市场影响。",
        "en": "Explain the facts, timing and possible market impact."
      },
      "bullish": [{ "zh": "示例利好因素", "en": "Example positive factor" }],
      "bearish": [{ "zh": "示例利空因素", "en": "Example negative factor" }],
      "macroRisk": {
        "zh": "说明风险传导路径与判断边界。",
        "en": "Describe the risk transmission and limits of the assessment."
      }
    }
  ],
  "sectorRadar": {
    "ai": { "zh": "示例 AI 板块观察", "en": "Example AI sector context" }
  },
  "premarketFocus": {
    "futures": { "zh": "示例期货观察", "en": "Example futures context" },
    "treasury10Y": { "zh": "示例利率观察", "en": "Example rates context" },
    "dxy": { "zh": "示例美元观察", "en": "Example dollar context" },
    "oil": { "zh": "示例原油观察", "en": "Example oil context" },
    "keyRisk": { "zh": "示例盘前风险", "en": "Example risk to watch" }
  },
  "judgment": {
    "type": "mixed",
    "confidence": { "zh": "中", "en": "medium" },
    "note": {
      "zh": "示例综合判断与反证条件。",
      "en": "Example assessment and conditions that would weaken it."
    }
  },
  "marketData": {
    "asOf": "2026-11-13T14:00:00Z",
    "provider": "Example provider",
    "interval": "5m",
    "quotes": [
      {
        "id": "es",
        "symbol": "ES=F",
        "price": 6000,
        "barStart": "2026-11-13T13:50:00Z",
        "observedAt": "2026-11-13T13:55:00Z",
        "reference": { "price": 5970, "observedAt": "2026-11-12T21:00:00Z" },
        "sourceURL": "https://example.com/quote/es",
        "delayed": true
      },
      {
        "id": "tnx",
        "symbol": "^TNX",
        "price": 4.2,
        "observedAt": "2026-11-13T13:55:00Z",
        "reference": { "price": 4.18, "observedAt": "2026-11-12T20:00:00Z" },
        "sourceURL": "https://example.com/quote/tnx",
        "delayed": true
      }
    ]
  }
}
```

## 主要字段

这些是内容维护约定，不代表当前程序会强制验证所有类型。

| 字段             | 建议类型                   | 用途与缺失行为                                                     |
| ---------------- | -------------------------- | ------------------------------------------------------------------ |
| `date`           | 有效的 `YYYY-MM-DD` 字符串 | 选期、排序、归档与 URL；不符合格式的报告会被过滤                   |
| `asOf`           | 带时区的 ISO 8601 字符串   | 记录整份报告的信息截点；当前 UI 不单独显示此字段，可在摘要说明截点 |
| `summary`        | 双语文本                   | 今日主线；无有效内容时不展示摘要面板                               |
| `topNews`        | 新闻对象数组               | 焦点新闻；无有效标题的条目不展示                                   |
| `sectorRadar`    | 板块键到双语文本的对象     | 板块雷达；空内容不展示                                             |
| `premarketFocus` | 观察项到双语文本的对象     | 盘前关注与侧栏风险观察                                             |
| `judgment`       | 对象                       | 情绪类型、置信度、综合判断                                         |
| `marketData`     | 行情快照对象，可省略       | 顶部行情卡片；缺失时不虚构或沿用其他日期的报价                     |

新闻对象使用 `title`、`url`、`impact`、`bullish`、`bearish` 和 `macroRisk`。`url` 应为原始 HTTP(S) 新闻地址；缺少有效链接时，页面会改为搜索新闻标题，不应把这个回退当作已经核实来源。

`bullish` 和 `bearish` 是因素列表，可以提及股票代码，但并非只能填代码。正文直接以文本显示，不会解析 Markdown 或 HTML。

### 板块和观点

`sectorRadar` 已知键：`ai`、`semiconductor`、`bigTech`、`energy`、`ev`、`market`、`preciousMetals`、`oil`。可以只提供有内容的板块。

`premarketFocus` 的 `futures`、`treasury10Y`、`dxy`、`oil` 在盘前关注区域展示；`keyRisk` 在风险观察侧栏展示。

`judgment.type` 使用 `risk-on`、`risk-off`、`mixed`、`event-driven` 之一。`confidence` 建议双语提供高／中／低与 high／medium／low；`note` 说明判断依据和可能使判断失效的条件。前端不会自动计算情绪或置信度。

## 双语兼容规则

新内容优先采用 `{ "zh": "中文", "en": "English" }`。`src/lib/reports.js` 的 `text()` 也兼容普通字符串和数字；对象缺少当前语言时，优先回退到英文，再回退到中文。

因素数组建议使用双语对象数组。旧格式仍支持普通字符串，以及分别以 `zh:`、`en:` 开头的字符串：匹配当前语言的标记项优先，没有时使用英文标记项；不带标记的项都会保留。

空白文本、以 `[` 开头的占位内容，以及因素列表中的 `TICKER1` 一类占位项可能被过滤。不要用占位文字代替缺失信息，也不要为了双语界面在每条新文本中拼接两种语言。

## 行情快照

`marketData.quotes` 是数组。顶部卡片只读取以下四种 ID：

| ID    | 展示项目          | `price` 单位                   |
| ----- | ----------------- | ------------------------------ |
| `es`  | 标普 500 期货     | 指数点位                       |
| `nq`  | 纳指 100 期货     | 指数点位                       |
| `tnx` | 10 年期美债收益率 | 百分数，例如 `4.2` 表示 `4.2%` |
| `wti` | WTI 原油          | 美元／桶                       |

其他 ID 可保留作溯源，但不会自动生成更多顶部卡片，也不会自动转换成板块正文。

- `price` 和 `reference.price` 应为有限数字，不能是带单位的字符串。当前价有效即可显示卡片；参考价缺失、无效或不大于零时不显示涨跌幅。
- `observedAt` 是报价观察时间；`reference.observedAt` 是比较基准时间。使用 UTC `Z` 或明确的时区偏移，页面统一格式化为 `America/New_York`，自动显示 EST／EDT。
- `barStart` 是原始行情区间的开始时间，可用于溯源；当前卡片显示的是 `observedAt`。
- `sourceURL` 保存原始行情来源，`symbol` 保存供应商代码，`provider` 保存供应商名称。缺少 `provider` 时 UI 会回退显示 Yahoo Finance，因此其他来源应明确填写名称。
- `delayed: true` 会使快照说明显示延时标记。报价始终是晨报记录，不能描述为网站实时更新的行情。

非收益率卡片的涨跌幅为 `(price - reference.price) / reference.price * 100`。`tnx` 使用 `(price - reference.price) * 100`，单位为基点：从 `4.18%` 到 `4.20%` 是 **+2.0 bp**，不是 +2%。

## 新增与更正

1. 确认交易日和信息截点，准备已核实的新闻、报价、来源链接与双语文本。
2. 新建 `data/YYYY-MM-DD.json`，或更正原有日期的文件。文件名与 `date` 保持一致。
3. 检查 JSON、实际日期、数值单位、观察时间和比较基准。参考价的时点应由内容生产流程明确选择，前端不会推断前收盘。
4. 按[发布流程](operations.md#发布网站)构建、预览、提交和发布。核对日期选择器、搜索、原文链接和双语展示。

可以在仓库根目录运行下面的语法检查，先将文件名改为本次要发布的日期：

```bash
node --input-type=module -e 'import fs from "node:fs"; JSON.parse(fs.readFileSync("data/2026-11-13.json", "utf8")); console.log("JSON OK");'
```

这个命令只验证 JSON 语法，不验证新闻真实性、字段完整性、日期或报价正确性。发布更正后，页面没有自动的勘误记录；影响读者理解的重要更正应在正文或[网站公告](site-announcements.md)中说明。
