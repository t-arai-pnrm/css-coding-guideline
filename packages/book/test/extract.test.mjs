import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { JSDOM } from 'jsdom';
import { extractPage } from '../src/extract.mjs';
import { printedVolumeOf } from '../config/volumes.mjs';

const render = async (body, options = {}) => {
  const dir = await mkdtemp(join(tmpdir(), 'book-extract-'));
  try {
    const html = join(dir, 'index.html');
    await writeFile(html, `<div class="sl-markdown-content">${body}</div>`);
    const page = { id: 'layout', dir: 'layout', slug: 'index', label: '第7章', title: '第7章 レイアウト', chapter: 7, demos: [], html, ...options.page };
    const context = {
      pages: new Map(), volumePageIds: new Set(['layout']), volumeNumber: 1,
      stylesheets: new Set(), selection: {}, indexer: { mark() {} },
      nextFigure: (() => { let i = 0; return () => `7-${++i}`; })(),
      nextCode: (() => { let i = 0; return () => `7-${++i}`; })(),
      nextTable: (() => { let i = 0; return () => `7-${++i}`; })(),
      ...options.context,
    };
    return new JSDOM(await extractPage(page, context)).window.document;
  } finally { await rm(dir, { recursive: true, force: true }); }
};

test('紙に採録しない付録へ巻番号や架空のページ番号を付けない', async () => {
  assert.equal(printedVolumeOf({ dir: 'appendix', slug: 'demo-tokens' }), null);
  assert.equal(printedVolumeOf({ dir: 'appendix', slug: 'glossary' }), 3);
  const pages = new Map([
    ['appendix/demo-tokens', { id: 'appendix/demo-tokens', volume: null }],
    ['layout/sizing', { id: 'layout/sizing', volume: 1 }],
    ['components', { id: 'components', volume: 2 }],
  ]);
  const doc = await render('<p><a href="/recss-guideline/appendix/demo-tokens/">付録I</a></p><p><a href="/recss-guideline/layout/sizing/">7-4</a></p><p><a href="/recss-guideline/components/">第10章</a></p>', { context: { pages } });
  assert.match(doc.body.textContent, /付録I（補足サイト）/);
  assert.match(doc.body.textContent, /7-4（この試し組みでは省略）/);
  assert.match(doc.body.textContent, /第10章（巻2）/);
  assert.equal(doc.querySelectorAll('a.xref').length, 0);
});

test('規約の性質と適用条件を保ち、解答を本文の後へ移す', async () => {
  const doc = await render('<ul class="guideline"><li class="_rule"><p class="_statement">規約の要点</p><dl class="_meta"><div class="_row"><dt>ID</dt><dd><code>sample-rule</code></dd></div><div class="_row"><dt>性質</dt><dd>本書の規約</dd></div><div class="_row"><dt>補足</dt><dd>複数の子が変わる場合</dd></div><div class="_row"><dt>理由</dt><dd>本文で説明</dd></div></dl></li></ul><p>問題</p><details><summary>答えと解説</summary><p>解答の内容</p></details><h2>次の章へ</h2><p>本文の続き</p>');
  assert.equal(doc.querySelector('._id').textContent, 'sample-rule');
  assert.match(doc.querySelector('._meta').textContent, /本書の規約.*複数の子が変わる場合/);
  assert.doesNotMatch(doc.querySelector('._meta').textContent, /本文で説明/);
  assert.equal(doc.querySelector('.answers').lastElementChild.id, 'layout--answer-1');
  assert.equal(doc.querySelector('.answer-pointer a').getAttribute('href'), '#layout--answer-1');
  assert.equal(doc.querySelector('section').lastElementChild.className, 'answers');
});

test('前提案内は本文に残し、参考資料URLは末尾でなくても印刷する', async () => {
  const pages = new Map([['layout/sizing', { id: 'layout/sizing', volume: 1 }]]);
  const doc = await render('<p>先に幅の前提を確かめます。「<a href="/recss-guideline/layout/sizing/">7-4</a>」で説明しています。</p><h2>参考リンク</h2><ul><li><a href="https://example.com">資料</a></li></ul><p>章末の案内</p>', { context: { pages, volumePageIds: new Set(['layout', 'layout/sizing']) } });
  assert.match(doc.querySelector('section > p').textContent, /先に幅の前提.*7-4.*説明しています/);
  assert.equal(doc.querySelectorAll('.notes').length, 0);
  assert.equal(doc.querySelector('ul').className, 'reference-list');
});

test('概念図と静止デモを掲載順に番号付けし、配布番号を保つ', async () => {
  const body = '<figure class="figure"><svg><title>概念図</title></svg></figure><figure class="css-demo"><span class="_caption">動作</span><iframe srcdoc="test"></iframe></figure>';
  const doc = await render(body, { page: { id: 'layout/sizing', label: '7-4', demos: [{ name: 'demo', mentioned: [] }] }, context: { selection: { demo: { print: true, widths: [320] } }, capture: async () => ({ file: 'test.png', cropped: false }) } });
  const captions = [...doc.querySelectorAll('figcaption')].map((item) => item.textContent);
  assert.deepEqual(captions, ['図7-1　概念図', '図7-2　動作（デモ7-4-1）']);
});

test('節の冒頭に、読み方の区別と前提の1行を出す', async () => {
  const doc = await render('<p>本文</p>', { page: { id: 'values/advanced-math-functions', dir: 'values', slug: 'advanced-math-functions', label: '6-4', title: '6-4 計算関数を応用する', reading: 'applied', readingNote: '前提の1文です。' } });
  const line = doc.querySelector('section > h1 + .page-reading');
  assert.equal(line.querySelector('._label').textContent, '応用');
  assert.match(line.textContent, /要件が出たときに、通して読む節です。前提の1文です。/);
  const index = await render('<p>本文</p>');
  assert.equal(index.querySelectorAll('.page-reading').length, 0);
});

test('コード例のキャプションに、区別と全体のデモ番号を添える', async () => {
  const code = (title, attributes) =>
    `<div class="expressive-code"><figure class="frame" ${attributes}><figcaption class="header"><span class="title">${title}</span></figcaption><pre><code><div class="ec-line"><div class="code">a {}</div></div></code></pre></figure></div>`;
  const doc = await render(
    code('🙆‍♂ Recommended: 閾値を1か所に集める', 'data-code-use="excerpt" data-code-from="values/fluid-heading"') +
      code('🙅‍♂ Not Recommended: 物理プロパティで書く', 'data-code-issue="convention"') +
      code('🙆‍♂ Recommended: 帯の分だけずらす', 'data-code-use="diff" data-code-from="exercise-files/sticky-header/finished/site-header.css"'),
    { page: { id: 'values/math-functions', dir: 'values', slug: 'math-functions', label: '6-3', title: '6-3 計算関数', demos: [{ name: 'values/other', mentioned: [] }, { name: 'values/fluid-heading', mentioned: [] }] } },
  );
  const captions = [...doc.querySelectorAll('figure.code figcaption')].map((caption) => caption.textContent);
  assert.match(captions[0], /推奨例・抜粋：閾値を1か所に集める（全体はデモ6-3-2）/);
  assert.match(captions[1], /避ける例（規約との差）：物理プロパティで書く/);
  assert.match(captions[2], /推奨例・差分：帯の分だけずらす（全体は配布ファイル site-header.css）/);
});
