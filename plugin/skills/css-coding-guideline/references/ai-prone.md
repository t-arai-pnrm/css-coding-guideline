# AIが誤りやすいルール

- ガイドラインのバージョン: 0.48.0（2026-10-10 生成）
- ルールの数: 289

AIが生成するコードで特に誤りやすいルールです。CSSを書く前とレビューの前に、必ず確認してください。1件1行で、強度とルールの本文と ID だけを並べています。理由と補足は、章ごとのファイル（`references/<章>.md`）を ID で検索して読んでください。

## 第1章 CSSのマインドセット（references/01-principles.md）

- 【推奨】寸法は1つの値に決めつけず、上限・下限・比率などの制約を示して、具体的な値の計算はブラウザに任せる。（`css-as-suggestion`）
- 【推奨】新しい機能を使うときは、最初に対象の Safari で使えるかを確認する。（`check-safari-support-first`）
- 【禁止】対象のブラウザの一部が対応していないレイアウトの機能を、レイアウトの要として使わない。（`no-unsupported-layout-features`）
- 【推奨】フォールバックは、新しいプロパティならそのまま書き、`var()` を含まない新しい値なら従来の宣言を前に書くか `@supports` の中に書き、`var()` を含む宣言と、ほかの宣言もまとめて切り替える宣言は必ず `@supports` の中に書く。（`fallback-method-by-invalidation`）
- 【必須】JavaScript で表示を切り替える前提のスタイル（表示する前の状態として要素を隠すなど）は、`@media (scripting: enabled)` の中に書き、さらに初期化に成功した JavaScript が付ける属性を条件にする。（`scripting-for-js-dependent-styles`）
- 【禁止】ブロックレイアウトの要素に、`justify-self` や `justify-items` を指定しない。（`no-justify-self-in-block-layout`）

## 第2章 CSS設計の考え方（references/02-design-mindset.md）

- 【必須】宣言はひとつひとつ、なぜ必要かを説明できるものだけを書く。（`explainable-declarations`）
- 【禁止】ブロックレベルの要素や、`inset: 0` で広げた絶対配置の要素に、`width: 100%`（`inline-size: 100%`）を指定しない。（`no-redundant-width-100`）
- 【非推奨】CSS の初期値、ブラウザのデフォルトスタイル、リセット CSS、ベーススタイルで決まっている値を、理由なく指定し直さない。（`no-redundant-defaults`）
- 【推奨】サブプロパティの一部だけを変えるときは、ショートハンドではなくロングハンドで書く（`background` ではなく `background-color` など）。（`longhand-for-partial-change`）

## 第4章 カスケードを制御する（references/04-cascade.md）

- 【禁止】詳細度や読み込み順の競争に勝つ目的で `!important` を使わない。（`no-important-for-specificity`）
- 【非推奨】プロパティをまとめて戻すときに `all: unset` を使わず、レイヤーを使うなら `all: revert-layer`、使わないなら `all: revert` を指定する。（`no-all-unset`）
- 【禁止】ID セレクタでスタイルを指定しない。（`no-id-selector`）
- 【禁止】上書きのために、`.a.a`、`.a[class]`、`.a:not(#_)` のような詳細度を上げるためだけのセレクタや、祖先やタイプセレクタを足したセレクタを書かない。（`no-specificity-hacks`）
- 【必須】`@layer` を使えない場合に限り、ベーススタイルのセレクタを `:where()` で包み、詳細度を 0 にする（例：`:where(a:any-link)`）。（`where-for-base-selectors`）
- 【必須】レイヤーの順序は、読み込むCSSの先頭で `@layer tokens, reset, base, vendors, compositions, pages, components, patterns, utilities;` と宣言する。（`layer-order-declaration`）
- 【必須】`@import` は、フレームワークや PostCSS のプラグインなどでビルド時に展開し、ブラウザで実行させない。（`import-resolved-at-build`）
- 【必須】CMS のように、レイヤーに入っていない外部のCSSと共存する環境では `@layer` を使わず、9つの分類はディレクトリ構成と `@import` の順番で保つ。（`no-layers-with-unlayered-css`）
- 【必須】コンポーネントのスタイルは、`@scope (.scoped.<名前>) to (.scoped)` の中に書く。（`scope-with-donut`）
- 【推奨】ネストしたセレクタの意味と詳細度は、`&` を親のセレクタリストを包んだ `:is()` に置き換えて確かめ、Sass の展開結果として読まない（`.news, #pickup { & ._title {} }` は `:is(.news, #pickup) ._title`）。（`nesting-read-as-is`）

## 第5章 擬似クラスと擬似要素（references/05-pseudo.md）

- 【推奨】状態のセレクタ（`:hover`、`:focus-visible`、`:checked`、`[aria-expanded="true"]`、`[open]` など）は `:where()` で包まず、まとめたいときは `:is()` を使う。（`is-for-state-selectors`）
- 【必須】ブラウザの対応が分かれる擬似クラスをほかのセレクタと並べるときは、カンマで区切った普通のセレクタリストではなく、`:is()` か `:where()` の引数に書く（`:not()` と `:has()` の引数の中では、さらに `:is()` で包む）。（`forgiving-list-for-partial-support`）
- 【推奨】複数の条件を除くときは、`:not(.a):not(.b)` と重ねず、`:not(.a, .b)` のように1つの `:not()` の引数に並べる。（`not-selector-list`）
- 【推奨】「X の中にない要素」は、`&:not(X *)` や `a:not(nav a)` のように祖先を `:not()` の引数の中に書き、`:not(X) a` のように祖先の側を否定しない。（`not-ancestor-in-argument`）
- 【推奨】子孫の状態や有無によって祖先のスタイルを変えるときは、JavaScript で状態のクラスを付けずに `:has()` を使う。（`has-over-state-class`）
- 【推奨】「X を持たない要素」は `:not(:has(X))` で書き、`:has(:not(X))` は使わない。（`not-has-for-absence`）
- 【禁止】`:has()` を、起点のセレクタなしで書かない（`:has(.foo)` や `*:has(.foo)` は使わず、`&:has(> .foo)` や `.card:has(> img)` のように直前に起点を書く）。（`no-unanchored-has`）
- 【推奨】`:has()` の起点は `:root` や `body` ではなくコンポーネントのルートのような狭い要素にし、引数は `>` や `+` で範囲を絞る（例：`&:has(> ._input:checked)`）。（`has-narrow-anchor`）
- 【推奨】クラスや状態で絞った中での順番は `:nth-child(N of S)` で書き、`:nth-of-type()` を代わりに使わない（`._post:nth-of-type(2)` ではなく `:nth-child(2 of ._post)`）。（`nth-child-of-over-nth-of-type`）
- 【推奨】子要素を位置で選ぶのは、縞模様や先頭の数個のように順番そのものが条件になるときに限り、役割の決まった子はタイプセレクタか子クラスで選ぶ。（`select-roles-not-positions`）
- 【推奨】`sibling-index()` と `sibling-count()` は、色相や遅延のように未対応の環境で失われても困らない装飾の値に限って使い、`@supports (z-index: sibling-index())` の中に書いて、外に未対応の環境で使う値を書く。（`sibling-functions-for-decoration`）
- 【推奨】子要素の数で親や兄弟の見た目を変えるときは、`&:has(> :nth-child(3))` のように親を起点にした `:has()` で数え、数えた子要素そのものの見た目を変えるときは、`& > :nth-child(2n + 1):nth-last-child(1)` のように子の側で `:nth-child()` と `:nth-last-child()` を組み合わせる。（`quantity-query-with-has`）
- 【推奨】列数のようなレイアウトの切り替えは `auto-fit` やコンテナサイズクエリで行い、数量クエリは「1件だけなら中央に置く」「最終行の端数を中央に寄せる」のように、子要素の数そのものが条件のときに限って使う。（`quantity-query-for-count-conditions`）
- 【推奨】入力の有無で見た目を変えるときは、入力例を書いた `placeholder` 属性のある入力欄に `:placeholder-shown` を使い、`placeholder` 属性のない入力欄を `:not(:placeholder-shown)` で「入力済み」と判定しない。（`placeholder-shown-with-hint`）
- 【推奨】同じ状態をネイティブの属性と ARIA 属性の両方で表すことがあるときは、`&:is(:disabled, [aria-disabled="true"])` や `&:is(:user-invalid, [aria-invalid="true"])` のように、擬似クラスと属性セレクタをまとめて指定する。（`native-and-aria-state-together`）
- 【推奨】読み取り専用の入力欄の見た目は `&[readonly]` に指定し、`input:read-only` のように、要素の種類を限らずに `:read-only` を使わない。（`readonly-attribute-for-text-field`）
- 【必須】`::placeholder` の文字は `color` で色を指定し、背景とのコントラスト比を 4.5:1 以上にする。`opacity` で薄くしない。（`placeholder-color-contrast`）
- 【推奨】`<details>` と `<dialog>` の開いた状態は `[open]` 属性セレクタで選び、対象のすべてのブラウザが対応するまで `:open` を使わない。（`open-attribute-for-details-dialog`）
- 【必須】`popover` 属性の要素の表示中の状態は `:popover-open` で選び、`[open]`、`:open`、`.is-open` のようなクラスで選ばない。（`popover-open-for-popover`）
- 【推奨】モーダルとして開いたダイアログだけに当てるスタイルは `:modal` で選び、`dialog[open]` で代用しない。（`modal-pseudo-for-modal-styles`）
- 【推奨】`:empty` は、空白や改行が入らないことを確かめた要素にだけ使い、テンプレートや CMS が改行を出力しうる要素の判定に使わない。（`empty-without-whitespace`）
- 【禁止】必須の印、単位、注意書き、副題のように、読み手が知る必要のある文字を、`::before` や `::after` の `content` で入れない（HTML に書く）。（`no-meaningful-generated-content`）
- 【推奨】装飾として文字や記号を生成コンテンツで入れるときは、`content: "→" / ""` のように代替テキストを空にする。（`empty-alt-for-decorative-content`）
- 【推奨】`::marker` に指定するのは `color` と `font-size` だけにし、記号を変える、太くする、アイコンにするといった装飾は、`list-style-type: ""` でマーカーを空にして `::before` で描く。（`marker-color-and-font-size-only`）
- 【推奨】検索結果のページで検索語に付ける目印のように、内容の一部として読み手に伝える強調は `<mark>` で書き、`::highlight()` は、ページ内検索の一致や構文の色分けのように、操作に合わせて描き直す表示に使う。（`mark-over-highlight-for-meaning`）

