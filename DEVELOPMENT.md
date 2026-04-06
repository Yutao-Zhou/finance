# ClawBot Development Guide

## Project Overview

This is a React + Vite application deployed to GitHub Pages at `https://yutaozhou.com/finance/`.

## Daily Workflow for ClawBot

### 1. Research & Generate Daily Report

Create a JSON file at `data/YYYY-MM-DD.json` (e.g., `data/2026-04-05.json`) following this structure:

```json
{
  "date": "YYYY-MM-DD",
  "summary": "[1-3 sentence summary of today's premarket主线]",
  "topNews": [
    {
      "title": "[News headline]",
      "impact": "[Why this matters]",
      "bullish": ["TICKER1", "TICKER2"],
      "bearish": ["TICKER3"],
      "macroRisk": "Yes/No - [transmission path if yes]"
    }
  ],
  "sectorRadar": {
    "ai": "[AI sector update]",
    "semiconductor": "[Semiconductor update]",
    "bigTech": "[Big Tech update]",
    "energy": "[Energy sector update]",
    "ev": "[EV sector update]",
    "market": "[Broad market update]",
    "preciousMetals": "[Precious metals update]",
    "oil": "[Oil market update]"
  },
  "premarketFocus": {
    "futures": "[S&P 500 / Nasdaq / Dow futures direction]",
    "treasury10Y": "[10Y Treasury yield if notable]",
    "dxy": "[DXY if notable]",
    "oil": "[Oil price if notable]",
    "keyRisk": "[Key risk to watch today]"
  },
  "judgment": {
    "type": "risk-on / risk-off / mixed / event-driven",
    "confidence": "high / medium / low",
    "note": "[Brief reasoning]"
  }
}
```

### 2. Commit and Push

```bash
git add data/YYYY-MM-DD.json
git commit -m "Add daily market insight for YYYY-MM-DD"
git push origin main
```

### 3. Deploy to GitHub Pages

```bash
npm run deploy
```

This command:
1. Runs `npm run build` to generate production files in `dist/`
2. Uses `gh-pages` package to publish `dist/` contents to the `gh-pages` branch

## Important Configuration

### Vite Base Path

The `vite.config.js` must have `base: '/finance/'` for correct asset loading on GitHub Pages:

```js
export default defineConfig({
  plugins: [react()],
  base: '/finance/',
})
```

### Package.json Deploy Script

The deploy script is configured as:
```json
"deploy": "npm run build && gh-pages -d dist"
```

## Common Issues & Solutions

### 404 Errors for Assets (e.g., `/src/main.jsx` not found)

**Cause**: The `gh-pages` branch is out of date or the `base` path is incorrect.

**Solution**:
1. Verify `vite.config.js` has `base: '/finance/'`
2. Run `npm run deploy` to rebuild and push to `gh-pages` branch
3. Wait 1-2 minutes for GitHub Pages to update

### Site Not Updating After Push

The site won't update automatically when you push to `main`. You **must** run `npm run deploy` to rebuild and publish to the `gh-pages` branch.

## File Structure

```
finance/
├── data/                    # Daily JSON reports (ClawBot writes here)
│   └── 2026-04-05.json     # Template report
├── src/
│   ├── App.jsx             # Main component - reads data/*.json
│   ├── App.css             # Styling
│   └── main.jsx            # Entry point
├── dist/                   # Build output (auto-generated, do not edit)
├── vite.config.js          # Vite config (base: '/finance/')
├── package.json            # Dependencies + deploy script
└── DEVELOPMENT.md          # This file
```

## Dependencies

- **react** / **react-dom**: UI framework
- **vite**: Build tool
- **gh-pages**: Deployment tool (publishes `dist/` to `gh-pages` branch)