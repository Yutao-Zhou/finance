# Changelog

**English** | [简体中文](CHANGELOG.zh-CN.md)

Significant changes to development, operations and the reading experience, listed by actual date descending. The project does not currently use formal release versions, so entries are grouped by date. Daily report data commits are not listed individually.

Reader-facing notices are maintained separately in [`src/data/announcements.js`](src/data/announcements.js). This file does not automatically appear in site announcements.

## 2026-11-21

### Added

- Browser read-aloud for the current edition’s summary, top stories and premarket risks, with pause, resume and stop controls.

## 2026-11-16

### Documentation

- Replace the Vite template README with a project introduction and quick start.
- Add development, architecture, report-format, operations, announcement and troubleshooting guides.
- Add a contribution guide, preserve the DEVELOPMENT entry point and establish a dated changelog.
- Document the existing limitations of legacy scripts, repository-wide lint and the sitemap command.
- Make English the default for all project documentation, retain complete Simplified Chinese counterparts and add page-level language links.

## 2026-11-15

### Added

- Announcement bell, category list, important service banners and read states.
- Advance notice of a planned pause in new morning briefings during January 2027, with exact dates to be confirmed.
- Historical feature announcements using their original release dates.

Commit: `1d2a715`.

## 2026-11-12

### Fixed

- Move recent briefs below the report body on phone and tablet layouts, while retaining the desktop sidebar entry.

Commit: `dbab098`.

## 2026-11-11

### Maintenance

- Integrate the main site's shared analytics script and expose language, view, report-date and reading-end markers.

Commits: `f09d8f9`, `73160d4`. The main site maintains the analytics service implementation.

## 2026-11-07

### Added and improved

- Styled edition picker with search, monthly groups and keyboard navigation (`c50d9d4`).
- Small, medium and large reading text sizes with persisted browser preferences (`2e63693`).
- Brief and full reading views with on-demand details and persisted browser preferences (`253d9dc`).

## 2026-11-06

### Redesigned

- Introduce a warm paper palette, forest green and serif headings.
- Bring together market snapshots, the big picture, top stories, sector radar, premarket focus and the archive.
- Retain Chinese and English, light and dark themes, search and historical edition selection, with responsive layouts.

Commit: `cdebd9c`.

This changelog covers the significant changes above. Earlier history remains available in Git. Print/save-as-PDF was not released and is not listed as a shipped feature.
