# 第17章 インタラクション：ルール

- ガイドラインのバージョン: 0.44.6（2026-10-09 生成）
- ルールの数: 39
- 本文: 約11.5万字
- 読む条件: ホバー、フォーカス、状態の表示、開閉するUI（details、dialog、popover）、フォーム部品、カルーセル

このファイルは「CSSコーディングガイドライン」のルールから自動生成しています。直接編集しないでください。
強度は「必須」「推奨」「非推奨」「禁止」の4段階です。「必須」と「禁止」は、各ルールの補足に書いた適用範囲と例外を除いて必ず守り、「推奨」と「非推奨」は理由があれば外れてかまいません。
性質は3種類です。「仕様上の制約」はCSS・HTML・ブラウザの振る舞いやWCAGから導かれ、守らないと表示や操作が崩れます。「実装上の判断」は状況とトレードオフで決まり、適用する条件があります。「本書の規約」は一貫性のために本書が選んだ約束で、ほかの約束を選んでも同じように成り立ちます。
背景とコード例は、各節の本文にあります。本文は MCP の `get_page`（ページID）か、URL で読みます。

## この章の節

- `interaction` 第17章 インタラクション（約3,200字）https://t-arai-pnrm.github.io/css-coding-guideline/interaction/
- `interaction/states-and-focus` 17-1 状態とフォーカスを表す（約5万字）https://t-arai-pnrm.github.io/css-coding-guideline/interaction/states-and-focus/
- `interaction/disclosure` 17-2 開閉するUI（約2.2万字）https://t-arai-pnrm.github.io/css-coding-guideline/interaction/disclosure/
- `interaction/forms` 17-3 フォーム部品（約2.3万字）https://t-arai-pnrm.github.io/css-coding-guideline/interaction/forms/
- `interaction/carousel` 17-4 CSSでカルーセルを作る（約1.7万字）https://t-arai-pnrm.github.io/css-coding-guideline/interaction/carousel/

## 17-1 状態とフォーカスを表す

https://t-arai-pnrm.github.io/css-coding-guideline/interaction/states-and-focus/

- 【必須・仕様上の制約】ホバーのスタイルは、リンクなら `&:any-link:hover`、ボタンやフォームのコントロールなら `&:enabled:hover` のように操作できる状態に限定し、`@media (any-hover)` の中に書く。（`hover-operable-in-any-hover`）
  - 理由: `href` のない現在のページのリンクや無効にしたボタンが押せるかのように反応するのと、タッチ操作の端末でホバーの状態が残り続けるのを防ぎつつ、タブレットにマウスをつないだ場合のように、ホバーできる入力がひとつでもあればホバーを有効にできるため。
  - 補足: 条件は `(any-hover: hover)` と値まで書かず、`(any-hover)` と書きます。値なしの `(any-hover)` は、値が `none` のときだけ偽になるので、`(any-hover: hover)` と同じ意味です。`(hover: hover)` や画面の幅では判定しません。`<summary>` と `<label>` には無効の状態がないので、`:hover` に操作できる状態の条件を付けません。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/interaction/states-and-focus/#rule-hover-operable-in-any-hover
- 【必須・実装上の判断】ホバーで変える見た目は、`:focus-visible` にも同じように指定する。（`hover-with-focus-visible`）
  - 理由: キーボードで操作するユーザーにも同じ手がかりを示せ、フォーカスリングが見えにくい場面の補いにもなるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/interaction/states-and-focus/#rule-hover-with-focus-visible
- 【禁止・実装上の判断】キーボード操作によるフォーカスの移動にトランジションやアニメーションを掛けない。（`no-motion-on-focus-visible`）
  - 理由: 入力と表示の変化がずれて、反応が遅く感じられるため。
  - 補足: トランジションは `&:not(:focus-visible)` の中に書き、`:focus-visible` のときは一度で切り替えます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/interaction/states-and-focus/#rule-no-motion-on-focus-visible
