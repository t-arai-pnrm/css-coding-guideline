/**
 * 第21章の演習を手元で進めるためのファイルを、演習のデモから生成する。
 * 出力先は `public/exercise-files/` で、サイトの `/exercise-files/` から読める。
 *
 * - `base.css`：レイヤーの順序宣言、共通トークン（tokens レイヤー）、kiso.css（reset レイヤー）、デモのベーススタイル
 * - `card-start/`：21-2の開始版。カードの HTML と、置く側のスタイルだけ
 * - `<節のスラッグ>/`：各節を終えた時点の完成版。節 N の開始版は、節 N−1 の完成版
 * - `review/`：21-8でレビューするプルリクエストの版
 *
 * 本のデモは1つの `style.css` にまとめているが、配布版では本文のとおり、責任ごとにファイルを分ける。
 * `@scope (.scoped.<名前>)` のブロックを `<名前>.css` に、コンポジションのレイヤーを `compositions.css` に切り出し、
 * それぞれ元の `@layer` で包み直す。レイヤーの順序は `base.css` で宣言しているので、読み込む順番には左右されない。
 *
 * 21-4以降は、トップページ（`index.html`）と記事ページ（`article.html`）の両方を置き、同じカードと一覧の CSS を読ませる。
 * トップページの HTML は、各デモのディレクトリの `top.html`（配布専用）から、`page-top` のスタイルは21-3のデモから取る。
 *
 * 土台のスタイルは `src/lib/demo.ts` のデモと同じものを使う。演習のデモを変えたら、このスクリプトを実行し直す。
 */
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public/exercise-files');
const demoDir = 'src/demos/exercise';
const read = (path) => readFileSync(join(root, path), 'utf8');

/** 演習の節（スラッグ）。並びは節の順番。 */
const SECTIONS = [
  { slug: 'card', title: '21-2 カードを作る' },
  { slug: 'list', title: '21-3 一覧に並べる' },
  { slug: 'sidebar', title: '21-4 サイドバーにも置く' },
  { slug: 'content-changes', title: '21-5 内容の変化に耐える' },
  { slug: 'clickable-card', title: '21-6 カード全体を押せるようにする' },
  { slug: 'featured', title: '21-7 特集の見た目を足す' },
];

/* ---------- 土台 ---------- */

/** `src/lib/demo.ts` から、テンプレートリテラルや文字列の定数を取り出す。 */
const demoTs = read('src/lib/demo.ts');
const pickConstant = (name) => {
  const match = demoTs.match(new RegExp(`const ${name} =\\s*(['\`])([\\s\\S]*?)\\1;`));
  if (!match) throw new Error(`src/lib/demo.ts に ${name} が見つかりません`);
  return match[2];
};

const tokenFiles = ['colors', 'shadows', 'sizes', 'typography', 'motion', 'z-index'];
const tokens = tokenFiles.map((name) => read(`src/demos/tokens/${name}.css`)).join('\n');
const require = createRequire(import.meta.url);
const kiso = readFileSync(require.resolve('kiso.css/kiso.css'), 'utf8');

const baseCss = `/* 演習の土台。本書のデモと同じレイヤー、共通トークン、リセットCSS（kiso.css）、ベーススタイル。このファイルは変えない。 */
${pickConstant('LAYER_ORDER')}

@layer tokens {
${tokens}
}

@layer reset {
${kiso}
}

${pickConstant('DEMO_BASE')}
`;

/* ---------- CSS の切り出し ---------- */

/**
 * CSS を、トップレベルの項目（コメントか、波かっこで閉じるブロック）に分ける。
 * コメントと文字列の中の波かっこは数えない。
 */
const splitTopLevel = (css) => {
  const items = [];
  let i = 0;
  while (i < css.length) {
    if (/\s/.test(css[i])) {
      i++;
      continue;
    }
    if (css.startsWith('/*', i)) {
      const end = css.indexOf('*/', i + 2) + 2;
      items.push({ type: 'comment', text: css.slice(i, end) });
      i = end;
      continue;
    }
    const start = i;
    let depth = 0;
    let quote = null;
    for (; i < css.length; i++) {
      const c = css[i];
      if (quote) {
        if (c === '\\') i++;
        else if (c === quote) quote = null;
      } else if (c === '"' || c === "'") quote = c;
      else if (css.startsWith('/*', i)) i = css.indexOf('*/', i + 2) + 1;
      else if (c === '{') depth++;
      else if (c === '}' && --depth === 0) {
        i++;
        break;
      } else if (c === ';' && depth === 0) {
        i++;
        break;
      }
    }
    const text = css.slice(start, i);
    const open = text.indexOf('{');
    items.push(
      open === -1
        ? { type: 'statement', text }
        : { type: 'block', prelude: text.slice(0, open).trim(), body: text.slice(open + 1, -1), text },
    );
  }
  return items;
};

/**
 * デモの `style.css` を、ファイル名ごとの CSS に分ける。
 * 戻り値は `Map<ファイル名, CSS>`。
 */
