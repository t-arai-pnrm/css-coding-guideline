/**
 * 索引。語は、用語集（付録E）の語と、節の見出しに書いた CSS の構文（`@scope`、`:has()` など）から拾う。
 * 本文のすべての出現を載せると多すぎるので、節ごとに、次のどれかに当たるときだけ、最初の出現を索引に載せる。
 * - 用語集が「詳しい説明」として指している節（ページ番号を太字にする）
 * - 見出しにその語がある節
 * - 本文にその語が3回以上出る節
 */
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { DOCS } from './pages.mjs';

const HERE = new URL('../', import.meta.url).pathname;
/** 索引の語を探す場所と、探さない場所 */
const SEARCH = 'p, li, td, th, h2, h3, dd, summary';
const SKIP = 'pre, figure.code, .notes, .guideline, .baseline, .demo-ref, figcaption, .toc';
/** 見出しの中で、索引に載せる CSS の構文（アットルール、擬似クラス、関数、プロパティ、「プロパティ: 値」） */
const SYNTAX = /^(@[a-z-]+|::?[a-z-]+(\(\))?|[a-z-]+\(\)|[a-z][a-z-]*(: [a-z][a-z -]*)?)$/;
/** 節ごとに索引に載せる、本文での出現回数の下限 */
const MIN_COUNT = 3;

const toHiragana = (text) => text.replace(/[ァ-ヶ]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 0x60));

