# 第1章 CSSのマインドセット：ルール

- ガイドラインのバージョン: 0.45.0（2026-10-09 生成）
- ルールの数: 15
- 本文: 約5.4万字
- 読む条件: 新しい機能、ブラウザの対応状況、フォールバック、@supports

このファイルは「CSSコーディングガイドライン」のルールから自動生成しています。直接編集しないでください。
強度は「必須」「推奨」「非推奨」「禁止」の4段階です。「必須」と「禁止」は、各ルールの補足に書いた適用範囲と例外を除いて必ず守り、「推奨」と「非推奨」は理由があれば外れてかまいません。
性質は3種類です。「仕様上の制約」はCSS・HTML・ブラウザの振る舞いやWCAGから導かれ、守らないと表示や操作が崩れます。「実装上の判断」は状況とトレードオフで決まり、適用する条件があります。「本書の規約」は一貫性のために本書が選んだ約束で、ほかの約束を選んでも同じように成り立ちます。
背景とコード例は、各節の本文にあります。本文は MCP の `get_page`（ページID）か、URL で読みます。

## この章の節

- `principles` 第1章 CSSのマインドセット（約3,900字）https://t-arai-pnrm.github.io/css-coding-guideline/principles/
- `principles/browser-suggestion` 1-1 CSSはブラウザへの「提案」である（約1万字）https://t-arai-pnrm.github.io/css-coding-guideline/principles/browser-suggestion/
- `principles/browser-support` 1-2 ブラウザサポートとプログレッシブ・エンハンスメント（約1.6万字）https://t-arai-pnrm.github.io/css-coding-guideline/principles/browser-support/
- `principles/layout-algorithms` 1-3 CSSはレイアウトのアルゴリズムの集まりである（約3,400字）https://t-arai-pnrm.github.io/css-coding-guideline/principles/layout-algorithms/
- `principles/fundamentals` 1-4 基礎を固める（約3,100字）https://t-arai-pnrm.github.io/css-coding-guideline/principles/fundamentals/
- `principles/no-memorizing` 1-5 解決策を丸暗記しない（約5,700字）https://t-arai-pnrm.github.io/css-coding-guideline/principles/no-memorizing/
- `principles/tips` 1-6 Tipsとの付き合い方（約5,900字）https://t-arai-pnrm.github.io/css-coding-guideline/principles/tips/
- `principles/options` 1-7 選択肢を多く持つ（約5,500字）https://t-arai-pnrm.github.io/css-coding-guideline/principles/options/

## 1-1 CSSはブラウザへの「提案」である

https://t-arai-pnrm.github.io/css-coding-guideline/principles/browser-suggestion/

- 【推奨・実装上の判断】寸法は1つの値に決めつけず、上限・下限・比率などの制約を示して、具体的な値の計算はブラウザに任せる。（`css-as-suggestion`）
  - 理由: 画面の幅、文字サイズの設定、文章量など、実装者には決められない条件が変わっても崩れないため。
  - 補足: 幅と高さの具体的な指定のしかたは「13-1 検討する順番」にあります。アイコンのように本質的に大きさが決まった要素は、固定値でかまいません。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/principles/browser-suggestion/#rule-css-as-suggestion
- 【推奨・実装上の判断】画像の切り抜き、テキストの折り返し、列数の決定のようにブラウザが計算できる処理は、自前で作り込まずに CSS の機能に任せる。（`delegate-to-browser`）
  - 理由: 表示する環境を知っているのはブラウザであり、どの大きさや条件でも同じ仕組みで対応できるため。
  - 補足: 画像の切り抜きは `object-fit: cover`、装飾のグラデーションは CSS のグラデーションで描きます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/principles/browser-suggestion/#rule-delegate-to-browser
- 【推奨・実装上の判断】すべての環境でデザインカンプと同じ見た目にすること（ピクセルパーフェクト）ではなく、どの環境でもデザインの意図が伝わり、内容を読めて操作できることを目標にする。（`consensus-over-pixel-perfect`）
  - 理由: 表示を左右する変数は無数にあり、特定の環境に合わせて決め打ちした値は、ほかの環境で崩れる原因になるため。
  - 補足: カンプの比率を保ってほしいと頼まれた場合も、カンプの幅に対する比率でページ全体を拡大・縮小せず、何を保つかをデザイナーとすり合わせます（13-7）。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/principles/browser-suggestion/#rule-consensus-over-pixel-perfect
- 【推奨・実装上の判断】カンプの幅以外での見せ方、文章量や要素の数が変わったときの見せ方、細部の再現の程度を、実装の前にデザイナーやクライアントと合意しておく。（`agree-on-responsive-behavior`）
  - 理由: どこまでを許容するかは実装者だけでは決められず、実装の後で食い違うと手戻りが大きいため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/principles/browser-suggestion/#rule-agree-on-responsive-behavior

## 1-2 ブラウザサポートとプログレッシブ・エンハンスメント

https://t-arai-pnrm.github.io/css-coding-guideline/principles/browser-support/

- 【必須・本書の規約】対象のブラウザは、Safari は現行のメジャーバージョンから2つ前の最終版以降、Chrome、Edge、Firefox は最新版とする。（`browser-support-target`）
  - 理由: 古いバージョンが残りやすい Safari が最も保守的な基準になり、ここで使える機能ならほかのブラウザでも使えることが多いため。
  - 補足: 2026年9月時点では Safari 27 が最新なので、Safari 18 系の最終版（18.6）以降が対象です。番号は 18 の次が 26 なので、実際に出たメジャーバージョンを数えます。案件で動作環境が決まっている場合は、そちらに従います。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/principles/browser-support/#rule-browser-support-target
