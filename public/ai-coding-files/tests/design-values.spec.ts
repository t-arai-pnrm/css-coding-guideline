import { test, expect } from '@playwright/test';

/**
 * plan の値の対応表を、ブラウザの計算値と照合するテスト。
 * 対応表の「書く値」を、対象と同じ親の中に置いた比較用の要素に指定し、2つの計算値が一致するかを見る。
 * トークンを参照する値も、ブラウザが解決した値どうしで比べられる。
 * 値に % や em を含む行は、比較用の要素と大きさの基準が変わるので、この方法では比べない。
 */

// 最悪の内容を入れたテストページ（tests/pages/article-card/index.html）。カードを、幅の違う2つの置き場所に並べている。
// コンテナサイズクエリで切り替わる値は、画面の幅ではなく置き場所の幅で決まるので、
// #narrow は幅240px相当に固定し、#wide は最大400px相当にして、どの画面の幅でも同じ値を期待できるようにする
const PAGE = '/tests/pages/article-card/';
const WIDTHS = [320, 480, 768, 1024, 1280];

// plan の値の対応表から写す
const ROWS = [
  { selector: '#narrow .article-card ._layout', property: 'row-gap', value: 'calc(var(--spacing--xs) * 1px)' },
  { selector: '#wide .article-card ._layout', property: 'row-gap', value: 'calc(var(--spacing--sm) * 1px)' },
  { selector: '#narrow .article-card h3', property: 'font-size', value: 'calc(var(--text--subtitle--font-size) / 16 * 1rem)' },
  { selector: '#wide .article-card h3', property: 'font-size', value: 'calc(var(--text--title--font-size) / 16 * 1rem)' },
  { selector: '#wide .article-card time', property: 'color', value: 'var(--foreground--muted)' },
  { selector: '#narrow .article-card ._excerpt', property: 'display', value: 'none' },
];

for (const width of WIDTHS) {
  test(`article-card：${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(PAGE);

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, '横スクロールが出ていない').toBeLessThanOrEqual(0);

    for (const row of ROWS) {
      const result = await page.evaluate(({ selector, property, value }) => {
        const element = document.querySelector(selector);
        if (!element?.parentElement) return null;

        const probe = document.createElement('div');
        probe.style.setProperty(property, value);
        element.parentElement.append(probe);
        const actual = getComputedStyle(element).getPropertyValue(property);
        const expected = getComputedStyle(probe).getPropertyValue(property);
        probe.remove();

        return { actual, expected };
      }, row);

      expect(result, `${row.selector} がある`).not.toBeNull();
      expect.soft(result?.actual, `${row.selector} の ${row.property}`).toBe(result?.expected);
    }
  });
}
