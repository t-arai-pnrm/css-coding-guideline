/**
 * 第20章の演習を手元で進めるためのファイルを、演習のデモから生成する。
 * 出力先は `public/exercise-files/` で、サイトの `/exercise-files/` から読める。
 *
 * - `base.css`：レイヤーの順序宣言、共通トークン（tokens レイヤー）、kiso.css（reset レイヤー）、デモのベーススタイル
 * - `card-start/`：20-2の開始版。カードの HTML と、置く側のスタイルだけの `style.css`
 * - `<節のスラッグ>/`：各節を終えた時点の完成版。節 N の開始版は、節 N−1 の完成版
 *
 * 土台のスタイルは `src/lib/demo.ts` のデモと同じものを使う。演習のデモを変えたら、このスクリプトを実行し直す。
 */
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public/exercise-files');
const read = (path) => readFileSync(join(root, path), 'utf8');

/** 演習の節（スラッグ）。並びは節の順番。 */
const SECTIONS = [
  { slug: 'card', title: '20-2 カードを作る' },
  { slug: 'list', title: '20-3 一覧に並べる' },
  { slug: 'sidebar', title: '20-4 サイドバーにも置く' },
  { slug: 'content-changes', title: '20-5 内容の変化に耐える' },
  { slug: 'clickable-card', title: '20-6 カード全体を押せるようにする' },
  { slug: 'featured', title: '20-7 特集の見た目を足す' },
];

/** `src/lib/demo.ts` から、テンプレートリテラルや文字列の定数を取り出す。 */
const demoTs = read('src/lib/demo.ts');
const pickConstant = (name) => {
  const match = demoTs.match(new RegExp(`const ${name} =\\s*(['\`])([\\s\\S]*?)\\1;`));
  if (!match) throw new Error(`src/lib/demo.ts に ${name} が見つかりません`);
  return match[2];
};
const layerOrder = pickConstant('LAYER_ORDER');
const demoBase = pickConstant('DEMO_BASE');

const tokenFiles = ['colors', 'shadows', 'sizes', 'typography', 'motion', 'z-index'];
const tokens = tokenFiles.map((name) => read(`src/demos/tokens/${name}.css`)).join('\n');

const require = createRequire(import.meta.url);
const kiso = readFileSync(require.resolve('kiso.css/kiso.css'), 'utf8');

const baseCss = `/* 演習の土台。本書のデモと同じレイヤー、共通トークン、リセットCSS（kiso.css）、ベーススタイル。このファイルは変えない。 */
${layerOrder}

@layer tokens {
${tokens}
}

@layer reset {
${kiso}
}

${demoBase}
`;

const page = ({ title, html }) => `<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light">
  <title>${title}</title>
  <link rel="stylesheet" href="../base.css">
  <link rel="stylesheet" href="style.css">
</head>
<body>
${html.trimEnd()}
</body>
</html>
`;

const write = (dir, files) => {
  mkdirSync(join(outDir, dir), { recursive: true });
  for (const [name, content] of Object.entries(files)) {
    writeFileSync(join(outDir, dir, name), content);
  }
};

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'base.css'), baseCss);

for (const { slug, title } of SECTIONS) {
  const html = read(`src/demos/exercise/${slug}/index.html`);
  const css = read(`src/demos/exercise/${slug}/style.css`);
  write(slug, { 'index.html': page({ title: `${title}（完成版）`, html }), 'style.css': css });
}

// 20-2の開始版は、カードのコンポーネントを書く前の状態。置く側のスタイルまでを残す。
const cardCss = read('src/demos/exercise/card/style.css');
const componentsStart = cardCss.indexOf('@layer components');
if (componentsStart === -1) throw new Error('card/style.css に @layer components が見つかりません');
const startCss = `${cardCss.slice(0, componentsStart).trimEnd()}

@layer components {
  /* ここに記事カード（.scoped.article-card）のスタイルを書く */
}
`;
write('card-start', {
  'index.html': page({
    title: '20-2 カードを作る（開始版）',
    html: read('src/demos/exercise/card/index.html'),
  }),
  'style.css': startCss,
});

console.log(`public/exercise-files/ に ${SECTIONS.length + 1} 個の版と base.css を書き出しました。`);
