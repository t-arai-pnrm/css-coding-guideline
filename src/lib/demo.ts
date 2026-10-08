import kisoCss from 'kiso.css/kiso.css?raw';
import colorTokens from '../demos/tokens/colors.css?raw';
import shadowTokens from '../demos/tokens/shadows.css?raw';
import sizeTokens from '../demos/tokens/sizes.css?raw';
import motionTokens from '../demos/tokens/motion.css?raw';
import typographyTokens from '../demos/tokens/typography.css?raw';
import zIndexTokens from '../demos/tokens/z-index.css?raw';

/**
 * デモの土台。
 * - `kiso`: 本書が推奨する環境（レイヤーの順序宣言、`tokens` レイヤーに入れた共通トークン、`reset` レイヤーに入れた kiso.css、ベーススタイル）
 * - `none`: ブラウザのデフォルトスタイルのまま
 */
export type DemoBase = 'kiso' | 'none';

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

export const buildSrcdoc = ({
  html,
  css,
  base = 'kiso',
  scheme = 'light',
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
  if (base === 'kiso') {
    head.push(
      `<style>${LAYER_ORDER}</style>`,
      `<style>@layer tokens {\n${TOKENS}\n}</style>`,
      `<style>@layer reset {\n${kisoCss}\n}</style>`,
      `<style>${DEMO_BASE}</style>`,
    );
  }
  head.push(`<style>\n${css}\n</style>`);
  const script = js ? `<script type="module">\n${js}\n</script>` : '';
  return `<!doctype html><html lang="ja"><head>${head.join('')}</head><body>\n${html}\n${script}</body></html>`;
};
