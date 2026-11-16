// Keep IDs stable: read and dismissed states are saved against these IDs.
// Dates on historical entries are their original release dates.
const announcements = [
  {
    id: "2027-01-briefing-pause",
    date: "2026-11-15",
    category: "service",
    pinned: true,
    banner: true,
    zh: {
      title: "1 月晨报更新暂停安排",
      summary: "计划于 2027 年 1 月临时暂停发布新晨报，具体起止时间待确认。",
      body: [
        "暂停期间，网站和历史晨报仍可正常浏览。恢复更新后，将通过网站公告通知。",
      ],
      status: "计划暂停",
      bannerTitle: "2027 年 1 月晨报将暂停更新",
      bannerDescription: "网站与历史晨报仍可访问，具体起止时间另行公告。",
      details: [
        ["预计时间", "2027 年 1 月 · 待确认"],
        ["影响范围", "新晨报发布"],
        ["不受影响", "网站浏览与历史归档"],
      ],
    },
    en: {
      title: "January briefing publication pause",
      summary:
        "New morning briefs are planned to pause temporarily in January 2027. Exact dates are to be confirmed.",
      body: [
        "The website and past briefs will remain available during the pause. A site announcement will be posted when publication resumes.",
      ],
      status: "Planned pause",
      bannerTitle: "Morning briefs will pause in January 2027",
      bannerDescription:
        "The site and archive will remain available. Exact dates will be announced.",
      details: [
        ["When", "January 2027 · dates to be confirmed"],
        ["Affected", "Publication of new briefs"],
        ["Available", "Website browsing and the archive"],
      ],
    },
    action: "archive",
  },
  {
    id: "2026-11-15-site-announcements",
    date: "2026-11-15",
    category: "feature",
    zh: {
      title: "网站公告上线",
      summary: "服务安排、维护通知与功能更新，现在可以在这里统一查看。",
      body: [
        "点击顶部铃铛打开公告。重要服务安排会在页面顶部提前提醒，功能更新也会保留在公告记录中。",
        "已读状态和横幅关闭记录会保存在当前浏览器，无需登录。",
      ],
    },
    en: {
      title: "Site announcements are here",
      summary:
        "Service schedules, maintenance notices and feature updates now have one home.",
      body: [
        "Open the bell in the toolbar to browse updates. Important service notices also appear in a banner, while release notes stay in the announcement history.",
        "Read states and dismissed banners are remembered in this browser, with no sign-in needed.",
      ],
    },
  },
  {
    id: "2026-11-12-mobile-recent-briefs",
    date: "2026-11-12",
    category: "feature",
    notify: false,
    zh: {
      title: "手机端最近晨报位置优化",
      summary: "最近晨报移至正文之后，手机阅读更连贯。",
      body: [
        "手机端现在会在读完正文后显示最近晨报，方便继续回看；桌面端仍可通过侧栏快速切换。",
      ],
    },
    en: {
      title: "A smoother reading order on mobile",
      summary: "Recent briefs now follow the report content on small screens.",
      body: [
        "On mobile, recent briefs appear after the report for uninterrupted reading and easy browsing afterward. Desktop readers can still switch briefs from the side panel.",
      ],
    },
  },
  {
    id: "2026-11-07-reading-views",
    date: "2026-11-07",
    category: "feature",
    notify: false,
    zh: {
      title: "精简／完整阅读自由切换",
      summary: "先扫重点，或展开阅读完整分析。",
      body: [
        "精简模式保留今日主线与新闻标题，详情、板块雷达和盘前关注可按需展开。完整模式展示全部内容，阅读偏好会自动记住。",
      ],
    },
    en: {
      title: "Brief and full reading views",
      summary: "Scan the essentials or read the full analysis.",
      body: [
        "Brief view keeps the summary and headlines in focus, with story details, sector radar and premarket focus available on demand. Full view shows all content, and your preference is remembered.",
      ],
    },
  },
  {
    id: "2026-11-07-reading-size",
    date: "2026-11-07",
    category: "feature",
    notify: false,
    zh: {
      title: "阅读字号支持三档调节",
      summary: "小、中、大三档字号，让长篇晨报更好读。",
      body: [
        "在晨报标题下方选择适合自己的阅读字号，新闻标题与正文会一起调整。字号偏好保存在当前浏览器，下次打开仍会保留。",
      ],
    },
    en: {
      title: "Three reading text sizes",
      summary: "Small, medium and large text for comfortable reading.",
      body: [
        "Choose a text size below the briefing title to adjust report headlines and body copy together. Your choice is saved in this browser for future visits.",
      ],
    },
  },
  {
    id: "2026-11-07-edition-picker",
    date: "2026-11-07",
    category: "feature",
    notify: false,
    zh: {
      title: "晨报日期选择器焕新",
      summary: "按月份浏览历史晨报，也可以直接搜索日期。",
      body: [
        "新版日期面板与网站风格统一，支持月份分组、日期搜索和当前期高亮，也可以使用方向键、Enter 和 Esc 操作。",
      ],
    },
    en: {
      title: "A redesigned edition picker",
      summary: "Browse editions by month or search for a date.",
      body: [
        "The date panel now matches the site, with monthly groups, date search and a clear selection. Arrow keys, Enter and Escape work too.",
      ],
    },
  },
  {
    id: "2026-11-06-editorial-redesign",
    date: "2026-11-06",
    category: "feature",
    notify: false,
    zh: {
      title: "晨报界面全面改版",
      summary: "暖纸色与深绿色的新界面，让市场信息更有条理。",
      body: [
        "全新的阅读布局整合行情快照、今日主线、焦点新闻、板块雷达与历史归档，并支持晨报搜索、中英文切换和深浅色主题。",
      ],
    },
    en: {
      title: "A new look for the morning brief",
      summary:
        "A warm paper palette and forest green bring more structure to market news.",
      body: [
        "The new layout brings together market snapshots, the big picture, top stories, sector radar and the archive, with report search, Chinese and English, and light and dark themes.",
      ],
    },
  },
];

export default announcements.sort(
  (a, b) =>
    Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)) ||
    b.date.localeCompare(a.date),
);
