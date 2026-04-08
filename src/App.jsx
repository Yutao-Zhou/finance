import { useEffect, useState } from 'react'
import './App.css'

// Import all JSON files from data directory
const dataFiles = import.meta.glob('../data/*.json', { eager: true })

function parseData(files) {
  const reports = Object.values(files).map(mod => mod.default)
  return reports.sort((a, b) => new Date(b.date) - new Date(a.date))
}

// Helper to get localized string
function t(value, lang) {
  if (typeof value === 'object' && value !== null) {
    return value[lang] || value.en || ''
  }
  return value
}

// Sector name translations
const sectorNames = {
  ai: { en: 'AI', zh: 'AI' },
  semiconductor: { en: 'Semiconductor', zh: '半导体' },
  bigTech: { en: 'Big Tech', zh: '大科技' },
  energy: { en: 'Energy', zh: '能源' },
  ev: { en: 'EV', zh: '电动车' },
  market: { en: 'Market', zh: '大盘' },
  preciousMetals: { en: 'Precious Metals', zh: '贵金属' },
  oil: { en: 'Oil', zh: '石油' }
}

// UI translations
const ui = {
  en: {
    title: '🤖 ClawBot US Market Insights',
    subtitle: 'Daily AI-powered premarket analysis',
    summary: 'Summary',
    topNews: 'Top News',
    impact: 'Impact',
    bullish: 'Bullish',
    bearish: 'Bearish',
    macroRisk: 'Macro Risk',
    sectorRadar: 'Sector Radar',
    premarketFocus: 'Premarket Focus',
    futures: 'Futures',
    treasury10Y: '10Y Treasury',
    dxy: 'DXY',
    oil: 'Oil',
    keyRisk: 'Key Risk',
    aiJudgment: 'AI Judgment',
    confidence: 'Confidence',
    empty: 'No reports yet. ClawBot will publish daily insights here.',
    footer: 'Powered by ClawBot AI | Daily US Market Analysis'
  },
  zh: {
    title: '🤖 ClawBot 美股晨报',
    subtitle: '每日 AI 驱动盘前分析',
    summary: '一句话总览',
    topNews: '今日最重要新闻',
    impact: '为什么重要',
    bullish: '利好',
    bearish: '利空',
    macroRisk: '宏观风险',
    sectorRadar: '板块雷达',
    premarketFocus: '今日盘前关注',
    futures: '三大指数期货',
    treasury10Y: '10Y美债',
    dxy: '美元指数',
    oil: '油价',
    keyRisk: '关键风险',
    aiJudgment: '我的判断',
    confidence: '置信度',
    empty: '暂无报告。ClawBot 将在此发布每日洞察。',
    footer: 'ClawBot AI 驱动 | 每日美股分析'
  }
}

