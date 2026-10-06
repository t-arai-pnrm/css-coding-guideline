import kisoCss from 'kiso.css/kiso.css?raw';

/**
 * デモの土台。
 * - `kiso`: 本書が推奨する環境（レイヤーの順序宣言、`reset` レイヤーに入れた kiso.css、ベーススタイルの全称セレクタの `min-inline-size: 0`）
 * - `none`: ブラウザのデフォルトスタイルのまま
 */
export type DemoBase = 'kiso' | 'none';

export type DemoScheme = 'light' | 'dark' | 'light dark';

const LAYER_ORDER =
  '@layer tokens, reset, base, vendors, compositions, pages, components, patterns, utilities;';

/**
 * デモのベーススタイル。
 * 全称セレクタの `min-inline-size: 0` は、8-2 のベーススタイルと同じ指定で、本書の列を `1fr` のまま書く前提になる。
 * kiso.css は `body` に `min-block-size: 100dvb` を指定しているが、そのままだと
 * iframe の高さを中身に合わせられないため、デモでは解除する。
 */
const DEMO_BASE = `@layer base {
  *,
  ::before,
  ::after {
    min-inline-size: 0;
  }

  body {
    min-block-size: initial;
    padding: 16px;
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
    `<meta name="color-scheme" content="${scheme}">`,
  ];
  if (base === 'kiso') {
    head.push(
      `<style>${LAYER_ORDER}</style>`,
      `<style>@layer reset {\n${kisoCss}\n}</style>`,
      `<style>${DEMO_BASE}</style>`,
    );
  }
  head.push(`<style>\n${css}\n</style>`);
  const script = js ? `<script type="module">\n${js}\n</script>` : '';
  return `<!doctype html><html lang="ja"><head>${head.join('')}</head><body>\n${html}\n${script}</body></html>`;
};