- 【非推奨・実装上の判断】ホバーやフォーカスの変化を `opacity` で表さない。（`no-opacity-for-hover`）
  - 理由: 文字まで透けてコントラストが下がり、「なぜ透けるのか」という意図もコードから読み取れないため。
  - 補足: 背景色や文字色を、トークンや相対カラー構文で作った別の色に変えます。背景が透明な項目（メニュー、リスト、タブ）には、半透明の重ね色のトークン `--background--hover` と `--background--active` を `background-color` に指定します。半透明なのは重ねた背景の色だけで、文字は透けないので、`opacity` で透かす方法とは違います。背景色のあるボタンは、相対カラー構文で明るさを変えます。文字色で塗るボタン（`--background--inverse`）は、テーマによって明るくするか暗くするかが逆になるので、`color-mix()` でページの背景色に寄せます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/interaction/states-and-focus/#rule-no-opacity-for-hover
- 【推奨・実装上の判断】状態のスタイルは、`.is-active` のような状態クラスを使わず、擬似クラス（`:disabled` など）、HTML 要素の属性（`target` など）、ARIA 属性（`aria-expanded` など）、`data-*` 属性の優先順位でセレクタを選ぶ。（`state-by-pseudo-class-or-aria`）
  - 理由: ブラウザの動作や支援技術に伝わる状態と同じ情報から見た目が決まるのでずれず、クラスと属性を二重に管理せずに済むため。
  - 補足: `:required` と `required` 属性のように、擬似クラスと属性のどちらでも選べる状態は、擬似クラスで選びます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/interaction/states-and-focus/#rule-state-by-pseudo-class-or-aria
- 【推奨・本書の規約】HTML の属性にも ARIA 属性にもない状態（スクロールで縮んだヘッダーや演出の進み具合など）だけを、`data-compact-mode` のような `data-*` 属性で表す。（`data-attribute-for-other-states`）
  - 理由: 見た目のためだけの状態を、支援技術に伝わる意味と混ぜずに済むため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/interaction/states-and-focus/#rule-data-attribute-for-other-states
- 【推奨・実装上の判断】カード全体をリンクにするときは、`<a>` でカードを包まず、見出しのリンクの `::after` をカードいっぱいに広げ、フォーカスリングはカードの `:has(:focus-visible)` に出す。（`stretched-link-for-card`）
  - 理由: リンクのテキストが見出しだけになり、スクリーンリーダーでカードの中身をすべて読み上げるような冗長さを避けられるため。
  - 補足: カードの中にほかのリンクやボタンを置くときは、それらを `::after` より手前に重ねます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/interaction/states-and-focus/#rule-stretched-link-for-card
- 【推奨・仕様上の制約】ブラウザがフォーカスの表示を必要と判断する場合に限って親の見た目を変えるときは、`:focus-within` ではなく `&:has(:focus-visible)` を使う。（`focus-visible-over-focus-within`）
  - 理由: `:focus-within` は、ボタンをマウスでクリックしたときのように、ブラウザがフォーカスリングを出さない場面にも当てはまるため。
  - 補足: `:focus-visible` は入力の手段を判定しません。テキストの入力欄は、クリックでフォーカスしたときにも当てはまります。入力欄をクリックした時点でグループ全体を強調してよいなら、`:focus-within` で足ります。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/interaction/states-and-focus/#rule-focus-visible-over-focus-within
- 【推奨・仕様上の制約】ホバーで位置や大きさが変わる要素は、ホバーを受ける要素を動かさず、子要素（または擬似要素）を動かす。（`hover-target-stays-still`）
  - 理由: ホバーを受ける要素自身が動くと、カーソルが要素の外に出てホバーが外れ、戻るとまた当たるという繰り返しで、ちらつくため。
  - 補足: ホバーを受ける要素の `&:any-link:hover`／`&:enabled:hover` と `&:focus-visible` で `--_hocus: --true` を立て、動かす子要素や擬似要素は `@container style(--_hocus: --true)` の中で動かします。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/interaction/states-and-focus/#rule-hover-target-stays-still
