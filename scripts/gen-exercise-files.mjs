/**
 * 第21章の演習を手元で進めるためのファイルを、演習のデモから生成する。
 * 出力先は `public/exercise-files/` で、サイトの `/exercise-files/` から読める。
 *
 * - `base.css`：レイヤーの順序宣言、共通トークンと演習のサイトのトークン（tokens レイヤー）、kiso.css（reset レイヤー）、デモと演習のベーススタイル、欧文の書体の `@font-face`
 * - `fonts/`：欧文の書体のファイルとライセンス（`src/demos/exercise/fonts/` を写す）
 * - `<節のスラッグ>/start/`：開始版。その節で作るファイルだけを空にし、ほかの部品は完成した状態にする
 * - `<節のスラッグ>/middle/`：中間版。最初の要件を終えた時点（デモの `<スラッグ>-1`）
 * - `<節のスラッグ>/finished/`：完成版。要件の変更を終えた時点（デモの `<スラッグ>-2`）
 * - `review/`：21-15でレビューするプルリクエストの版
 *
 * 本のデモは1つの `style.css` にまとめているが、配布版では本文のとおり、責任ごとにファイルを分ける。
 * `@scope (.scoped.<名前>)` のブロックを `<名前>.css` に、コンポジションのレイヤーを `compositions.css` に、
 * パターンのレイヤーを `patterns.css` に、ベーススタイルの追加（`@layer base`）を `site-base.css` に切り出し、
 * それぞれ元の `@layer` で包み直す。レイヤーの順序は `base.css` で宣言しているので、読み込む順番には左右されない。
 * `--<名前>--…` の `@keyframes` は、`<名前>.css` の先頭に、レイヤーの外のまま置く。
 *
 * 土台のスタイルは `src/lib/demo.ts` のデモと同じものを使う。演習のデモを変えたら、このスクリプトを実行し直す。
 */
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public/exercise-files');
const demoDir = 'src/demos/exercise';
const read = (path) => readFileSync(join(root, path), 'utf8');

/**
 * 演習の節。並びは節の順番。
 * `empty` は開始版で空にするファイル（その節で書くもの）、`startFrom` は開始版で前の節の状態に戻すファイル。
 */