## 第6章 値と単位（references/06-values.md）

- 【必須】単位は「ユーザーがブラウザの文字サイズを大きくしたとき、この値も一緒に大きくなるべきか」で選び、大きくなるべき値は rem（または em）、そうでない値は px にする。（`unit-by-text-scaling`）
- 【必須】`font-size` は rem（要素の文字サイズに比例させるなら em）で指定し、px を使わない。（`font-size-in-rem`）
- 【推奨】px の値を rem に変換するときは `calc(24 / 16 * 1rem)` のように変換の式で書き、計算した結果（`1.5rem`）を書かない。（`px-to-rem-formula`）
- 【禁止】`html { font-size: 62.5% }` のように、rem の計算を簡単にする目的でルートの文字サイズを変えない。（`no-root-font-size-change`）
- 【必須】`line-height` は単位のない数値で指定する。（`unitless-line-height`）
- 【禁止】`vw`、`vh`、`vi`、`vb`、`vmin`、`vmax` を使わない。（`no-vw-vh`）
- 【推奨】ビューポート単位は、横方向は `svi`、縦方向は `svb` を優先する。（`prefer-svi-svb`）
- 【非推奨】要素の大きさを `dvb`（`dvh`）で指定しない。（`avoid-dvb`）
- 【禁止】文字サイズをビューポート単位だけで決めない（`font-size: 4svi` など）。（`no-viewport-only-font-size`）
- 【必須】文字サイズのように、ユーザーの設定に追従させる値を `clamp()` で書くときは、最小値と最大値を rem にし、推奨値を rem と相対単位（`svi` か `cqi`）の和にする。（`clamp-rem-bounds`）
- 【推奨】`clamp()` の推奨値は、2つの基準の幅とそのときの値から傾きと切片を求めて書き、ジェネレーターが出した数値だけを貼らない。（`clamp-from-slope-intercept`）
- 【推奨】文字サイズを `clamp()` で流体的にするときは、最大値を最小値の2.5倍以内にする。（`fluid-font-size-max-ratio`）
- 【推奨】長さを単位のない数値に変えるときは、`calc(100svi / 1px)` のように単位のついた値で割り（typed arithmetic）、`tan(atan2(長さ, 1px))` で単位を外さない。（`typed-arithmetic-to-unitless`）
- 【必須】`content` 以外のプロパティで `attr()` を使うときは、型と第2引数を書き、その宣言を型付きの `attr()` を条件にした `@supports` の中に書いて、外に未対応の環境で使う宣言を書く。（`typed-attr-fallback`）
- 【推奨】`if()` は、要素自身に定義したカスタムプロパティを `style()` で調べるときにだけ使い、条件1つと `else` の形で書く。（`if-for-own-custom-property`）
- 【必須】`if()` を含む宣言の前に未対応の環境で使う宣言を書き、`if()` には必ず `else` の値を書く。（`if-fallback-and-else`）

## 第7章 レイアウトの仕組み（references/07-layout.md）

