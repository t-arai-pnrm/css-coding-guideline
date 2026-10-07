/**
 * 本の構成（部と章）。サイドバー、付録のルール一覧、AI 向けルール集の生成で共通に使う。
 * 章のディレクトリ名は URL になるので、公開後は変えない。
 */
export const PARTS = [
  {
    label: '第I部 CSSコーディングにおけるマインドセット',
    chapters: [
      { number: 1, dir: 'principles', title: 'CSSのマインドセット' },
      { number: 2, dir: 'design-mindset', title: 'CSS設計の考え方' },
      { number: 3, dir: 'design-reproduction', title: 'デザインを再現する' },
    ],
  },
  {
    label: '第II部 基礎編',
    chapters: [
      { number: 4, dir: 'cascade', title: 'カスケードを制御する' },
      { number: 5, dir: 'pseudo', title: '擬似クラスと擬似要素' },
      { number: 6, dir: 'values', title: '値と単位' },
      { number: 7, dir: 'layout', title: 'レイアウトの仕組み' },
    ],
  },
  {
    label: '第III部 設計編',
    chapters: [
      { number: 8, dir: 'reset', title: 'リセットとベーススタイル' },
      { number: 9, dir: 'notation', title: '記法の規約' },
      { number: 10, dir: 'components', title: 'コンポーネントとカスタムプロパティ' },
    ],
  },
  {
    label: '第IV部 実装編',
    chapters: [
      { number: 11, dir: 'layout-practice', title: 'レイアウトを組む' },
      { number: 12, dir: 'compositions', title: 'レイアウトコンポジション' },
      { number: 13, dir: 'responsive', title: 'レスポンシブデザイン' },
      { number: 14, dir: 'typography', title: 'タイポグラフィと和文組版' },
      { number: 15, dir: 'color-media', title: '色' },
      { number: 16, dir: 'decoration', title: '画像・装飾' },
      { number: 17, dir: 'interaction', title: 'インタラクション' },
      { number: 18, dir: 'motion', title: 'モーション' },
    ],
  },
  {
    label: '第V部 運用編',
    chapters: [{ number: 19, dir: 'operations', title: '実務での運用' }],
  },
  {
    label: '第VI部 演習編',
    chapters: [{ number: 20, dir: 'exercise', title: '記事の一覧を作る' }],
  },
];

export const CHAPTERS = PARTS.flatMap((part) => part.chapters);

/** 章の見出し（例: 第13章 レスポンシブデザイン）。 */
export const chapterLabel = (chapter) => `第${chapter.number}章 ${chapter.title}`;

/**
 * Baseline のバッジに表示する、データを確認した年月。
 * web-features を更新したら、この値も更新する。
 */
export const BASELINE_CHECKED = '2026年9月';
