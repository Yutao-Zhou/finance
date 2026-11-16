import { useEffect, useId, useRef, useState } from "react";
import "./Announcements.css";

const copy = {
  zh: {
    bell: "公告",
    title: "网站公告",
    subtitle: "服务安排与功能动态",
    all: "全部",
    service: "服务通知",
    feature: "功能更新",
    pinned: "置顶",
    markAll: "全部标为已读",
    allRead: "全部已读",
    unread: "未读",
    unreadCount: (count) => `${count} 条未读`,
    total: (count) => `${count} 条公告`,
    close: "关闭公告",
    dismiss: "关闭此提醒",
    advance: "提前告知",
    details: "查看详情",
    archive: "查看历史晨报",
    footer: "维护、更新与恢复通知，都会在这里发布。",
  },
  en: {
    bell: "Updates",
    title: "Site updates",
    subtitle: "Service notices & release notes",
    all: "All",
    service: "Service",
    feature: "Features",
    pinned: "Pinned",
    markAll: "Mark all as read",
    allRead: "All caught up",
    unread: "Unread",
    unreadCount: (count) => `${count} unread`,
    total: (count) => `${count} announcements`,
    close: "Close announcements",
    dismiss: "Dismiss this notice",
    advance: "Coming up",
    details: "View details",
    archive: "Browse past briefs",
    footer: "Maintenance, updates and resumption notices live here.",
  },
};

function UpdateIcon({ name = "bell", size = 20, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {name === "bell" && (
        <>
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4M12 2V1" />
        </>
      )}
      {name === "calendar" && (
        <>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M16 3v4M8 3v4M3 11h18" />
        </>
      )}
      {name === "close" && <path d="m6 6 12 12M18 6 6 18" />}
      {name === "chevron" && <path d="m9 5 7 7-7 7" />}
      {name === "arrow" && <path d="M5 12h14m-5-5 5 5-5 5" />}
      {name === "check" && <path d="m5 12 4 4L19 6" />}
      {name === "pin" && (
        <path d="m16 3 5 5-4 1-4 5 1 3-2 2-7-7 2-2 3 1 5-4 1-4ZM4 20l4-4" />
      )}
    </svg>
  );
}

export function AnnouncementBell({ lang, updates }) {
  const labels = copy[lang];
  return (
    <button
      type="button"
      className="announcement-bell"
      onClick={() => updates.openUpdates()}
      aria-haspopup="dialog"
      aria-controls="site-announcements"
      aria-expanded={updates.open}
      aria-label={`${labels.title}${updates.unreadCount ? ` · ${labels.unreadCount(updates.unreadCount)}` : ""}`}
    >
      <UpdateIcon />
      <span className="announcement-bell-label">{labels.bell}</span>
      {updates.unreadCount > 0 && (
        <span className="announcement-badge" aria-hidden="true">
          {updates.unreadCount}
        </span>
      )}
    </button>
  );
}

export function AnnouncementBanner({ lang, updates }) {
  const item = updates.featured;
  if (!item) return null;
  const labels = copy[lang],
    content = item[lang];
  return (
    <aside className="announcement-banner" aria-label={labels.service}>
      <UpdateIcon
        name="calendar"
        size={22}
        className="announcement-banner-icon"
      />
      <div className="announcement-banner-copy">
        <div className="announcement-banner-heading">
          <span className="announcement-advance">{labels.advance}</span>
          <strong>{content.bannerTitle || content.title}</strong>
        </div>
        <p>{content.bannerDescription || content.summary}</p>
      </div>
      <button
        type="button"
        className="announcement-banner-details"
        onClick={() => updates.openUpdates(item.id)}
      >
        {labels.details}
        <UpdateIcon name="chevron" size={14} />
      </button>
      <button
        type="button"
        className="icon-button announcement-dismiss"
        aria-label={labels.dismiss}
        onClick={() => updates.dismiss(item.id)}
      >
        <UpdateIcon name="close" size={16} />
      </button>
    </aside>
  );
}

