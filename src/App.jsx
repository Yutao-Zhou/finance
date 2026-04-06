import { useEffect, useState } from 'react'
import './App.css'

// Import all JSON files from data directory
const dataFiles = import.meta.glob('../data/*.json', { eager: true })

function parseData(files) {
  const reports = Object.values(files).map(mod => mod.default)
  return reports.sort((a, b) => new Date(b.date) - new Date(a.date))
}

function ReportCard({ report }) {
  const { date, summary, topNews, sectorRadar, premarketFocus, judgment } = report

  const judgmentColors = {
    'risk-on': 'var(--accent-green)',
    'risk-off': 'var(--accent-red)',
    'mixed': 'var(--accent-yellow)',
    'event-driven': 'var(--accent-blue)'
  }

  return (
    <article className="report-card">
      <header className="report-header">
        <h2 className="report-date">{date}</h2>
        <span
          className="judgment-badge"
          style={{ backgroundColor: judgmentColors[judgment.type] || 'var(--accent-purple)' }}
        >
          {judgment.type}
        </span>
      </header>

      <section className="report-summary">
        <h3>Summary</h3>
        <p>{summary}</p>
      </section>

      {topNews && topNews.length > 0 && topNews[0].title !== '[News headline]' && (
        <section className="report-section">
          <h3>Top News</h3>
          <div className="news-list">
            {topNews.map((news, i) => (
              <div key={i} className="news-item">
                <h4 className="news-title">{news.title}</h4>
                <p className="news-impact"><strong>Impact:</strong> {news.impact}</p>
                {news.bullish.length > 0 && news.bullish[0] !== 'TICKER1' && (
                  <p className="news-bullish">
                    <strong>Bullish:</strong> {news.bullish.join(', ')}
                  </p>
                )}
                {news.bearish.length > 0 && news.bearish[0] !== 'TICKER3' && (
                  <p className="news-bearish">
                    <strong>Bearish:</strong> {news.bearish.join(', ')}
                  </p>
                )}
                {news.macroRisk && news.macroRisk !== 'Yes/No - [transmission path if yes]' && (
                  <p className="news-macro">
                    <strong>Macro Risk:</strong> {news.macroRisk}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {sectorRadar && Object.values(sectorRadar).some(v => v && !v.startsWith('[')) && (
        <section className="report-section">
          <h3>Sector Radar</h3>
          <div className="sector-grid">
            {Object.entries(sectorRadar).map(([key, value]) => (
              value && !value.startsWith('[') && (
                <div key={key} className="sector-item">
                  <h4 className="sector-name">{key}</h4>
                  <p className="sector-desc">{value}</p>
                </div>
              )
            ))}
          </div>
        </section>
      )}

      {premarketFocus && premarketFocus.futures !== '[S&P 500 / Nasdaq / Dow futures direction]' && (
        <section className="report-section">
          <h3>Premarket Focus</h3>
          <div className="premarket-grid">
            {premarketFocus.futures && (
              <div className="premarket-item">
                <span className="premarket-label">Futures</span>
                <span className="premarket-value">{premarketFocus.futures}</span>
              </div>
            )}
            {premarketFocus.treasury10Y && (
              <div className="premarket-item">
                <span className="premarket-label">10Y Treasury</span>
                <span className="premarket-value">{premarketFocus.treasury10Y}</span>
              </div>
            )}
            {premarketFocus.dxy && (
              <div className="premarket-item">
                <span className="premarket-label">DXY</span>
                <span className="premarket-value">{premarketFocus.dxy}</span>
              </div>
            )}
            {premarketFocus.oil && (
              <div className="premarket-item">
                <span className="premarket-label">Oil</span>
                <span className="premarket-value">{premarketFocus.oil}</span>
              </div>
            )}
            {premarketFocus.keyRisk && (
              <div className="premarket-item full-width">
                <span className="premarket-label">Key Risk</span>
                <span className="premarket-value">{premarketFocus.keyRisk}</span>
              </div>
            )}
          </div>
        </section>
      )}

      {judgment.note && judgment.note !== '[Brief reasoning]' && (
        <section className="report-section">
          <h3>AI Judgment</h3>
          <p className="judgment-note">{judgment.note}</p>
          {judgment.confidence && (
            <p className="judgment-confidence">Confidence: {judgment.confidence}</p>
          )}
        </section>
      )}
    </article>
  )
}

function App() {
  const [reports, setReports] = useState([])

  useEffect(() => {
    const data = parseData(dataFiles)
    setReports(data)
  }, [])

  return (
    <div className="app">
      <header className="header">
        <h1>🤖 ClawBot US Market Insights</h1>
        <p className="subtitle">Daily AI-powered premarket analysis</p>
      </header>

      <main className="main-content">
        {reports.length === 0 ? (
          <div className="empty-state">
            <p>No reports yet. ClawBot will publish daily insights here.</p>
          </div>
        ) : (
          <div className="timeline">
            {reports.map((report, index) => (
              <ReportCard key={index} report={report} />
            ))}
          </div>
        )}
      </main>

      <footer className="footer">
        <p>Powered by ClawBot AI | Daily US Market Analysis</p>
      </footer>
    </div>
  )
}

export default App