- 【推奨】配置が思いどおりにならないときは、値を足したり `position` でずらしたりする前に、その要素がどのレイアウトの方式（通常フロー、Flexbox、Grid、位置指定）の中にあり、どの要素が包含ブロックとスタッキングコンテキストになっているかを確かめる。（`identify-layout-mode-first`）
- 【非推奨】要素を横に並べるために `display: inline-block`（`inline flow-root`）を使わず、親を Flexbox か Grid にして `gap` で間隔を決める。（`no-inline-block-for-rows`）
- 【非推奨】`gap`、`align-items`、`justify-content` のように Flexbox や Grid でだけ働くプロパティを、`display` が `flex` でも `grid` でもない通常フローの要素に書かない。（`no-flex-grid-props-in-flow`）
- 【推奨】`box-sizing` はベーススタイル（kiso.css）の全称セレクタで `border-box` にそろえ、コンポーネントで `box-sizing: border-box` を書き足さない。（`box-sizing-border-box-base`）
- 【推奨】画面幅いっぱいに広げる子要素を持たない要素を、最大幅と左右の `padding` で中央に寄せ、内容の幅を最大幅にそろえるときは、`calc()` で最大幅に `padding` を足さず、`box-sizing: unset` で `content-box` に戻す。（`unset-box-sizing-for-content-max-width`）
- 【推奨】ホバーや選択などの状態で枠線を足すときは、`border-width` を変えず、同じ太さの透明な `border` を最初から置いて色だけを変えるか、`outline` か `box-shadow` で描く。（`box-state-border-without-shift`）
- 【必須】ブロックの左右の中央寄せには、`margin: 0 auto` や `margin: auto` ではなく `margin-inline: auto` を使う。（`margin-inline-auto-centering`）
- 【推奨】要素の幅を中身に合わせるときは、`display: inline-block` や `float` に変えず、`inline-size: fit-content` を指定する。（`box-fit-content-over-display-change`）
- 【推奨】利用できる幅いっぱいに広げる指定が要る要素には、`inline-size: 100%` ではなく、`inline-size: -webkit-fill-available` と `inline-size: stretch` をこの順に書く。（`stretch-over-width-100`）
- 【推奨】子要素の高さを親にそろえるときは、`height: 100%` ではなく、親を grid にして `stretch` に任せる。（`stretch-over-height-100`）
- 【推奨】親の背景や枠線の内側に余白を取るときは、最初の子の `margin-block-start` や最後の子の `margin-block-end` ではなく、親の `padding-block` で作る。（`margin-collapse-padding-for-inner-space`）
- 【推奨】Flexbox のアイテムを中身にかかわらず比率で分けるときは `flex: 1` のように `flex-basis` も0にし、中身の大きさに余りを足して伸ばすときは `flex-grow` だけを指定して、2つを区別する。（`flexbox-basis-zero-for-ratio`）
- 【推奨】フレックスアイテムが縮まずにはみ出すときは、固定の幅を足したり `overflow: hidden` で隠したりする前に、自動の最小幅（`min-inline-size: auto`）が中身の最小幅になっていないかを確かめる。（`flexbox-check-auto-min-size`）
- 【非推奨】フォーカスできる要素や、順番に意味のある要素を並べた Flexbox で、`order` や `row-reverse`・`column-reverse` によって見た目の順番を入れ替えない。（`flexbox-no-visual-reorder`）
- 【推奨】アイテムの数で行数が変わるグリッドでは、`grid-template-rows` で行を決めず、`grid-auto-rows` で暗黙の行の大きさを決める。（`grid-auto-rows-for-item-count`）
- 【非推奨】暗黙の行や列が作られるグリッドで、アイテムを最後まで届かせるために `-1` などの負の線番号を使わない。（`grid-negative-lines-explicit-only`）
- 【非推奨】順序に意味のある要素（フォーカスできる要素、手順、ランキング）を並べた Grid に、`grid-auto-flow: dense` を指定しない。（`no-dense-for-ordered-items`）
- 【推奨】並べたカードの中の見出し、本文、ボタンの位置をそろえるときは、固定の高さや JavaScript ではなく、サブグリッドを使う。（`subgrid-for-aligned-rows`）
- 【推奨】絶対配置の要素を中央に置くときは、`translate: -50% -50%` ではなく、`inset: 0` と `margin: auto` を使う。（`absolute-centering-with-margin-auto`）
- 【必須】Grid や Flexbox の子に `position: sticky` を指定するときは、その要素に `align-self: start` を指定する。（`sticky-align-self-start`）
- 【推奨】ポップオーバーを開くボタンを基準に配置するときは、`anchor-name` で名前を付けず、`popovertarget` や `commandfor` による暗黙のアンカーを使う。（`implicit-anchor-first`）
- 【推奨】`position-area` の値は、`bottom right` のような物理キーワードではなく、`block-end inline-end` のような論理キーワードで書く。（`position-area-logical-keywords`）
- 【必須】アンカーを基準にした配置の指定は `@supports` の中に書き、その外には、未対応の環境でも内容を読めて操作できる配置を書く。ポップオーバーは `margin: revert` で画面の中央に、ポップオーバーではない要素は `position: absolute` ごと `@supports` に入れて通常フローに置く。（`anchor-fallback-placement`）
- 【推奨】`display: contents` は、サブグリッドに参加させるときや、幅によってラッパーの箱を出し入れするときなど、箱をなくす理由があるときだけ使う。画面の幅で並びを変えるだけなら `grid-template` のエリアで組む。（`display-contents-with-reason`）
- 【禁止】ボタンやリンクのようにフォーカスできる要素に、`display: contents` を指定しない。（`no-display-contents-on-focusable`）

## 第8章 リセットとベーススタイル（references/08-reset.md）

- 【禁止】リセットで、`input` への `appearance: none` や `* { margin: 0; padding: 0; }` のように、要素の機能や便利なデフォルトを一律に消す指定をしない。（`reset-no-destructive-reset`）
- 【禁止】フォーカスリングを `box-shadow` だけで描かない。（`focus-ring-not-box-shadow-only`）
- 【禁止】`html` や `:root` に、`scroll-behavior: smooth` を無条件に指定しない。（`no-global-smooth-scroll`）
- 【必須】モーダル表示中の背面のスクロールは、`:root:has(:modal)` に `overflow: hidden` を指定して止める。（`modal-scroll-lock-root`）
- 【禁止】リセットやベーススタイルを、レイヤーの外に、クラス1つで上書きできない詳細度のセレクタ（`a:link, a:visited` など）で書かない。（`no-heavy-specificity-in-global`）
- 【禁止】`outline: none` や `outline: 0` で、フォーカスリングを消さない。（`no-outline-none`）
- 【必須】リストのマーカーは、`list-style: none` ではなく `list-style-type: ""` で消す。（`list-style-type-empty-string`）

## 第9章 記法の規約（references/09-notation.md）

- 【必須】コンポーネントの子要素のクラス名は、`_` で始まる kebab-case にする（例：`._main-link`、`._nav-links`）。（`child-class-underscore`）
- 【推奨】1つの要素に種類の違うクラスを付けるときは、ルート、子要素、コンポジション、パターン、ユーティリティの順に並べ、種類の境目を `|` で区切る（例：`class="_tags | cluster"`）。（`group-classes-with-pipe`）
- 【必須】自分で付けて値として使う名前（`@keyframes`、グリッドの線とエリア、アンカー、スタイルクエリの値）は、`--` で始める。（`dashed-ident-names`）
- 【推奨】クラス名とカスタムプロパティの名前は、単語を省略せずに書く（`._btn` ではなく `._button`、`._ttl` ではなく `._title`）。省略してよいのは、`img` や `nav` のように Web 標準で使われている略語と、`cta` のようにプロジェクトの中で浸透している略語だけにする。（`no-abbreviation`）
- 【必須】`inner`、`outer`、`container` を名前に使うときは、`._section-inner`、`._card-outer`、`._list-container` のように、必ず「何の」を併記する（`._inner` だけにしない）。（`inner-outer-names`）
- 【必須】コンテンツの外縁と画面の端のあいだのインライン方向の余白は `gutter`、子要素どうしの間隔は `gap` と呼び、取り違えない（列の間隔を `gutter` と呼ばない）。（`gutter-vs-gap`）
- 【必須】`columns` の語は段組み（マルチカラム）の配置にだけ使い、Flexbox や Grid の列には使わない。（`columns-for-multicol`）
- 【推奨】サイトの中を移動する導線は `navigation`（または `nav`）、操作を実行したり選んだりする選択肢の一覧は `menu` と呼ぶ。（`navigation-not-menu`）
- 【推奨】クラス名に番号を使わない（`._card-1` と `._card-2` ではなく、役割の名前、`data-variant` のような属性、`:nth-child()` で区別する）。（`no-numbers-in-class-names`）
- 【必須】要素自身の擬似クラス・擬似要素・属性の状態は、主語のセレクタに連結せず（`[popover]:popover-open`、`._link::after`）、主語のルールの中に `&:popover-open` のようにネストして書く。（`nest-own-states`）
- 【禁止】`&__title` や `&--large` のように、`&` に文字をつなげてクラス名を作らない。（`no-nesting-concatenation`）
- 【必須】`@media` と `@container` は、`@scope` やファイルの直下に置かず、各セレクタの中に書く。（`conditions-inside-rules`）
- 【必須】`display` は、`block flex` や `inline flow-root` のような2値構文で書く。（`display-two-value-syntax`）
- 【推奨】移動、回転、拡大・縮小は、`transform` の関数ではなく、`translate`、`rotate`、`scale` の個別のプロパティで書く。（`individual-transform-properties`）
- 【必須】色の関数の値はカンマではなくスペースで区切り、不透明度は `/` の後ろにパーセントで書く（`rgb(0 0 0 / 80%)`）。（`color-space-separated`）
- 【禁止】`rgba()` と `hsla()` を使わず、`rgb()` と `hsl()` に統一する。（`no-rgba-hsla`）
- 【推奨】寸法、余白、位置、ボーダーは、物理プロパティではなく論理プロパティで書く（`width` ではなく `inline-size`、`top` ではなく `inset-block-start`）。（`logical-properties`）
- 【必須】コードの途中のコメントには「なぜそう書くのか」と「なぜ別の書き方をしないのか」だけを書き、コードが何をしているかは書かない。（`comments-why-only`）