function AnnouncementList({ lang, updates, onArchive }) {
  const [filter, setFilter] = useState("all");
  const [expandedId, setExpandedId] = useState(updates.initialId);
  const labels = copy[lang];
  const items = updates.items.filter(
    (item) => filter === "all" || item.category === filter,
  );
  const dateFormat = new Intl.DateTimeFormat(
    lang === "zh" ? "zh-CN" : "en-US",
    { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" },
  );
  return (
    <>
      <div className="announcement-controls">
        <div
          className="announcement-filters"
          role="group"
          aria-label={lang === "zh" ? "公告分类" : "Announcement category"}
        >
          {["all", "service", "feature"].map((value) => (
            <button
              type="button"
              key={value}
              aria-pressed={filter === value}
              onClick={() => setFilter(value)}
            >
              {labels[value]}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="announcement-mark-all"
          disabled={!updates.unreadCount}
          onClick={updates.markAllRead}
        >
          <UpdateIcon name="check" size={14} />
          {updates.unreadCount ? labels.markAll : labels.allRead}
        </button>
      </div>
      <div
        className="announcement-list"
        aria-label={labels.total(items.length)}
      >
        {items.map((item) => {
          const content = item[lang],
            expanded = expandedId === item.id,
            unread = updates.isUnread(item);
          return (
            <details
              className={`announcement-card announcement-card--${item.category}`}
              open={expanded}
              key={item.id}
            >
              <summary
                onClick={(event) => {
                  event.preventDefault();
                  setExpandedId(expanded ? null : item.id);
                  updates.markRead(item.id);
                }}
              >
                <span className="announcement-card-meta">
                  {item.pinned && (
                    <span className="announcement-pin">
                      <UpdateIcon name="pin" size={12} />
                      {labels.pinned}
                    </span>
                  )}
                  <span className="announcement-category">
                    {labels[item.category]}
                    {content.status ? ` · ${content.status}` : ""}
                  </span>
                  {unread && (
                    <span
                      className="announcement-unread-dot"
                      role="img"
                      aria-label={labels.unread}
                    />
                  )}
                </span>
                <span className="announcement-card-title">
                  <span>{content.title}</span>
                  <UpdateIcon name="chevron" size={16} />
                </span>
                <time dateTime={item.date}>
                  {dateFormat.format(new Date(`${item.date}T00:00:00Z`))}
                </time>
                <span className="announcement-card-summary">
                  {content.summary}
                </span>
              </summary>
              <div className="announcement-card-body">
                {content.body?.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {content.details && (
                  <dl className="announcement-facts">
                    {content.details.map(([label, value]) => (
                      <div key={label}>
                        <dt>{label}</dt>
                        <dd>{value}</dd>
                      </div>
                    ))}
                  </dl>
                )}
                {item.action === "archive" && (
                  <button
                    type="button"
                    className="announcement-archive"
                    onClick={() => {
                      updates.closeUpdates();
                      onArchive();
                    }}
                  >
                    {labels.archive}
                    <UpdateIcon name="arrow" size={16} />
                  </button>
                )}
              </div>
            </details>
          );
        })}
        <p className="announcement-history-count">
          {labels.total(items.length)}
        </p>
      </div>
    </>
  );
}

export function AnnouncementDrawer({ lang, updates, onArchive }) {
  const ref = useRef(null),
    closeRef = useRef(null),
    titleId = useId(),
    subtitleId = useId();
  const labels = copy[lang];
  useEffect(() => {
    if (!updates.open) return;
    const dialog = ref.current,
      previousFocus = document.activeElement,
      overflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
      if (previousFocus?.isConnected)
        previousFocus.focus({ preventScroll: true });
    };
  }, [updates.open]);
  return (
    <dialog
      className="announcements-drawer"
      id="site-announcements"
      ref={ref}
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={subtitleId}
      onCancel={(event) => {
        event.preventDefault();
        updates.closeUpdates();
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (
          event.clientX < bounds.left ||
          event.clientX > bounds.right ||
          event.clientY < bounds.top ||
          event.clientY > bounds.bottom
        )
          updates.closeUpdates();
      }}
    >
      <div className="announcements-drawer-inner">
        <header className="announcement-header">
          <span className="announcement-eyebrow">SITE UPDATES</span>
          <button
            type="button"
            className="icon-button announcement-close"
            ref={closeRef}
            aria-label={labels.close}
            onClick={updates.closeUpdates}
          >
            <UpdateIcon name="close" size={21} />
          </button>
          <div className="announcement-heading">
            <h2 id={titleId}>{labels.title}</h2>
            <span
              className={
                "announcement-unread-count" +
                (!updates.unreadCount ? " is-read" : "")
              }
              role="status"
            >
              {updates.unreadCount
                ? labels.unreadCount(updates.unreadCount)
                : labels.allRead}
            </span>
          </div>
          <p id={subtitleId}>{labels.subtitle}</p>
        </header>
        {updates.open && (
          <AnnouncementList
            lang={lang}
            updates={updates}
            onArchive={onArchive}
          />
        )}
        <footer className="announcement-footer">
          <span className="status-dot" />
          {labels.footer}
        </footer>
      </div>
    </dialog>
  );
}
