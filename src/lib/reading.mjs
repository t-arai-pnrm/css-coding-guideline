/**
 * 節の読み方の区別（frontmatter の `reading`）。節の冒頭、サイドバー、紙版の目次と節の冒頭、AI 向けの配布物で共通に使う。
 * 第1〜20章の節（章の概要を除く）には必ず付ける。「はじめに」、付録、第21章には付けない。
 */
export const READINGS = {
  basic: { label: '基本', text: '初めて読むときに読む節です。' },
  applied: { label: '応用', text: '要件が出たときに、通して読む節です。' },
  reference: { label: '参照', text: '必要な見出しを引いて使う節です。' },
};

/** 区別を付けない章のディレクトリ */
const EXCLUDED_DIRS = new Set(['introduction', 'appendix', 'exercise']);

/** ページ ID（例: `values/if-and-attr`）が、区別を付ける節かどうか */
export const needsReading = (id) => {
  const [dir, slug] = id.split('/');
  return Boolean(slug) && slug !== 'index' && !EXCLUDED_DIRS.has(dir);
};

/** 節の冒頭に出す1行（区別の名前を除く本文）。`readingNote` があれば続ける */
export const readingText = (reading, note) => {
  const base = READINGS[reading]?.text ?? '';
  return note ? `${base}${note}` : base;
};