## 第10章 コンポーネントとカスタムプロパティ（references/10-components.md）

- 【推奨】コンポーネントにするかは、繰り返し使うか、全インスタンスで HTML の構造・クラス・ARIA 属性・data 属性・条件分岐・JavaScript の振る舞いを制御したいか、既知の要件として構造の拡張があるか、の順に判定する。（`component-decision-tests`）
- 【非推奨】見た目が共通だという理由だけで、コンポーネントを作らない（段落、区切り線、単純な見出し、見た目だけをまとめた wrapper はコンポーネントにしない）。（`no-component-for-look-only`）
- 【推奨】親の中でしか意味を持たない区画（カードの見出し、本文、フッター、内側を包む要素など）は、別のコンポーネントにせず、親の `@scope` の中でタイプセレクタか子クラスで選ぶ。（`local-parts-stay-in-parent`）
- 【必須】コンポーネントの CSS は、コンポーネントごとに1つのファイルに書き、複数のコンポーネントの CSS を1つのファイルに混ぜない。（`one-component-per-file`）
- 【非推奨】コンポーネントのルートに、外部関連型のレイアウト（`margin`、`position: absolute` と `inset`、`flex`、`grid-area`、`align-self`、`inline-size`、`block-size` など）を指定しない。（`no-external-layout-on-root`）
- 【推奨】`@scope` の中の要素はタイプセレクタで選び、子クラスは同じ種類の要素を役割で区別するときと、`div` と `span` に役割を示すときだけ付ける（`._list` や `._link` のように要素の種類と同じ意味のクラスを付けない）。（`type-selector-in-scope`）
- 【推奨】子要素のクラスの下にある要素を、子孫結合子のタイプセレクタ（`._summary p`）で選ばない。同じ種類の要素を領域ごとに変えたいときは、その要素にクラスを付ける。（`no-type-under-child-class`）
- 【禁止】ほかのコンポーネントのルートや内部の要素を、セレクタで選んで見た目を上書きしない。（`no-other-component-internals`）
- 【必須】z-index の値は、数値を直接書かずにトークンで指定する。（`z-index-tokens-only`）
- 【必須】内部の要素で相対的な z-index を使うコンポーネントは、ルートに `isolation: isolate` を指定する。（`isolation-for-relative-z-index`）
- 【推奨】パターンには、重ねるコンポーネントが指定しないプロパティだけを書き、コンポーネントの側で変える値は `--<パターン>--<プロパティ>` の公開プロパティで受け取る。（`pattern-leaves-component-properties`）
- 【必須】トークンは `--<分類>--<名前>` の形で名付ける（例：`--color--neutral--500`、`--spacing--md`）。（`token-naming-category-first`）
- 【推奨】トークンとして定義されている値は、数値や色を直接書かずにトークンを参照する。（`use-defined-tokens`）
- 【必須】外から変えてよい値は、`--<コンポーネント>--<プロパティ>` の公開プロパティにする（例：`--card--radius`）。（`public-property-naming`）
- 【必須】コンポーネントの中だけで使う値は、`--_` で始まる内部プロパティにする。（`internal-property-prefix`）
- 【必須】公開プロパティはコンポーネント自身では宣言せず、`:scope` で内部プロパティに受けて、デフォルト値を `var()` のフォールバックに書く。（`receive-public-property-with-fallback`）
- 【推奨】公開プロパティの値は、できるだけ呼び出し側の `style` 属性で渡す。（`pass-values-via-style-attribute`）
- 【必須】コンテナサイズクエリ（`@container --scoped (…)`）は、コンポーネントの中で、フラグを宣言する1つの要素のルールだけに書く。その要素はクエリの外で `--_density: --compact` をデフォルト値として宣言してクエリの中で `--_density: --spacious` に切り替え、ほかの子孫は `@container style(--_density: --spacious)` で切り替える。（`density-via-style-query`）
- 【必須】親や自身のホバーとフォーカスで子要素や擬似要素の見た目を変えるときは、`--_hocus: --false` をデフォルト値として宣言し、`&:any-link:hover`（`@media (any-hover)` の中）と `&:focus-visible` で `--_hocus: --true` に切り替え、子要素と擬似要素は `@container style(--_hocus: --true)` で切り替える。（`hocus-via-style-query`）
- 【必須】スタイルクエリで問い合わせるフラグの値は、`--compact` のような `--` で始まる識別子にし、オンとオフの2値の状態は `--true` と `--false` にそろえる。（`state-flag-values`）
- 【推奨】カスタム要素で作る部品は、カスタム要素そのものに `scoped` クラスを付けてルートにし、CSS は外部のファイルに `@scope (<要素名>.scoped) to (.scoped)` の形で書く。（`custom-element-as-scope-root`）
- 【必須】カスタム要素のルートには、`display: block flow` のように `display` を明示する。（`custom-element-root-display`）
- 【推奨】JavaScript がなくても動く HTML（`popover` 属性、`<dialog>` と `command` 属性など）を先に作り、カスタム要素は振る舞いを足すだけにする。（`custom-element-enhances-html`）
- 【推奨】ページから子要素を受け取る部品は Light DOM で作り、Shadow DOM は中身をすべて自分で描く部品に限って使う。（`light-dom-for-received-children`）
- 【推奨】Shadow DOM の中では、ページのトークンをカスタムプロパティで参照し、kiso.css のリセットやユーティリティに頼っていた指定は中に書く。（`shadow-dom-restate-page-styles`）

## 第11章 レイアウトを組む（references/11-layout-practice.md）

