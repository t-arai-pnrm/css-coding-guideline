/**
 * 本の構成（部と章）。サイドバー、付録のルール一覧、AI 向けルール集の生成で共通に使う。
 * 章のディレクトリ名は URL になるので、公開後は変えない。
 */
export const PARTS = [
  {
    label: '第I部 基礎編',
    chapters: [
      { number: 1, dir: 'principles', title: '本書の前提となる考え方' },
      { number: 2, dir: 'cascade', title: 'カスケードを制御する' },
      { number: 3, dir: 'pseudo', title: '擬似クラスと擬似要素' },
      { number: 4, dir: 'values', title: '値と単位' },
    ],
  },
  {
    label: '第II部 設計編',
    chapters: [
      { number: 5, dir: 'reset', title: 'リセットとベーススタイル' },
      { number: 6, dir: 'notation', title: '記法の規約' },
      { number: 7, dir: 'components', title: 'コンポーネントとカスタムプロパティ' },
    ],
  },
  {
    label: '第III部 実装編',
    chapters: [
      {
        number: 8,
        dir: 'layout',
        title: 'レイアウト',
        // 節の下にまとめるページ群。`after` の節の直後に、折りたたみのグループとして並べる
        groups: [{ dir: 'compositions', label: '8-14 コンポジション集', after: 'masonry' }],
      },
      { number: 9, dir: 'responsive', title: 'レスポンシブデザイン' },
      { number: 10, dir: 'typography', title: 'タイポグラフィと和文組版' },
      { number: 11, dir: 'color-media', title: '色' },
      { number: 12, dir: 'decoration', title: '画像・装飾' },
      { number: 13, dir: 'interaction', title: 'インタラクションとモーション' },
    ],
  },
  {
    label: '第IV部 運用編',
    chapters: [{ number: 14, dir: 'operations', title: '実務での運用' }],
  },
];

export const CHAPTERS = PARTS.flatMap((part) => part.chapters);

/** 章の見出し（例: 第8章 レスポンシブデザイン）。 */
export const chapterLabel = (chapter) => `第${chapter.number}章 ${chapter.title}`;

/**
 * Baseline のバッジに表示する、データを確認した年月。
 * web-features を更新したら、この値も更新する。
 */
export const BASELINE_CHECKED = '2026年9月';