function ReportCard({ report, lang }) {
  const { date, summary, topNews, sectorRadar, premarketFocus, judgment } = report
  const labels = ui[lang]

  const judgmentColors = {
    'risk-on': 'var(--accent-green)',
    'risk-off': 'var(--accent-red)',
    'mixed': 'var(--accent-yellow)',
    'event-driven': 'var(--accent-blue)'
  }

  const judgmentLabels = {
    en: { 'risk-on': 'Risk-On', 'risk-off': 'Risk-Off', 'mixed': 'Mixed', 'event-driven': 'Event-Driven' },
    zh: { 'risk-on': '风险偏好', 'risk-off': '风险规避', 'mixed': '分化', 'event-driven': '事件驱动' }
  }

  return (
    <article className="report-card">
      <header className="report-header">
        <h2 className="report-date">{date}</h2>
        <span
          className="judgment-badge"
          style={{ backgroundColor: judgmentColors[judgment.type] || 'var(--accent-purple)' }}
        >
          {judgmentLabels[lang]?.[judgment.type] || judgment.type}
        </span>
      </header>

      <section className="report-summary">
        <h3>{labels.summary}</h3>
        <p>{t(summary, lang)}</p>
      </section>

      {topNews && topNews.length > 0 && t(topNews[0].title, lang) !== '' && !t(topNews[0].title, lang).startsWith('[') && (
        <section className="report-section">
          <h3>{labels.topNews}</h3>
          <div className="news-list">
            {topNews.map((news, i) => (
              <div key={i} className="news-item">
                <h4 className="news-title">{t(news.title, lang)}</h4>
                <p className="news-impact"><strong>{labels.impact}:</strong> {t(news.impact, lang)}</p>
                {news.bullish && news.bullish.length > 0 && news.bullish[0] !== 'TICKER1' && (
                  <p className="news-bullish">
                    <strong>{labels.bullish}:</strong> {news.bullish.join(', ')}
                  </p>
                )}
                {news.bearish && news.bearish.length > 0 && news.bearish[0] !== 'TICKER3' && (
                  <p className="news-bearish">
                    <strong>{labels.bearish}:</strong> {news.bearish.join(', ')}
                  </p>
                )}
                {news.macroRisk && t(news.macroRisk, lang) && !t(news.macroRisk, lang).startsWith('[') && (
                  <p className="news-macro">
                    <strong>{labels.macroRisk}:</strong> {t(news.macroRisk, lang)}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {sectorRadar && Object.values(sectorRadar).some(v => t(v, lang) && !t(v, lang).startsWith('[')) && (
        <section className="report-section">
          <h3>{labels.sectorRadar}</h3>
          <div className="sector-grid">
            {Object.entries(sectorRadar).map(([key, value]) => (
              t(value, lang) && !t(value, lang).startsWith('[') && (
                <div key={key} className="sector-item">
                  <h4 className="sector-name">{t(sectorNames[key], lang)}</h4>
                  <p className="sector-desc">{t(value, lang)}</p>
                </div>
              )
            ))}
          </div>
        </section>
      )}

      {premarketFocus && t(premarketFocus.futures, lang) && !t(premarketFocus.futures, lang).startsWith('[') && (
        <section className="report-section">
          <h3>{labels.premarketFocus}</h3>
          <div className="premarket-grid">
            {t(premarketFocus.futures, lang) && (
              <div className="premarket-item">
                <span className="premarket-label">{labels.futures}</span>
                <span className="premarket-value">{t(premarketFocus.futures, lang)}</span>
              </div>
            )}
            {t(premarketFocus.treasury10Y, lang) && (
              <div className="premarket-item">
                <span className="premarket-label">{labels.treasury10Y}</span>
                <span className="premarket-value">{t(premarketFocus.treasury10Y, lang)}</span>
              </div>
            )}
            {t(premarketFocus.dxy, lang) && (
              <div className="premarket-item">
                <span className="premarket-label">{labels.dxy}</span>
                <span className="premarket-value">{t(premarketFocus.dxy, lang)}</span>
              </div>
            )}
            {t(premarketFocus.oil, lang) && (
              <div className="premarket-item">
                <span className="premarket-label">{labels.oil}</span>
                <span className="premarket-value">{t(premarketFocus.oil, lang)}</span>
              </div>
            )}
            {t(premarketFocus.keyRisk, lang) && (
              <div className="premarket-item full-width">
                <span className="premarket-label">{labels.keyRisk}</span>
                <span className="premarket-value">{t(premarketFocus.keyRisk, lang)}</span>
              </div>
            )}
          </div>
        </section>
      )}

      {judgment.note && t(judgment.note, lang) && !t(judgment.note, lang).startsWith('[') && (
        <section className="report-section">
          <h3>{labels.aiJudgment}</h3>
          <p className="judgment-note">{t(judgment.note, lang)}</p>
          {judgment.confidence && (
            <p className="judgment-confidence">{labels.confidence}: {t(judgment.confidence, lang)}</p>
          )}
        </section>
      )}
    </article>
  )
}

function App() {
  const [reports, setReports] = useState([])
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme')
    return saved ? saved === 'dark' : true
  })
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem('lang')
    return saved || 'en'
  })

  useEffect(() => {
    document.documentElement.classList.toggle('light-mode', !darkMode)
    localStorage.setItem('theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  useEffect(() => {
    localStorage.setItem('lang', lang)
  }, [lang])

  useEffect(() => {
    const data = parseData(dataFiles)
    setReports(data)
  }, [])

  const labels = ui[lang]

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div>
            <h1>{labels.title}</h1>
            <p className="subtitle">{labels.subtitle}</p>
          </div>
          <div className="header-controls">
            <button
              className="lang-toggle"
              onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
              aria-label={`Switch to ${lang === 'en' ? 'Chinese' : 'English'}`}
            >
              {lang === 'en' ? '中文' : 'EN'}
            </button>
            <button
              className="theme-toggle"
              onClick={() => setDarkMode(!darkMode)}
              aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        {reports.length === 0 ? (
          <div className="empty-state">
            <p>{labels.empty}</p>
          </div>
        ) : (
          <div className="timeline">
            {reports.map((report, index) => (
              <ReportCard key={index} report={report} lang={lang} />
            ))}
          </div>
        )}
      </main>

      <footer className="footer">
        <p>{labels.footer}</p>
        <p className="copyright">© 2025 Yutao Zhou. All rights reserved.</p>
        <p className="disclaimer">Disclaimer: I am not responsible for AI-generated content.</p>
      </footer>
    </div>
  )
}

export default App