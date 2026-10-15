/**
 * dist/ の1ページの HTML から本文を取り出し、紙に合わせて書き換える。
 * - サイトの UI（見出しのアンカー、コピーのボタン、スクリプト）を外す
 * - 要素の id に、ページの ID を前置きして、巻の中で重ならないようにする
 * - 内部リンクを、同じ巻なら「（p.N）」、別の巻なら「（巻N）」が付く参照にする
 * - 参照だけの文と括弧の参照を「※N」の注にして、節末の「参照」に集める（notes.mjs）
 * - デモを、静止図（図N-M）か、補足サイトのデモ番号に置き換える
 * - ガイドラインの要点、性質、適用条件、IDを残す
 */
import { readFile } from 'node:fs/promises';
import { JSDOM, VirtualConsole } from 'jsdom';
import { BASE, SITE, pageUrl } from '../../../src/lib/site.mjs';
import { moveReferencesToNotes } from './notes.mjs';

const SITE_BASE = `${BASE}/`;

/** ページの ID（components/style-queries）を、id 属性に使える形にする */
export const keyOf = (pageId) => pageId.replaceAll('/', '_');

/** /recss-guideline/components/style-queries/#x を { page: 'components/style-queries', hash: 'x' } にする */
const parseHref = (href) => {
  if (!href.startsWith(SITE_BASE)) return null;
  const [path, hash = ''] = href.slice(SITE_BASE.length).split('#');
  return { page: path.replace(/\/$/, ''), hash: decodeURIComponent(hash) };
};

/** 章ごとの図の番号のキー。はじめには「序」、付録は記号 */
const figureKey = (page) => page.chapter ?? (page.label?.startsWith('付録') ? page.label.slice(2) : '序');

/**
 * デモの撮影の幅。指定がなければ、デモの幅のボタンから狭い幅と広い幅を選ぶ。
 * 本文が触れている幅を優先し、触れていなければ、広い幅は768px（紙で文字が読める大きさに収まる幅）にする。
 */
const widthsOf = (figure, setting, mentioned) => {
  if (setting?.widths) return setting.widths;
  const presets = [...figure.querySelectorAll('._preset[data-width]')]
    .map((button) => Number(button.dataset.width))
    .filter(Number.isFinite);
  // 幅のボタンがないデモ（widths={[]}）は、本文の幅に近い720pxで1枚だけ撮る
  if (presets.length === 0) return [720];
  const cited = presets.filter((width) => mentioned.includes(width));
  const usable = presets.filter((width) => width >= 320);
  const narrowCited = cited.filter((width) => width < 600);
  const wideCited = cited.filter((width) => width >= 600);
  const narrow = narrowCited.length ? Math.min(...narrowCited) : Math.min(...(usable.length ? usable : presets));
  const wide = wideCited.length ? Math.min(...wideCited) : presets.includes(768) ? 768 : Math.max(...presets);
  return narrow === wide ? [wide] : [narrow, wide];
};

/**
 * 要素の中のリンクを、紙の参照にする。ページ内の参照は id の前置きに合わせ、
 * 同じ巻のページは「（p.N）」になる参照に、別の巻と採録しないページは「（巻N）」「（補足サイト）」を添える。
 * 扉の後に置く前付けでも使う。
 */
