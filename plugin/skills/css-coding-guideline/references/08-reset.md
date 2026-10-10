# 第8章 リセットとベーススタイル：ルール

- ガイドラインのバージョン: 0.46.0（2026-10-09 生成）
- ルールの数: 23
- 本文: 約4.7万字
- 読む条件: リセットCSS、要素セレクタだけのスタイル、:root や body のようにグローバルに書くスタイル

このファイルは「CSSコーディングガイドライン」のルールから自動生成しています。直接編集しないでください。
強度は「必須」「推奨」「非推奨」「禁止」の4段階です。「必須」と「禁止」は、各ルールの補足に書いた適用範囲と例外を除いて必ず守り、「推奨」と「非推奨」は理由があれば外れてかまいません。
性質は3種類です。「仕様上の制約」はCSS・HTML・ブラウザの振る舞いやWCAGから導かれ、守らないと表示や操作が崩れます。「実装上の判断」は状況とトレードオフで決まり、適用する条件があります。「本書の規約」は一貫性のために本書が選んだ約束で、ほかの約束を選んでも同じように成り立ちます。
背景とコード例は、各節の本文にあります。本文は MCP の `get_page`（ページID）か、URL で読みます。

## この章の節

- `reset` 第8章 リセットとベーススタイル（約2,900字）https://t-arai-pnrm.github.io/css-coding-guideline/reset/
- `reset/kiso` 8-1 壊さないリセット（約1.3万字）https://t-arai-pnrm.github.io/css-coding-guideline/reset/kiso/
- `reset/base-styles` 8-2 ベーススタイルに書くもの（約2.3万字）https://t-arai-pnrm.github.io/css-coding-guideline/reset/base-styles/
- `reset/global-pitfalls` 8-3 グローバルに書いてはいけないもの（約8,200字）https://t-arai-pnrm.github.io/css-coding-guideline/reset/global-pitfalls/

## 8-1 壊さないリセット

https://t-arai-pnrm.github.io/css-coding-guideline/reset/kiso/

- 【推奨・本書の規約】リセット CSS には kiso.css を使う。（`reset-kiso-css`）
  - 理由: 詳細度が 0 で上書きしやすく、和文向けの初期値が入っていて、ブラウザの便利なデフォルトを壊さないため。
  - 補足: ほかのリセット CSS を使う場合も、セレクタの詳細度が 0 で、破壊的なリセットをしないものを選びます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/reset/kiso/#rule-reset-kiso-css
- 【必須・仕様上の制約】リセット CSS は `@import url("kiso.css") layer(reset);` のように、`reset` レイヤーに読み込む。（`reset-in-reset-layer`）
  - 理由: ベースやコンポーネントのレイヤーより弱くなり、それらの指定が詳細度に関係なくリセットに勝つため。
  - 補足: レイヤーを使わない環境（CMS など）では、`@import url("kiso.css");` とレイヤーなしで読み込み、ほかの CSS より前に置きます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/reset/kiso/#rule-reset-in-reset-layer
- 【必須・実装上の判断】リセット CSS は、セレクタを `:where()` で包んで詳細度を 0 にしたものを使う。（`reset-zero-specificity`）
  - 理由: レイヤーを使えない環境でも、ベースやコンポーネントの指定がリセットに負けず、クラス1つで上書きできるため。
  - 補足: リセット CSS はレイヤーなしで読み込まれることもある配布物なので、レイヤーに頼らず詳細度を 0 にしておく必要があります。自分で書くベーススタイルは、`base` レイヤーに素のセレクタで書きます（ルール `where-for-base-selectors`）。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/reset/kiso/#rule-reset-zero-specificity
- 【禁止・実装上の判断】リセットで、`input` への `appearance: none` や `* { margin: 0; padding: 0; }` のように、要素の機能や便利なデフォルトを一律に消す指定をしない。（`reset-no-destructive-reset`）
  - 理由: チェックボックスが見えなくなったり、ボタンの余白のように毎回指定し直すものが増えたりするため。
  - 補足: `appearance: none` は、見た目を作り直す部品にだけ個別に指定します。色を変えるだけなら `accent-color` で足ります。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/reset/kiso/#rule-reset-no-destructive-reset
- 【推奨・実装上の判断】和文向けの組版の初期値（`text-spacing-trim`、`text-autospace`、`line-break`、`overflow-wrap`）は、`:root` に指定して継承させる。（`reset-japanese-defaults-on-root`）
  - 理由: 要素ごとに指定し直す必要がなく、`pre` や入力欄のような例外だけを個別に打ち消せば済むため。
  - 補足: kiso.css を使えば指定済みです。値の選び方は第14章「タイポグラフィと和文組版」で扱います。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/reset/kiso/#rule-reset-japanese-defaults-on-root