- 【推奨・仕様上の制約】操作する要素には 24px 相当の最小の大きさを確保し、`@media (any-pointer: coarse)` では 44px 相当にする。大きさは内部のカスタムプロパティの値だけを切り替える。（`hit-area-min-size`）
  - 理由: 指で操作する環境では、小さな操作領域が押し間違いの原因になり、値だけを切り替えれば `min-block-size` と `min-inline-size` の指定を1か所にできるため。
  - 補足: 24px は WCAG 2.2 の達成基準 2.5.8（AA）、44px は 2.5.5（AAA）に由来します。周囲に十分な間隔がある場合や文章中のリンクは、2.5.8 の例外です。文字と一緒に大きくなるように `rem` で書き、`max(24px, 24 / 16 * 1rem)` のように CSS ピクセルの下限を併記します。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/interaction/states-and-focus/#rule-hit-area-min-size
- 【推奨・仕様上の制約】押せる範囲を広げる `padding` は、`<li>` のような外側の要素ではなく、`<a>` や `<button>` のような操作する要素自身に付ける。チェックボックスやラジオボタンは `<label>` で文字と一緒に包む。（`padding-on-interactive-element`）
  - 理由: 外側の要素に付けた `padding` は見た目を大きくするだけで、押せる範囲は文字の部分に限られ、項目の端を押しても反応しないため。
  - 補足: `<a>` は `display: block flow` か `display: inline flow-root` にして、上下の `padding` も押せる範囲と行の高さに含めます。チェックボックスと `<label>` を兄弟に並べて間を空けると、その隙間は押しても何も起きない領域になります。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/interaction/states-and-focus/#rule-padding-on-interactive-element
- 【推奨・仕様上の制約】ホバーで背景が付く項目を並べるメニュー、リスト、タブでは、項目の間を `gap` や `margin` で空けず、間隔を各項目の内側の `padding` で作る。（`no-gaps-between-hover-items`）
  - 理由: カーソルが項目の間の隙間を通るあいだはどの項目にもホバーが当たらず、背景が消えてから次の項目に付き直して点滅して見え、隙間を押しても何も起きないため。
  - 補足: 背景の帯どうしを離して見せたいときも、項目は隙間なく並べ、背景を項目の擬似要素に描いて `inset` で内側に寄せます。カーソルに最も近い項目に背景を付ける作り方や、隙間のクリックを背景の付いた項目に渡す作り方は JavaScript が要るので、採りません。ホバーした項目へ背景が移る表現（`anchor-indicator-as-decoration`）でも、隙間では背景が薄れてから戻ります。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/interaction/states-and-focus/#rule-no-gaps-between-hover-items
- 【推奨・仕様上の制約】見た目を変えずに押せる範囲を広げるときは、擬似要素を `inset: min(0px, (100% - var(--_hit-size)) / 2)` で要素の外にはみ出させ、広げた範囲を隣の操作する要素に重ねない。（`pseudo-hit-area-no-overlap`）
  - 理由: 擬似要素は要素の一部として押せるので見た目を保ったまま範囲を広げられるが、隣の要素に重なると、押した要素と違うものが反応することがあるため。
  - 補足: 要素がもともと `--_hit-size` より大きいときは、`min()` の上限の0pxで擬似要素が要素より小さくならないようにしています。並べるときは、広げたあとの大きさで間隔を確かめます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/interaction/states-and-focus/#rule-pseudo-hit-area-no-overlap
- 【推奨・仕様上の制約】`user-select: none` は、`<label>` で作った切り替えや `role="tab"` のタブのように、連打や長押しで文字が選択されて困る操作部品にだけ指定し、本文や `body` には指定しない。（`user-select-none-for-controls`）
  - 理由: 初期値の `auto` は親の値が `none` なら `none` として扱われるので、広い範囲に指定すると、文章のコピーや、選択した文字を読み上げや翻訳の機能に渡す操作ができなくなるため。
  - 補足: Safari は接頭辞なしの `user-select` に対応していないので（2026年10月）、`-webkit-user-select` を、理由のコメントと Stylelint の無効化のコメントを添えて併記します。`<button>` の文字は、ダブルクリックしても選択されません（Chrome 152 で確認）。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/interaction/states-and-focus/#rule-user-select-none-for-controls
