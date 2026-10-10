# 第2章 CSS設計の考え方：ルール

- ガイドラインのバージョン: 0.47.3（2026-10-10 生成）
- ルールの数: 7
- 本文: 約2.5万字
- 読む条件: コンポーネントの分け方、共通化、上書きの多い設計

このファイルは「CSSコーディングガイドライン」のルールから自動生成しています。直接編集しないでください。
強度は「必須」「推奨」「非推奨」「禁止」の4段階です。「必須」と「禁止」は、各ルールの補足に書いた適用範囲と例外を除いて必ず守り、「推奨」と「非推奨」は理由があれば外れてかまいません。
性質は3種類です。「仕様上の制約」はCSS・HTML・ブラウザの振る舞いやWCAGから導かれ、守らないと表示や操作が崩れます。「実装上の判断」は状況とトレードオフで決まり、適用する条件があります。「本書の規約」は一貫性のために本書が選んだ約束で、ほかの約束を選んでも同じように成り立ちます。
背景とコード例は、各節の本文にあります。本文は MCP の `get_page`（ページID）か、URL で読みます。

## この章の節

- `design-mindset` 第2章 CSS設計の考え方（約2,700字）https://t-arai-pnrm.github.io/css-coding-guideline/design-mindset/
- `design-mindset/what-is-css-design` 2-1 CSS設計のマインドセット（約3,000字）https://t-arai-pnrm.github.io/css-coding-guideline/design-mindset/what-is-css-design/
- `design-mindset/css-mindset` 2-2 CSSで考えるための6つの視点（約7,700字）https://t-arai-pnrm.github.io/css-coding-guideline/design-mindset/css-mindset/
- `design-mindset/maintainability` 2-3 保守しやすさを最優先にする（約1.2万字）https://t-arai-pnrm.github.io/css-coding-guideline/design-mindset/maintainability/

## 2-3 保守しやすさを最優先にする

https://t-arai-pnrm.github.io/css-coding-guideline/design-mindset/maintainability/

- 【推奨・実装上の判断】書き方に迷ったら、コードの短さや共通化よりも、ほかの人が読んで安全に直せる書き方を選ぶ。（`maintainability-first`）
  - 理由: Web サイトは公開後の更新と改修の期間のほうが長く、書いた本人以外が触ることも多いため。
  - 補足: 公開後に更新する予定のない短期のキャンペーンサイトなどは例外です。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/design-mindset/maintainability/#rule-maintainability-first
- 【推奨・実装上の判断】似た記述の重複は許容し、共通化は同じものが3回現れてから、役割まで同じかを確かめて検討する。（`rule-of-three`）
  - 理由: 早すぎる共通化は影響範囲を広げ、一部だけ変えたいときに修飾クラスや上書きの分岐が増えるため。
  - 補足: 一緒に変わるべき値だけを、デザイントークンで共有します。共通化の単位は、「画像と文章を横に並べる」程度の配置の共通点ではなく、役割まで同じ実質的な部品にします。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/design-mindset/maintainability/#rule-rule-of-three
- 【必須・実装上の判断】宣言はひとつひとつ、なぜ必要かを説明できるものだけを書く。（`explainable-declarations`）
  - 理由: 余計な宣言はほかのセレクタとぶつかり、どの値が勝つかが状況しだいになるうえ、打ち消すための上書きが増えるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/design-mindset/maintainability/#rule-explainable-declarations
- 【禁止・仕様上の制約】ブロックレベルの要素や、`inset: 0` で広げた絶対配置の要素に、`width: 100%`（`inline-size: 100%`）を指定しない。（`no-redundant-width-100`）
  - 理由: 指定しなくても利用できる幅いっぱいに広がり、左右のマージンや `box-sizing` の変更と組み合わさると、はみ出しの原因になるため。
  - 補足: `<img>` のような置換要素や、`<button>` のようなフォーム部品には必要なことがあります。`min(320px, 100%)` のように、はみ出しを防ぐための `100%` は対象外です。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/design-mindset/maintainability/#rule-no-redundant-width-100
- 【非推奨・実装上の判断】CSS の初期値、ブラウザのデフォルトスタイル、リセット CSS、ベーススタイルで決まっている値を、理由なく指定し直さない。（`no-redundant-defaults`）
  - 理由: 設計の一貫性が崩れ、デフォルト値の側を変えたときにも古い値が残り続けるため。
  - 補足: 最初の要素だけマージンを打ち消すのではなく、`:not(:first-child)` や `* + *` で2つ目以降にだけ付けます。値を戻すときの書き方は「4-1 カスケード・詳細度・継承」のルールに従います。ブロックレベルの要素に付けた `vertical-align` や、フレックスアイテムに付けた `float` のように、その文脈でブラウザが無視するプロパティも消します。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/design-mindset/maintainability/#rule-no-redundant-defaults
- 【推奨・仕様上の制約】サブプロパティの一部だけを変えるときは、ショートハンドではなくロングハンドで書く（`background` ではなく `background-color` など）。（`longhand-for-partial-change`）
  - 理由: ショートハンドは指定しなかったサブプロパティも初期値に戻し、ほかの場所で設定した値を壊すため。
  - 補足: `inset` や `border` のように、すべての辺にまとめて値を与える用途では問題になりにくいです。`flex: 1` は `flex-basis` も `0%` にするので、`flex-grow: 1` とは別物です。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/design-mindset/maintainability/#rule-longhand-for-partial-change
- 【禁止・仕様上の制約】`font` ショートハンドは、リセットの目的以外で使わない。（`no-font-shorthand`）
  - 理由: 文字の大きさやファミリーだけでなく、`line-height` や `font-kerning` まで初期値に戻し、継承させたい値を壊すため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/design-mindset/maintainability/#rule-no-font-shorthand
