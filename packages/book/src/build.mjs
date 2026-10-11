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

const counters = new Map();
const stylesheets = new Set();
const assets = new Map();
const ctx = {
  pages: pagesById,
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

const sections = [];
for (const page of pages) {
  process.stdout.write(`${page.id}\n`);
  sections.push(await extractPage(page, ctx));
}
await capturer.close();

for (const [name, from] of assets) await copyFile(from, join(outDir, 'assets', name));
await copyFile(join(HERE, 'src/paper.css'), join(outDir, 'paper.css'));

// 目次：章の概要と節を、ページ番号付きで並べる
const toc = pages
  .map((page) => `<li class="${page.slug === 'index' ? 'toc-chapter' : 'toc-section'}"><a href="#page-${keyOf(page.id)}">${page.title}</a></li>`)
  .join('\n');

const version = JSON.parse(await readFile(join(HERE, '../../package.json'), 'utf8')).version;
const html = `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<title>CSSコーディングガイドライン 巻${volume.number} ${volume.title}</title>
<link rel="stylesheet" href="paper.css">
</head>
<body>
<section class="title-page">
<p class="book-title">CSSコーディングガイドライン</p>
<p class="volume-title">巻${volume.number}　${volume.title}</p>
<p class="book-version">試し組み（v${version}）</p>
</section>
<nav class="toc">
<h1>目次</h1>
<ol>
${toc}
</ol>
</nav>
${sections.join('\n')}
</body>
</html>
`;
await writeFile(join(outDir, 'book.html'), html);
process.stdout.write(`${join(outDir, 'book.html')}（${pages.length}ページ分）を作りました。\n`);