export const rewriteLinks = (doc, content, key, ctx) => {
  for (const anchor of content.querySelectorAll('a[href]')) {
    const href = anchor.getAttribute('href');
    if (href.startsWith('#')) {
      anchor.setAttribute('href', `#${key}--${decodeURIComponent(href.slice(1))}`);
      continue;
    }
    const target = parseHref(href);
    if (!target) continue;
    const targetPage = ctx.pages.get(target.page);
    if (!targetPage) {
      anchor.setAttribute('href', `${SITE}${href}`);
      continue;
    }
    if (/^(こちら|ここ|詳細|このページ|リンク)$/.test(anchor.textContent.trim())) anchor.textContent = targetPage.title;
    const inVolume = ctx.volumePageIds.has(targetPage.id);
    const isRule = target.hash.startsWith('rule-');
    if (inVolume) {
      const hash = target.hash ? `${keyOf(targetPage.id)}--${target.hash}` : `page-${keyOf(targetPage.id)}`;
      anchor.setAttribute('href', `#${hash}`);
      anchor.classList.add(isRule ? 'xref-rule' : 'xref');
      if (isRule) anchor.dataset.label = targetPage.label ?? '';
    } else {
      // 採録しない付録や試し組みで省略したページにページ番号を付けない。
      const where = targetPage.volume === ctx.volumeNumber ? 'この試し組みでは省略' : targetPage.volume ? `巻${targetPage.volume}` : '補足サイト';
      if (targetPage.volume && targetPage.volume !== ctx.volumeNumber) anchor.removeAttribute('href');
      else anchor.setAttribute('href', pageUrl(targetPage.id) + (target.hash ? `#${target.hash}` : ''));
      anchor.classList.add('xref-out');
      const suffix = isRule ? `（${targetPage.label ?? ''}、${where}）` : `（${where}）`;
      anchor.after(doc.createTextNode(suffix));
    }
  }
};