- 【推奨・実装上の判断】リセットで消したスタイルを本文エリアなどで戻すときは、値を書き直さずに `revert` を使う。（`reset-restore-with-revert`）
  - 理由: ブラウザのデフォルトに戻す意図がコードから読み取れ、元の値を覚えておく必要もないため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/reset/kiso/#rule-reset-restore-with-revert
- 【推奨・実装上の判断】kiso.css の値を変えたいときは、kiso.css 本体を書き換えず、`base` レイヤーで上書きする。（`reset-override-in-base`）
  - 理由: リセットを新しいバージョンに更新しやすく、プロジェクトで変えた箇所がベーススタイルにまとまるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/reset/kiso/#rule-reset-override-in-base

## 8-2 ベーススタイルに書くもの

https://t-arai-pnrm.github.io/css-coding-guideline/reset/base-styles/

- 【推奨・実装上の判断】ベーススタイルの `:root` に `text-underline-offset: 25%` を指定し、下線を文字から離す。（`underline-offset-in-base`）
  - 理由: 文字と下線の間が詰まっていると文字が判読しにくくなるため。継承されるプロパティなのでルート要素に1回書けば全体に適用でき、パーセントは相対値のまま継承されるので、見出しのような大きな文字でも比率が保たれる（`em` はルート要素で固定の長さに計算されてから継承される）。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/reset/base-styles/#rule-underline-offset-in-base
- 【推奨・実装上の判断】ベーススタイルのフォーカスリングは、`:focus-visible` に `CanvasText` の `outline` と `Canvas` の `box-shadow` を重ねた二重リングで定義する。（`focus-ring-double`）
  - 理由: 背景が明るくても暗くても2色のどちらかが背景と区別でき、システムカラーなのでダークモードや強制カラーモードにも追従するため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/reset/base-styles/#rule-focus-ring-double
- 【禁止・仕様上の制約】フォーカスリングを `box-shadow` だけで描かない。（`focus-ring-not-box-shadow-only`）
  - 理由: 強制カラーモードでは `box-shadow` が `none` になり、フォーカスの位置が見えなくなるため。
  - 補足: `box-shadow` は、`outline` で描いたリングを補う用途に限って使います。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/reset/base-styles/#rule-focus-ring-not-box-shadow-only
- 【禁止・仕様上の制約】`html` や `:root` に、`scroll-behavior: smooth` を無条件に指定しない。（`no-global-smooth-scroll`）
  - 理由: キーボードでのフォーカス移動や `scrollTo()` のスクロールまでなめらかになり、動きを減らす設定をしているユーザーにもアニメーションが適用されるため。
  - 補足: カルーセルのような個別のスクロールコンテナに指定するのは問題ありません。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/reset/base-styles/#rule-no-global-smooth-scroll
- 【推奨・実装上の判断】スムーススクロールは、`prefers-reduced-motion: no-preference` の中で、`:root[data-loaded="true"]:has(:target):not(:has(:focus-visible))` のときだけ有効にする。（`smooth-scroll-conditional`）
  - 理由: ページ内リンクで移動するときだけなめらかにし、フラグメント付きの URL で表示した直後や、キーボードでフォーカスを移すとき、動きを減らす設定をしているときは即座にスクロールさせるため。
  - 補足: `data-loaded` 属性は、JavaScript で `load` イベントのときにルート要素に付けます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/reset/base-styles/#rule-smooth-scroll-conditional
- 【推奨・仕様上の制約】`[id]` と `:focus` に `scroll-margin-block-start` を指定し、ページ内リンクの移動先やフォーカスした要素が固定ヘッダーに隠れないようにする。（`scroll-margin-for-targets`）
  - 理由: 移動先の見出しやフォーカスした要素が、固定ヘッダーの下に隠れて見えなくなるのを防ぐため。
  - 補足: 本書のベーススタイルでは `4rlh` を目安にしています。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/reset/base-styles/#rule-scroll-margin-for-targets
- 【必須・実装上の判断】モーダル表示中の背面のスクロールは、`:root:has(:modal)` に `overflow: hidden` を指定して止める。（`modal-scroll-lock-root`）
  - 理由: `:modal` ならモーダルとして開いたダイアログだけに限定でき、ルート要素の `overflow` はビューポートに伝わるので `position: sticky` の要素を妨げないため。
  - 補足: `body:has(dialog[open])` はモーダルでないダイアログにも反応するので使いません。スクロールバーの分のずれは、`:root` の `scrollbar-gutter: stable` で防ぎます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/reset/base-styles/#rule-modal-scroll-lock-root