- 【推奨・実装上の判断】新しい機能を使うときは、最初に対象の Safari で使えるかを確認する。（`check-safari-support-first`）
  - 理由: 対象のブラウザの中で、新しい機能への対応が最も遅れやすいのが Safari であるため。
  - 補足: 本書では、対応状況を web-features のデータ（Baseline）で示しています。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/principles/browser-support/#rule-check-safari-support-first
- 【必須・実装上の判断】対象のブラウザの一部しか対応していない機能は、未対応の環境でも内容を読めて操作できる場合に限って、プログレッシブ・エンハンスメントとして使う。（`progressive-enhancement-if-harmless`）
  - 理由: 対応した環境の体験を良くしつつ、未対応の環境のユーザーを切り捨てないため。
  - 補足: 2026年9月時点では、`text-wrap: pretty`、`word-break: auto-phrase`、`field-sizing`、`text-box`、ドキュメント間のビュートランジションが使いやすい例です。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/principles/browser-support/#rule-progressive-enhancement-if-harmless
- 【推奨・実装上の判断】プログレッシブ・エンハンスメントとして使う機能は、その宣言を外した表示を確かめてから使う。同じ機能を複数の箇所で使うときは、箇所ごとに確かめる。（`verify-fallback-by-removal`）
  - 理由: 未対応の環境では宣言が無視されるだけなので、宣言を外した表示を見れば、読めて操作できるかを、未対応のブラウザなしで判断できるため。
  - 補足: 宣言のコメントアウトか、開発者ツールでの無効化で確かめます。案件の基準を決めるときは、未対応の環境での体験、自サイトのアクセス解析のブラウザ分布、使えなかったときの害の大きさを合わせて見ます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/principles/browser-support/#rule-verify-fallback-by-removal
- 【禁止・仕様上の制約】対象のブラウザの一部が対応していないレイアウトの機能を、レイアウトの要として使わない。（`no-unsupported-layout-features`）
  - 理由: 未対応の環境では指定が無視され、表示の崩れや内容の重なりにつながるため。
  - 補足: 2026年10月時点では、アンカーポジショニング、絶対配置の要素への `place-self`、`sibling-index()` と `sibling-count()` が該当します。装飾的な演出に限り、`@supports` で従来の表現を用意して使えます（`sibling-index()` の書き方は `sibling-functions-for-decoration`）。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/principles/browser-support/#rule-no-unsupported-layout-features
- 【推奨・仕様上の制約】新しい機能に合わせて既存の宣言も変えるときは、その宣言を `@supports` の中に書く。（`supports-for-dependent-declarations`）
  - 理由: 未対応の環境で、従来の手段まで取り上げてしまうのを防ぐため。
  - 補足: 例：`field-sizing: content` を使うときの `resize: none` と `max-block-size`。新しいプロパティそのものは、未対応の環境で無視されるので `@supports` で囲む必要はありません。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/principles/browser-support/#rule-supports-for-dependent-declarations
- 【推奨・実装上の判断】対象のブラウザがすべて対応している機能には、フォールバックや `@supports` の分岐を書かず、残っていれば消す。（`remove-unneeded-fallbacks`）
  - 理由: 使われないコードが残り、読む人に「まだ対応していないブラウザがある」と誤解させるため。
  - 補足: 例：`lh` 単位は Safari 16.4 で対応しているので、`@supports not (top: 1lh)` の分岐は不要です。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/principles/browser-support/#rule-remove-unneeded-fallbacks
- 【推奨・仕様上の制約】フォールバックは、新しいプロパティならそのまま書き、`var()` を含まない新しい値なら従来の宣言を前に書くか `@supports` の中に書き、`var()` を含む宣言と、ほかの宣言もまとめて切り替える宣言は必ず `@supports` の中に書く。（`fallback-method-by-invalidation`）
  - 理由: `var()` を含む宣言は計算値の時点で無効になり、前に書いた宣言に戻らないため。まとめて切り替える宣言は、`@supports` の条件で意図が読め、不要になったときに検索して消せるため。
  - 補足: 従来の宣言を前に書くときは、同じプロパティの重複が誤記に見えないように、未対応の環境で使う値であることをコメントで書きます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/principles/browser-support/#rule-fallback-method-by-invalidation
- 【必須・仕様上の制約】JavaScript で表示を切り替える前提のスタイル（表示する前の状態として要素を隠すなど）は、`@media (scripting: enabled)` の中に書き、さらに初期化に成功した JavaScript が付ける属性を条件にする。（`scripting-for-js-dependent-styles`）
  - 理由: JavaScript が無効な環境や、スクリプトの読み込みや実行に失敗した環境で、内容が隠れたままになるのを防ぐため。`scripting: enabled` は JavaScript が有効なことしか表さない。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/principles/browser-support/#rule-scripting-for-js-dependent-styles
- 【必須・実装上の判断】表示の確認は Chrome だけで済ませず、Safari（iOS を含む）と Firefox でも行う。（`no-chrome-only-check`）
  - 理由: 既存のプロパティの新しい仕様を Chrome が先に実装することが多く、Chrome だけで確認すると、ほかのブラウザとの差に気づけないため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/principles/browser-support/#rule-no-chrome-only-check
- 【禁止・仕様上の制約】ブロックレイアウトの要素に、`justify-self` や `justify-items` を指定しない。（`no-justify-self-in-block-layout`）
  - 理由: 2026年9月時点で対応しているのは Chrome だけで、Safari と Firefox では無視されるため。
  - 補足: ブロックの中央寄せには `margin-inline: auto` を使います。`display` を grid からブロックに戻すときは、指定が残っていないかを確かめます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/principles/browser-support/#rule-no-justify-self-in-block-layout
