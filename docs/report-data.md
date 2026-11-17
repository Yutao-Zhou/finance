# Report data

**English** | [简体中文](zh-CN/report-data.md)

[Documentation index](README.md) · [Publication workflow](operations.md)

## Files and dates

Each briefing is a root-level `data/YYYY-MM-DD.json` file. Its filename must match the root `date` field and use the US trading date represented by the report. Keep one file per date; correct an existing report in place.

The frontend currently filters using only a `YYYY-MM-DD` regular expression and sorts the resulting date strings descending. It has no complete JSON Schema validation or automatic checks for holidays, duplicate dates or impossible calendar dates. Maintainers must check those before publishing. Invalid JSON fails the build.

## Example

The following is **format demonstration data**. Prices, news and source URLs are placeholders and must not be published as a real briefing. Missing sectors and quote cards are not filled automatically.

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

## Main fields

These are content-maintenance conventions, not types fully enforced by the application.

| Field            | Suggested type                               | Use and missing-content behavior                                                                                    |
| ---------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `date`           | Valid `YYYY-MM-DD` string                    | Edition selection, sorting, archive and URL; reports with a mismatched format are filtered out                      |
| `asOf`           | ISO 8601 timestamp with time zone            | Information cutoff for the whole report; not displayed separately by the UI, so state it in the summary when needed |
| `summary`        | Bilingual text                               | The big picture; the panel is omitted when content is empty                                                         |
| `topNews`        | Array of news objects                        | Top stories; entries without a usable title are omitted                                                             |
| `sectorRadar`    | Object mapping sector keys to bilingual text | Sector context; empty content is omitted                                                                            |
| `premarketFocus` | Object mapping focus keys to bilingual text  | Premarket focus and sidebar risk observation                                                                        |
| `judgment`       | Object                                       | Market mood, confidence and assessment                                                                              |
| `marketData`     | Optional snapshot object                     | Top quote cards; missing data is not invented or borrowed from another date                                         |

News objects use `title`, `url`, `impact`, `bullish`, `bearish` and `macroRisk`. `url` should be the original HTTP(S) news source. Missing or invalid URLs fall back to a headline search; that fallback does not establish that the source was verified.

`bullish` and `bearish` are lists of factors. They can mention tickers but are not limited to ticker symbols. Copy renders as plain text, without Markdown or HTML parsing.

### Sectors and judgment

Known `sectorRadar` keys are `ai`, `semiconductor`, `bigTech`, `energy`, `ev`, `market`, `preciousMetals` and `oil`. Include only sectors with relevant content.

`premarketFocus.futures`, `treasury10Y`, `dxy` and `oil` render in the premarket focus area. `keyRisk` appears in the risk-observation sidebar.

Use `risk-on`, `risk-off`, `mixed` or `event-driven` for `judgment.type`. Provide bilingual `confidence` text for high/medium/low and its Chinese equivalent. `note` explains the assessment and conditions that could weaken it. The frontend does not calculate mood or confidence.

## Bilingual compatibility

Prefer `{ "zh": "中文", "en": "English" }` for new text. `text()` in `src/lib/reports.js` also accepts plain strings and numbers. When the selected language is missing from an object, it falls back to English, then Chinese.

Prefer arrays of bilingual objects for factors. Legacy formats still support plain strings and strings prefixed with `zh:` or `en:`. Tagged entries for the selected language take priority; English tags are the fallback. Untagged entries are always retained.

Blank content, placeholders beginning with `[` and factor placeholders such as `TICKER1` may be filtered out. Do not replace missing information with placeholders or concatenate both languages into every new string.

## Market snapshots

`marketData.quotes` is an array. The top cards read only these four IDs:

| ID    | Display                | `price` unit                         |
| ----- | ---------------------- | ------------------------------------ |
| `es`  | S&P 500 futures        | Index points                         |
| `nq`  | Nasdaq-100 futures     | Index points                         |
| `tnx` | 10-year Treasury yield | Percentage value: `4.2` means `4.2%` |
| `wti` | WTI crude              | USD per barrel                       |

Other IDs can be retained for traceability. They do not automatically create more top cards or generate sector copy.

- `price` and `reference.price` should be finite numbers, not strings containing units. A valid current price is enough to show a card. Missing, invalid or non-positive reference prices omit the change indicator.
- `observedAt` is the quote observation time; `reference.observedAt` is its comparison time. Use UTC `Z` or an explicit time-zone offset. The UI formats them in `America/New_York`, including EST/EDT automatically.
- `barStart` records the start of the source interval for traceability. Cards display `observedAt`.
- `sourceURL` records the original quote source, `symbol` the provider's symbol, and `provider` its name. Missing `provider` falls back to Yahoo Finance in the UI, so explicitly name other sources.
- `delayed: true` adds a delayed-data label. All quotes remain recorded briefing snapshots, not prices refreshed live by the website.

Non-yield changes use `(price - reference.price) / reference.price * 100`. `tnx` uses `(price - reference.price) * 100` basis points: a move from `4.18%` to `4.20%` is **+2.0 bp**, not +2%.

## Add or correct a report

1. Confirm the trading date and information cutoff. Prepare verified news, quotes, source links and bilingual copy.
2. Add `data/YYYY-MM-DD.json` or correct the existing file for that date. Keep the filename and `date` aligned.
3. Check JSON, real calendar dates, numerical units, observation times and reference prices. The content pipeline must choose the reference time explicitly; the frontend does not infer the previous close.
4. Follow the [publication workflow](operations.md#publish-the-site) to build, preview, commit and deploy. Check edition selection, search, source links and both languages.

For a syntax check, run this from the repository root after replacing the filename with the date you intend to publish:

```bash
node --input-type=module -e 'import fs from "node:fs"; JSON.parse(fs.readFileSync("data/2026-11-13.json", "utf8")); console.log("JSON OK");'
```

This checks only JSON syntax, not facts, field completeness, dates or quote accuracy. The page has no automatic correction history. Explain significant corrections in the report or a [site announcement](site-announcements.md).