- 【禁止・仕様上の制約】`html`、`body`、全称セレクタのようにページ全体に及ぶセレクタに `touch-action: none` を指定しない。（`no-global-touch-action-none`）
  - 理由: ブラウザは触れた要素からスクロールする祖先までの `touch-action` を重ね合わせて許す操作を決めるので、ページ全体でスクロールとピンチでの拡大が止まるため。
  - 補足: `touch-action` は、ドラッグやスワイプを自分で処理する部品にだけ、`pan-y pinch-zoom` のように残す操作を明示して指定します。ボタンなどの `touch-action: manipulation` は kiso.css が指定しているので、書き直しません。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/interaction/states-and-focus/#rule-no-global-touch-action-none

## 17-2 開閉するUI

https://t-arai-pnrm.github.io/css-coding-guideline/interaction/disclosure/

- 【推奨・実装上の判断】開閉する UI は、`<dialog>`、`popover` 属性、`<details>`、`hidden="until-found"` のような HTML の機能で作り、`div` とクラスの付け外しで作らない。（`native-disclosure-elements`）
  - 理由: フォーカスの移動、Esc キーでの閉じる操作、トップレイヤーへの表示、ページ内検索での展開を、ブラウザが引き受けてくれるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/interaction/disclosure/#rule-native-disclosure-elements
- 【推奨・実装上の判断】モーダルの開閉は `command` 属性と `commandfor` 属性で行い、対応していないブラウザのためにポリフィルを読み込む。（`dialog-command-attributes`）
  - 理由: `showModal()` を呼ぶ JavaScript を書かずに済み、開閉のボタンが `<button>` に限られるので、マークアップの誤りも防げるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/interaction/disclosure/#rule-dialog-command-attributes
- 【推奨・実装上の判断】背景のクリックで閉じるモーダルは `closedby="any"` で作り、クリックの位置を判定する処理を自作しない。（`dialog-closedby-any`）
  - 理由: Esc キーと背景のクリックによる閉じる操作を、ブラウザの標準の振る舞いにそろえられるため。
  - 補足: 対応していないブラウザでも、Esc キーと閉じるボタンでは閉じられます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/interaction/disclosure/#rule-dialog-closedby-any
- 【禁止・仕様上の制約】モーダルに、独自のフォーカストラップを実装しない。（`no-custom-focus-trap`）
  - 理由: `showModal()` で開いたダイアログは背面を操作できない状態にするので不要であり、ブラウザのツールバーへの移動まで妨げてしまうため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/interaction/disclosure/#rule-no-custom-focus-trap
- 【推奨・仕様上の制約】モーダルやドロワーの中でスクロールする要素には、`overscroll-behavior-block: contain` のように、スクロールする方向の軸だけにスクロールの連鎖を止める指定をする。（`overscroll-contain-in-overlay`）
  - 理由: 中の要素を端までスクロールしたときに、背面のページが続けてスクロールするのを防ぐため。
  - 補足: `dialog` と `[popover]` 自体には kiso.css が指定しています。軸を付けない `overscroll-behavior` は、横のスワイプで前のページに戻る操作まで止めてしまいます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/interaction/disclosure/#rule-overscroll-contain-in-overlay
- 【推奨・仕様上の制約】`<dialog>` のモーダルにできないドロワーで背面を操作できなくするときは、`interactivity: inert` ではなく、JavaScript で背面の要素に `inert` 属性を付ける。（`inert-attribute-for-background`）
  - 理由: `interactivity` に対応していない環境では背面を操作できてしまい、見えないリンクにフォーカスが移るため。
  - 補足: CSS で書く場合も、`body:has()` ではなく、`.global-header:has(…) ~ *` のように起点をヘッダーに絞ります。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/interaction/disclosure/#rule-inert-attribute-for-background
- 【推奨・実装上の判断】1つだけを開くアコーディオンは、同じ `name` 属性を付けた `<details>` で作る。（`details-name-for-exclusive`）
  - 理由: JavaScript を書かずに、ほかの項目を閉じる動作をブラウザに任せられるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/interaction/disclosure/#rule-details-name-for-exclusive
