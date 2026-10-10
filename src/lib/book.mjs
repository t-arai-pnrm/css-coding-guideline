/**
 * 本の構成（部と章）。サイドバー、付録のルール一覧、AI 向けの配布物の生成で共通に使う。
 * 章のディレクトリ名は URL になるので、公開後は変えない。
 *
 * `review` は、AI がレビューで読む章を選ぶ条件（スキルの章の索引と MCP の list_chapters に出す）。
 * `always: true` の章は、どの CSS のレビューでも読む。
 */
export const PARTS = [
  {
    label: '第I部 CSSコーディングにおけるマインドセット',
    chapters: [
      {
        number: 1,
        dir: 'principles',
        title: 'CSSのマインドセット',
        review: '新しい機能、ブラウザの対応状況、フォールバック、@supports',
      },
      {
        number: 2,
        dir: 'design-mindset',
        title: 'CSS設計の考え方',
        review: 'コンポーネントの分け方、共通化、上書きの多い設計',
      },
      {
        number: 3,
        dir: 'design-reproduction',
        title: 'デザインを再現する',
        review: 'デザインカンプの数値（余白、文字の大きさ、幅）の再現',
      },
    ],
  },
  {
    label: '第II部 基礎編',
    chapters: [
      {
        number: 4,
        dir: 'cascade',
        title: 'カスケードを制御する',
        review: '@layer、!important、詳細度、セレクタの重ね掛け、:is()、:where()、上書きの順番',
      },
      {
        number: 5,
        dir: 'pseudo',
        title: '擬似クラスと擬似要素',
        review: ':has()、:hover、:focus-visible、:nth-child()、::before、::after などの擬似クラスと擬似要素',
      },
      {
        number: 6,
        dir: 'values',
        title: '値と単位',
        review: 'px、rem、em、vw、vh、cqi などの単位、calc()、min()、max()、clamp()、if()、attr()',
      },
      {
        number: 7,
        dir: 'layout',
        title: 'レイアウトの仕組み',
        review: 'display、Flexbox、Grid、position、margin、ボックスモデル、幅と高さ',
      },
    ],
  },
  {
    label: '第III部 設計編',
    chapters: [
      {
        number: 8,
        dir: 'reset',
        title: 'リセットとベーススタイル',
        review: 'リセットCSS、要素セレクタだけのスタイル、:root や body のようにグローバルに書くスタイル',
      },
      {
        number: 9,
        dir: 'notation',
        title: '記法の規約',
        review: 'すべてのCSS（命名、ネスト、@scope、プロパティの並び、記法）',
        always: true,
      },
      {
        number: 10,
        dir: 'components',
        title: 'コンポーネントとカスタムプロパティ',
        review: 'すべてのCSS（コンポーネントの境界、カスタムプロパティ、デザイントークン）',
        always: true,
      },
    ],
  },
  {
    label: '第IV部 実装編',
    chapters: [
      {
        number: 11,
        dir: 'layout-practice',
        title: 'レイアウトを組む',
        review: '余白の設計、内容の変化への耐性、はみ出しとスクロール、重なり、z-index、アンカーポジショニング、表',
      },
      {
        number: 12,
        dir: 'compositions',
        title: 'レイアウトコンポジション',
        review: '要素を縦に積む、横に並べる、列に分けるなど、繰り返し使うレイアウトのパターン',
      },
      {
        number: 13,
        dir: 'responsive',
        title: 'レスポンシブデザイン',
        review: '@media、@container、ブレイクポイント、画面幅やコンテナの幅による切り替え、safe-area',
      },
      {
        number: 14,
        dir: 'typography',
        title: 'タイポグラフィと和文組版',
        review: 'font-*、line-height、文字の大きさ、和文組版、改行、文字の色の役割',
      },
      {
        number: 15,
        dir: 'color-media',
        title: '色',
        review: '色の指定（oklch()、color-mix()、相対カラー構文）、ダークモード、強制カラーモード、コントラスト',
      },
      {
        number: 16,
        dir: 'decoration',
        title: '画像・装飾',
        review: '画像、SVG、アイコン、mask、影、角丸、枠線、区切り線、印刷',
      },
      {
        number: 17,
        dir: 'interaction',
        title: 'インタラクション',
        review: 'ホバー、フォーカス、押せる範囲、タッチ操作、user-select、状態を表す属性（ARIA属性、data-*属性）、カード全体のリンク、開閉するUI（details、dialog、popover）、フォーム部品、カルーセル',
      },
      {
        number: 18,
        dir: 'motion',
        title: 'モーション',
        review: 'transition、animation、@keyframes、prefers-reduced-motion、スクロール連動、View Transitions',
      },
    ],
  },
  {
    label: '第V部 運用編',
    chapters: [
      {
        number: 19,
        dir: 'operations',
        title: '実務での運用',
        review: 'Stylelint、レビュー、CMSの本文エリアやWYSIWYG、既存のサイトへの導入',
      },
      {
        number: 20,
        dir: 'ai-coding',
        title: 'AIにコーディングさせる',
        review: 'AIが書いたCSS、Figmaなどのデザインツールから書いたCSS',
      },
    ],
  },
  {
    label: '第VI部 演習編',
    chapters: [{ number: 21, dir: 'exercise', title: '記事の一覧を作る' }],
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
