/**
 * 1つの巻の、組版用の HTML（out/vol<N>/book.html）を作る。
 * 先にサイトを `pnpm build` して、dist/ を最新にしておく。
 *
 * 使い方: node src/build.mjs [巻の番号（省略すると1）]
 */
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { JSDOM, VirtualConsole } from 'jsdom';
import { extractPage, keyOf, rewriteLinks } from './extract.mjs';
import { createCapturer } from './capture.mjs';
import { allPages, DIST, volumePages } from './pages.mjs';
import { VOLUMES } from '../config/volumes.mjs';
import { createIndexer, loadTerms, renderIndex } from './indexer.mjs';
import { READINGS } from '../../../src/lib/reading.mjs';
import { BASE, pageUrl } from '../../../src/lib/site.mjs';
import { BASELINE_CHECKED } from '../../../src/lib/book.mjs';

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
const codeSelection = JSON.parse(await readFile(join(HERE, 'config/code-selection.json'), 'utf8'));
const capturer = await createCapturer(join(outDir, 'img'));
const indexer = createIndexer(await loadTerms());

const counters = new Map();
const codeCounters = new Map();
const tableCounters = new Map();
const numbered = (map, chapter) => {
  const next = (map.get(chapter) ?? 0) + 1;
  map.set(chapter, next);
  return `${chapter}-${next}`;
};
const stylesheets = new Set();
const assets = new Map();
const ctx = {
  pages: pagesById,
  indexer,
  volumePageIds: new Set(pages.map((page) => page.id)),
  volumeNumber: number,
  selection,
  codeSelection,
  supplements: [],
  stylesheets,
  capture: capturer.capture,
  nextFigure: (chapter) => numbered(counters, chapter),
  nextCode: (chapter) => numbered(codeCounters, chapter),
  nextTable: (chapter) => numbered(tableCounters, chapter),
  copyAsset: (src) => {
    const name = basename(src);
    assets.set(name, join(DIST, src.slice(BASE.length)));
    return `assets/${name}`;
  },
};

// 章ごとに1つのファイルにする。1つの大きな HTML を組むと、Vivliostyle の組版が文書の大きさに対して急に遅くなるため
const files = new Map();
const fileOf = (page) => `${String(volume.dirs.indexOf(page.dir) + 1).padStart(2, '0')}-${page.dir}.html`;
const keyToFile = new Map([...pages.map((page) => [keyOf(page.id), fileOf(page)]), ['index', '99-index.html']]);
for (const page of pages) {
  process.stdout.write(`${page.id}\n`);
  const file = fileOf(page);
  if (!files.has(file)) files.set(file, []);
  files.get(file).push(await extractPage(page, ctx));
}
await capturer.close();

// 巻の設定の movePart：ページの見出しから後ろを切り出し、巻の末尾に別の節として置く。切り出した部分の id は、移した先のファイルで引く
const movedIds = new Map();
let movedToc = '';
if (volume.movePart && files.size) {
  const { page: movedPage, from, title: movedTitle } = volume.movePart;
  const source = pages.find((page) => page.id === movedPage);
  if (source) {
    const sections = files.get(fileOf(source));
    const index = sections.findIndex((html) => html.includes(`id="page-${keyOf(source.id)}"`));
    const html = sections[index];
    const start = html.indexOf(`<h2 id="${keyOf(source.id)}--${from}"`);
    if (start === -1) throw new Error(`${movedPage} に見出し「${from}」がありません。config/volumes.mjs の movePart を見直してください。`);
    const end = html.lastIndexOf('</section>');
    sections[index] = `${html.slice(0, start)}</section>`;
    const key = `${keyOf(source.id)}-part`;
    const lastFile = [...files.keys()].at(-1);
    files.get(lastFile).push(`<section class="page" id="page-${key}" data-title="${movedTitle}">
<h1>${movedTitle}</h1>
${html.slice(start, end)}</section>`);
    for (const [, id] of html.slice(start, end).matchAll(/\bid="([^"]+)"/g)) movedIds.set(id, lastFile);
    movedIds.set(`page-${key}`, lastFile);
    movedToc = `<li class="toc-chapter"><a href="#page-${key}">${movedTitle}</a></li>`;
  }
}