- 【推奨・実装上の判断】`:root` に `scrollbar-gutter: stable` を指定し、スクロールバーの出入りによるレイアウトのずれを防ぐ。（`scrollbar-gutter-stable`）
  - 理由: モーダルの開閉や内容の増減でスクロールバーが出入りしても、コンテンツが横にずれないため。
  - 補足: kiso.css が指定しているので、kiso.css を使う場合は書き足す必要はありません。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/reset/base-styles/#rule-scrollbar-gutter-stable
- 【非推奨・実装上の判断】スクロールバーの色や太さを変えない。（`no-custom-scrollbar`）
  - 理由: OS やユーザーの設定と見た目がずれて操作の一貫性が損なわれ、強制カラーモードではスクロールバーが見えなくなるおそれがあるため。
  - 補足: デザイン上どうしても変える場合は、`@media (forced-colors: none)` の中で、標準の `scrollbar-color` と `scrollbar-width` を使います。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/reset/base-styles/#rule-no-custom-scrollbar
- 【推奨・実装上の判断】`interpolate-size: allow-keywords` はリセットではなくベーススタイルの `:root` に、`prefers-reduced-motion: no-preference` の条件付きで指定する。（`interpolate-size-in-base`）
  - 理由: 既存のトランジションに意図しないアニメーションを起こしうる指定なので、影響を判断できるプロジェクトの側で有効にするため。
  - 補足: 対応していないブラウザでは、大きさが一瞬で切り替わるだけです。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/reset/base-styles/#rule-interpolate-size-in-base
- 【推奨・実装上の判断】ベーススタイルで、全称セレクタ（`*, ::before, ::after`）に `min-inline-size: 0` を指定する。（`global-min-inline-size-zero`）
  - 理由: フレックスアイテムとグリッドアイテムが、中身の最小幅より縮まずに親からはみ出す問題を、既定で防げるため。
  - 補足: 縮ませたくない要素には、個別に `flex-shrink: 0` などを指定します。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/reset/base-styles/#rule-global-min-inline-size-zero

## 8-3 グローバルに書いてはいけないもの

https://t-arai-pnrm.github.io/css-coding-guideline/reset/global-pitfalls/

- 【禁止・実装上の判断】リセットやベーススタイルを、レイヤーの外に、クラス1つで上書きできない詳細度のセレクタ（`a:link, a:visited` など）で書かない。（`no-heavy-specificity-in-global`）
  - 理由: 上書きのために詳細度を上げたり `!important` を付けたりする対応が増え、保守しにくくなるため。
  - 補足: `@layer` を使う場合は、ベーススタイルを `base` レイヤーに素のセレクタで書けば、後のレイヤーのクラス1つで上書きできます。`@layer` を使えない場合は、`:focus-visible` や `:root:has(:modal)` のような擬似クラスも含めて、セレクタを `:where()` で包みます（第4章のルール `where-for-base-selectors`）。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/reset/global-pitfalls/#rule-no-heavy-specificity-in-global
- 【禁止・実装上の判断】ベーススタイルで、要素全体に `display`、`position`、`max-inline-size` のようなレイアウトのプロパティを指定しない（例：`div { display: flex; }`、`* { position: relative; }`）。（`no-layout-properties-in-base`）
  - 理由: レイアウトは文脈によって必要なものが変わるので、ほかの文脈で打ち消しの指定が増え、打ち消し忘れによる不具合も起きやすいため。
  - 補足: 全称セレクタの `min-inline-size: 0`（8-2）は、フレックスアイテムとグリッドアイテムの最小幅だけを変える例外です。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/reset/global-pitfalls/#rule-no-layout-properties-in-base
- 【禁止・仕様上の制約】`outline: none` や `outline: 0` で、フォーカスリングを消さない。（`no-outline-none`）
  - 理由: キーボードで操作するユーザーが、フォーカスの位置を見失うため。
  - 補足: クリックしたときにリングが出る問題は、ブラウザが `:focus-visible` で解決しています。見た目を変えたいときは、消さずに定義し直します。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/reset/global-pitfalls/#rule-no-outline-none
- 【必須・仕様上の制約】リストのマーカーは、`list-style: none` ではなく `list-style-type: ""` で消す。（`list-style-type-empty-string`）
  - 理由: Safari の VoiceOver は、`list-style: none` を指定したリストをリストとして読み上げないため。
  - 補足: kiso.css を使えば、`ul`、`ol`、`menu` のマーカーは消えています。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/reset/global-pitfalls/#rule-list-style-type-empty-string
- 【禁止・仕様上の制約】ダークモードに対応していないサイトで、`color-scheme: light dark` を指定しない。（`no-color-scheme-without-dark-mode`）
  - 理由: ダークモードの環境で、サイトが色を指定していない部分だけが暗い配色になり、文字色と背景色が同化することがあるため。
  - 補足: 暗い背景だけのサイトでは、`<meta name="color-scheme" content="dark">` を指定します。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/reset/global-pitfalls/#rule-no-color-scheme-without-dark-mode