const SECTIONS = [
  { slug: 'buttons', title: '21-2 ボタンとセクション見出しを作る', empty: ['action-control.css', 'patterns.css'] },
  { slug: 'card-grid', title: '21-3 カード一覧とサイドバーを作る', empty: ['article-cards.css'] },
  {
    slug: 'article-list',
    title: '21-4 記事リストを作る',
    empty: ['article-row.css', 'article-list.css', 'category-filter.css'],
  },
  { slug: 'footer', title: '21-5 フッターを作る', empty: ['site-footer.css'] },
  {
    slug: 'sticky-header',
    title: '21-6 固定ヘッダーを作る',
    empty: ['site-header.css', 'global-nav.css', 'site-base.css'],
  },
  {
    slug: 'drawer',
    title: '21-7 ドロワーメニューを作る',
    empty: ['site-drawer.css'],
    startFrom: { demo: 'sticky-header-1', files: ['site-header.css', 'global-nav.css', 'site-base.css'] },
  },
  { slug: 'hero', title: '21-8 ヒーローを作る', empty: ['hero.css'] },
  { slug: 'faq', title: '21-9 よくある質問を作る', empty: ['faq-accordion.css'] },
  { slug: 'pricing', title: '21-10 料金プランを作る', empty: ['pricing-plans.css'] },
  { slug: 'steps', title: '21-11 制作の流れを作る', empty: ['steps.css'] },
  { slug: 'contact-form', title: '21-12 お問い合わせフォームを作る', empty: ['contact-form.css'] },
  { slug: 'scroll-reveal', title: '21-13 スクロールに合わせて表示する', withoutReveal: true },
  { slug: 'assemble', title: '21-14 ページに組み上げる', empty: ['page-top.css'] },
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
const tokens = [
  ...tokenFiles.map((name) => read(`src/demos/tokens/${name}.css`)),
  read(`${demoDir}/site-tokens.css`),
].join('\n');
const require = createRequire(import.meta.url);
const kiso = readFileSync(require.resolve('kiso.css/kiso.css'), 'utf8');

const baseCss = `/**
 * 演習の土台。本書のデモと同じレイヤーの順序、共通トークン、演習のサイトのトークン、リセットCSS（kiso.css）、ベーススタイルを入れている。
 * すべての節の HTML が最初に読み込む。このファイルは変えない。
 */
${pickConstant('LAYER_ORDER')}

@layer tokens {
${tokens}
}

@layer reset {
${kiso}
}

${pickConstant('DEMO_BASE')}

${pickConstant('EXERCISE_FONT_FACE')}

${pickConstant('EXERCISE_BASE')}
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

/** レイヤーごとの出力先。pages と components は @scope ごとに分ける */
const LAYER_FILES = { tokens: 'tokens.css', base: 'site-base.css', compositions: 'compositions.css', patterns: 'patterns.css' };

/** 字下げを外した説明ブロック（`/** … *\/`）を、ファイルの先頭に置く形にする */
const dedentDocBlock = (comment) => comment.replace(/^ +\*/gm, ' *');

/**
 * `/** *\/` の形式はファイルの先頭の説明ブロックだけに使うので（ルール `doc-block-file-top-only`）、
 * 複数のコンポジションを入れる compositions.css では、各コンポジションの説明ブロックの `@prop` を先頭の説明ブロックに集め、
 * 本体には1行目だけを通常のコメントとして残す。
 */
const hoistCompositionDocs = (css) => {
  const sections = [];
  const body = css.replace(/^( *)\/\*\*\n\1 \* ([^\n]+?)。\n((?:\1 \*[^\n]*\n)*?)\1 \*\/\n/gm, (_, indent, title, rest) => {
    const props = rest
      .split('\n')
      .map((line) => line.replace(/^ *\* ?/, ''))
      .filter((line) => line.startsWith('@prop'));
    sections.push(` * ${title}\n${props.map((line) => ` * ${line}`).join('\n')}`);
    return `${indent}/* ${title} */\n`;
  });
  if (sections.length === 0) return css;
  return `/**\n * コンポジション。子の並べ方だけを受け持ち、間隔や幅は公開プロパティで受け取る。\n *\n${sections.join('\n *\n')}\n */\n${body}`;
};

/**
 * 元のデモに説明ブロックがないファイルの説明（ルール `file-header-doc-block`）。
 * ページのスタイル、パターン、ベーススタイルの追加は、デモでは1つの style.css の中にあり、ファイルの説明を持たないので、ここで補う。
 */
const FILE_DOCS = {
  'patterns.css': 'パターン。複数のコンポーネントで同じ見た目を繰り返す要素のスタイル。\nクラス1つで見た目が決まり、置かれた場所の余白や幅は持たない。',
  'site-base.css': 'ベーススタイルの追加。base.css のベーススタイルに、このサイトで要る指定（ルート要素のスクロールの指定や、サイト全体で使う @keyframes）を足す。\nセレクタは、クラスを付けない素のセレクタで書く。',
  'page-demo.css': 'この節のデモのページ。部品を並べ、部品の外側の余白と、中身の幅を決める。\n部品の内側には触れない。',
  'page-top.css': 'トップページ。帯の順番、背景、上下の余白、中身の幅を決める。\n部品の内側には触れない。',
  'page-column.css': 'コラムのページ。新着と人気の記事の一覧とサイドバーを並べ、その間隔と幅を決める。',
  'page-category.css': 'コラムのカテゴリーのページ。見出し、絞り込み、記事の一覧を縦に並べ、その間隔を決める。',
  'page-contact.css': 'お問い合わせのページ。見出しとフォームを並べ、フォームの幅を決める。',
  'page-pricing.css': '料金プランのページ。見出しと料金プランの一覧を並べ、その間隔と幅を決める。',
  'page-service.css': '事業内容のページ。見出しと制作の流れを並べ、その間隔と幅を決める。',
};
/** 説明ブロックを先頭に置く。続く内容がコメントなら、間を1行空ける */
const withHeader = (header, css) => `${header}\n${css.startsWith('/*') ? '\n' : ''}${css}`;
const docBlock = (text) => `/**\n${text.split('\n').map((line) => ` * ${line}`).join('\n')}\n */`;

/**
 * デモの CSS を、ファイル名ごとの CSS に分ける。
 * 戻り値は `Map<ファイル名, CSS>`。
 */
const splitDemoCss = (css, source) => {
  const files = new Map();
  const unlayered = new Map();
  const headers = new Map();
  const isReview = source.includes('/review/');
  // chunk は、元のファイルと同じく @layer の中の字下げ（2文字）を付けた CSS
  const add = (name, layer, chunk) => {
    const prev = files.get(name);
    const body = chunk.replace(/^\n+/, '').trimEnd();
    files.set(name, prev ? `${prev.slice(0, -2)}\n${body}\n}\n` : `@layer ${layer} {\n${body}\n}\n`);
  };
  let pendingTop = [];
  for (const item of splitTopLevel(css)) {
    if (item.type === 'comment') {
      pendingTop.push(item.text);
      continue;
    }
    // --<名前>--… の @keyframes は、その名前のファイルにレイヤーの外のまま置く
    const keyframes = item.type === 'block' && item.prelude.match(/^@keyframes\s+--([\w]+(?:-[a-z]+)*?)--/);
    if (keyframes) {
      const name = `${keyframes[1]}.css`;
      unlayered.set(name, `${unlayered.get(name) ?? ''}${[...pendingTop, item.text].join('\n')}\n\n`);
      pendingTop = [];
      continue;
    }
    pendingTop = [];
    const layer = item.type === 'block' && item.prelude.match(/^@layer\s+([\w-]+)$/)?.[1];
    if (!layer) throw new Error(`${source}: @layer の外に書かれた項目があります：${item.text.slice(0, 40)}`);
    if (LAYER_FILES[layer]) {
      add(LAYER_FILES[layer], layer, item.body);
      continue;
    }
    // pages と components は、@scope のブロックごとにファイルを分ける。直前のコメントは同じファイルに入れる
    let pending = [];
    for (const child of splitTopLevel(item.body)) {
      if (child.type === 'comment') {
        pending.push(child.text);
        continue;
      }
      // @scope の外に書いたルール（21-15のレビューの悪い例）は、セレクタの最初のクラスのファイルに入れる
      const name =
        child.prelude?.match(/^@scope\s*\(\.scoped\.([\w-]+)\)/)?.[1] ?? child.prelude?.match(/\.([\w-]+)/)?.[1];
      if (!name) throw new Error(`${source}: @layer ${layer} の中に、どのファイルに入れるか決められない項目があります`);
      // 説明ブロックは @layer の中に入れず、ファイルの先頭に置く（ルール `file-header-doc-block`）
      // 説明ブロックがなく、1行のコメントで説明しているときは、そのコメントを説明ブロックにする（21-15のレビューの版は除く）
      let docs = pending.filter((comment) => comment.startsWith('/**'));
      if (docs.length === 0 && !isReview && pending.length > 0 && !pending.at(-1).includes('\n')) docs = [pending.at(-1)];
      if (docs.length > 0 && !headers.has(`${name}.css`)) {
        const header = docs.map((comment) =>
          comment.startsWith('/**') ? dedentDocBlock(comment) : docBlock(comment.replace(/^\/\*\s*|\s*\*\/$/g, '').replace(/(?<!。)$/, '。')),
        );
        headers.set(`${name}.css`, header.join('\n'));
      }
      add(`${name}.css`, layer, `  ${[...pending.filter((comment) => !docs.includes(comment)), child.text].join('\n  ')}`);
      pending = [];
    }
  }
  for (const [name, css] of unlayered) files.set(name, `${css}${files.get(name) ?? ''}`.trimEnd() + '\n');
  for (const [name, header] of headers) files.set(name, withHeader(header, files.get(name)));
  if (files.has('compositions.css')) files.set('compositions.css', hoistCompositionDocs(files.get('compositions.css')));
  if (!isReview) {
    for (const [name, css] of files) {
      if (css.startsWith('/**')) continue;
      if (!FILE_DOCS[name]) throw new Error(`${source}: ${name} の先頭に置く説明がありません。デモに説明ブロックを書くか、FILE_DOCS に足してください`);
      files.set(name, withHeader(docBlock(FILE_DOCS[name]), css));
    }
  }
  return files;
};

/** その節で読者が書くファイルを、空の @layer にする */
const emptyFile = (name, css) => {
  const layer = css.match(/@layer\s+([\w-]+)\s*\{/)?.[1] ?? 'components';
  const scope = css.match(/@scope \(\.scoped\.([\w-]+)\)/)?.[1];
  const what = scope ? `${scope}（.scoped.${scope}）のスタイル` : { base: 'ベーススタイルの追加', patterns: 'パターンのスタイル' }[layer];
  return `@layer ${layer} {\n  /* ここに${what}を書く */\n}\n`;
};

/** 21-13の開始版：スクロールに合わせた表示の指定（@supports の中と、それを切り替える値）を外す */
const withoutReveal = (css) => {
  let out = css.replace(/\/\*[^*]*\*\/\n@keyframes --page-top--in-view \{[\s\S]*?\n\}\n\n?/, '');
  // @supports (animation-timeline: view()) … のブロックを、字下げごと取り除く
  const marker = /\n( *)(\/\*[^\n]*\*\/\n\1)?@supports \(animation-timeline: view\(\)\) and \(animation-range: entry\) \{/;
  for (let m = out.match(marker); m; m = out.match(marker)) {
    const start = m.index;
    let i = out.indexOf('{', start);
    let depth = 0;
    for (; i < out.length; i++) {
      if (out[i] === '{') depth++;
      else if (out[i] === '}' && --depth === 0) break;
    }
    out = out.slice(0, start) + out.slice(i + 1);
  }
  return (
    out
      .replace(/\n *--_in-view: --false;\n/g, '\n')
      .replace(/\n *--translate-from--y-value: 24px;\n/g, '\n')
      // 波かっこの内側の端に残った空行を詰め、中身のなくなったルールを直前のコメントごと消す
      .replace(/\{\n(?: *\n)+/g, '{\n')
      .replace(/\n(?: *\n)+( *\})/g, '\n$1')
      .replace(/\n(?: *\/\*[^\n]*\*\/\n)? *[^\n{}]+\{\n *\}\n/g, '\n')
      .replace(/\n\n\n+/g, '\n\n')
  );
};

/* ---------- HTML ---------- */

const LAYER_RANK = { tokens: 0, base: 1, compositions: 2, pages: 3, components: 4, patterns: 5, utilities: 6 };
const rankOf = (css) => LAYER_RANK[css.match(/@layer\s+([\w-]+)\s*\{/)?.[1] ?? 'pages'];
const isPageCss = (css) => /@layer\s+pages\s*\{/.test(css);

/** HTML が使う CSS だけを、レイヤーの順に読み込む。ページのスタイルは、HTML のルートが使うものだけにする。 */
const linksFor = (html, files) =>
  [...files]
    .filter(([name, css]) => !isPageCss(css) || html.includes(`scoped ${name.replace(/\.css$/, '')}`))
    .sort(([, a], [, b]) => rankOf(a) - rankOf(b))
    .map(([name]) => `  <link rel="stylesheet" href="${name}">`)
    .join('\n');

const page = ({ title, html, files, js }) => `<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light">
  <title>${title}</title>
  <link rel="stylesheet" href="${files.base ?? '../../base.css'}">
${linksFor(html, files.css)}
</head>
<body>
${html.trimEnd()}
${js ? '<script src="script.js"></script>\n' : ''}</body>
</html>
`;

/* ---------- 書き出し ---------- */

const write = (dir, { title, html, css, js, base }) => {
  mkdirSync(join(outDir, dir), { recursive: true });
  writeFileSync(join(outDir, dir, 'index.html'), page({ title, html, files: { css, base }, js }));
  for (const [name, text] of css) writeFileSync(join(outDir, dir, name), text);
  if (js) writeFileSync(join(outDir, dir, 'script.js'), js);
};

const demo = (name) => {
  const dir = `${demoDir}/${name}`;
  const cssPath = existsSync(join(root, dir, 'style.css')) ? `${dir}/style.css` : `${dir}/style.bad.css`;
  const jsPath = join(root, dir, 'script.js');
  return {
    html: read(`${dir}/index.html`),
    css: splitDemoCss(read(cssPath), cssPath),
    js: existsSync(jsPath) ? readFileSync(jsPath, 'utf8') : undefined,
  };
};

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'base.css'), baseCss);
cpSync(join(root, demoDir, 'fonts'), join(outDir, 'fonts'), { recursive: true });

for (const section of SECTIONS) {
  const { slug, title } = section;
  const middle = demo(`${slug}-1`);
  const finished = demo(`${slug}-2`);

  const start = { ...middle, css: new Map(middle.css) };
  for (const name of section.empty ?? []) start.css.set(name, emptyFile(name, middle.css.get(name) ?? ''));
  if (section.startFrom) {
    const from = demo(section.startFrom.demo);
    for (const name of section.startFrom.files) start.css.set(name, from.css.get(name));
  }
  if (section.withoutReveal) {
    for (const [name, css] of start.css) start.css.set(name, withoutReveal(css));
  }

  write(`${slug}/start`, { ...start, title: `${title}（開始版）` });
  write(`${slug}/middle`, { ...middle, title: `${title}（中間版）` });
  write(`${slug}/finished`, { ...finished, title: `${title}（完成版）` });
}

// 21-15でレビューするプルリクエスト。デモでは使うコンポジションだけを書いているが、配布版ではプロジェクトの全体を置く
const review = demo('review');
// コンポジションはプロジェクトで共有するファイルなので、21-3を終えた時点のもの（grid と cluster を含む）を使う
review.css.set('compositions.css', demo('card-grid-2').css.get('compositions.css'));
write('review', { ...review, title: '21-15 レビューするプルリクエスト', base: '../base.css' });

console.log(`public/exercise-files/ に ${SECTIONS.length} 節×3 の版と、レビューの版と base.css と fonts/ を書き出しました。`);