- 【禁止・仕様上の制約】`<summary>` の中に見出しの要素を入れない。（`no-heading-in-summary`）
  - 理由: `<summary>` の中では見出しの役割が失われ、見出しで移動するユーザーが項目にたどり着けなくなるため。
  - 補足: 見出しの構造が必要なら、`hidden="until-found"` を使ったアコーディオンにします。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/interaction/disclosure/#rule-no-heading-in-summary
- 【推奨・実装上の判断】`<details>` の開閉する部分の余白や開閉の動きは、`::details-content` に指定する。（`details-content-for-panel`）
  - 理由: 中身を包む要素を足さずに済み、閉じる動きまで CSS だけで書けるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/interaction/disclosure/#rule-details-content-for-panel
- 【推奨・実装上の判断】タブやアコーディオンの閉じたパネルは `hidden="until-found"` で隠し、`display: none` で隠さない。（`hidden-until-found-for-panels`）
  - 理由: ページ内検索やページ内リンクで中身が見つかったとき、ブラウザが自動でパネルを開くため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/interaction/disclosure/#rule-hidden-until-found-for-panels
- 【必須・実装上の判断】開閉するパネルは初期のHTMLでは隠さず、開閉の処理の初期化が成功してから JavaScript で隠す。（`hide-panels-after-init`）
  - 理由: JavaScript が無効な環境や、スクリプトの読み込みや実行に失敗した環境でも、中身を読めるようにするため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/interaction/disclosure/#rule-hide-panels-after-init
- 【非推奨・仕様上の制約】`hidden="until-found"` を付ける要素自体には、余白、枠線、背景を指定しない。（`no-box-style-on-until-found`）
  - 理由: 対応したブラウザは `content-visibility: hidden` で中身だけを隠すので、要素自体の余白や枠線は閉じていても表示されるため。
  - 補足: 余白や背景は、内側の要素に指定します。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/interaction/disclosure/#rule-no-box-style-on-until-found

## 17-3 フォーム部品

https://t-arai-pnrm.github.io/css-coding-guideline/interaction/forms/

- 【推奨・実装上の判断】チェックボックス、ラジオボタン、スライダーの色を変えるだけなら、`accent-color` を使う。（`accent-color-for-color-only`）
  - 理由: ブラウザの部品の操作性やアクセシビリティをそのまま保てるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/interaction/forms/#rule-accent-color-for-color-only
- 【推奨・実装上の判断】チェックボックスやラジオボタンの見た目を作り直すときは、`input` 自体に `appearance: none` を指定して描き、`input` を隠して別の要素で描かない。（`style-input-directly`）
  - 理由: キーボードで操作できなくなる事故を防げ、フォーカスリングもそのまま表示されるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/interaction/forms/#rule-style-input-directly
- 【非推奨・仕様上の制約】`input` 要素の大きさを `aspect-ratio` で決めない。（`no-aspect-ratio-on-input`）
  - 理由: Safari で縦横の比率が保たれず、部品が潰れることがあるため。
  - 補足: `inline-size` と `block-size` の両方を指定します。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/interaction/forms/#rule-no-aspect-ratio-on-input
- 【推奨・仕様上の制約】`<select>` の見た目を `appearance: base-select` で変えるときは、`::picker(select)`、`::picker-icon`、`option::checkmark` の指定も含めて `@supports (appearance: base-select)` の中に書く。（`base-select-in-supports`）
  - 理由: 未対応の環境（2026年10月の時点では Firefox）でブラウザの標準の `<select>` のまま表示させ、`base-select` を前提にした余白や枠線が標準の部品に当たるのを防ぐため。
  - 補足: `appearance: base-select` は、`<select>` と `::picker(select)` の両方に指定します。選んだ項目の中身をボタンに表示するには、`<select>` の最初の子に `<button>` を置き、その中に `<selectedcontent>` を書きます。`<div>` と JavaScript でドロップダウンを作り直すことはしません。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/interaction/forms/#rule-base-select-in-supports
