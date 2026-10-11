/**
 * 本文の参照を、紙では「※N」の注にして、節の末尾の「参照」にまとめる。
 * - 参照だけの文（「〜は「13-3 …」で説明しています。」）は本文から外し、直前の文の末尾に ※N を付ける
 * - 括弧だけの参照（「…します（「13-2 …」）。」）は、括弧を ※N に置き換える
 * どちらも、ほかのページへのリンク（a.xref、a.xref-out）を含むものだけを対象にする。ルールへのリンクは本文に残す。
 */

const REF = 'a.xref, a.xref-out';
/** 参照だけの文の終わり方 */
const POINTER = /(説明|解説|扱|述べ|まとめ|示|紹介)(し|い|っ|め)?(て)?(い)?(ます|ました)。$|参照してください。$/;
/** 注で省く文の結び */
const TAIL = /(で|に)?(詳しく|具体的に|順に)?(説明|解説|扱|述べ|まとめ|示|紹介)[^。]*。$|を参照してください。$/;
/** 注を付けない場所（ルール、図、表、注の一覧など） */
const SKIP = '.guideline, .notes, figure, table, .baseline, .demo-ref, summary, li';

const isRef = (node) => node.nodeType === 1 && (node.matches(REF) || node.querySelector?.(REF) !== null);
const isText = (node) => node?.nodeType === 3;

/** 段落の子を、「。」で終わる文ごとのノードの配列に分ける */
const sentencesOf = (paragraph) => {
  for (const node of [...paragraph.childNodes]) {
    if (!isText(node)) continue;
    let current = node;
    let index = current.data.indexOf('。');
    while (index !== -1 && index < current.data.length - 1) {
      current = current.splitText(index + 1);
      index = current.data.indexOf('。');
    }
  }
  const sentences = [];
  let sentence = [];
  for (const node of [...paragraph.childNodes]) {
    sentence.push(node);
    if (isText(node) && node.data.trimEnd().endsWith('。')) {
      sentences.push(sentence);
      sentence = [];
    }
  }
  if (sentence.length) sentences.push(sentence);
  return sentences;
};

/** 文の最後の「。」の直前に、注の印を入れる */
const markBeforePeriod = (doc, sentence, marker) => {
  const last = [...sentence].reverse().find((node) => isText(node) && node.data.includes('。'));
  if (!last) return false;
  const tail = last.splitText(last.data.lastIndexOf('。'));
  tail.before(marker);
  return true;
};

export const moveReferencesToNotes = (doc, content) => {
  const notes = [];
  const marker = () => {
    const mark = doc.createElement('span');
    mark.className = 'note-ref';
    notes.push({ mark, nodes: [] });
    return notes.at(-1);
  };

  for (const paragraph of content.querySelectorAll('p')) {
    if (paragraph.closest(SKIP)) continue;
    paragraph.normalize();

    // 括弧だけの参照：（「13-2 …」）と（13-2 …）
    for (const anchor of [...paragraph.querySelectorAll(REF)]) {
      if (anchor.parentNode !== paragraph) continue;
      const before = anchor.previousSibling;
      const after = anchor.nextSibling;
      if (!isText(before) || !isText(after)) continue;
      const quoted = before.data.endsWith('（「') && /^(（(巻\d|補足サイト)）)?」）/.test(after.data);
      const plain = !quoted && before.data.endsWith('（') && /^(（(巻\d|補足サイト)）)?）/.test(after.data);
      if (!quoted && !plain) continue;
      const suffix = after.data.match(/^（(巻\d|補足サイト)）/)?.[0] ?? '';
      const note = marker();
      note.nodes = [doc.createTextNode(quoted ? '「' : ''), anchor.cloneNode(true), doc.createTextNode(`${quoted ? '」' : ''}${suffix}`)];
      before.data = before.data.slice(0, quoted ? -2 : -1);
      after.data = after.data.slice(suffix.length + (quoted ? 2 : 1));
      anchor.replaceWith(note.mark);
    }

    // 参照だけの文
    const sentences = sentencesOf(paragraph);
    for (const [index, sentence] of sentences.entries()) {
      const text = sentence.map((node) => node.textContent).join('').trim();
      if (!sentence.some(isRef) || !POINTER.test(text)) continue;
      const previous = sentences.slice(0, index).reverse().find((item) => item.some((node) => node.isConnected));
      if (!previous) continue;
      const note = marker();
      if (!markBeforePeriod(doc, previous, note.mark)) {
        notes.pop();
        continue;
      }
      note.nodes = sentence.map((node) => node.cloneNode(true));
      // 注では「で説明しています」のような結びを省き、何がどこにあるかだけを残す
      const last = [...note.nodes].reverse().find(isText);
      if (last) last.data = last.data.replace(TAIL, '');
      for (const node of sentence) node.remove();
    }
  }

  // 本文に現れる順に番号を振る
  const ordered = notes.filter((note) => note.mark.isConnected);
  const position = (note) => [...content.querySelectorAll('.note-ref')].indexOf(note.mark);
  ordered.sort((a, b) => position(a) - position(b));
  for (const [index, note] of ordered.entries()) note.mark.textContent = `※${index + 1}`;
  return ordered;
};