const splitDemoCss = (css, source) => {
  const files = new Map();
  // chunk は、元のファイルと同じく @layer の中の字下げ（2文字）を付けた CSS
  const add = (name, layer, chunk) => {
    const prev = files.get(name);
    const body = chunk.replace(/^\n+/, '').trimEnd();
    files.set(name, prev ? `${prev.slice(0, -2)}\n${body}\n}\n` : `@layer ${layer} {\n${body}\n}\n`);
  };
  for (const item of splitTopLevel(css)) {
    const layer = item.type === 'block' && item.prelude.match(/^@layer\s+([\w-]+)$/)?.[1];
    if (!layer) throw new Error(`${source}: @layer の外に書かれた項目があります：${item.text.slice(0, 40)}`);
    if (layer === 'compositions' || layer === 'tokens') {
      add(`${layer}.css`, layer, item.body);
      continue;
    }
    // pages と components は、@scope のブロックごとにファイルを分ける。直前のコメントは同じファイルに入れる
    let pending = [];
    for (const child of splitTopLevel(item.body)) {
      if (child.type === 'comment') {
        pending.push(child.text);
        continue;
      }
      // @scope の外に書いたルール（21-8のレビューの悪い例）は、セレクタの最初のクラスのファイルに入れる
      const name =
        child.prelude?.match(/^@scope\s*\(\.scoped\.([\w-]+)\)/)?.[1] ?? child.prelude?.match(/\.([\w-]+)/)?.[1];
      if (!name) throw new Error(`${source}: @layer ${layer} の中に、どのファイルに入れるか決められない項目があります`);
      add(`${name}.css`, layer, `  ${[...pending, child.text].join('\n  ')}`);
      pending = [];
    }
  }
  return files;
};

/* ---------- HTML ---------- */

const LAYER_RANK = { tokens: 0, compositions: 1, pages: 2, components: 3, patterns: 4, utilities: 5 };
const layerOf = (css) => css.match(/^@layer\s+([\w-]+)/)[1];

/** HTML が使う CSS だけを、レイヤーの順に読み込む。ページのスタイルは、HTML のルートが使うものだけにする。 */
const linksFor = (html, files) =>
  [...files]
    .filter(([name, css]) => layerOf(css) !== 'pages' || html.includes(`scoped ${name.replace(/\.css$/, '')}`))
    .sort(([, a], [, b]) => LAYER_RANK[layerOf(a)] - LAYER_RANK[layerOf(b)])
    .map(([name]) => `  <link rel="stylesheet" href="${name}">`)
    .join('\n');

const page = ({ title, html, files }) => `<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light">
  <title>${title}</title>
  <link rel="stylesheet" href="../base.css">
${linksFor(html, files)}
</head>
<body>
${html.trimEnd()}
</body>
</html>
`;

/* ---------- 書き出し ---------- */

const write = (dir, pages, files) => {
  mkdirSync(join(outDir, dir), { recursive: true });
  for (const [name, html] of Object.entries(pages)) writeFileSync(join(outDir, dir, name), html);
  for (const [name, css] of files) writeFileSync(join(outDir, dir, name), css);
};

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'base.css'), baseCss);

const listFiles = splitDemoCss(read(`${demoDir}/list/style.css`), 'list/style.css');
const pageTopCss = listFiles.get('page-top.css');

for (const { slug, title } of SECTIONS) {
  const files = splitDemoCss(read(`${demoDir}/${slug}/style.css`), `${slug}/style.css`);
  const html = read(`${demoDir}/${slug}/index.html`);
  const topPath = `${demoDir}/${slug}/top.html`;
  if (existsSync(join(root, topPath))) {
    // 記事ページの段階。トップページも同じカードと一覧の CSS で表示する
    files.set('page-top.css', pageTopCss);
    write(
      slug,
      {
        'index.html': page({ title: `${title}（完成版）トップページ`, html: read(topPath), files }),
        'article.html': page({ title: `${title}（完成版）記事ページ`, html, files }),
      },
      files,
    );
  } else {
    write(slug, { 'index.html': page({ title: `${title}（完成版）`, html, files }) }, files);
  }
}

// 21-2の開始版は、カードのスタイルを書く前の状態。置く側のスタイルと、空のカードのファイルを置く
const cardFiles = splitDemoCss(read(`${demoDir}/card/style.css`), 'card/style.css');
cardFiles.set('article-card.css', '@layer components {\n  /* ここに記事カード（.scoped.article-card）のスタイルを書く */\n}\n');
write(
  'card-start',
  { 'index.html': page({ title: '21-2 カードを作る（開始版）', html: read(`${demoDir}/card/index.html`), files: cardFiles }) },
  cardFiles,
);

// 21-8でレビューするプルリクエスト。デモでは使うコンポジションだけを書いているが、配布版ではプロジェクトの全体を置く
const reviewFiles = splitDemoCss(read(`${demoDir}/review/style.bad.css`), 'review/style.bad.css');
// コンポジションはプロジェクトで共有するファイルなので、21-7を終えた時点のもの（cluster を含む）を使う
reviewFiles.set('compositions.css', splitDemoCss(read(`${demoDir}/featured/style.css`), 'featured/style.css').get('compositions.css'));
write(
  'review',
  {
    'index.html': page({
      title: '21-8 レビューするプルリクエスト',
      html: read(`${demoDir}/review/index.html`),
      files: reviewFiles,
    }),
  },
  reviewFiles,
);

console.log(`public/exercise-files/ に ${SECTIONS.length + 2} 個の版と base.css を書き出しました。`);