- 【推奨・実装上の判断】スイッチは `<input type="checkbox" switch>` で作り、`switch` 属性に対応していない環境でチェックボックスとして扱われることを許容する。（`switch-attribute-progressive`）
  - 理由: 対応した環境ではスクリーンリーダーがオンとオフで読み上げ、未対応の環境でも操作は損なわれないため。
  - 補足: すべての環境でスイッチとして読み上げる必要がある場合は、`role="switch"` を加えます。`<button>` と `aria-pressed` はトグルボタンを表し、オンとオフの意味にならないので使いません。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/interaction/forms/#rule-switch-attribute-progressive
- 【推奨・仕様上の制約】入力エラーの見た目は、`:invalid` ではなく `:user-invalid` に指定する。（`user-invalid-for-errors`）
  - 理由: `:invalid` は入力する前から当てはまり、ページを開いた時点でエラーが表示されてしまうため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/interaction/forms/#rule-user-invalid-for-errors
- 【推奨・実装上の判断】`<textarea>` には `field-sizing: content` を指定し、最小と最大の高さを `lh` 単位で決める。（`field-sizing-for-textarea`）
  - 理由: 入力した量に合わせて入力欄が伸び縮みし、未対応の環境では従来どおりの入力欄になるだけなため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/interaction/forms/#rule-field-sizing-for-textarea
- 【推奨・仕様上の制約】入力欄の文字サイズは `1rem`（16px 相当）以上にする。（`input-font-size-min-1rem`）
  - 理由: iOS の Safari は、文字サイズが16px 未満の入力欄にフォーカスすると画面を拡大し、ページの見え方が変わってしまうため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/interaction/forms/#rule-input-font-size-min-1rem
- 【禁止・仕様上の制約】入力欄での拡大を防ぐために、`<meta name="viewport">` の `maximum-scale` や `user-scalable=no` でズームを止めない。（`no-maximum-scale`）
  - 理由: 拡大して読む必要のあるユーザーが、ページを拡大できなくなるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/interaction/forms/#rule-no-maximum-scale

## 17-4 CSSでカルーセルを作る

https://t-arai-pnrm.github.io/css-coding-guideline/interaction/carousel/

- 【禁止・実装上の判断】カルーセルを自動で再生しない。（`no-autoplay-carousel`）
  - 理由: 読み上げや操作の途中で内容が切り替わり、一時停止の手段を用意しても問題が残るうえ、自動で切り替わるスライドをユーザーは最後まで見ないため。
  - 補足: カルーセルにする前に、カードを一覧で並べられないかを検討します。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/interaction/carousel/#rule-no-autoplay-carousel
- 【必須・仕様上の制約】`::scroll-button()`、`::scroll-marker`、`scroll-marker-group`、`scrollbar-width: none` は、`@supports selector(::scroll-button(*))` などの中に書く。（`carousel-controls-in-supports`）
  - 理由: 未対応の環境ではボタンとインジケーターが表示されないので、スクロールバーを残して横スクロールとして読めるようにし、Safari でネストした以降のスタイルが無効になるのも防ぐため。
  - 補足: 土台はスクロールスナップの横スクロールにし、ボタンとインジケーターはプログレッシブ・エンハンスメントとして足します。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/interaction/carousel/#rule-carousel-controls-in-supports
- 【推奨・仕様上の制約】カルーセルのスライドを `container: --<名前> / scroll-state` のコンテナにし、止まっていないスライドの中身を `@container --<名前> not scroll-state(snapped: inline)` で `interactivity: inert` にする。（`carousel-inert-unsnapped`）
  - 理由: 隠れているスライドが読み上げとフォーカスの対象から外れ、見えている1枚の後にカルーセルの後ろの要素へ移れるため。
  - 補足: 1枚ずつ表示するカルーセルが前提です。複数枚を表示すると、見えていてもスナップの位置にないスライドが不活性になるので、条件を見直すか、この指定を使いません。`interactivity` は継承し、子孫から `auto` で打ち消せません。コンテナクエリで変えられるのは子孫だけなので、スライドではなくその中の要素に指定します。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/interaction/carousel/#rule-carousel-inert-unsnapped