- 【推奨】レイアウトを組むときは、まず親の `grid-template` で子要素の配置と大きさを決められないかを検討する。（`grid-template-first`）
- 【推奨】縦に積む要素の間隔が、前後の要素の種類や有無によって変わるときは、Flexbox や Grid にせず、通常フローのまま次兄弟結合子で選んだ要素の `margin-block-start` で間隔を作る。（`normal-flow-for-conditional-spacing`）
- 【推奨】Flexbox や Grid の子要素の間隔は、子要素の `margin` ではなく、親の `gap` で作る。（`gap-over-child-margin`）
- 【必須】要素の間のブロック方向の `margin` は、`& > * + *` や `& > :is(:heading, h1, h2, h3, h4, h5, h6) + *` のように、次兄弟結合子で前の要素を条件にしたセレクタで選び、後ろの要素の `margin-block-start` に指定する。（`block-margin-with-sibling-combinator`）
- 【推奨】要素の高さは `block-size` で固定しない。一定の高さが要るときは `min-block-size` で下限を、上限が要るときは `max-block-size` で上限を決め、縦横比が決まっている要素（画像、動画、擬似要素で描くアイコンなど）は `aspect-ratio` で決める。（`min-block-size-over-fixed-height`）
- 【必須】`minmax()` の最小値や `min-inline-size` に固定の長さを書くときは、`min(100%, …)` で親の幅を上限にする。（`minmax-min-capped-at-100-percent`）
- 【推奨】列を均等や比率で分けるときは、`minmax(0, 1fr)` ではなく `1fr` と書く。（`fr-without-minmax-zero`）
- 【推奨】Flexbox で要素を並べるときは、`flex-wrap: wrap` を既定にし、`nowrap` のままにするのは1行に収める理由がある並びだけにする。（`flex-wrap-for-variable-items`）
- 【非推奨】明確な理由がない限り、`white-space: nowrap` を指定しない。（`no-nowrap-without-reason`）
- 【必須】はみ出しを切り取るだけなら、`overflow: hidden`（`overflow-x: hidden`）ではなく `clip` を使う。（`overflow-clip-over-hidden`）
- 【推奨】スクロールさせる要素の中身を `justify-content` や `align-content` で中央に寄せるときは、`safe center` と書く。（`safe-center-for-scrollable`）
- 【推奨】要素を重ねるときは、`position: absolute` の前に、Grid の同じエリアに置く方法を検討する。（`grid-stack-before-absolute`）
- 【推奨】重なり順がおかしいときは、z-index の値を大きくする前に、どのスタッキングコンテキストの中で比べられているかを確かめる。（`check-stacking-context-first`）
- 【推奨】Flexbox と Grid の子の重なり順を変えるだけなら、`position: relative` を足さずに z-index を指定する。（`z-index-on-items-without-position`）
- 【必須】親の幅を超えて画面の端まで広げる量は、`calc((100lvi - 100%) / -2)` のように「画面の幅と親の幅の差の半分」の式で書き、`100vw` や `calc(50% - 50vw)` を使わない。（`full-bleed-offset-formula`）
- 【推奨】ヘッダーを固定するときは、`@media (height >= calc(600 / 16 * 1rem))` のように、ビューポートの高さが十分なときだけ固定する。（`sticky-header-height-query`）
- 【推奨】`sticky` の要素が留まっている間だけ見た目を変えるときは、`scroll` イベントではなく `container-type: scroll-state` と `@container scroll-state(stuck: …)` を使い、変える内容は見えなくても操作に困らない装飾に限る。（`scroll-state-for-sticky-styles`）
- 【推奨】ページ全体のスクロールはビューポート（ルートスクローラー）に任せ、`html`、`body`、ページ全体を包むラッパーをスクロールコンテナにしない。（`root-scroller-for-page-scroll`）
- 【非推奨】`html` と `body` に `height: 100%` を指定しない。画面の高さが必要なら、ページのレイアウトの要素に `min-block-size: 100svb` で最小値を決める。（`root-scroller-no-fixed-root-height`）
- 【推奨】`display: block grid-lanes` は `@supports (display: block grid-lanes)` の中に書き、その外には通常の Grid（`display: block grid`）と同じ `grid-template-columns` を書く。（`grid-lanes-inside-supports`）
- 【推奨】上から下へ読む1つのリストを段に分けるときは `columns` を使い、項目に `break-inside: avoid` を指定して、間隔は `margin` ではなく `padding-block` で空ける。（`columns-for-top-to-bottom-lists`）
- 【必須】`grid-template-areas`、`flex-direction: row-reverse | column-reverse`、`flex-wrap: wrap-reverse`、`grid-auto-flow: dense` を書いたルールには、同じルールに `reading-flow` を指定する。（`reading-flow-when-reordered`）
- 【必須】`order` と `reading-order` の値には、`1` か `-1` だけを使う。（`order-one-or-minus-one`）
- 【推奨】文字に添えるアイコンは Grid か Flexbox で文章と並べ、`position: absolute` で重ねない。（`icon-grid-over-absolute`）
- 【必須】文章が折り返すおそれのある行頭や行末のアイコンは、`margin-block: calc((1lh - アイコンの大きさ) / 2)` で1行目の中央に置き、`align-items: center` で項目全体の中央に置かない。（`icon-first-line-with-lh`）
- 【必須】中身の構造が決まらず Grid や Flexbox にできないアイコンを `float` や `position: absolute` で置くときは、位置を `calc()` の式で書き、何の値から決めたかを残す。（`out-of-flow-icon-position-calc`）
- 【推奨】文章の角に置く要素（モーダルの閉じるボタン、右上の装飾の画像など）は、`position: absolute` ではなく `float` で置き、文章を回り込ませる。（`float-for-corner-elements`）
- 【推奨】表は置かれた場所の幅に合わせて縮めず、`min-inline-size` で最小の幅を決め、表を包む要素に `overflow-x: auto` を指定して、それより狭い場所では横にスクロールさせる。（`table-min-size-with-scroller`）
- 【必須】スクロールのラッパーで包んだ表の列の見出しを `position: sticky` で留めるときは、ラッパーに `max-block-size` を指定して、ラッパーの中で縦にスクロールさせる。（`sticky-table-header-needs-block-limit`）
- 【必須】表の見出しのセルを `position: sticky` で留めるときは、表に `border-collapse: separate` と `border-spacing: 0` を指定し、枠線を各セルに持たせる。（`table-sticky-border-separate`）
- 【推奨】数値の列のセルは、列の見出しのセルも含めて `text-align: end` で末尾に揃え、表に `font-variant-numeric: tabular-nums` を指定する。（`numeric-cells-tabular-end`）
- 【推奨】1行で打ち切るときは、`text-overflow: ellipsis` に `white-space: nowrap` と `overflow-inline: clip` を組み合わせる。（`ellipsis-with-nowrap-and-clip`）
- 【禁止】金額、数量、日付、型番のような数値を、`text-overflow` や行数の制限で切り詰めない。（`no-truncate-numbers`）
- 【推奨】読み込み中の表示（スケルトン）は読み込み後の内容と同じ寸法にし、画像の枠は `aspect-ratio`、文字の行は `lh` 単位で場所を取る。（`skeleton-matches-final-size`）

## 第12章 レイアウトコンポジション（references/12-compositions.md）