for (const [name, from] of assets) await copyFile(from, join(outDir, 'assets', name));
await copyFile(join(HERE, 'src/paper.css'), join(outDir, 'paper.css'));

/** ほかのファイルにある要素への参照を、ファイル名付きの href にする */
const linkAcross = (html, file) =>
  html.replace(/href="#([^"]+)"/g, (match, id) => {
    const key = id.startsWith('page-') ? id.slice('page-'.length) : id.split('--')[0];
    const target = movedIds.get(id) ?? keyToFile.get(key);
    return target && target !== file ? `href="${target}#${id}"` : match;
  });

const version = JSON.parse(await readFile(join(HERE, '../../package.json'), 'utf8')).version;
const sampleManifest = JSON.parse(await readFile(join(HERE, '../../public/sample-files', `v${version}`, 'manifest.json'), 'utf8'));
const title = `RECSSガイドライン 巻${volume.number} ${volume.title}`;
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

/** 前付けの HTML の中のリンクを、本文と同じ紙の参照にする */
const printLinks = (html, key) => {
  const dom = new JSDOM(`<body>${html}</body>`);
  const body = dom.window.document.body;
  rewriteLinks(dom.window.document, body, key, ctx);
  return body.innerHTML;
};

/** 巻の設定の短い文を HTML にする（`code` と [文字列](/パス/#見出し) だけを扱う） */
const inline = (text) =>
  text
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\((\/[^)]+)\)/g, (match, label, path) => `<a href="${BASE}${path}">${label}</a>`);

// 扉の後の「この巻について」：前提、到達目標、確かめる問い、次の巻（最後の巻は付録と補足サイト）
const preface = volume.preface
  ? printLinks(
      `<section class="volume-preface">
<h1>この巻について</h1>
${volume.preface.prerequisite ? `<h2>前提とすること</h2>
<p>${inline(volume.preface.prerequisite)}</p>` : ''}
${volume.preface.goal ? `<h2>この巻で身につくこと</h2>
<p>${inline(volume.preface.goal)}</p>` : ''}
<h2>身についたかを確かめる</h2>
<p>${inline(volume.preface.check)}</p>
<h2>${volume.number === VOLUMES.length ? '巻末の付録と補足サイト' : '次の巻へ'}</h2>
<p>${inline(volume.preface.next)}</p>
</section>`,
      'volume-preface',
    )
  : '';

// 巻2と巻3の前付けに、「最小の構成で始める」の命名の早見表を写す。巻1を開かずに、コード例の名前を見分けられるようにする
const cheatSheet = async () => {
  if (!volume.cheatSheet) return '';
  const html = join(DIST, 'introduction/quick-start/index.html');
  const doc = new JSDOM(await readFile(html, 'utf8'), { virtualConsole: new VirtualConsole() }).window.document;
  const heading = doc.querySelector('.sl-markdown-content h2[id="命名の早見表"]');
  if (!heading) throw new Error('最小の構成で始めるに「命名の早見表」がありません。先に pnpm build を実行してください。');
  const start = heading.closest('.sl-heading-wrapper') ?? heading;
  const parts = [];
  for (let node = start.nextElementSibling; node && !node.matches('h2, .sl-heading-wrapper.level-h2'); node = node.nextElementSibling) parts.push(node);
  for (const part of parts) for (const element of part.querySelectorAll('.sl-anchor-link')) element.remove();
  return printLinks(`<section class="naming-cheatsheet">
<h1>命名の早見表</h1>
${parts.map((part) => part.outerHTML).join('\n')}
</section>`, 'naming-cheatsheet');
};

