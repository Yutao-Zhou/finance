# Contributing

**English** | [简体中文](CONTRIBUTING.zh-CN.md)

[Project README](README.md) · [Documentation](docs/README.md)

## Before making changes

1. Read [Getting started](docs/getting-started.md) and [Architecture](docs/architecture.md).
2. Check the working tree and branch, preserve existing changes, and synchronize with the remote. Keep other contributors' work intact.
3. Identify whether the change affects code, reports, announcements or documentation. Keep each commit focused on a clear problem.

Use a topic branch and pull request for collaboration or review. Maintainers working directly on `main` still need to complete checks and review staged files before pushing. The repository currently has no CI configuration that runs these checks automatically.

## Code and content conventions

- Follow the existing React and CSS structure. Reuse semantic theme variables and provide both Chinese and English for new UI copy.
- Preserve labels, keyboard interaction, visible focus and mobile layouts. Do not replace reading text-size controls with scaling of the entire page.
- Follow [Report data](docs/report-data.md) when editing briefings. Verify sources, times, units and bilingual content. Do not publish example prices or placeholder stories.
- Announcement IDs identify persisted reader states. Follow [Site announcements](docs/site-announcements.md) for updates and historical backfills.
- `dist/` is generated output; do not edit it manually or commit it to `main`. The legacy root `assets/` directory is not the place for new frontend code.
- Keep keys, tokens and private machine configuration out of frontend code and public documentation. Treat browser-loaded content as public.
- Keep unrelated changes out of the current scope. Record independent issues and their impact separately.

## Validation

For code changes, run at least:

```bash
npx eslint src
npm run build
git diff --check
```

The full `npm run lint` is currently affected by legacy files; see [known issues](docs/troubleshooting.md). There is no `npm test` script. Do not claim to have run a test suite that does not exist.

Check the areas affected by the change. Documentation-only and unrelated small changes do not require repeating every UI check:

| Area                 | Checks                                                                                                                     |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Layout and styling   | Desktop, tablet, 390px phone, and 320px when relevant; no horizontal overflow; readable light and dark themes              |
| Bilingual UI         | Copy, controls, dates, empty states and long text in both languages                                                        |
| Reading experience   | Three text sizes, brief/full views, disclosures and persistence after reload                                               |
| Editions and archive | Latest and historical editions, date search, arrows/Enter/Escape, report search and no-results states                      |
| Announcements        | Filters, banners, dismissal, read state, persistence, Escape, native dialog focus and archive navigation                   |
| Report content       | Filename/date agreement, observation and reference times, source links, and no presentation of missing data as live quotes |

When adding stable business logic, choose tests that verify actual behavior. Avoid tests that merely mirror the implementation, and do not document automatic testing before the infrastructure exists.

## Documentation and change records

**English is the default documentation language.** Keep default root documents and guides under `docs/` in English. Preserve Simplified Chinese counterparts as root `*.zh-CN.md` files and guides under `docs/zh-CN/`.

Update both languages in the same change, including language-switch links, navigation and examples. New guides need an English version and a corresponding Chinese version. Commands, identifiers, source paths and the documented behavior must agree between translations.

| Change                                  | Also update                                                                        |
| --------------------------------------- | ---------------------------------------------------------------------------------- |
| Commands or dependency requirements     | `docs/getting-started.md` and the README quick start when needed                   |
| Components, data flow or storage keys   | `docs/architecture.md`                                                             |
| Report fields or compatibility          | `docs/report-data.md`                                                              |
| Deployment or operations                | `docs/operations.md`                                                               |
| Announcement structure or read behavior | `docs/site-announcements.md`                                                       |
| Significant feature or fix              | `CHANGELOG.md`; add a separate website announcement when readers need notification |

Apply the equivalent updates to the Chinese files. Relative links must work on GitHub and JSON examples must parse. `DEVELOPMENT.md` remains an entry point; detailed instructions live under `docs/`.

## Commits and releases

Use a title that describes the actual change, such as `Fix mobile placement of recent briefs` or `Document report data and deployment workflow`. No commit prefix is enforced, and daily content updates do not require an application version bump.

Review `git diff` and `git diff --cached --stat` before committing. Stage only files for this change. PR descriptions should explain the problem, resulting behavior, validation and any remaining limitations.

After pushing source, website changes still need the [deployment workflow](docs/operations.md). Documentation-only changes normally require a push but no site deployment.
