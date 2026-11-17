# Getting started

**English** | [简体中文](zh-CN/getting-started.md)

[Documentation index](README.md)

## Requirements

Install Git, Node.js and npm. [package.json](../package.json) and [package-lock.json](../package-lock.json) define the dependencies; use `npm ci` to install the locked versions.

The current lockfile contains React 19.2.4 and Vite 8.0.3. Vite requires Node.js `^20.19.0 || >=22.12.0`. Check your environment:

```bash
node --version
npm --version
git --version
```

Browsing and building the static frontend require no market-data credentials, database or authentication service. Deployment also requires permission to push to the Git remote.

## Install and run

```bash
git clone https://github.com/Yutao-Zhou/finance.git
cd finance
npm ci
npm run dev
```

Open the `/finance/` URL printed in the terminal. Vite normally uses port 5173 and may choose another port if it is occupied.

To bind the development server to a specific address and require a fixed port:

```bash
npm run dev -- --host 127.0.0.1 --port 5173 --strictPort
```

Press `Ctrl+C` to stop the server. Changes under `src/` trigger hot updates during development. Do not edit `dist/` directly.

## Command reference

| Command           | Current behavior                                                              |
| ----------------- | ----------------------------------------------------------------------------- |
| `npm ci`          | Install from the lockfile for a new environment or dependency recovery        |
| `npm run dev`     | Start the Vite development server                                             |
| `npm run build`   | Build production static files into `dist/`                                    |
| `npm run preview` | Preview the existing `dist/`; does not rebuild it                             |
| `npm run lint`    | Check the whole repository; currently blocked by legacy files described below |
| `npx eslint src`  | Check the current frontend source                                             |
| `npm run deploy`  | Build and publish `dist/` to the remote `gh-pages` branch                     |
| `npm run sitemap` | References the missing `scripts/generate-sitemap.js`; currently unavailable   |

There is no `npm test` script, unit test framework or repository-managed browser test pipeline. The root `test-screenshot.js` is a legacy example, not a working test entry point.

## Build and check

```bash
npx eslint src
npm run build
npm run preview
```

The preview normally uses `http://localhost:4173/finance/`; use the actual port printed in the terminal. A successful build does not establish that content and interactions are correct. Check the behavior affected by your change.

The full `npm run lint` currently scans the legacy `assets/index-RH8QDDtS.js` and `test-screenshot.js` and reports errors. Use `npx eslint src` for the current source, but do not report it as a passing repository-wide lint check. See [troubleshooting](troubleshooting.md) for known limitations.

## Validation by change type

| Change        | Minimum checks                                                                                                                 |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Report JSON   | Syntax, date matching the filename, bilingual content, verified sources, build and rendered content                            |
| Announcement  | Categories, order, both languages, banners, unread and dismissed states; see [announcement maintenance](site-announcements.md) |
| React or CSS  | Source lint, build, and affected desktop and mobile interactions                                                               |
| Documentation | Relative links, source paths, commands and examples; Markdown-only changes usually need no site build                          |

See [Contributing](../CONTRIBUTING.md) for the UI regression checklist.

## Next steps

- Read [Architecture](architecture.md) before changing UI components, theme variables or reading settings.
- Read [Report data](report-data.md) before adding content.
- Use [Operations](operations.md) when publishing. `npm run preview` is a local preview, not a deployment.
