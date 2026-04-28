const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 1600 } });

    page.on('console', msg => console.log('PAGE:', msg.type(), msg.text()));
    page.on('pageerror', err => console.error('PAGEERROR:', err.message));

    await page.goto('http://127.0.0.1:5174/finance/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(4000);
    await page.screenshot({ path: 'C:\\Users\\Yutao Zhou\\.openclaw\\workspace\\finance-output.png', fullPage: true });
    console.log('Screenshot saved');
    await browser.close();
  } catch (err) {
    console.error('SHOT_ERROR:', err && err.stack ? err.stack : String(err));
    process.exit(1);
  }
})();
