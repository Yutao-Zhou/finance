import { useEffect, useId, useRef, useState } from "react";
import {
  formatDate,
  hasContent,
  localizedItems,
  quoteChange,
  quoteTime,
  reportMatches,
  safeUrl,
  sourceName,
  text,
} from "./lib/reports";
import "./App.css";

const dataFiles = import.meta.glob("../data/*.json", { eager: true });
const reports = Object.values(dataFiles)
  .map((mod) => mod.default)
  .filter((report) => /^\d{4}-\d{2}-\d{2}$/.test(report?.date))
  .sort((a, b) => b.date.localeCompare(a.date));
const copy = {
  zh: {
    title: "美股晨报",
    subtitle: "开盘之前，看清市场脉络。",
    brief: "今日晨报",
    archive: "历史归档",
    sectors: "板块雷达",
    focus: "盘前关注",
    search: "搜索日期、新闻或股票代码",
    searchShort: "搜索晨报",
    summary: "今日主线",
    aiSummary: "AI 摘要",
    news: "焦点新闻",
    bullish: "利好因素",
    bearish: "利空因素",
    macro: "风险传导",
    risk: "盘前观察",
    judgment: "AI 观点",
    confidence: "置信度",
    readMore: "查看原文",
    searchSource: "搜索相关新闻",
    more: "展开全文",
    less: "收起全文",
    recent: "最近晨报",
    allReports: "全部归档",
    latest: "最新一期",
    previous: "上一期",
    next: "下一期",
    snapshot: "晨报行情快照",
    delayed: "延时数据",
    recorded: "晨报记录",
    reference: "参考时点",
    source: "数据来源",
    historical: "历史报告",
    edition: "选择晨报日期",
    results: "搜索结果",
    clearSearch: "清除搜索",
    archiveIntro: "回看每个交易日的市场脉络。",
    empty: "暂无晨报",
    noResults: "没有找到匹配的晨报",
    trySearch: "试试其他日期、关键词或股票代码。",
    count: "期晨报",
    showMore: "加载更多晨报",
    jump: "本期导航",
    top: "回到顶部",
    readBrief: "阅读晨报",
    ai: "AI 辅助研究",
    footer: "每日市场脉络，开盘前掌握。",
    disclaimer:
      "内容由 AI 生成，仅供信息参考，不构成投资建议。行情为各期晨报记录的快照，非实时数据。",
    futures: "指数期货",
    treasury10Y: "10年期美债",
    dxy: "美元指数",
    oil: "原油",
    light: "切换浅色模式",
    dark: "切换深色模式",
    menu: "展开导航",
    close: "关闭导航",
    feedEmpty: "晨报发布后会显示在这里。",
    skip: "跳转到主要内容",
  },
  en: {
    title: "Market Morning Brief",
    subtitle: "A clearer view. Before the bell.",
    brief: "Latest brief",
    archive: "Archive",
    sectors: "Sector radar",
    focus: "Premarket focus",
    search: "Search dates, headlines or tickers",
    searchShort: "Search briefs",
    summary: "The big picture",
    aiSummary: "AI SUMMARY",
    news: "Top stories",
    bullish: "Bullish factors",
    bearish: "Bearish factors",
    macro: "Risk transmission",
    risk: "What to watch",
    judgment: "AI perspective",
    confidence: "Confidence",
    readMore: "Read source",
    searchSource: "Find coverage",
    more: "Read the full view",
    less: "Show less",
    recent: "Recent briefs",
    allReports: "View archive",
    latest: "Latest edition",
    previous: "Older brief",
    next: "Newer brief",
    snapshot: "Briefing snapshot",
    delayed: "Delayed data",
    recorded: "Recorded in the brief",
    reference: "Reference",
    source: "Source",
    historical: "Archive edition",
    edition: "Select briefing date",
    results: "Search results",
    clearSearch: "Clear search",
    archiveIntro: "Revisit the market, one morning at a time.",
    empty: "No briefs yet",
    noResults: "No matching briefs",
    trySearch: "Try another date, keyword or ticker.",
    count: "briefs",
    showMore: "Load more briefs",
    jump: "In this edition",
    top: "Back to top",
    readBrief: "Read briefing",
    ai: "AI-assisted research",
    footer: "Daily context. Before the opening bell.",
    disclaimer:
      "AI-generated content for information only, not investment advice. Quotes are recorded briefing snapshots, not live market data.",
    futures: "Index futures",
    treasury10Y: "10Y Treasury",
    dxy: "US dollar index",
    oil: "Crude oil",
    light: "Switch to light mode",
    dark: "Switch to dark mode",
    menu: "Open navigation",
    close: "Close navigation",
    feedEmpty: "New daily briefings will appear here.",
    skip: "Skip to main content",
  },
};
const sectorNames = {
  ai: ["AI", "AI"],
  semiconductor: ["半导体", "Semiconductors"],
  bigTech: ["大科技", "Big Tech"],
  energy: ["能源", "Energy"],
  ev: ["电动车", "Electric vehicles"],
  market: ["大盘", "Broad market"],
  preciousMetals: ["贵金属", "Precious metals"],
  oil: ["原油", "Oil"],
};
const moods = {
  "risk-on": ["风险偏好", "Risk-on"],
  "risk-off": ["风险规避", "Risk-off"],
  mixed: ["市场分化", "Mixed"],
  "event-driven": ["事件驱动", "Event-driven"],
};
const metrics = [
  {
    id: "es",
    name: ["标普500期货", "S&P 500 futures"],
    code: "S&P 500 FUTURES",
    icon: "bars",
  },
  {
    id: "nq",
    name: ["纳指100期货", "Nasdaq-100 futures"],
    code: "NASDAQ 100 FUTURES",
    icon: "chip",
  },
  {
    id: "tnx",
    name: ["10年期美债", "10Y Treasury"],
    code: "US 10Y",
    icon: "bank",
  },
  {
    id: "wti",
    name: ["WTI 原油", "WTI crude"],
    code: "WTI CRUDE",
    icon: "drop",
  },
];
function Icon({ name, size = 20, ...props }) {
  const paths = {
    brief: (
      <>
        <rect x="5" y="3" width="14" height="18" rx="2" />
        <path d="M9 7h6M9 11h6M9 15h4" />
      </>
    ),
    archive: (
      <>
        <path d="M3 8h18v12H3zM2 4h20v4H2zM9 12h6" />
      </>
    ),
    layers: <path d="m12 3 10 5-10 5L2 8l10-5ZM3 12l9 5 9-5M3 16l9 5 9-5" />,
    search: (
      <>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m16 16 5 5" />
      </>
    ),
    sun: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 1v2m0 18v2M1 12h2m18 0h2M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2" />
      </>
    ),
    moon: <path d="M20.8 14A9 9 0 0 1 10 3.2 9 9 0 1 0 20.8 14Z" />,
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
    external: <path d="M14 4h6v6m0-6L10 14M10 4H4v16h16v-6" />,
    chevron: <path d="m9 5 7 7-7 7" />,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
    bars: <path d="M5 20V12m7 8V7m7 13V3" strokeWidth="4" />,
    chip: (
      <>
        <rect x="6" y="6" width="12" height="12" rx="2" />
        <path d="M9 2v4m6-4v4M9 18v4m6-4v4M2 9h4m-4 6h4m12-6h4m-4 6h4" />
      </>
    ),
    bank: <path d="m2 8 10-6 10 6H2ZM3 21h18M5 11v7m7-7v7m7-7v7" />,
    drop: <path d="M12 2S5 10 5 15a7 7 0 0 0 14 0c0-5-7-13-7-13Z" />,
    watch: (
      <path d="m4 6-2 9a4 4 0 1 0 8 0V8H4Zm16 0 2 9a4 4 0 1 1-8 0V8h6ZM10 11h4M6 3v3m12-3v3" />
    ),
    sparkle: (
      <path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3ZM21 2v4m-2-2h4" />
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M3 10h18M7 2v6m10-6v6" />
      </>
    ),
    monitor: (
      <>
        <rect x="3" y="3" width="18" height="14" rx="2" />
        <path d="M8 21h8m-4-4v4" />
      </>
    ),
    info: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v6m0-10h.01" />
      </>
    ),
  };
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
      {paths[name] || paths.layers}
    </svg>
  );
}
function BrandMark() {
  return (
    <svg className="brand-mark" viewBox="0 0 40 36" aria-hidden="true">
      <path
        fill="currentColor"
        opacity=".65"
        d="M3 28 17 7a5 5 0 0 1 7-1l12 19a4 4 0 0 1-4 6H20l-6-11-6 11H5a2 2 0 0 1-2-3Z"
      />
      <path fill="var(--sidebar)" d="m13 25 9-14 7 12h-9l-4 6Z" />
    </svg>
  );
}
function Mood({ type, lang }) {
  return type ? (
    <span className={"mood mood--" + type}>
      <span className="mood-dot" />
      {moods[type]?.[lang === "zh" ? 0 : 1] || type}
    </span>
  ) : null;
}
function SectionTitle({ icon, title, subtitle, id }) {
  return (
    <div className="section-heading">
      {icon && <Icon name={icon} size={22} />}
      <h2 id={id}>{title}</h2>
      {subtitle && <span className="section-english">{subtitle}</span>}
      <span className="heading-rule" />
    </div>
  );
}
function MetricStrip({ report, lang }) {
  const labels = copy[lang];
  const quotes = metrics
    .map((metric) => ({
      ...metric,
      quote: report.marketData?.quotes?.find((quote) => quote.id === metric.id),
    }))
    .filter((metric) => Number.isFinite(metric.quote?.price));
  if (!quotes.length) return null;
  return (
    <section className="market-snapshot" aria-label={labels.snapshot}>
      <div className="metric-grid">
        {quotes.map(({ id, name, code, icon, quote }) => {
          const change = quoteChange(quote);
          const sign = change && change.value >= 0 ? "+" : "";
          const price = new Intl.NumberFormat(
            lang === "zh" ? "zh-CN" : "en-US",
            {
              minimumFractionDigits: id === "tnx" ? 3 : 2,
              maximumFractionDigits: id === "tnx" ? 3 : 2,
            },
          ).format(quote.price);
          return (
            <div className="metric-card" key={id}>
              <div className="metric-top">
                <span className="metric-icon">
                  <Icon name={icon} size={23} />
                </span>
                <div>
                  <h2>{name[lang === "zh" ? 0 : 1]}</h2>
                  <span className="metric-code">{code}</span>
                </div>
              </div>
              <div className="metric-values">
                <strong>
                  {id === "wti" ? "$" : ""}
                  {price}
                  {id === "tnx" ? "%" : ""}
                </strong>
                {change && (
                  <span
                    className={
                      "metric-change " +
                      (id === "tnx"
                        ? "neutral"
                        : change.value >= 0
                          ? "positive"
                          : "negative")
                    }
                  >
                    {sign}
                    {change.value.toFixed(id === "tnx" ? 1 : 2)}
                    {change.unit === "bp" ? " bp" : "%"}
                  </span>
                )}
              </div>
              <div className="metric-time">{quoteTime(quote.observedAt)}</div>
              {quote.reference?.observedAt && (
                <div className="metric-reference">
                  {labels.reference} · {quoteTime(quote.reference.observedAt)}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="snapshot-caption">
        <span>
          {labels.source} · {report.marketData?.provider || "Yahoo Finance"}
        </span>
        <span>
          {labels.recorded}
          {quotes.some(({ quote }) => quote.delayed)
            ? " · " + labels.delayed
            : ""}
        </span>
      </div>
    </section>
  );
}
function FactorList({ values, type, lang }) {
  const items = localizedItems(values, lang);
  return items.length ? (
    <div className={"factor factor--" + type}>
      <span className="factor-label">{copy[lang][type]}</span>
      <ul>
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  ) : null;
}
function NewsList({ report, lang }) {
  const labels = copy[lang];
  const news =
    report.topNews?.filter((item) => hasContent(item.title, lang)) || [];
  if (!news.length) return null;
  return (
    <section
      className="panel news-panel"
      id="stories"
      aria-labelledby="stories-heading"
    >
      <SectionTitle
        title={labels.news}
        subtitle="TOP STORIES"
        id="stories-heading"
      />
      {news.map((item, i) => {
        const source = safeUrl(item.url);
        const url =
          source ||
          "https://www.google.com/search?q=" +
            encodeURIComponent(text(item.title, lang));
        return (
          <article className="news-story" key={i}>
            <div className="story-number">{String(i + 1).padStart(2, "0")}</div>
            <div className="story-body">
              <h3>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  {text(item.title, lang)}
                  <Icon name="external" size={15} />
                </a>
              </h3>
              {hasContent(item.impact, lang) && (
                <p className="story-impact">{text(item.impact, lang)}</p>
              )}
              <a
                className="source-link"
                href={url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {sourceName(source)}
                {source ? " · " + labels.readMore : labels.searchSource}
                <Icon name="external" size={12} />
              </a>
              <div className="factor-grid">
                <FactorList values={item.bullish} type="bullish" lang={lang} />
                <FactorList values={item.bearish} type="bearish" lang={lang} />
              </div>
              {hasContent(item.macroRisk, lang) && (
                <div className="macro-note">
                  <span>{labels.macro}</span>
                  <p>{text(item.macroRisk, lang)}</p>
                </div>
              )}
            </div>
          </article>
        );
      })}
    </section>
  );
}
function ExpandableText({ value, lang }) {
  const [expanded, setExpanded] = useState(false);
  const id = useId();
  const content = text(value, lang);
  const expandable = content.length > (lang === "zh" ? 90 : 180);
  return (
    <>
      <p
        id={id}
        className={
          "judgment-copy" + (expandable && !expanded ? " is-collapsed" : "")
        }
      >
        {content}
      </p>
      {expandable && (
        <button
          className="text-button expand-button"
          aria-expanded={expanded}
          aria-controls={id}
          onClick={() => setExpanded(!expanded)}
        >
          {copy[lang][expanded ? "less" : "more"]}
          <Icon name="chevron" size={13} />
        </button>
      )}
    </>
  );
}
function ReportSidebar({ report, lang, onSelect, onArchive }) {
  const labels = copy[lang],
    note = report.judgment?.note,
    confidence = text(report.judgment?.confidence, lang),
    focus = report.premarketFocus?.keyRisk;
  return (
    <aside className="report-sidebar" aria-label={labels.risk}>
      {hasContent(focus, lang) && (
        <section className="panel watch-panel">
          <SectionTitle icon="watch" title={labels.risk} />
          <p>{text(focus, lang)}</p>
        </section>
      )}
      {hasContent(note, lang) && (
        <section className="panel judgment-panel">
          <div className="judgment-heading">
            <SectionTitle icon="sparkle" title={labels.judgment} />
            {confidence && (
              <span className="confidence">
                {labels.confidence} · {confidence}
              </span>
            )}
          </div>
          <ExpandableText key={report.date + lang} value={note} lang={lang} />
        </section>
      )}
      <section className="panel recent-panel">
        <SectionTitle icon="calendar" title={labels.recent} />
        <div className="recent-list">
          {reports.slice(0, 3).map((item) => (
            <button
              className={
                "recent-date" + (item.date === report.date ? " selected" : "")
              }
              onClick={() => onSelect(item.date)}
              key={item.date}
              aria-pressed={item.date === report.date}
            >
              <time dateTime={item.date}>
                {formatDate(item.date, lang, true)}
              </time>
              <Icon name="chevron" size={14} />
            </button>
          ))}
        </div>
        <button className="text-button archive-link" onClick={onArchive}>
          {labels.allReports}
          <Icon name="arrow" size={14} />
        </button>
      </section>
      <nav className="edition-nav" aria-label={labels.jump}>
        <span>{labels.jump}</span>
        {report.topNews?.some((item) => hasContent(item.title, lang)) && (
          <a href="#stories">
            {labels.news}
            <Icon name="arrow" size={13} />
          </a>
        )}
        {Object.values(report.sectorRadar || {}).some((value) =>
          hasContent(value, lang),
        ) && (
          <a href="#sectors">
            {labels.sectors}
            <Icon name="arrow" size={13} />
          </a>
        )}
        {Object.values(report.premarketFocus || {}).some((value) =>
          hasContent(value, lang),
        ) && (
          <a href="#premarket">
            {labels.focus}
            <Icon name="arrow" size={13} />
          </a>
        )}
      </nav>
    </aside>
  );
}
function Sectors({ report, lang }) {
  const sectors = Object.entries(report.sectorRadar || {}).filter(([, value]) =>
    hasContent(value, lang),
  );
  return sectors.length ? (
    <section
      className="panel sectors-panel"
      id="sectors"
      aria-labelledby="sectors-heading"
    >
      <SectionTitle
        icon="layers"
        title={copy[lang].sectors}
        subtitle="SECTOR RADAR"
        id="sectors-heading"
      />
      <div className="sector-grid">
        {sectors.map(([key, value]) => (
          <article className="sector-card" key={key}>
            <div className="sector-heading">
              <span className="sector-icon">
                <Icon
                  name={
                    ["ai", "semiconductor"].includes(key)
                      ? "chip"
                      : key === "bigTech"
                        ? "monitor"
                        : ["oil", "energy"].includes(key)
                          ? "drop"
                          : "layers"
                  }
                  size={20}
                />
              </span>
              <h3>{sectorNames[key]?.[lang === "zh" ? 0 : 1] || key}</h3>
            </div>
            <p>{text(value, lang)}</p>
          </article>
        ))}
      </div>
    </section>
  ) : null;
}
function Premarket({ report, lang }) {
  const labels = copy[lang];
  const items = ["futures", "treasury10Y", "dxy", "oil"].filter((key) =>
    hasContent(report.premarketFocus?.[key], lang),
  );
  return items.length ? (
    <section
      className="panel premarket-panel"
      id="premarket"
      aria-labelledby="premarket-heading"
    >
      <SectionTitle
        icon="watch"
        title={labels.focus}
        subtitle="PREMARKET FOCUS"
        id="premarket-heading"
      />
      <div className="premarket-grid">
        {items.map((key) => (
          <article className={"focus-card focus-card--" + key} key={key}>
            <h3>{labels[key]}</h3>
            <p>{text(report.premarketFocus[key], lang)}</p>
          </article>
        ))}
      </div>
    </section>
  ) : null;
}
function readPreference(key, fallback, allowed) {
  try {
    const value = localStorage.getItem(key);
    return allowed.includes(value) ? value : fallback;
  } catch {
    return fallback;
  }
}
function App() {
  const [lang, setLang] = useState(() =>
    readPreference("lang", "zh", ["zh", "en"]),
  );
  const [theme, setTheme] = useState(() =>
    readPreference("theme", "light", ["light", "dark"]),
  );
  const [selectedDate, setSelectedDate] = useState(
    () =>
      reports.find(
        (report) =>
          report.date ===
          new URLSearchParams(window.location.search).get("date"),
      )?.date || reports[0]?.date,
  );
  const [view, setView] = useState("brief"),
    [search, setSearch] = useState(""),
    [archiveCount, setArchiveCount] = useState(18),
    [mobileOpen, setMobileOpen] = useState(false);
  const searchRef = useRef(null),
    labels = copy[lang];
  const activeReport =
    reports.find((report) => report.date === selectedDate) || reports[0];
  const filtered = reports.filter((report) => reportMatches(report, search)),
    showArchive = view === "archive" || search.trim() !== "",
    activeIndex = reports.indexOf(activeReport);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    document.title = "ClawBot · " + copy[lang].title;
    try {
      localStorage.setItem("theme", theme);
      localStorage.setItem("lang", lang);
    } catch {
      /* Storage may be disabled. */
    }
  }, [theme, lang]);
  useEffect(() => {
    const onKey = (event) => {
      if (
        event.key === "/" &&
        !["INPUT", "TEXTAREA", "SELECT"].includes(
          document.activeElement?.tagName,
        ) &&
        !event.ctrlKey &&
        !event.metaKey
      ) {
        event.preventDefault();
        searchRef.current?.focus();
      }
      if (event.key === "Escape") {
        setMobileOpen(false);
        setSearch("");
        searchRef.current?.blur();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => {
    const timer = window.setInterval(
      () => {
        if (document.visibilityState === "hidden") window.location.reload();
      },
      60 * 60 * 1000,
    );
    return () => window.clearInterval(timer);
  }, []);
  function selectReport(date) {
    setSelectedDate(date);
    setView("brief");
    setSearch("");
    setMobileOpen(false);
    const url = new URL(window.location.href);
    if (date === reports[0]?.date) url.searchParams.delete("date");
    else url.searchParams.set("date", date);
    url.hash = "";
    window.history.replaceState(null, "", url);
    window.scrollTo({ top: 0, behavior: "instant" });
  }
  function openArchive() {
    setView("archive");
    setSearch("");
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  }
  function openSectors() {
    setSearch("");
    setView("brief");
    setMobileOpen(false);
    window.requestAnimationFrame(() =>
      document
        .getElementById("sectors")
        ?.scrollIntoView({ behavior: "smooth" }),
    );
  }
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        {labels.skip}
      </a>
      {mobileOpen && (
        <button
          className="nav-backdrop"
          aria-label={labels.close}
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={"sidebar" + (mobileOpen ? " is-open" : "")}
        aria-label="ClawBot"
      >
        <a
          className="brand"
          href={import.meta.env.BASE_URL}
          onClick={(event) => {
            event.preventDefault();
            selectReport(reports[0]?.date);
          }}
        >
          <BrandMark />
          <span>ClawBot</span>
        </a>
        <span className="brand-caption">THE PREMARKET BRIEF</span>
        <nav className="primary-nav">
          <button
            className={"nav-item" + (!showArchive ? " active" : "")}
            aria-current={!showArchive ? "page" : undefined}
            onClick={() => selectReport(reports[0]?.date)}
          >
            <Icon name="brief" />
            <span>{labels.brief}</span>
            <span className="nav-dot" />
          </button>
          <button
            className={"nav-item" + (showArchive ? " active" : "")}
            aria-current={showArchive ? "page" : undefined}
            onClick={openArchive}
          >
            <Icon name="archive" />
            <span>{labels.archive}</span>
            <span className="nav-count">{reports.length}</span>
          </button>
          {activeReport &&
            Object.values(activeReport.sectorRadar || {}).some((value) =>
              hasContent(value, lang),
            ) && (
              <button className="nav-item" onClick={openSectors}>
                <Icon name="layers" />
                <span>{labels.sectors}</span>
              </button>
            )}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-line" />
          <p>
            Daily context.
            <br />
            <em>Before the bell.</em>
          </p>
          <span>
            <span className="status-dot" />
            {labels.ai}
          </span>
          <a
            href="https://github.com/Yutao-Zhou/finance"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
            <Icon name="external" size={12} />
          </a>
        </div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="icon-button mobile-menu"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={labels.menu}
              aria-expanded={mobileOpen}
            >
              <Icon name={mobileOpen ? "close" : "menu"} />
            </button>
            <span className="workspace-label">
              <span className="status-dot" />
              {labels.ai}
            </span>
          </div>
          <div className="toolbar">
            <div className="search-field">
              <Icon name="search" size={17} />
              <input
                ref={searchRef}
                type="search"
                aria-label={labels.search}
                placeholder={labels.searchShort}
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setArchiveCount(18);
                }}
              />
              {search ? (
                <button
                  className="search-clear"
                  onClick={() => setSearch("")}
                  aria-label={labels.clearSearch}
                >
                  <Icon name="close" size={14} />
                </button>
              ) : (
                <kbd>/</kbd>
              )}
            </div>
            <div
              className="language-switch"
              role="group"
              aria-label={lang === "zh" ? "语言" : "Language"}
            >
              <button
                lang="zh-CN"
                className={lang === "zh" ? "selected" : ""}
                aria-pressed={lang === "zh"}
                onClick={() => setLang("zh")}
              >
                中
              </button>
              <span>/</span>
              <button
                lang="en"
                className={lang === "en" ? "selected" : ""}
                aria-pressed={lang === "en"}
                onClick={() => setLang("en")}
              >
                EN
              </button>
            </div>
            <span className="toolbar-divider" />
            <button
              className="icon-button theme-toggle"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              aria-label={labels[theme === "light" ? "dark" : "light"]}
              title={labels[theme === "light" ? "dark" : "light"]}
            >
              <Icon name={theme === "light" ? "moon" : "sun"} size={21} />
            </button>
          </div>
        </header>
        <main id="main" className="main-content">
          <header className="masthead">
            <div>
              <div className="masthead-title">
                <h1>{showArchive ? labels.archive : labels.title}</h1>
                <span className="masthead-english">
                  THE
                  <br />
                  PREMARKET
                  <br />
                  BRIEF
                </span>
              </div>
              <p className="masthead-subtitle">
                {showArchive ? labels.archiveIntro : labels.subtitle}
              </p>
            </div>
            {activeReport && !showArchive && (
              <div className="edition-picker">
                <span className="edition-label">
                  {activeReport.date === reports[0]?.date
                    ? labels.latest
                    : labels.historical}
                </span>
                <label className="date-select">
                  <span className="sr-only">{labels.edition}</span>
                  <select
                    value={activeReport.date}
                    onChange={(event) => selectReport(event.target.value)}
                  >
                    {reports.map((report) => (
                      <option key={report.date} value={report.date}>
                        {formatDate(report.date, lang)}
                      </option>
                    ))}
                  </select>
                  <Icon name="chevron" size={15} />
                </label>
                <span className="edition-date">
                  DAILY INTELLIGENCE / {activeReport.date.replaceAll("-", ".")}
                </span>
              </div>
            )}
            {showArchive && (
              <span className="archive-count">
                {search.trim() ? labels.results + " · " : ""}
                {filtered.length} {labels.count}
              </span>
            )}
          </header>
          {showArchive ? (
            <section
              className="archive-section"
              aria-label={labels.archive}
              aria-live="polite"
            >
              {filtered.length ? (
                <>
                  <div className="archive-grid">
                    {filtered.slice(0, archiveCount).map((report) => (
                      <button
                        className="panel archive-card"
                        key={report.date}
                        onClick={() => selectReport(report.date)}
                      >
                        <div className="archive-card-top">
                          <time dateTime={report.date}>
                            {formatDate(report.date, lang)}
                          </time>
                          <Mood type={report.judgment?.type} lang={lang} />
                        </div>
                        <h2>
                          {text(
                            report.topNews?.find((news) =>
                              hasContent(news.title, lang),
                            )?.title,
                            lang,
                          ) || labels.title}
                        </h2>
                        <p>{text(report.summary, lang)}</p>
                        <span className="archive-card-footer">
                          {labels.readBrief}
                          <Icon name="arrow" size={16} />
                        </span>
                      </button>
                    ))}
                  </div>
                  {archiveCount < filtered.length && (
                    <button
                      className="load-more"
                      onClick={() => setArchiveCount(archiveCount + 18)}
                    >
                      {labels.showMore}
                      <Icon name="arrow" size={16} />
                    </button>
                  )}
                </>
              ) : (
                <div className="empty-state">
                  <Icon name="search" size={32} />
                  <h2>{labels.noResults}</h2>
                  <p>{labels.trySearch}</p>
                  <button
                    className="text-button"
                    onClick={() => {
                      setSearch("");
                      setView("archive");
                    }}
                  >
                    {labels.clearSearch}
                    <Icon name="arrow" size={15} />
                  </button>
                </div>
              )}
            </section>
          ) : activeReport ? (
            <>
              <MetricStrip report={activeReport} lang={lang} />
              <div className="report-layout">
                <div className="reading-column">
                  {hasContent(activeReport.summary, lang) && (
                    <section
                      className="summary-panel"
                      aria-labelledby="summary-heading"
                    >
                      <div className="summary-heading">
                        <h2 id="summary-heading">{labels.summary}</h2>
                        <span className="summary-tag">{labels.aiSummary}</span>
                        <Mood type={activeReport.judgment?.type} lang={lang} />
                      </div>
                      <p>{text(activeReport.summary, lang)}</p>
                    </section>
                  )}
                  <NewsList report={activeReport} lang={lang} />
                </div>
                <ReportSidebar
                  report={activeReport}
                  lang={lang}
                  onSelect={selectReport}
                  onArchive={openArchive}
                />
              </div>
              <Sectors report={activeReport} lang={lang} />
              <Premarket report={activeReport} lang={lang} />
              <nav className="report-pagination" aria-label={labels.archive}>
                <button
                  disabled={activeIndex >= reports.length - 1}
                  onClick={() => selectReport(reports[activeIndex + 1].date)}
                >
                  <Icon className="reverse-arrow" name="arrow" size={17} />
                  <span>
                    {labels.previous}
                    <small>{reports[activeIndex + 1]?.date}</small>
                  </span>
                </button>
                <span className="pagination-edition">{activeReport.date}</span>
                <button
                  disabled={activeIndex <= 0}
                  onClick={() => selectReport(reports[activeIndex - 1].date)}
                >
                  <span>
                    {labels.next}
                    <small>{reports[activeIndex - 1]?.date}</small>
                  </span>
                  <Icon name="arrow" size={17} />
                </button>
              </nav>
            </>
          ) : (
            <section className="empty-state">
              <Icon name="brief" size={32} />
              <h2>{labels.empty}</h2>
              <p>{labels.feedEmpty}</p>
            </section>
          )}
          <footer className="footer">
            <div className="footer-top">
              <span className="footer-brand">
                ClawBot <span>/</span> {labels.footer}
              </span>
              <a href="#main">{labels.top} ↑</a>
            </div>
            <p>
              <Icon name="info" size={14} />
              {labels.disclaimer}
            </p>
            <span className="copyright">
              © {new Date().getFullYear()} Yutao Zhou. All rights reserved.
            </span>
          </footer>
        </main>
      </div>
    </div>
  );
}
export default App;