export const extractPage = async (page, ctx) => {
  // サイトの CSS のネストを jsdom が解釈できずに出す警告は、組版に関係しないので捨てる
  const dom = new JSDOM(await readFile(page.html, 'utf8'), { virtualConsole: new VirtualConsole() });
  const doc = dom.window.document;
  const content = doc.querySelector('.sl-markdown-content');
  if (!content) throw new Error(`${page.id}: 本文がありません。先に pnpm build を実行してください。`);
  const key = keyOf(page.id);

  // サイトの UI を外す
  for (const element of content.querySelectorAll('script, style, .sl-anchor-link, .copy')) element.remove();
  for (const link of content.querySelectorAll('link[rel="stylesheet"]')) {
    ctx.stylesheets.add(link.getAttribute('href'));
    link.remove();
  }
  for (const wrapper of content.querySelectorAll('.sl-heading-wrapper')) wrapper.replaceWith(...wrapper.childNodes);

  // コード：Expressive Code の枠を、タイトルと pre だけの単純な形に組み直す（Vivliostyle は、その CSS の折り返しを再現しないため）
  for (const block of content.querySelectorAll('.expressive-code')) {
    const title = block.querySelector('figcaption .title')?.textContent.trim() ?? '';
    const lines = [...block.querySelectorAll('.ec-line .code')].map((line) => line.innerHTML.replace(/\n$/, ''));
    const selection = ctx.codeSelection?.[page.id]?.[title];
    if (selection?.ranges?.some(([start, end]) => start < 1 || end < start || end > lines.length)) {
      throw new Error(`${page.id}: ${title}の抜粋範囲を見直してください。`);
    }
    const selected = selection?.ranges
      ? selection.ranges.flatMap(([start, end], index) => [
          ...(index ? ['…（中略）'] : []),
          ...lines.slice(start - 1, end),
        ])
      : lines;
    const figure = doc.createElement('figure');
    figure.className = 'code';
    const caption = doc.createElement('figcaption');
    const label = title.replace(/🙆‍♂\s*Recommended:\s*/u, '推奨例：').replace(/🙅‍♂\s*Not Recommended:\s*/u, '避ける例：');
    caption.textContent = `${label}${selection ? '（抜粋。全体は配布ファイル）' : ''}`;
    const pre = doc.createElement('pre');
    const code = doc.createElement('code');
    code.innerHTML = selected.join('\n');
    pre.append(code);
    figure.append(caption, pre);
    if (selection?.summary) {
      const note = doc.createElement('p');
      note.className = 'code-note';
      note.textContent = selection.summary;
      figure.append(note);
    }
    block.replaceWith(figure);
  }
  for (const details of content.querySelectorAll('details')) details.setAttribute('open', '');

  // デモ：静止図か、補足サイトのデモ番号に置き換える
  const demos = [...content.querySelectorAll('figure.css-demo')];
  if (demos.length !== page.demos.length) {
    process.stderr.write(`注意: ${page.id} のデモの数が、原稿（${page.demos.length}）と dist/（${demos.length}）で違います。\n`);
  }
  for (const [index, figure] of demos.entries()) {
    const call = page.demos[index] ?? { name: null, mentioned: [] };
    const name = call.name;
    const setting = name ? ctx.selection[name] : null;
    const title = figure.querySelector('._caption')?.textContent.trim() ?? '';
    const demoId = `${page.label ?? page.id.replaceAll('/', '-')}-${index + 1}`;
    ctx.supplements?.push({ id: demoId, page: page.id, title, source: name, url: pageUrl(page.id) });
    const tabs = figure.nextElementSibling;
    if (tabs?.localName === 'starlight-tabs') tabs.remove();
    if (setting?.print) {
      const srcdoc = figure.querySelector('iframe')?.getAttribute('srcdoc') ?? '';
      const shots = [];
      for (const width of widthsOf(figure, setting, call.mentioned)) shots.push({ width, ...(await ctx.capture(srcdoc, width)) });
      const out = doc.createElement('figure');
      out.className = 'print-demo';
      // 幅の違う図を同じ縮尺で縦に積む。最も広い図を紙の幅いっぱいにする
      const widest = Math.max(...shots.map((shot) => shot.width));
      out.innerHTML = `<div class="shots">${shots
        .map((shot) => `<div class="shot" style="inline-size: ${((shot.width / widest) * 100).toFixed(2)}%"><img src="img/${shot.file}" alt=""><p class="shot-label">幅 ${shot.width}px${shot.cropped ? '（上の部分）' : ''}</p></div>`)
        .join('')}</div>`;
      const caption = doc.createElement('figcaption');
      caption.textContent = title;
      caption.append(doc.createTextNode(`（デモ${demoId}）`));
      out.append(caption);
      figure.replaceWith(out);
    } else {
      const note = doc.createElement('p');
      note.className = 'demo-ref';
      const link = doc.createElement('a');
      link.href = pageUrl(page.id);
      link.textContent = `デモ${demoId}　${title}`;
      note.append(link, doc.createTextNode('（補足サイトのデモ一覧から参照）'));
      figure.replaceWith(note);
    }
  }

  // デモのコードタブを外した後で番号を振り、欠番や重複を避ける。
  for (const [index, figure] of [...content.querySelectorAll('figure.code')].entries()) {
    const caption = figure.querySelector('figcaption');
    caption.prepend(doc.createTextNode(`リスト${ctx.nextCode?.(figureKey(page)) ?? `${page.label}-${index + 1}`}　`));
    figure.id = `list-${index + 1}`;
  }
  for (const [index, table] of [...content.querySelectorAll('table')].entries()) {
    if (table.closest('.guideline, .baseline')) continue;
    let preceding = table.previousElementSibling;
    while (preceding && !/^h[23]$/.test(preceding.localName)) preceding = preceding.previousElementSibling;
    const caption = doc.createElement('caption');
    caption.textContent = `表${ctx.nextTable?.(figureKey(page)) ?? `${page.label}-${index + 1}`}　${preceding?.textContent ?? page.title}`;
    table.prepend(caption);
    table.id ||= `table-${index + 1}`;
  }

  // 静止デモと概念図を、本文に現れる順に番号付けする。
  for (const figure of content.querySelectorAll('figure.figure, figure.print-demo')) {
    let caption = figure.querySelector('figcaption');
    if (!caption) {
      caption = doc.createElement('figcaption');
      caption.textContent = figure.querySelector('svg > title')?.textContent.trim() ?? '';
      figure.append(caption);
    }
    const number = ctx.nextFigure(figureKey(page));
    caption.prepend(doc.createTextNode(`図${number}　`));
    figure.id ||= `figure-${number}`;
  }

  // 画像：dist/ から写し、相対パスにする
  for (const image of content.querySelectorAll('img[src^="/"]')) {
    const src = image.getAttribute('src');
    image.setAttribute('src', ctx.copyAsset(src));
  }

  // 規約の性質と適用条件は、要点を読むときにも必要なので残す。
  for (const rule of content.querySelectorAll('.guideline ._rule')) {
    const id = rule.querySelector('._meta code')?.textContent ?? '';
    for (const row of rule.querySelectorAll('._meta ._row')) {
      if (!['性質', '補足'].includes(row.querySelector('dt')?.textContent)) row.remove();
    }
    const tag = doc.createElement('p');
    tag.className = '_id';
    tag.innerHTML = `<code>${id}</code>`;
    rule.append(tag);
  }

  // 予想を問う問題の解答は、節の本文と離して後方に置く。
  if (page.dir === 'exercise' || page.slug === 'index') {
    const answers = [...content.querySelectorAll('details')].filter((item) => /答え|解説/.test(item.querySelector('summary')?.textContent ?? ''));
    if (answers.length) {
      const appendix = doc.createElement('aside');
      appendix.className = 'answers';
      const heading = doc.createElement('h2');
      heading.textContent = 'この節の解答';
      appendix.append(heading);
      for (const [index, answer] of answers.entries()) {
        answer.id = `answer-${index + 1}`;
        const pointer = doc.createElement('p');
        pointer.className = 'answer-pointer';
        const anchor = doc.createElement('a');
        anchor.href = `#answer-${index + 1}`;
        anchor.className = 'xref';
        anchor.textContent = `解答${index + 1}は、この節の解答欄を参照してください。`;
        pointer.append(anchor);
        answer.before(pointer);
        answer.querySelector('summary').textContent = `解答${index + 1}　答えと解説`;
        appendix.append(answer);
      }
      content.append(appendix);
    }
  }

  // id をページの中で一意にする
  for (const element of content.querySelectorAll('[id]')) element.id = `${key}--${element.id}`;

  rewriteLinks(doc, content, key, ctx);

  for (const heading of content.querySelectorAll('h2')) {
    if (heading.textContent !== '参考リンク') continue;
    let list = heading.nextElementSibling;
    while (list && !/^h[12]$/.test(list.localName)) {
      if (list.localName === 'ul') list.classList.add('reference-list');
      list = list.nextElementSibling;
    }
  }

  // 参照を ※N の注にして、節末の「参照」に集める（ガイドラインの前、なければ参考リンクの前、なければ末尾）
  const notes = moveReferencesToNotes(doc, content);
  if (notes.length) {
    const aside = doc.createElement('aside');
    aside.className = 'notes';
    const list = doc.createElement('ol');
    for (const note of notes) {
      const item = doc.createElement('li');
      const mark = doc.createElement('span');
      mark.className = 'note-mark';
      mark.textContent = note.mark.textContent;
      item.append(mark, ...note.nodes);
      list.append(item);
    }
    const title = doc.createElement('p');
    title.className = 'notes-title';
    title.textContent = '参照';
    aside.append(title, list);
    const before = content.querySelector(`[id="${key}--ガイドライン"], [id="${key}--参考リンク"]`);
    if (before) before.before(aside);
    else content.append(aside);
  }

  // 索引の語に印を入れる
  ctx.indexer.mark(doc, content, page, key);

  const kind = page.slug === 'index' ? (page.dir === 'introduction' ? 'page' : 'chapter-opener') : 'page';
  return `<section class="${kind}" id="page-${key}" data-title="${page.title}">
<h1>${page.title}</h1>
${content.innerHTML}
</section>`;
};