- 【推奨】構成が決まっていて、間隔を一律にしてよい要素を縦に積むときは `stack` を、見出しや段落、図が続き、子ごとに間隔を変えたい本文の流れには `prose` を使う。（`stack-vs-prose`）
- 【推奨】`stack` の一部の間隔だけを変えたいときは、子に `margin` を足さず、近い要素を `stack` で包んで入れ子にするか、`grid-template` の空のセルに切り替える。（`stack-uneven-gaps`）
- 【推奨】`stack` の子のうち、ボタンやリンクのように中身の幅で見せたい要素には、置く側の CSS で `align-self: start` を指定する。（`stack-align-self-start`）
- 【推奨】子を両端に分けて置くときは、`cluster` に `--cluster--justification: space-between` を渡さず、`apart` を使う。（`cluster-apart-for-two-ends`）
- 【推奨】`apart` は役割の違う2つのまとまりを両端に分けるときに使い、片側に複数の要素を置くときは1つの要素に包む。（`apart-for-two-groups`）
- 【必須】`switcher` の列の幅の目安は「（100% − 列の間隔 ×（列数 − 1））÷ 列数」で計算する。（`switcher-preferred-width-formula`）
- 【必須】閾値などの `calc()` で長さと足し合わせる間隔のデフォルト値は、単位のない `0` ではなく `0px` と書く。（`switcher-gap-default-with-unit`）
- 【必須】`sidebar` の直接の子は2つだけにし、それぞれに `.main-column` と `.side-column` を付ける。（`sidebar-two-direct-children`）
- 【推奨】`sidebar` のサイドを左右どちらに置くかは HTML の順番で決め、`flex-direction: row-reverse` や `order` で見た目だけを入れ替えない。（`sidebar-side-position-by-source-order`）
- 【推奨】同じ形のアイテムを並べる一覧で列の数に上限があるときは、メディアクエリで列数を切り替えず、`grid` の `--grid--column-min-width` と `--grid--column-max-count` で列の最小幅と最大数を渡す。（`grid-max-count-over-queries`）
- 【必須】`grid` の列の間隔には、`0` を渡すときも `0px` のように単位の付いた長さを渡す。（`grid-gap-with-unit`）
- 【推奨】`columns` コンポジションの直下には段に分けるリストを1つだけ置き、見出しなどはその外に置く。（`columns-single-list-child`）
- 【推奨】`masonry` コンポジションの `--masonry--tolerance` のデフォルト値は `flow-tolerance` の初期値と同じ `normal` にし、項目が左右へ飛んで見えるときだけ `3em` のような大きめの長さを渡す。（`masonry-tolerance-default-normal`）
- 【推奨】`pile` の子の位置を変えるときは、`--pile--placement` などの公開プロパティを、`.pile` ではなく動かしたい子の `style` 属性で渡す。（`pile-placement-on-target-child`）
- 【推奨】`pile` で画像の上に文字を重ねるときは、文字と画像の間に暗い層を置き、どの画像でも文字のコントラスト比が保たれるようにする。（`pile-scrim-for-text-on-image`）
- 【推奨】`primary-layout` の子の幅は、子に最大幅や負の `margin` を書かず、`full-column` などのクラスか `grid-column: --wide` のような線の名前で選ぶ。（`primary-layout-width-by-line-names`）
- 【必須】中央の列の最大幅は、コンテンツ幅の最大値から、その両側に足す列の上限を2本分引いて求める（`var(--_c--content-max-width) - var(--_c--narrow-reduction) * 2`）。（`primary-layout-center-column-subtract-both-sides`）
- 【推奨】`prose` の中で特定の間だけ間隔を変えるときは、`margin` を足さず、その間の後ろにある子に `--prose--space` を渡す。（`prose-space-on-following-child`）
- 【必須】`prose` の `--prose--space` はルートで内部プロパティに受け直さず、子要素の `margin-block-start` の `var()` で直接参照する。（`prose-no-internal-property`）

## 第13章 レスポンシブデザイン（references/13-responsive.md）

- 【必須】レスポンシブ対応は「静的 → イントリンシック → コンテナサイズクエリ → メディアクエリ」の順に検討し、上の段階で解決できるなら下の段階を使わない。（`responsive-escalation-order`）
- 【推奨】幅は固定値ではなく `max-inline-size` で上限を決め、固定値が必要なときは `min(100%, …)` ではみ出しを防ぐ。（`max-inline-size-over-fixed-width`）
- 【禁止】`sp`、`tablet`、`pc` のようにデバイスを連想させる名前を、ブレイクポイントやクラス名（`.sp-only` など）に使わない。（`no-device-names`）
- 【必須】ブレイクポイントは rem で指定し、`calc(640 / 16 * 1rem)` のようにピクセル値からの変換を式で書く。（`breakpoint-in-rem`）
- 【推奨】クエリの閾値は、「列の最小幅×列数＋隙間×隙間の数」や「中身の幅＋`padding`＋`border`」のように、レイアウトが成り立つ条件を `calc()` の式で書く。（`threshold-as-formula`）
- 【必須】閾値の式には、レイアウトが成り立つ条件に関わる `gap`、`padding`、`border` を省かずに含める。（`threshold-includes-gap-and-padding`）
- 【禁止】`@media` の条件と、コンテナサイズクエリの条件の中で `var()` を使わない。（`no-var-in-query`）
- 【必須】コンポーネントのルートをコンテナにするときは `container: --scoped / inline-size` と書いて `@container --scoped (…)` で問い合わせ、ルート以外の子要素をコンテナにするときはクラス名から下線を除いた名前（`._body` なら `--body`）を付ける。外側のコンポーネントのコンテナは問い合わせない。（`container-name-required`）
- 【必須】コンテナの名前は `--` で始める（例：`--scoped`、`--body`）。（`container-name-dashed-ident`）
- 【必須】コンテナサイズクエリの条件では、`width` ではなく `inline-size` を使う。（`container-query-inline-size`）
- 【非推奨】`zoom` による縮小は最後の手段にとどめ、使うときは、ルートの直下で中身を包む要素に `@container --scoped (inline-size < 最小幅)` の条件を付けて、`zoom: min(progress(100cqi, 0px, 最小幅), 1)` と書く。（`zoom-as-last-resort`）
- 【非推奨】`container` は、コンテナサイズクエリか `cqi` で実際に問い合わせる要素にだけ指定し、「とりあえず」すべてのルートや要素に付けない。（`no-container-just-in-case`）
- 【必須】`cqi` は、名前付きのコンテナがあると言い切れる子孫の要素でだけ使う。（`cqi-needs-named-container`）
- 【必須】メディアクエリとコンテナサイズクエリの条件は範囲構文（`>=` や `<`）で書き、`min-width` や `max-width` の書き方は使わない。（`query-range-syntax`）
- 【禁止】`device-width`、`device-height`、`device-aspect-ratio` をメディアクエリの条件に使わない。幅は `width` で判定する。（`no-device-width-feature`）
- 【推奨】操作の手段に合わせて変える指定は、画面の幅ではなく `@media (any-pointer: fine)` や `@media (any-pointer: coarse)` で判定する。（`any-pointer-not-width-for-input`）
- 【推奨】375px 未満の画面でもカンプの配置を保つ要件があるときに限り、`<meta name="viewport">` の直後にインラインで置いたスクリプトで、`content` を `width=375` に書き換え、ビューポートの幅を固定する。要件がなければ固定せず、自然に折り返した表示にする。（`fixed-viewport-below-min-width`）
- 【禁止】カンプの幅に対する比率で、ページ全体の文字サイズや余白を拡大・縮小しない（フルリキッドにしない）。（`no-full-liquid-scaling`）
- 【推奨】ヒーローのように幅に合わせて拡大・縮小させたい局所は、その部分を名前付きのコンテナにして `cqi` で組み、ビューポート単位を使わない。（`local-liquid-with-cqi`）
- 【必須】`<meta name="viewport">` に `viewport-fit=cover` を指定したら、文字やボタンを `env(safe-area-inset-*)` で確保した範囲の内側に置き、上下左右と横向きの画面で確認する。（`safe-area-inset-with-viewport-fit-cover`）
- 【推奨】セーフエリアの値は単独で余白にせず、左右のガターや端に接するバーの余白は `max(16px, env(safe-area-inset-left))` のように通常の余白と比べ、端から浮かせる要素の位置は `calc(16px + env(safe-area-inset-bottom))` のように足す。（`safe-area-combine-with-max`）
- 【必須】画面の下端に `position: fixed` で固定するバーやボタンには、`env(safe-area-inset-bottom)` を加える。（`safe-area-fixed-bottom`）

## 第14章 タイポグラフィと和文組版（references/14-typography.md）

