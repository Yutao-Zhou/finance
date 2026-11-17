# Troubleshooting

**English** | [简体中文](zh-CN/troubleshooting.md)

[Documentation index](README.md)

## The site did not update after a source push

`main` contains source code; the website serves the published static build. Synchronize the source, run `npm run deploy`, and confirm that the corresponding GitHub Pages job finishes. Follow the [publication workflow](operations.md#publish-the-site).

If the terminal shows `Published` but the page is old, wait for Pages deployment and refresh. Compare live asset filenames with `dist/index.html`. If they match, check browser caching and whether the URL selects an older edition with `?date=`.

## The latest report became older after deployment

The deployment may have used an old checkout. Inspect `git log`, remote `main` and the latest local `data/` date. Preserve existing changes, synchronize and redeploy. Repeating deployment from the stale checkout will not fix the content.

The site selects the newest date in its built content. Deploying does not collect or generate today's report.

## Node.js or installation errors

Check that `node --version` satisfies the current Vite requirement, `^20.19.0 || >=22.12.0`. Use `npm ci` with the committed lockfile rather than deleting or recreating `package-lock.json` to work around an installation error.

If `npm ci` reports a mismatch between the lockfile and `package.json`, first check for an unfinished dependency change. Regenerate the lockfile only when a dependency update is intended, and explain it in the same commit.

## An occupied port or inaccessible local page

Use the host and port printed by Vite, keeping the `/finance/` path. With `--strictPort`, an occupied port fails instead of selecting another one. Restart on an available port.

`npm run preview` requires a successful `npm run build` first. It shows that build, not source edits made afterward without rebuilding.

## A blank page or asset 404s

- Confirm that deployment publishes `dist/`, not the source directory, and that Vite `base` remains `/finance/`.
- Use `/finance/` with `?date=YYYY-MM-DD` for edition links. Date-based path routes are not implemented.
- If a production page requests `/src/main.jsx`, check whether source HTML was published or the legacy 404 page below was loaded.
- Inspect the browser console and network requests to distinguish JavaScript errors, path errors and font-loading failures.

`public/404.html` is a legacy template still referencing `/src/main.jsx`. Vite copies `public/` unchanged rather than transforming it into a production entry. This file is not currently a reliable SPA fallback. Share the supported query-parameter URLs rather than relying on arbitrary paths rendering through a 404 page.

## A report is missing or partially empty

Check that the file is in the root `data/` directory, contains valid JSON, uses a real `YYYY-MM-DD` date, and has been rebuilt and deployed. Do not put report files in `src/data/`, which currently contains announcements.

Stories without valid titles, empty copy and placeholders beginning with `[` may be filtered out. Missing structured quotes omit the top cards. See [Report data](report-data.md) for fields and compatibility rules.

## Quote changes, values or times look wrong

`price` must be a number; a change indicator also requires a positive `reference.price`. Check the quote ID, units, observation time and reference. For `tnx`, `4.2` means `4.2%`, and changes display in basis points.

Timestamps should include UTC `Z` or an explicit offset and are displayed in New York time. Do not substitute the machine's current time or interval start for the quote observation time. The frontend does not recalibrate these values against the provider.

## Announcements have no unread marker or a banner disappeared

Read state persists for a stable ID. Historical entries with `notify: false` also do not count as unread. Banner dismissal is stored separately; marking a notice read does not dismiss its banner.

Editing text under the same ID does not notify readers again. Important new arrangements need a new ID, with the old notice's pin and banner removed. No automatic expiry or scheduled publication exists; see [Site announcements](site-announcements.md).

Use a separate browser profile or private window to test persistence rather than mistaking your own historical read state for a bug. Avoid clearing all site data, which also removes other reading preferences.

## Theme, text size or reading view did not persist

Preferences use localStorage for the current origin and do not synchronize across devices. Private browsing, disabled storage or cleared site data can remove them. `localhost`, `127.0.0.1` and the production domain are different origins too.

Controls should still work in the current page when storage is unavailable. See the [storage reference](architecture.md#browser-storage) for exact keys.

## Repository-wide lint fails while current source passes

As checked on 2026-11-16, `npm run lint` runs `eslint .`, which includes the legacy `assets/index-RH8QDDtS.js` bundle and the Node/CommonJS-style `test-screenshot.js`. Those files do not fit the current browser-source configuration, and the complete check does not pass.

Use `npx eslint src` for the current frontend. To fix the full command, separately organize the legacy output and scripts or adjust ESLint's scopes; do not disable rules globally. This existing issue was not introduced by the documentation work or an ordinary UI change.

## The build warns about a JavaScript bundle over 500 kB

All historical briefings are eagerly imported and loaded with the initial bundle. Vite's size warning reflects the current architecture and is separate from a syntax error or failed build.

More historical reports will increase the initial download. Possible improvements include loading reports by date, splitting data or introducing a content index; none is currently implemented. Raising the warning threshold alone does not improve loading performance.

## The sitemap command or legacy screenshot script fails

- `npm run sitemap` points to the missing `scripts/generate-sitemap.js`. `public/sitemap.xml` is a static legacy file; builds do not add the latest briefings to it.
- `public/robots.txt` and the sitemap still use the older GitHub Pages hostname rather than the current canonical domain. Review them when changing SEO or the deployment domain.
- `test-screenshot.js` uses an undeclared Playwright dependency, CommonJS `require`, a fixed port and machine-specific paths. It is not a reusable automated test entry point.

These are known maintenance items, not capabilities added by the documentation work.

## What happens when the generation computer is off

Published pages and historical content remain available on GitHub Pages. External generation tasks depending on that device stop, and the website does not create new reports itself.

The PowerShell script and cron text do not establish that a real schedule is installed. See [Operations](operations.md#automation-boundary) for pauses, resumption and documentation of the external process.
