/**
 * dist/ の1ページの HTML から本文を取り出し、紙に合わせて書き換える。
 * - サイトの UI（見出しのアンカー、コピーのボタン、スクリプト）を外す
 * - 要素の id に、ページの ID を前置きして、巻の中で重ならないようにする
 * - 内部リンクを、同じ巻なら「（p.N）」、別の巻なら「（巻N）」が付く参照にし、節末に関連する節を集める
 * - デモを、静止図（図N-M）か、補足サイトのデモ番号に置き換える
 * - ガイドラインのルールを、要点（強度と本文）と ID だけにする
 */
import { readFile } from 'node:fs/promises';
import { JSDOM, VirtualConsole } from 'jsdom';
import { BASE } from '../../../src/lib/site.mjs';

const SITE_BASE = `${BASE}/`;

/** ページの ID（components/style-queries）を、id 属性に使える形にする */
export const keyOf = (pageId) => pageId.replaceAll('/', '_');

/** /css-coding-guideline/components/style-queries/#x を { page: 'components/style-queries', hash: 'x' } にする */
const parseHref = (href) => {
  if (!href.startsWith(SITE_BASE)) return null;
  const [path, hash = ''] = href.slice(SITE_BASE.length).split('#');
  return { page: path.replace(/\/$/, ''), hash: decodeURIComponent(hash) };
};

/** 章ごとの図の番号のキー。はじめには「序」、付録は記号 */
const figureKey = (page) => page.chapter ?? (page.label?.startsWith('付録') ? page.label.slice(2) : '序');

/** デモの撮影の幅。指定がなければ、デモの幅のボタンから、狭い幅と広い幅を選ぶ */
const widthsOf = (figure, setting) => {
  if (setting?.widths) return setting.widths;
  const presets = [...figure.querySelectorAll('._preset[data-width]')]
    .map((button) => Number(button.dataset.width))
    .filter(Number.isFinite);
  // 幅のボタンがないデモ（widths={[]}）は、本文の幅に近い720pxで1枚だけ撮る
  if (presets.length === 0) return [720];
  const usable = presets.filter((width) => width >= 320);
  const narrow = Math.min(...(usable.length ? usable : presets));
  const wide = presets.includes(1024) ? 1024 : Math.max(...presets);
  return narrow === wide ? [wide] : [narrow, wide];
};

