# Site announcements

**English** | [简体中文](zh-CN/site-announcements.md)

[Documentation index](README.md) · [Operations](operations.md)

## Where content lives

Announcements are JavaScript objects in [`src/data/announcements.js`](../src/data/announcements.js), built and deployed with the static site. The UI lives in `src/components/Announcements.jsx`; read-state logic lives in `src/lib/useAnnouncements.js`.

Announcements require no login, backend, browser push permissions or report-generation device. Content changes only after deployment. These are on-site notices, not email, system push or off-site alerts.

## Add an announcement

Add a complete bilingual object to the array. Replace the example ID, date and feature description below with actual release information before publishing:

```js
const announcement = {
  id: "2026-11-16-example-update",
  date: "2026-11-16",
  category: "feature",
  zh: {
    title: "示例功能更新",
    summary: "一句话说明用户现在可以做什么。",
    body: ["说明实际变化、入口和需要了解的限制。"],
  },
  en: {
    title: "Example feature update",
    summary: "Explain what readers can now do.",
    body: ["Describe the change, where to find it and any relevant limits."],
  },
};
```

Copy the object, not the `const` declaration, into the announcement array. Confirm that a feature is shipped before announcing it. Use the original release date and `notify: false` for historical backfills.

## Field reference

| Field      | Type or value                  | Behavior                                                                                     |
| ---------- | ------------------------------ | -------------------------------------------------------------------------------------------- |
| `id`       | Unique, stable string          | Identifies persisted read and dismissed states; never reuse another announcement's ID        |
| `date`     | Valid `YYYY-MM-DD`             | Displayed publication date and descending sort key                                           |
| `category` | `service` / `feature`          | Service notice or feature update                                                             |
| `zh`, `en` | Both language objects required | The component reads the selected object directly; it has no report-style language fallback   |
| `pinned`   | Optional boolean               | `true` sorts the entry before ordinary announcements                                         |
| `banner`   | Optional boolean               | Shows a page-top reminder, mainly for important service arrangements                         |
| `notify`   | Optional boolean               | Counts as a new message by default; `false` excludes historical backfills from unread counts |
| `action`   | Optional `archive`             | Shows a button to the report archive; other values have no implemented action                |

Each language object contains:

| Field               | Type                                     | Purpose                                                  |
| ------------------- | ---------------------------------------- | -------------------------------------------------------- |
| `title`             | Required string                          | Announcement title                                       |
| `summary`           | Required string                          | Summary visible in the collapsed card                    |
| `body`              | Optional string array                    | Paragraphs displayed when expanded                       |
| `status`            | Optional string                          | Short status after the category, such as “Planned pause” |
| `bannerTitle`       | Optional string                          | Banner heading; falls back to `title`                    |
| `bannerDescription` | Optional string                          | Banner description; falls back to `summary`              |
| `details`           | Optional array of `[label, value]` pairs | Facts such as expected timing and affected services      |

Copy is plain text, without Markdown, HTML or embedded link rendering. A new action type needs component support as well as data fields.

## Ordering, visibility and dates

- Entries sort by `pinned` first, then by descending `date`. Equal values retain their order in the file.
- Only the first sorted entry with `banner` that has not been dismissed in this browser appears as a banner. Dismissing it may reveal the next eligible banner.
- Category filters affect the drawer list, not the banner or global unread count.
- There is no scheduled publication, future-date hiding or automatic expiry. **An entry dated in the future still appears as soon as it is deployed.** Removing a banner requires editing the data and deploying again.

Ordinary feature updates can stay in the list without pinning or banners. Preserve expired service arrangements as history and note their updated status in the text.

## Read and dismissed states

Read entries and dismissed banners use separate localStorage ID arrays:

- `clawbot:announcements:read`
- `clawbot:announcements:dismissed`

Opening the bell expands and marks the first sorted announcement as read. Opening banner details marks that announcement as read. Expanding another entry marks it read; “Mark all as read” records every current ID. Historical entries with `notify: false` never count as unread.

Reading does not dismiss a banner, and dismissing a banner does not remove the entry from the drawer. Dismissal persists in this browser; editing text under the same ID does not make its banner appear again. Without storage, controls work in the current page but persistence after reload is not guaranteed.

For a significant change that should notify readers again, create a new announcement with a new ID. Remove `banner` / `pinned` from the old notice and explain the changed arrangement. Keep the ID when merely correcting a typo.

## Service notice content

Explain the reader impact: expected timing, affected services, what remains available and where further updates will appear. State when dates are unconfirmed and avoid unsupported promises about resumption.

Exact dates for the January 2027 briefing pause are currently unconfirmed. When arrangements are finalized or publication resumes, follow the [pause and resumption procedure](operations.md#pause-and-resume-publication). Public notices need no private travel or device details.

## Publish and validate

1. Check the unique ID, actual publication date, category and both languages. Use `git log` to verify historical feature dates.
2. Run `npx eslint src` and `npm run build`; preview content, ordering, filters and expansion.
3. Check mobile layouts, light/dark themes, Escape, visible focus, archive navigation and persistence of read/dismissed states after reload.
4. Commit only related files, push source, then follow the [deployment workflow](operations.md#publish-the-site) and verify production.

Use a separate browser profile or private window to test a new visitor without clearing existing reading preferences. Record developer-facing changes in the [Changelog](../CHANGELOG.md) too, but do not announce unreleased features as available.

Backfilled features came from `cdebd9c` (2026-11-06), `c50d9d4` / `2e63693` / `253d9dc` (2026-11-07), and `dbab098` (2026-11-12). Print/save-as-PDF was not released and is not included in announcements.
