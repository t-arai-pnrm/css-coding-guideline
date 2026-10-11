/**
 * 1つの巻の、組版用の HTML（out/vol<N>/book.html）を作る。
 * 先にサイトを `pnpm build` して、dist/ を最新にしておく。
 *
 * 使い方: node src/build.mjs [巻の番号（省略すると1）]
 */
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { extractPage, keyOf } from './extract.mjs';
import { createCapturer } from './capture.mjs';
import { allPages, DIST, volumePages } from './pages.mjs';
import { createIndexer, loadTerms, renderIndex } from './indexer.mjs';
import { BASE } from '../../../src/lib/site.mjs';

const HERE = new URL('../', import.meta.url).pathname;
const number = Number(process.argv[2] ?? 1);
const outDir = join(HERE, 'out', `vol${number}`);
await mkdir(join(outDir, 'img'), { recursive: true });
await mkdir(join(outDir, 'assets'), { recursive: true });

const { volume, pages: volumeAll } = await volumePages(number);
// 確認用に、環境変数 BOOK_PAGES（ページの ID をカンマで区切る）で組むページを絞れる。絞ったときは、外したページへの参照のページ番号が出ない
const only = process.env.BOOK_PAGES?.split(',').map((id) => id.trim()).filter(Boolean);
const pages = only?.length ? volumeAll.filter((page) => only.includes(page.id)) : volumeAll;
const pagesById = new Map((await allPages()).map((page) => [page.id, page]));
const selection = JSON.parse(await readFile(join(HERE, 'config/demo-selection.json'), 'utf8'));
const capturer = await createCapturer(join(outDir, 'img'));
const indexer = createIndexer(await loadTerms());

const counters = new Map();
const stylesheets = new Set();
const assets = new Map();
const ctx = {
  pages: pagesById,
  indexer,
  volumePageIds: new Set(volumeAll.map((page) => page.id)),
  selection,
  stylesheets,
  capture: capturer.capture,
  nextFigure: (chapter) => {
    const next = (counters.get(chapter) ?? 0) + 1;
    counters.set(chapter, next);
    return `${chapter}-${next}`;
  },
  copyAsset: (src) => {
    const name = basename(src);
    assets.set(name, join(DIST, src.slice(BASE.length)));
    return `assets/${name}`;
  },
};

// 章ごとに1つのファイルにする。1つの大きな HTML を組むと、Vivliostyle の組版が文書の大きさに対して急に遅くなるため
const files = new Map();
const fileOf = (page) => `${String(volume.dirs.indexOf(page.dir) + 1).padStart(2, '0')}-${page.dir}.html`;
const keyToFile = new Map([...volumeAll.map((page) => [keyOf(page.id), fileOf(page)]), ['index', '99-index.html']]);
for (const page of pages) {
  process.stdout.write(`${page.id}\n`);
  const file = fileOf(page);
  if (!files.has(file)) files.set(file, []);
  files.get(file).push(await extractPage(page, ctx));
}
await capturer.close();

for (const [name, from] of assets) await copyFile(from, join(outDir, 'assets', name));
await copyFile(join(HERE, 'src/paper.css'), join(outDir, 'paper.css'));

/** ほかのファイルにある要素への参照を、ファイル名付きの href にする */
const linkAcross = (html, file) =>
  html.replace(/href="#([^"]+)"/g, (match, id) => {
    const key = id.startsWith('page-') ? id.slice('page-'.length) : id.split('--')[0];
    const target = keyToFile.get(key);
    return target && target !== file ? `href="${target}#${id}"` : match;
  });

const version = JSON.parse(await readFile(join(HERE, '../../package.json'), 'utf8')).version;
const title = `CSSコーディングガイドライン 巻${volume.number} ${volume.title}`;
const documentOf = (body) => `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<title>${title}</title>
<link rel="stylesheet" href="paper.css">
</head>
<body>
${body}
</body>
</html>
`;

// 扉と目次：章の概要と節を、ページ番号付きで並べる
const toc = pages
  .map((page) => `<li class="${page.slug === 'index' ? 'toc-chapter' : 'toc-section'}"><a href="#page-${keyOf(page.id)}">${page.title}</a></li>`)
  .join('\n');
const front = `<section class="title-page">
<p class="book-title">CSSコーディングガイドライン</p>
<p class="volume-title">巻${volume.number}　${volume.title}</p>
<p class="book-version">試し組み（v${version}）</p>
</section>
<nav class="toc">
<h1>目次</h1>
<ol>
${toc}
<li class="toc-chapter"><a href="99-index.html#page-index">索引</a></li>
</ol>
</nav>`;
const entries = ['00-front.html', ...files.keys(), '99-index.html'];
await writeFile(join(outDir, '00-front.html'), documentOf(linkAcross(front, '00-front.html')));
for (const [file, sections] of files) await writeFile(join(outDir, file), documentOf(linkAcross(sections.join('\n'), file)));
await writeFile(join(outDir, '99-index.html'), documentOf(linkAcross(renderIndex(indexer.entries), '99-index.html')));

// Vivliostyle の設定。章のファイルを1つの本として組む
const config = { title, entryContext: outDir, entry: entries, size: '182mm,235mm', output: join(HERE, 'out', `vol${volume.number}.pdf`) };
await writeFile(join(outDir, 'vivliostyle.config.json'), `${JSON.stringify(config, null, 2)}\n`);
process.stdout.write(`${outDir} に、${pages.length}ページ分を${entries.length}個のファイルで作りました。\n`);
