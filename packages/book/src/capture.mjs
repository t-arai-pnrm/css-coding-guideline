/**
 * デモの静止図を撮る。デモの iframe の srcdoc を、指定した幅のブラウザで開き、PNG にする。
 * デモはライトの配色で撮る（紙はライトで刷る）。同じ内容と幅の画像があれば、撮り直さない。
 * 縦に長いデモは、上から MAX_HEIGHT までを撮る（紙では、2枚の図が1ページに収まる高さにする）。
 */
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import puppeteer from 'puppeteer-core';

/** 撮る高さの上限（px） */
const MAX_HEIGHT = 520;

/** Chrome の場所。環境変数 CHROME_PATH で変えられる */
export const CHROME = process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

export const createCapturer = async (outDir) => {
  await mkdir(outDir, { recursive: true });
  let browser = null;
  const capture = async (srcdoc, width) => {
    const hash = createHash('sha1').update(`${width}\n${MAX_HEIGHT}\n${srcdoc}`).digest('hex').slice(0, 12);
    const name = `demo-${hash}-${width}.png`;
    const path = join(outDir, name);
    const meta = `${path}.json`;
    if (!existsSync(path) || !existsSync(meta)) {
      browser ??= await puppeteer.launch({ executablePath: CHROME, headless: true });
      const page = await browser.newPage();
      await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }]);
      await page.setViewport({ width, height: 200, deviceScaleFactor: 2 });
      await page.setContent(srcdoc, { waitUntil: 'load' });
      const height = await page.evaluate(() => Math.ceil(document.body.getBoundingClientRect().bottom + 16));
      const cropped = height > MAX_HEIGHT;
      await page.setViewport({ width, height: Math.min(Math.max(height, 80), MAX_HEIGHT), deviceScaleFactor: 2 });
      await page.screenshot({ path });
      await page.close();
      await writeFile(meta, JSON.stringify({ cropped }));
    }
    const { cropped } = JSON.parse(await readFile(meta, 'utf8'));
    return { file: name, cropped };
  };
  const close = async () => browser?.close();
  return { capture, close };
};