// 扉と目次：章の概要と節を、ページ番号付きで並べる
// 節には、読み方の区別の印（基本・応用・参照）を添える
const readingMark = (page) => (READINGS[page.reading] ? `<span class="toc-reading" data-reading="${page.reading}">${READINGS[page.reading].label}</span>` : '');
const toc = pages
  .map((page) => `<li class="${page.slug === 'index' ? 'toc-chapter' : 'toc-section'}"><a href="#page-${keyOf(page.id)}">${readingMark(page)}${page.title}</a></li>`)
  .join('\n');
const front = `<section class="title-page">
<p class="book-title">RECSSガイドライン</p>
<p class="volume-title">巻${volume.number}　${volume.title}</p>
<p class="book-version">試し組み（v${version}）</p>
</section>
${preface}
${await cheatSheet()}
<section class="publication-info">
<h1>この試し組みの使い方</h1>
<p>本文とサンプルの版：v${version}。未確認の原稿を含む試し組みです。対応状況は${BASELINE_CHECKED}確認のデータで、全ブラウザの実機検証を表すものではありません。</p>
<p>目次と節の冒頭の「基本」は初めて読むときに読む節、「応用」は要件が出たときに通して読む節、「参照」は必要な見出しを引いて使う節です。基本の節だけを読めば、各巻の判断の問いと手を動かす課題まで進めます。</p>
<p>同じ巻への参照は節の名前とページ番号、別の巻は巻番号を示します。「補足サイト」とある付録は紙面には採録していません。デモ番号は、補足サイトの一覧と同じ番号です。</p>
<h2>サンプルと補足</h2>
<p class="support-url"><a href="${pageUrl('book-support')}">${pageUrl('book-support')}</a></p>
<p>v${version}のZIPを選び、README.mdの手順に従ってください。デモはHTMLにCSSと必要なJavaScriptを含めています。第21章には開始版、中間版、完成版、第20章には設定の全文があります。</p>
<img class="support-qr" src="assets/book-support-qr.svg" alt="補足サイトのURLを表すQRコード">
<h2>環境とライセンス</h2>
<p>実務配信の例：Node.js 22.12以降、Vite ${sampleManifest.dependencies.vite}。リセット：kiso.css ${sampleManifest.dependencies.kiso}。対応データ：web-features ${sampleManifest.dependencies.webFeatures}。ファイルのSHA-256と依存関係はmanifest.jsonに記録しています。</p>
<p>文章：CC BY 4.0。コード：MIT-0。著者：TAK。刊行版の正誤表、発行日、奥付は正式刊行時に確定します。</p>
</section>
<nav class="toc">
<h1>目次</h1>
<ol>
${toc}
${movedToc}
<li class="toc-chapter"><a href="99-index.html#page-index">索引</a></li>
</ol>
</nav>`;
const entries = ['00-front.html', ...files.keys(), '99-index.html'];
await writeFile(join(outDir, '00-front.html'), documentOf(linkAcross(front, '00-front.html')));
for (const [file, sections] of files) await writeFile(join(outDir, file), documentOf(linkAcross(sections.join('\n'), file)));
await writeFile(join(outDir, '99-index.html'), documentOf(linkAcross(renderIndex(indexer.entries), '99-index.html')));

// Vivliostyle の設定。章のファイルを1つの本として組む
const config = { title, entryContext: outDir, entry: entries, size: '182mm,235mm', output: join(HERE, 'out', `vol${volume.number}.pdf`) };
await copyFile(join(HERE, '../../public/book-support/qr.svg'), join(outDir, 'assets/book-support-qr.svg'));
await writeFile(join(outDir, 'supplements.json'), `${JSON.stringify({ version, demos: ctx.supplements }, null, 2)}\n`);
await writeFile(join(outDir, 'vivliostyle.config.json'), `${JSON.stringify(config, null, 2)}\n`);
process.stdout.write(`${outDir} に、${pages.length}ページ分を${entries.length}個のファイルで作りました。\n`);
