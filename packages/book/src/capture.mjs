/**
 * デモの静止図を撮る。デモの iframe の srcdoc を、指定した幅のブラウザで開き、ページ全体を PNG にする。
 * デモはライトの配色で撮る（紙はライトで刷る）。同じ内容と幅の画像があれば、撮り直さない。
 */
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import puppeteer from 'puppeteer-core';

/** Chrome の場所。環境変数 CHROME_PATH で変えられる */
export const CHROME = process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

export const createCapturer = async (outDir) => {
  await mkdir(outDir, { recursive: true });
  let browser = null;
  const capture = async (srcdoc, width) => {
    const hash = createHash('sha1').update(`${width}\n${srcdoc}`).digest('hex').slice(0, 12);
    const name = `demo-${hash}-${width}.png`;
    const path = join(outDir, name);
    if (!existsSync(path)) {
      browser ??= await puppeteer.launch({ executablePath: CHROME, headless: true });
      const page = await browser.newPage();
      await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }]);
      await page.setViewport({ width, height: 200, deviceScaleFactor: 2 });
      await page.setContent(srcdoc, { waitUntil: 'load' });
      const height = await page.evaluate(() => Math.ceil(document.body.getBoundingClientRect().bottom + 16));
      await page.setViewport({ width, height: Math.min(Math.max(height, 80), 1600), deviceScaleFactor: 2 });
      await page.screenshot({ path, fullPage: true });
      await page.close();
    }
    return name;
  };
  const close = async () => browser?.close();
  return { capture, close };
};
