export function text(value, lang = "en") {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  if (value && typeof value === "object")
    return text(value[lang] || value.en || value.zh, lang);
  return "";
}
export function hasContent(value, lang) {
  const content = text(value, lang).trim();
  return content !== "" && !content.startsWith("[");
}
export function localizedItems(values, lang) {
  if (!Array.isArray(values)) return [];
  const tagged = values.filter(
    (value) => typeof value === "string" && /^(en|zh)\s*:/i.test(value),
  );
  const plain = values.filter(
    (value) => typeof value !== "string" || !/^(en|zh)\s*:/i.test(value),
  );
  const preferred = tagged.filter((value) =>
    value.toLowerCase().startsWith(lang + ":"),
  );
  const fallback = tagged.filter((value) =>
    value.toLowerCase().startsWith("en:"),
  );
  return [...plain, ...(preferred.length ? preferred : fallback)]
    .map((value) =>
      text(value, lang)
        .replace(/^(en|zh)\s*:\s*/i, "")
        .trim(),
    )
    .filter((value) => value && !/^\[|^TICKER\d/i.test(value));
}
export function reportMatches(report, query) {
  if (!query.trim()) return true;
  const { date, summary, topNews, sectorRadar, premarketFocus, judgment } =
    report;
  return JSON.stringify({
    date,
    summary,
    topNews,
    sectorRadar,
    premarketFocus,
    judgment,
  })
    .toLowerCase()
    .includes(query.trim().toLowerCase());
}
export function safeUrl(value) {
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}
export function sourceName(value) {
  try {
    return new URL(value).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}
export function formatDate(date, lang, compact = false) {
  const value = new Date(date + "T12:00:00Z");
  if (Number.isNaN(value.getTime())) return date;
  return new Intl.DateTimeFormat(
    lang === "zh" ? "zh-CN" : "en-US",
    compact
      ? { month: "short", day: "numeric", timeZone: "UTC" }
      : {
          year: "numeric",
          month: "long",
          day: "numeric",
          weekday: "long",
          timeZone: "UTC",
        },
  ).format(value);
}
export function quoteTime(value) {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZoneName: "short",
  })
    .format(date)
    .replace(",", "");
}
export function quoteChange(quote) {
  if (
    !Number.isFinite(quote.price) ||
    !Number.isFinite(quote.reference?.price) ||
    quote.reference.price <= 0
  )
    return null;
  const difference = quote.price - quote.reference.price;
  return {
    value:
      quote.id === "tnx"
        ? difference * 100
        : (difference / quote.reference.price) * 100,
    unit: quote.id === "tnx" ? "bp" : "%",
  };
}
