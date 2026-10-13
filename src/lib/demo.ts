import kisoCss from 'kiso.css/kiso.css?raw';
import colorTokens from '../demos/tokens/colors.css?raw';
import shadowTokens from '../demos/tokens/shadows.css?raw';
import sizeTokens from '../demos/tokens/sizes.css?raw';
import motionTokens from '../demos/tokens/motion.css?raw';
import typographyTokens from '../demos/tokens/typography.css?raw';
import zIndexTokens from '../demos/tokens/z-index.css?raw';
import exerciseTokens from '../demos/exercise/site-tokens.css?raw';

/**
 * デモの土台。
 * - `kiso`: 本書が推奨する環境（レイヤーの順序宣言、`tokens` レイヤーに入れた共通トークン、`reset` レイヤーに入れた kiso.css、ベーススタイル）
 * - `exercise`: `kiso` の共通トークンの後に、第21章の演習のサイトのトークンを同じ `tokens` レイヤーで重ねる
 * - `none`: ブラウザのデフォルトスタイルのまま
 */
export type DemoBase = 'kiso' | 'exercise' | 'none';

/**
 * デモの配色。
 * - `auto`: 本のページのテーマ（ライトとダーク）に追従する
 * - `light` / `dark`: どちらかに固定する。特定の色を見せるデモに使う
 * - `light dark`: OS の設定に従う。`prefers-color-scheme` を説明するデモに使う
 */
export type DemoScheme = 'auto' | 'light' | 'dark' | 'light dark';

/**
 * `auto` のデモで、本のページの `data-theme`（Starlight が解決したライトかダーク）を iframe のルートの `color-scheme` に写す。
 * 描画より前に走らせるため、`<head>` の同期スクリプトにする。srcdoc の iframe は親と同じオリジンなので、親の DOM を読める。
 */
const THEME_SYNC = `(() => {
  let parentRoot = null;
  try {
    parentRoot = window.parent !== window ? window.parent.document.documentElement : null;
  } catch {}
  if (!parentRoot) return;
  const root = document.documentElement;
  const sync = () => {
    root.style.colorScheme = parentRoot.dataset.theme === 'dark' ? 'dark' : 'light';
  };
  sync();
  new MutationObserver(sync).observe(parentRoot, { attributes: true, attributeFilter: ['data-theme'] });
})();`;

const LAYER_ORDER =
  '@layer tokens, reset, base, vendors, compositions, pages, components, patterns, utilities;';

/** すべてのデモが使う共通トークン。`src/demos/tokens/` に分類ごとに置いている。 */
const TOKENS = [
  colorTokens,
  shadowTokens,
  sizeTokens,
  typographyTokens,
  motionTokens,
  zIndexTokens,
].join('\n');

/**
 * デモのベーススタイル。
 * 全称セレクタの `min-inline-size: 0` は、8-2 のベーススタイルと同じ指定で、本書の列を `1fr` のまま書く前提になる。
 * kiso.css は `body` に `min-block-size: 100dvb` を指定しているが、そのままだと
 * iframe の高さを中身に合わせられないため、デモでは解除する。
 * テーマに追従させるため、背景と文字の色は `body` にセマンティクスのトークンで指定する。
 */
const DEMO_BASE = `@layer base {
  *,
  ::before,
  ::after {
    min-inline-size: 0;
  }

  body {
    min-block-size: initial;
    padding: 24px;
    background-color: var(--background--base);
    color: var(--foreground--base);
  }
}`;

/**
 * 第21章の演習のサイトの欧文の書体（14-1）。見出しと英字の小見出しの飾りなので、読み込みを待たない `optional` にする。
 * `src` は、配布用の `base.css` から見た相対パスで書く。デモでは `buildSrcdoc` が、サイトの `/exercise-files/fonts/` に置き換える。
 */
const EXERCISE_FONT_FACE = `@font-face {
  font-family: "Inter";
  font-style: normal;
  font-weight: 100 900;
  font-display: optional;
  src: url("fonts/inter-latin-wght-normal.woff2") format("woff2");
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}`;

/**
 * 第21章の演習のサイトのベーススタイル。演習は1つのサイトを作るので、本書のベーススタイル（第8章、第14章）を通して当てる。
 * 解説のデモでは、話題と関係のない見た目の差を増やさないよう、`DEMO_BASE` だけにしている。
 */
const EXERCISE_BASE = `@layer base {
  :root {
    text-underline-offset: 25%;

    &:lang(ja) {
      font-kerning: none;
    }
  }

  :lang(en) {
    font-kerning: normal;
  }

  :is(:heading, h1, h2, h3, h4, h5, h6) {
    font-family: var(--font-family--latin);
  }

  :is(:heading, h1, h2, h3, h4, h5, h6, caption) {
    font-kerning: normal;

    &:lang(en) {
      text-wrap: balance;
    }

    &:lang(ja) {
      font-feature-settings: "palt";

      @supports (word-break: auto-phrase) {
        text-wrap: balance;
        word-break: auto-phrase;
      }
    }
  }

  :focus-visible {
    --_b--ring-width: 3px;
    --_b--ring-offset: 3px;

    box-shadow: 0 0 0 calc(var(--_b--ring-offset) + var(--_b--ring-width)) Canvas;
    outline: var(--_b--ring-width) solid CanvasText;
    outline-offset: var(--_b--ring-offset);
  }
}`;

export const buildSrcdoc = ({
  html,
  css,
  base = 'kiso',
  scheme = 'auto',
  js,
}: {
  html: string;
  css: string;
  base?: DemoBase;
  scheme?: DemoScheme;
  /** デモを動かすためのスクリプト。本文の主題ではないので、コードのタブには出さない。 */
  js?: string;
}) => {
  const head = [
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    `<meta name="color-scheme" content="${scheme === 'auto' ? 'light dark' : scheme}">`,
  ];
  if (scheme === 'auto') head.push(`<script>${THEME_SYNC}</script>`);
  if (base === 'kiso' || base === 'exercise') {
    const tokens = base === 'exercise' ? `${TOKENS}\n${exerciseTokens}` : TOKENS;
    head.push(
      `<style>${LAYER_ORDER}</style>`,
      `<style>@layer tokens {\n${tokens}\n}</style>`,
      `<style>@layer reset {\n${kisoCss}\n}</style>`,
      `<style>${DEMO_BASE}</style>`,
    );
    if (base === 'exercise') {
      const siteBase = (import.meta.env?.BASE_URL ?? '/').replace(/\/?$/, '/');
      const fontFace = EXERCISE_FONT_FACE.replace('url("fonts/', `url("${siteBase}exercise-files/fonts/`);
      head.push(`<style>${fontFace}</style>`, `<style>${EXERCISE_BASE}</style>`);
    }
  }
  head.push(`<style>\n${css}\n</style>`);
  const script = js ? `<script type="module">\n${js}\n</script>` : '';
  return `<!doctype html><html lang="ja"><head>${head.join('')}</head><body>\n${html}\n${script}</body></html>`;
};