export const extractPage = async (page, ctx) => {
  // サイトの CSS のネストを jsdom が解釈できずに出す警告は、組版に関係しないので捨てる
  const dom = new JSDOM(await readFile(page.html, 'utf8'), { virtualConsole: new VirtualConsole() });
  const doc = dom.window.document;
  const content = doc.querySelector('.sl-markdown-content');
  const key = keyOf(page.id);

  // サイトの UI を外す
  for (const element of content.querySelectorAll('script, style, .sl-anchor-link, .copy')) element.remove();
  for (const link of content.querySelectorAll('link[rel="stylesheet"]')) {
    ctx.stylesheets.add(link.getAttribute('href'));
    link.remove();
  }
  for (const wrapper of content.querySelectorAll('.sl-heading-wrapper')) wrapper.replaceWith(...wrapper.childNodes);
  for (const details of content.querySelectorAll('details')) details.setAttribute('open', '');

  // デモ：静止図か、補足サイトのデモ番号に置き換える
  const demos = [...content.querySelectorAll('figure.css-demo')];
  for (const [index, figure] of demos.entries()) {
    const name = page.demos[index] ?? null;
    const setting = name ? ctx.selection[name] : null;
    const title = figure.querySelector('._caption')?.textContent.trim() ?? '';
    const tabs = figure.nextElementSibling;
    if (tabs?.localName === 'starlight-tabs') tabs.remove();
    if (setting?.print) {
      const srcdoc = figure.querySelector('iframe')?.getAttribute('srcdoc') ?? '';
      const shots = [];
      for (const width of widthsOf(figure, setting)) shots.push({ width, file: await ctx.capture(srcdoc, width) });
      const number = ctx.nextFigure(figureKey(page));
      const out = doc.createElement('figure');
      out.className = 'print-demo';
      out.innerHTML = `<div class="shots">${shots
        .map((shot) => `<div class="shot" style="--width: ${shot.width}"><img src="img/${shot.file}" alt=""><p class="shot-label">幅 ${shot.width}px</p></div>`)
        .join('')}</div>`;
      const caption = doc.createElement('figcaption');
      caption.textContent = `図${number}　${title}`;
      out.append(caption);
      figure.replaceWith(out);
    } else {
      const note = doc.createElement('p');
      note.className = 'demo-ref';
      note.textContent = `デモ${page.label ?? ''}-${index + 1}　${title}（補足サイト）`;
      figure.replaceWith(note);
    }
  }

  // 図（Figure）：SVG の title をキャプションにして、番号を付ける
  for (const figure of content.querySelectorAll('figure.figure')) {
    const title = figure.querySelector('svg > title')?.textContent.trim() ?? '';
    const caption = doc.createElement('figcaption');
    caption.textContent = `図${ctx.nextFigure(figureKey(page))}　${title}`;
    figure.append(caption);
  }

  // 画像：dist/ から写し、相対パスにする
  for (const image of content.querySelectorAll('img[src^="/"]')) {
    const src = image.getAttribute('src');
    image.setAttribute('src', ctx.copyAsset(src));
  }

  // ガイドライン：要点（強度と本文）と ID だけにする
  for (const rule of content.querySelectorAll('.guideline ._rule')) {
    const id = rule.querySelector('._meta code')?.textContent ?? '';
    rule.querySelector('._meta')?.remove();
    const tag = doc.createElement('p');
    tag.className = '_id';
    tag.innerHTML = `<code>${id}</code>`;
    rule.append(tag);
  }

  // id をページの中で一意にする
  for (const element of content.querySelectorAll('[id]')) element.id = `${key}--${element.id}`;

  // リンク
  const related = new Map();
  for (const anchor of content.querySelectorAll('a[href]')) {
    const href = anchor.getAttribute('href');
    if (href.startsWith('#')) {
      anchor.setAttribute('href', `#${key}--${decodeURIComponent(href.slice(1))}`);
      continue;
    }
    const target = parseHref(href);
    if (!target) continue;
    const targetPage = ctx.pages.get(target.page);
    if (!targetPage) continue;
    const inVolume = ctx.volumePageIds.has(targetPage.id);
    const isRule = target.hash.startsWith('rule-');
    if (inVolume) {
      const hash = target.hash ? `${keyOf(targetPage.id)}--${target.hash}` : `page-${keyOf(targetPage.id)}`;
      anchor.setAttribute('href', `#${hash}`);
      anchor.className = isRule ? 'xref-rule' : 'xref';
      if (isRule) anchor.dataset.label = targetPage.label ?? '';
    } else {
      anchor.removeAttribute('href');
      anchor.className = 'xref-out';
      const where = targetPage.volume ? `巻${targetPage.volume}` : '補足サイト';
      const suffix = isRule ? `（${targetPage.label ?? ''}、${where}）` : `（${where}）`;
      anchor.after(doc.createTextNode(suffix));
    }
    if (!isRule && targetPage.id !== page.id && targetPage.label) {
      related.set(targetPage.id, { page: targetPage, inVolume });
    }
  }

  // 節末に、関連する節を置く（ガイドラインの前、なければ参考リンクの前、なければ末尾）
  if (related.size && page.slug !== 'index') {
    const aside = doc.createElement('aside');
    aside.className = 'related';
    const items = [...related.values()]
      .map(({ page: target, inVolume }) =>
        inVolume
          ? `<li><a class="xref" href="#page-${keyOf(target.id)}">${target.title}</a></li>`
          : `<li>${target.title}（${target.volume ? `巻${target.volume}` : '補足サイト'}）</li>`,
      )
      .join('');
    aside.innerHTML = `<p class="related-title">この節に関連する節</p><ul>${items}</ul>`;
    const before = content.querySelector(`[id="${key}--ガイドライン"], [id="${key}--参考リンク"]`);
    if (before) before.before(aside);
    else content.append(aside);
  }

  const kind = page.slug === 'index' ? (page.dir === 'introduction' ? 'page' : 'chapter-opener') : 'page';
  return `<section class="${kind}" id="page-${key}" data-title="${page.title}">
<h1>${page.title}</h1>
${content.innerHTML}
</section>`;
};