- 【推奨】デザインで特に指定がなければ、`font-family` は総称ファミリーの `sans-serif` だけにする。（`font-family-sans-serif`）
- 【非推奨】日本語のサイトでは、`font-family` に `system-ui` を使わない。（`no-system-ui-for-japanese`）
- 【非推奨】和文を含む要素に `font-size-adjust` を指定しない。（`no-font-size-adjust-for-japanese`）
- 【推奨】カウンター、価格、タイマーのように表示したまま値が変わる数字には、`font-variant-numeric: tabular-nums` を指定する。（`tabular-nums-for-changing-numbers`）
- 【非推奨】和文の本文に `font-feature-settings: "palt"` やカーニングを指定せず、ベタ組みにする。（`solid-setting-for-body-text`）
- 【禁止】`line-height: 1` を指定しない。（`no-line-height-one`）
- 【推奨】文字色は、重要度の段階を表す不透明なセマンティクスのトークンから選び、`opacity` や半透明の色で文字を薄くしない。（`two-text-colors`）
- 【非推奨】和文には `text-wrap: pretty` を指定しない。（`no-text-wrap-pretty-for-japanese`）
- 【推奨】`word-break` は初期値のままにし、長い単語や URL のはみ出しは `overflow-wrap: anywhere` で防ぐ。（`overflow-wrap-over-word-break`）
- 【非推奨】見た目を整えるための改行に `<br>` を使わない。（`no-br-for-visual-breaks`）
- 【推奨】行数を制限するときは、`-webkit-line-clamp` に `display: -webkit-box` と `-webkit-box-orient: block-axis` を組み合わせ、はみ出しは `overflow-block: clip` で隠す。（`line-clamp-with-overflow-clip`）

## 第15章 色（references/15-color-media.md）

- 【推奨】色のトークンと色の値は、`oklch()` で定義する。（`oklch-for-colors`）
- 【推奨】透過させた色や明度を変えた色は元の色から作り、そのためのトークンや RGB の値を別に用意しない。（`derive-colors-from-base`）
- 【推奨】画像の上に文字を載せる部品で、画像が表示されなかった場合に備える背景色は、文字色から決める。`background-color: oklch(from currentColor sign(0.7 - l) 0 h)` を先に書き、続けて `background-color: contrast-color(currentColor)` で上書きする。（`contrast-color-for-image-fallback`）
- 【推奨】ダークモードの色はセマンティクスのトークンに `light-dark()` で持たせ、コンポーネントに `prefers-color-scheme` のメディアクエリを書かない。（`light-dark-in-semantic-tokens`）
- 【必須】コンポーネントに `color-scheme` を指定するときは、同じ要素で `color` と `background-color` をセマンティクスのトークンで指定し直す。（`redeclare-colors-with-color-scheme`）
- 【必須】枠線を消すときは、`border: none` ではなく `border-color: transparent` で透明にする。（`transparent-border-over-none`）
- 【必須】`mask-image` や `clip-path` で切り抜き、`background-color` で塗る図形は、`currentColor` を直接指定せず、強制カラーモードでシステムカラーに切り替わるカスタムプロパティ（`--background-current`）から色を受け取る。（`background-current-for-shapes`）
- 【必須】本文の中のリンク、フォーカスやホバーの状態、入力エラーのような情報を、色の違いだけで伝えない。（`no-color-only-information`）
- 【必須】文字と背景のコントラスト比は、WCAG 2.1 の AA（通常の文字で 4.5:1 以上、大きな文字で 3:1 以上）を満たす。（`text-contrast-aa`）

## 第16章 画像・装飾（references/16-decoration.md）

- 【必須】`<img>` には、画像の実際の大きさを `width` と `height` の属性で書く。（`img-width-height-attributes`）
- 【推奨】背景に写真を敷くときは、`background-image` ではなく、`object-fit` を指定した `<img>` を本文と同じグリッドのエリアに置く。（`img-over-background-image`）
- 【禁止】ファーストビューに表示される画像に、`loading="lazy"` を指定しない。（`no-lazy-loading-first-view`）
- 【推奨】`<img>` に `decoding="async"` を指定せず、デフォルトの `auto` に任せる。（`no-decoding-async`）
- 【推奨】三角形などの図形は `border` の組み合わせではなく `clip-path` で描き、`polygon()` の値は `--shape--triangle-bottom` のようなトークンにする。（`clip-path-shape-tokens`）
- 【推奨】ダークモードでは、高い面ほど背景を明るくし、面の高さを影だけで表さない。（`lighter-surface-in-dark-mode`）
- 【推奨】行ごとに背景や枠線を敷く装飾は、インラインの要素に `-webkit-box-decoration-break: clone` と `box-decoration-break: clone` を併記して描く。（`inline-decoration-clone-with-prefix`）
- 【推奨】`corner-shape` は、無視されても角丸のまま崩れない宣言ならそのまま書き、`scoop` の擬似要素のように未対応の環境で形が崩れる指定だけを `@supports (corner-shape: …)` の中に書く。（`corner-shape-guard-when-broken`）
- 【推奨】画面いっぱいのときだけ角丸を消すときは、`calc(sign(100lvi - 100% - 許容幅) * 半径) / 半径` のように、要素の幅とビューポートの幅を比べて水平方向の半径だけを切り替える。（`full-bleed-radius-with-sign`）
- 【推奨】`background-clip: border-area` の透明な枠線のように、未対応の環境で宣言ごと無効になって何も描かれなくなる指定は `@supports` の中に書く。（`guard-new-shapes-with-supports`）
- 【推奨】グラデーションの枠線は `background-clip: border-area` で描いて未対応の環境では単色の枠線に戻し、どの環境でもグラデーションが必要なときだけ、擬似要素の透明な枠線にグラデーションを敷いて `mask-composite: exclude` で内側をくり抜く。（`gradient-border-method`）
- 【推奨】吹き出しのように枠線を輪郭に沿わせる形は、`shape()` を1つのカスタムプロパティに入れて `clip-path` と `border-shape` で共有し、`border` と `border-shape` は `@supports (border-shape: …)` の中に書く。（`shared-shape-for-border-shape`）
- 【推奨】並んだ要素の間の区切り線は、各要素の `border` ではなく、要素の間の `gap` に描く。（`separators-in-gap`）
- 【非推奨】区切り線のために各要素に `border` を付け、`:last-child` や `:nth-child()` で末尾の要素の `border` を打ち消さない。（`no-last-child-border-reset`）
- 【必須】gap decorations の対応を `@supports` で判定するときは、`column-rule` ではなく `column-rule-inset` のような gap decorations で加わったプロパティを条件にする。（`gap-decorations-supports-condition`）

## 第17章 インタラクション（references/17-interaction.md）

