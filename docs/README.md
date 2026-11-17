# Documentation

**English** | [简体中文](zh-CN/README.md)

Start with the [project README](../README.md), then choose a guide below. English is the default language; a complete [Simplified Chinese edition](zh-CN/README.md) is available.

## Development and maintenance

| Guide                                       | What it covers                                                        |
| ------------------------------------------- | --------------------------------------------------------------------- |
| [Getting started](getting-started.md)       | Environment setup, local development, checks and build previews       |
| [Architecture](architecture.md)             | Content flow, components, state, styling and external dependencies    |
| [Report data](report-data.md)               | JSON fields, bilingual content, quote units and missing data          |
| [Operations](operations.md)                 | Publication, deployment verification, rollback, pauses and resumption |
| [Site announcements](site-announcements.md) | Adding notices, pinning banners and maintaining read states           |
| [Troubleshooting](troubleshooting.md)       | Stale pages, build warnings and legacy tooling                        |
| [Contributing](../CONTRIBUTING.md)          | Scope, commits and validation requirements                            |
| [Changelog](../CHANGELOG.md)                | Significant shipped code and feature changes                          |

## Documentation conventions

- Keep English in the default files: root `README.md`, `CONTRIBUTING.md`, `CHANGELOG.md`, `DEVELOPMENT.md` and the guides directly under `docs/`.
- Keep Simplified Chinese root documents in `*.zh-CN.md` and translated guides in `docs/zh-CN/`, using the same guide filenames. Each page must link to its counterpart. Keep navigation within the selected language.
- Update English and Chinese counterparts together when commands, fields or behavior change. Preserve the same meaning and examples; translate explanatory text, not command names, field names or source paths.
- Keep project entry points and collaboration files at the repository root. Use lowercase, hyphenated filenames and relative links for detailed guides so they work on GitHub.
- Separate instructions, reference material and architectural explanations. Maintain command and field details on their dedicated pages and link to them elsewhere.
- `package.json`, the lockfile and source code define current behavior. Update the relevant documentation in the same change as implementation changes.
- Add new guides to this index. Code examples must parse; keep placeholder examples out of the real `data/` directory.
- Distinguish implemented features, historical examples and planned work. Do not describe unconfigured or unverified automation as a production capability.

Documentation last checked against the repository on **2026-11-16**. Update the affected pages as behavior changes; a documentation update does not imply a new briefing was published that day.
