/**
 * 紙の書籍版の巻の構成。章は src/lib/book.mjs の章のディレクトリで指定する。
 * 「はじめに」（introduction）は巻1の先頭に置く。付録は巻3の末尾に、紙に載せるものだけを置く。
 */
export const VOLUMES = [
  {
    number: 1,
    title: '考え方と基礎',
    dirs: ['introduction', 'principles', 'design-mindset', 'design-reproduction', 'cascade', 'pseudo', 'values', 'layout'],
  },
  {
    number: 2,
    title: '設計と実装（1）',
    dirs: ['reset', 'notation', 'components', 'layout-practice', 'compositions', 'responsive'],
  },
  {
    number: 3,
    title: '実装（2）・運用・演習',
    dirs: ['typography', 'color-media', 'decoration', 'interaction', 'motion', 'operations', 'ai-coding', 'exercise', 'appendix'],
    // 付録のうち、紙に載せるページ（それ以外は補足サイト）
    appendix: ['glossary', 'troubles', 'checklist'],
  },
];

/** 章のディレクトリから、巻の番号を引く */
export const volumeOf = (dir) => VOLUMES.find((volume) => volume.dirs.includes(dir))?.number ?? null;

/** 付録は、巻に採録するページだけを内部参照の対象にする。 */
export const printedVolumeOf = (page) => {
  const volume = VOLUMES.find((item) => item.dirs.includes(page.dir));
  if (!volume || (page.dir === 'appendix' && !volume.appendix?.includes(page.slug))) return null;
  return volume.number;
};