- 【必須】ホバーのスタイルは、リンクなら `&:any-link:hover`、ボタンやフォームのコントロールなら `&:enabled:hover` のように操作できる状態に限定し、`@media (any-hover)` の中に書く。（`hover-operable-in-any-hover`）
- 【必須】ホバーで変える見た目は、`:focus-visible` にも同じように指定する。（`hover-with-focus-visible`）
- 【非推奨】ホバーやフォーカスの変化を `opacity` で表さない。（`no-opacity-for-hover`）
- 【推奨】状態のスタイルは、`.is-active` のような状態クラスを使わず、擬似クラス（`:disabled` など）、HTML 要素の属性（`target` など）、ARIA 属性（`aria-expanded` など）、`data-*` 属性の優先順位でセレクタを選ぶ。（`state-by-pseudo-class-or-aria`）
- 【推奨】開閉する UI は、`<dialog>`、`popover` 属性、`<details>`、`hidden="until-found"` のような HTML の機能で作り、`div` とクラスの付け外しで作らない。（`native-disclosure-elements`）
- 【推奨】`<dialog>` のモーダルにできないドロワーで背面を操作できなくするときは、`interactivity: inert` ではなく、JavaScript で背面の要素に `inert` 属性を付ける。（`inert-attribute-for-background`）
- 【推奨】タブやアコーディオンの閉じたパネルは `hidden="until-found"` で隠し、`display: none` で隠さない。（`hidden-until-found-for-panels`）
- 【必須】開閉するパネルは初期のHTMLでは隠さず、開閉の処理の初期化が成功してから JavaScript で隠す。（`hide-panels-after-init`）
- 【推奨】チェックボックスやラジオボタンの見た目を作り直すときは、`input` 自体に `appearance: none` を指定して描き、`input` を隠して別の要素で描かない。（`style-input-directly`）
- 【推奨】入力エラーの見た目は、`:invalid` ではなく `:user-invalid` に指定する。（`user-invalid-for-errors`）
- 【推奨】入力欄の文字サイズは `1rem`（16px 相当）以上にする。（`input-font-size-min-1rem`）
- 【禁止】入力欄での拡大を防ぐために、`<meta name="viewport">` の `maximum-scale` や `user-scalable=no` でズームを止めない。（`no-maximum-scale`）
- 【禁止】カルーセルを自動で再生しない。（`no-autoplay-carousel`）
- 【必須】`::scroll-button()`、`::scroll-marker`、`scroll-marker-group`、`scrollbar-width: none` は、`@supports selector(::scroll-button(*))` などの中に書く。（`carousel-controls-in-supports`）

## 第18章 モーション（references/18-motion.md）

- 【禁止】キーボードショートカットで開閉する UI（コマンドパレットなど）に、出現と退場の動きを付けない。（`no-motion-on-keyboard-shortcut`）
- 【必須】装飾的な動きのうちフェード以外は `@media (prefers-reduced-motion: no-preference)` の中で指定する。（`motion-only-with-no-preference`）
- 【必須】機能的な動きでも大きな変動は、動きを減らす設定のときにフェードへ置き換える。（`simplify-large-motion-when-reduced`）
- 【必須】拡大して現れる動きは `scale: 0` から始めず、ツールチップとポップオーバーは0.95〜0.98、ドロップダウンメニューは0.92〜0.96、ダイアログやドロワーは0.85〜0.92から始め、`transform-origin` をトリガーのある側に向ける。（`scale-in-from-near-one`）
- 【非推奨】UI の出現、退場、移動に、`ease-in` や `in` 系のイージング（だんだん速くなる動き）を使わない。（`no-ease-in-for-ui`）
- 【必須】操作に応じる機能的な動きの再生時間は300ms以下にし、ダイアログ、ドロワー、シートのように画面の大部分を覆う UI でも500ms以下にする。（`functional-motion-under-300ms`）
- 【禁止】`transition: all` や `transition-property: all` を使わない。（`no-transition-all`）
- 【推奨】グローバルな `@keyframes` は1つにつき1つのプロパティだけを変え、複数の動きは `animation-name` のカンマ区切りで組み合わせる。（`keyframes-single-property`）
- 【推奨】`@keyframes` の自明な `from` や `to` は省略し、要素がもともと持っている値に向けて（または、その値から）動かす。（`keyframes-omit-obvious-frame`）
- 【推奨】`display: none` から表示する要素の出現と退場は、`@starting-style` と `transition-behavior: allow-discrete` で動かす。（`starting-style-for-entry`）
- 【推奨】`@starting-style` で動かすプロパティは、詳細度の高い規則やインラインスタイルで指定しない。`@starting-style` は元の規則の中に書く。出現だけを動かすなら `@keyframes` の `from` を使う。（`starting-style-not-overridden`）
- 【推奨】スクロール位置に合わせて連続して変わる動きはスクロール駆動アニメーションで、画面に入ったときに1回だけ動かす演出は `view()` のタイムラインで切り替えたカスタムプロパティを `@container style()` で問い合わせて作り、`scroll` イベントで毎回位置を計算しない。（`scroll-linked-method`）
- 【推奨】画面に入ったら1回だけ再生する演出は、ルートの `view()` のタイムラインで登録していないカスタムプロパティを `--false` から `--true` に切り替え、子の一時停止したアニメーションを `@container style(--_in-view: --true)` の中で `running` にし、全体を `@supports (animation-timeline: view()) and (animation-range: entry)` で囲む。（`reveal-once-with-style-query`）
- 【必須】`will-change` は CSS に書いたままにせず、どうしても必要なときだけ、動きの直前に JavaScript で付けて、終わったら外す。（`will-change-temporarily`）
- 【推奨】`content-visibility: auto` は最初の画面より下にある大きなブロックにだけ指定し、`contain-intrinsic-block-size: auto <長さ>` を組で書く。（`content-visibility-with-intrinsic-size`）
- 【禁止】同時に表示される複数の要素に、同じ `view-transition-name` を付けない。（`view-transition-name-unique`）
- 【推奨】同じページの中の切り替えで、並んだ要素を1つずつ動かすときは、連番の名前を振らず、`view-transition-name: match-element` と `view-transition-class` を組み合わせる。（`view-transition-match-element`）

## 第19章 実務での運用（references/19-operations.md）

- 【禁止】エラーや警告を消すことだけを目的に、ルールを無効にしたり検査を飛ばしたりしない。（`no-disabling-to-silence`）
- 【推奨】宣言が効かないときは、詳細度を上げたり `!important` を付けたりする前に、開発者ツールで勝っている宣言と、差が付いた段階（レイヤー、詳細度、スコープの近さ、出現順）を確かめる。（`devtools-find-winning-declaration`）
- 【推奨】編集画面から挿入する独自のブロックには `cms-` で始まるクラスを `class` 属性の先頭に付け、本文エリアの `@scope` を `to ([class|="cms"])` で手前で止める。（`wysiwyg-cms-prefix`）

## 第20章 AIにコーディングさせる（references/20-ai-coding.md）

- 【禁止】Figma などのデザインツールが出力したコードの、Tailwind のクラス、絶対配置の座標、固定の幅と高さを、そのまま CSS に写さない。（`no-verbatim-design-output`）
- 【必須】デザインと指示にない値や振る舞い（カンプのない幅、状態の見た目、内容が増えたときの見せ方）を、推測で作って完成として扱わない。（`no-guessing-missing-design`）
- 【推奨】デザインの値は、CSS を書く前にトークンに対応づけ、トークンに当たらない値は例外として理由とともに書き出す。（`figma-values-to-tokens`）
- 【推奨】AI に CSS を書かせるときは、トークン、ベーススタイル、レイヤーの順番、コンポジションのように全ページに及ぶ変更を、コンポーネントの中で閉じる変更と分け、着手する前に人が確かめる。（`escalate-shared-changes`）
- 【推奨】lint とビルドが通っても、書いた宣言が適用されているかを、ブラウザの計算値で確かめる。（`verify-applied-styles`）
- 【必須】実行していない検査と、人が判定する項目は、完了の報告で「未確認」と書き、「問題なし」と書かない。（`report-unverified-honestly`）
- 【禁止】VRT の基準画像を、差分の原因を確かめずに、テストを通すためだけに更新しない。（`no-baseline-update-to-pass`）
- 【推奨】「まだ使えない」「未対応」を理由に CSS の機能を避けたり JavaScript で作り直したりする提案は、Baseline などで現在の対応状況を確かめてから受け入れる。（`verify-support-claims`）
- 【推奨】プロジェクトで採用を決めていない限り、Tailwind CSS のユーティリティや CSS-in-JS で書かず、コンポーネントのクラスと `@scope` で書く。（`no-unrequested-css-framework`）