/** 用語集の表から、語、読み、本文で探す表記、詳しい説明の節を読む */
export const loadTerms = async () => {
  const extraConfig = JSON.parse(await readFile(join(HERE, 'config/index-terms.json'), 'utf8'));
  const extra = extraConfig.terms;
  const source = await readFile(join(DOCS, 'appendix/glossary.mdx'), 'utf8');
  const terms = [];
  for (const line of source.split('\n')) {
    const cells = line.match(/^\| (.+?) \| (.*?) \| (.*?) \|$/);
    if (!cells || cells[1] === '用語' || cells[1].startsWith('---')) continue;
    const link = cells[3].match(/\]\(\/([^)#]+?)\/?(#[^)]*)?\)/);
    const defines = link ? link[1].replace(/\/$/, '') : null;
    // 「A、B、C」は別々の語にし、「イントリンシック（intrinsic）」の括弧は表記の候補にする
    for (const raw of cells[1].split('、')) {
      const code = raw.match(/^`(.+)`$/)?.[1];
      const base = (code ?? raw).replace(/（.*?）$/, '').trim();
      const alias = raw.match(/（([A-Za-z][^）]*)）$/)?.[1];
      const setting = extra[base] ?? {};
      if (setting.skip || base.length < 2) continue;
      terms.push({
        label: base,
        code: Boolean(code),
        yomi: setting.yomi ?? toHiragana(base),
        match: setting.match ?? [base, ...(alias ? [alias] : [])],
        defines,
      });
    }
  }
  // 用語集にない、索引にだけ載せる語
  for (const item of extraConfig.add ?? []) {
    terms.push({ label: item.label, code: Boolean(item.code), yomi: item.yomi ?? item.label, match: item.match ?? [item.label], defines: null });
  }
  return terms;
};

/** 索引の語を本文に印として埋め込み、索引の項目を集める */
export const createIndexer = (terms) => {
  const entries = new Map(terms.map((term, index) => [term.label, { ...term, id: `t${index}`, locators: [] }]));
  const textTerms = [...entries.values()].filter((term) => !term.code);
  const matchers = textTerms
    .flatMap((term) => term.match.map((text) => ({ text, term })))
    .sort((a, b) => b.text.length - a.text.length);

  const mark = (doc, content, page, key) => {
    const found = new Map();
    const note = (term, node, offset, inHeading) => {
      const record = found.get(term.label) ?? { count: 0, first: null, heading: false };
      record.count += 1;
      if (!record.first || (inHeading && !record.heading)) record.first = { node, offset };
      record.heading ||= inHeading;
      found.set(term.label, record);
    };

    for (const container of content.querySelectorAll(SEARCH)) {
      if (container.closest(SKIP)) continue;
      const inHeading = /^h[23]$/.test(container.localName);
      // 見出しの CSS の構文
      if (inHeading) {
        for (const code of container.querySelectorAll('code')) {
          if (code.closest(SEARCH) !== container) continue;
          const text = code.textContent.trim();
          if (!SYNTAX.test(text)) continue;
          if (!entries.has(text)) entries.set(text, { label: text, code: true, yomi: text, match: [text], defines: null, id: `s${entries.size}`, locators: [] });
          note(entries.get(text), code, 0, true);
        }
      }
      // 用語集の語（長い表記から先に当てる）
      const walker = doc.createTreeWalker(container, 4);
      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        if (node.parentElement.closest(`code, ${SKIP}`)) continue;
        if (node.parentElement.closest(SEARCH) !== container) continue;
        const text = node.data;
        for (let index = 0; index < text.length; ) {
          const hit = matchers.find((matcher) => text.startsWith(matcher.text, index));
          if (!hit) {
            index += 1;
            continue;
          }
          note(hit.term, node, index, inHeading);
          index += hit.text.length;
        }
      }
      // 用語集の、コードで書く語（`palt` など）
      for (const code of container.querySelectorAll('code')) {
        if (code.closest(SEARCH) !== container || code.closest(SKIP)) continue;
        const term = entries.get(code.textContent.trim());
        if (term?.code) note(term, code, 0, inHeading);
      }
    }

    // 載せる節を選び、最初の出現に印を入れる（同じテキストの中は、後ろから入れて位置をずらさない）
    const inserts = [];
    for (const [label, record] of found) {
      const term = entries.get(label);
      const isDefinition = term.defines === page.id;
      if (!isDefinition && !record.heading && record.count < MIN_COUNT) continue;
      const id = `${key}--ix-${term.id}`;
      term.locators.push({ id, definition: isDefinition });
      inserts.push({ ...record.first, id });
    }
    inserts.sort((a, b) => b.offset - a.offset);
    for (const { node, offset, id } of inserts) {
      const anchor = doc.createElement('span');
      anchor.className = 'ix';
      anchor.id = id;
      if (node.nodeType === 3) {
        const rest = offset > 0 ? node.splitText(offset) : node;
        rest.before(anchor);
      } else {
        node.before(anchor);
      }
    }
  };

  return { mark, entries };
};

/** 五十音の行。記号と英字は先頭にまとめる */
const ROWS = ['あ', 'か', 'さ', 'た', 'な', 'は', 'ま', 'や', 'ら', 'わ'];
const rowOf = (yomi) => {
  const first = toHiragana(yomi).normalize('NFD')[0];
  if (!/[ぁ-ゖ]/.test(first)) return '記号・英字';
  const code = first.charCodeAt(0);
  const starts = ['あ', 'か', 'さ', 'た', 'な', 'は', 'ま', 'や', 'ら', 'わ'].map((char) => char.charCodeAt(0));
  let row = ROWS[0];
  for (const [index, start] of starts.entries()) if (code >= start) row = ROWS[index];
  return row;
};
const sortKey = (entry) => (rowOf(entry.yomi) === '記号・英字' ? entry.yomi.replace(/^[^A-Za-z0-9]+/, '').toLowerCase() : toHiragana(entry.yomi));

/** 索引のページの HTML。ページ番号は組版のときに target-counter で入る */
export const renderIndex = (entries) => {
  const listed = [...entries.values()].filter((entry) => entry.locators.length);
  const groups = new Map([['記号・英字', []], ...ROWS.map((row) => [row, []])]);
  for (const entry of listed) groups.get(rowOf(entry.yomi)).push(entry);
  const sections = [...groups]
    .filter(([, items]) => items.length)
    .map(([row, items]) => {
      const lines = items
        .sort((a, b) => sortKey(a).localeCompare(sortKey(b), 'ja'))
        .map((entry) => {
          const label = entry.code ? `<code>${entry.label.replace(/</g, '&lt;')}</code>` : entry.label;
          const refs = entry.locators.map((locator) => `<a class="ix-ref${locator.definition ? ' -definition' : ''}" href="#${locator.id}"></a>`).join('');
          return `<li><span class="ix-term">${label}</span>${refs}</li>`;
        })
        .join('\n');
      return `<h2>${row}</h2>\n<ul class="ix-list">\n${lines}\n</ul>`;
    })
    .join('\n');
  return `<section class="page index" id="page-index"><h1>索引</h1>\n${sections}\n</section>`;
};

