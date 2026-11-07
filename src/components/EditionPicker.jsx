import { useEffect, useId, useRef, useState } from "react";
import { formatDate } from "../lib/reports";
import "./EditionPicker.css";

const labels = {
  zh: {
    title: "选择晨报日期",
    search: "搜索日期，如 2026-11",
    empty: "没有找到这个日期的晨报",
    count: "期晨报",
    latest: "最新",
    hint: "↑ ↓ 选择 · Enter 打开",
    close: "关闭日期选择",
  },
  en: {
    title: "Select an edition",
    search: "Find a date, e.g. 2026-11",
    empty: "No briefings match this date",
    count: "editions",
    latest: "LATEST",
    hint: "↑ ↓ to navigate · Enter to open",
    close: "Close edition picker",
  },
};

export default function EditionPicker({ reports, value, lang, onChange }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeDate, setActiveDate] = useState(value);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const searchRef = useRef(null);
  const activeRef = useRef(null);
  const id = useId();
  const strings = labels[lang];
  const locale = lang === "zh" ? "zh-CN" : "en-US";
  const filtered = reports.filter(({ date }) =>
    (date + " " + formatDate(date, lang))
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );
  const activeIndex = Math.max(
    0,
    filtered.findIndex(({ date }) => date === activeDate),
  );
  const highlighted = filtered[activeIndex]?.date;
  const groups = new Map();
  for (const report of filtered) {
    const month = report.date.slice(0, 7);
    if (!groups.has(month)) groups.set(month, []);
    groups.get(month).push(report);
  }

  useEffect(() => {
    if (!open) return;
    searchRef.current?.focus({ preventScroll: true });
    const outside = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);

  useEffect(() => {
    if (open) activeRef.current?.scrollIntoView({ block: "nearest" });
  }, [open, highlighted]);

  function show() {
    setQuery("");
    setActiveDate(value);
    setOpen(true);
  }
  function close() {
    setOpen(false);
    triggerRef.current?.focus({ preventScroll: true });
  }
  function choose(date) {
    close();
    onChange(date);
  }
  function onSearchKey(event) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;
      const next = Math.max(
        0,
        Math.min(filtered.length - 1, activeIndex + direction),
      );
      if (filtered[next]) setActiveDate(filtered[next].date);
    } else if (event.key === "Enter" && highlighted) {
      event.preventDefault();
      choose(highlighted);
    }
  }

  return (
    <div
      className="edition-control"
      ref={rootRef}
      onBlur={(event) => {
        if (
          event.relatedTarget &&
          !event.currentTarget.contains(event.relatedTarget)
        )
          setOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.preventDefault();
          event.stopPropagation();
          close();
        }
      }}
    >
      <button
        type="button"
        className="edition-trigger"
        ref={triggerRef}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? id + "-dialog" : undefined}
        aria-label={strings.title + " · " + formatDate(value, lang)}
        onClick={() => (open ? close() : show())}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            show();
          }
        }}
      >
        <span>{formatDate(value, lang)}</span>
        <svg
          className="edition-chevron"
          width="14"
          height="14"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path d="m5 7 5 5 5-5" />
        </svg>
      </button>
      {open && (
        <div
          className="edition-popover"
          id={id + "-dialog"}
          role="dialog"
          aria-labelledby={id + "-title"}
        >
          <div className="edition-popover-heading">
            <div>
              <span className="edition-eyebrow">THE ARCHIVE</span>
              <h2 id={id + "-title"}>{strings.title}</h2>
            </div>
            <button
              className="edition-close"
              type="button"
              aria-label={strings.close}
              onClick={close}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <path d="m5 5 10 10M5 15 15 5" />
              </svg>
            </button>
          </div>
          <div className="edition-search">
            <svg
              width="16"
              height="16"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              aria-hidden="true"
            >
              <circle cx="8.5" cy="8.5" r="5.5" />
              <path d="m13 13 4 4" />
            </svg>
            <input
              ref={searchRef}
              role="combobox"
              aria-label={strings.search}
              aria-autocomplete="list"
              aria-expanded="true"
              aria-controls={id + "-list"}
              aria-activedescendant={
                highlighted ? id + "-" + highlighted : undefined
              }
              placeholder={strings.search}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setActiveDate("");
              }}
              onKeyDown={onSearchKey}
            />
          </div>
          <div
            className="edition-options"
            id={id + "-list"}
            role="listbox"
            aria-label={strings.title}
          >
            {[...groups].map(([month, entries]) => (
              <div
                className="edition-month"
                role="group"
                aria-label={new Intl.DateTimeFormat(locale, {
                  year: "numeric",
                  month: "long",
                  timeZone: "UTC",
                }).format(new Date(month + "-01T12:00:00Z"))}
                key={month}
              >
                <div className="edition-month-heading" aria-hidden="true">
                  {new Intl.DateTimeFormat(locale, {
                    year: "numeric",
                    month: "long",
                    timeZone: "UTC",
                  }).format(new Date(month + "-01T12:00:00Z"))}
                  <span>{entries.length}</span>
                </div>
                {entries.map(({ date }) => (
                  <button
                    type="button"
                    role="option"
                    aria-selected={date === value}
                    tabIndex={-1}
                    id={id + "-" + date}
                    ref={date === highlighted ? activeRef : undefined}
                    className={
                      "edition-option" +
                      (date === highlighted ? " is-highlighted" : "") +
                      (date === value ? " is-selected" : "")
                    }
                    key={date}
                    onMouseEnter={() => setActiveDate(date)}
                    onClick={() => choose(date)}
                  >
                    <span className="edition-option-main">
                      <time dateTime={date}>
                        {formatDate(date, lang, true)}
                      </time>
                      <span>
                        {new Intl.DateTimeFormat(locale, {
                          weekday: "long",
                          timeZone: "UTC",
                        }).format(new Date(date + "T12:00:00Z"))}
                      </span>
                    </span>
                    <span className="edition-option-meta">
                      {date === reports[0]?.date && (
                        <span className="edition-latest">{strings.latest}</span>
                      )}
                      {date === value ? (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 20 20"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          aria-hidden="true"
                        >
                          <path d="m4 10 4 4 8-8" />
                        </svg>
                      ) : (
                        <span className="edition-option-year">
                          {date.slice(0, 4)}
                        </span>
                      )}
                    </span>
                  </button>
                ))}
              </div>
            ))}
          </div>
          {!filtered.length && (
            <p className="edition-no-results" role="status">
              {strings.empty}
            </p>
          )}
          <div className="edition-popover-footer">
            <span aria-live="polite">
              {filtered.length} {strings.count}
            </span>
            <span>{strings.hint}</span>
          </div>
        </div>
      )}
    </div>
  );
}
