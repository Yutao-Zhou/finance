# ClawBot · The Premarket Brief

**English** | [简体中文](README.zh-CN.md)

A bilingual US market morning briefing website covering market themes, top stories, sector context and recorded market snapshots, with an archive of past editions.

[Website](https://yutaozhou.com/finance/) · [Documentation](docs/README.md) · [Contributing](CONTRIBUTING.md) · [Changelog](CHANGELOG.md)

## Features

- Latest briefing and historical archive, searchable by news, date or ticker.
- Searchable edition picker with monthly groups and keyboard navigation.
- Recorded market snapshots with observation times, reference times and price changes.
- Chinese and English, light and dark themes, three text sizes, and brief or full reading views.
- Responsive layouts for phones, tablets and desktops.
- Site announcements, important service banners, release notes and local read states.

## Run locally

Install Git, Node.js and npm. The locked Vite version requires Node.js `^20.19.0 || >=22.12.0`; Node.js 22.12 or a newer compatible version can be used.

```bash
git clone https://github.com/Yutao-Zhou/finance.git
cd finance
npm ci
npm run dev
```

Open the URL printed by Vite, normally `http://localhost:5173/finance/`. Browsing and building the frontend require no API keys or `.env` file.

```bash
npm run build
npm run preview
```

The preview normally runs at `http://localhost:4173/finance/`. Use the actual URL printed in the terminal if the port changes.

## Maintenance guides

| Task                                           | Guide                                            |
| ---------------------------------------------- | ------------------------------------------------ |
| Install, run, check and preview the app        | [Getting started](docs/getting-started.md)       |
| Find components, state and data flow           | [Architecture](docs/architecture.md)             |
| Add or correct a briefing                      | [Report data](docs/report-data.md)               |
| Deploy, roll back, pause or resume publication | [Operations](docs/operations.md)                 |
| Publish service notices or release notes       | [Site announcements](docs/site-announcements.md) |
| Diagnose page, tooling or deployment problems  | [Troubleshooting](docs/troubleshooting.md)       |

## Content and deployment

The site uses React 19 and Vite 8. Briefings live in the root `data/YYYY-MM-DD.json` directory, and announcements live in `src/data/announcements.js`. Both are bundled into the static site at build time.

**Pushing `main` updates the source; publishing the website also requires `npm run deploy`.** The command builds `dist/` and publishes it to the `gh-pages` branch using `gh-pages`. Follow the [deployment guide](docs/operations.md#publish-the-site).

The repository's script and scheduling examples do not form a complete briefing generation service. If generation stops, the published site and archive remain available, but the site does not generate missing editions itself.

Quotes are recorded briefing snapshots, not live prices. Content is AI-assisted and provided for information only.

English is the default documentation language. The [Simplified Chinese edition](README.zh-CN.md) provides the same maintenance guides.
