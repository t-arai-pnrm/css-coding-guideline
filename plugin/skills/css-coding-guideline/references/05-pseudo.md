# 第5章 擬似クラスと擬似要素：ルール

- ガイドラインのバージョン: 0.43.0（2026-10-08 生成）
- ルールの数: 28

このファイルは「CSSコーディングガイドライン」のルールから自動生成しています。直接編集しないでください。
強度は「必須」「推奨」「非推奨」「禁止」の4段階です。「必須」と「禁止」は、各ルールの補足に書いた適用範囲と例外を除いて必ず守り、「推奨」と「非推奨」は理由があれば外れてかまいません。
性質は3種類です。「仕様上の制約」はCSS・HTML・ブラウザの振る舞いやWCAGから導かれ、守らないと表示や操作が崩れます。「実装上の判断」は状況とトレードオフで決まり、適用する条件があります。「本書の規約」は一貫性のために本書が選んだ約束で、ほかの約束を選んでも同じように成り立ちます。
背景とコード例は、各節の URL のページにあります。

## 5-1 擬似クラスと擬似要素の基本

https://t-arai-pnrm.github.io/css-coding-guideline/pseudo/basics/

- 【禁止・本書の規約】擬似要素を、`:before` や `:after` のような1コロンの旧記法で書かない（`::before` や `::after` と書く）。（`pseudo-element-double-colon`）
  - 理由: 1コロンでは擬似クラスと見分けがつかず、要素の状態を選んでいるのか要素の一部を選んでいるのかをセレクタから読み取れなくなるため。
  - 補足: 1コロンの記法は、CSS2との互換のために `::before`、`::after`、`::first-line`、`::first-letter` の4つにだけ残されています。`::marker` や `::placeholder` のようなあとから加わった擬似要素は、1コロンでは無効なセレクタになります。
  - 自動チェック: Stylelint: `selector-pseudo-element-colon-notation`
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/pseudo/basics/#rule-pseudo-element-double-colon
- 【必須・仕様上の制約】ブラウザの対応が分かれる擬似クラスをほかのセレクタと並べるときは、カンマで区切った普通のセレクタリストではなく、`:is()` か `:where()` の引数に書く（`:not()` と `:has()` の引数の中では、さらに `:is()` で包む）。（`forgiving-list-for-partial-support`）
  - 理由: セレクタリストと `:not()`・`:has()` の引数は、解釈できないセレクタが1つでもあるとルール全体が無効になり、`:is()` と `:where()` の引数は、解釈できないセレクタだけを無視するため。
  - 補足: `:heading` の具体的な書き方は、ルール `heading-with-fallback` に従います。擬似要素は `:is()` と `:where()` の引数に書けないので、対応が分かれる擬似要素は、ほかのセレクタと並べず別のルールに分けます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/pseudo/basics/#rule-forgiving-list-for-partial-support
- 【必須・仕様上の制約】`:heading` を使うときは、`:is(:heading, h1, h2, h3, h4, h5, h6)` のように従来のタイプセレクタと並べ、`:is()` か `:where()` の中に書く。（`heading-with-fallback`）
  - 理由: 対応していないブラウザでは、普通のセレクタリストに書いた `:heading` がルール全体を無効にするため。
  - 補足: `:is()` と `:where()` の引数では、解釈できないセレクタだけが無視され、残りは有効になります。`@layer` を使う場合のベーススタイルは `:is()` で書き、`:where()` は `@layer` を使えない場合に使います（ルール `where-for-base-selectors`）。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/pseudo/basics/#rule-heading-with-fallback

## 5-2 :is()・:where()・:not()

https://t-arai-pnrm.github.io/css-coding-guideline/pseudo/is-where-not/

- 【推奨・仕様上の制約】状態のセレクタ（`:hover`、`:focus-visible`、`:checked`、`[aria-expanded="true"]`、`[open]` など）は `:where()` で包まず、まとめたいときは `:is()` を使う。（`is-for-state-selectors`）
  - 理由: 状態のスタイルは既定の見た目より優先されるべきで、`:where()` で詳細度を 0 にすると、同じ要素の既定のスタイルに書く順番しだいで負けるため。
  - 補足: `:where()` は、`@layer` を使えない場面のベーススタイルと、上書きされる前提のデフォルト値に使います。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/pseudo/is-where-not/#rule-is-for-state-selectors
- 【推奨・実装上の判断】複数の条件を除くときは、`:not(.a):not(.b)` と重ねず、`:not(.a, .b)` のように1つの `:not()` の引数に並べる。（`not-selector-list`）
  - 理由: 当てはまる要素は同じで、詳細度が引数の最大の1つ分にとどまり、除く条件が1か所にまとまるため。重ねた `:not()` は、条件を1つ足すたびに詳細度が上がる。
  - 補足: `:not()` の引数は寛容なセレクタリストではないので、対応が分かれる擬似クラスを並べるときは、`:not(:is(…))` のように引数の中で `:is()` に包みます（ルール `forgiving-list-for-partial-support`）。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/pseudo/is-where-not/#rule-not-selector-list
- 【推奨・仕様上の制約】「X の中にない要素」は、`&:not(X *)` や `a:not(nav a)` のように祖先を `:not()` の引数の中に書き、`:not(X) a` のように祖先の側を否定しない。（`not-ancestor-in-argument`）
  - 理由: `:not(X) a` は「X ではない祖先を1つでも持つ `a`」を選ぶので、`html` や `body` が常に当てはまり、X の中の要素も除けないため。
  - 補足: 「X を持たない要素」を `:not(:has(X))` と書くルール `not-has-for-absence` と同じく、否定の範囲をセレクタの形と一致させます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/pseudo/is-where-not/#rule-not-ancestor-in-argument

## 5-3 :has() で祖先と前の兄弟を選ぶ

https://t-arai-pnrm.github.io/css-coding-guideline/pseudo/has/

- 【推奨・実装上の判断】子孫の状態や有無によって祖先のスタイルを変えるときは、JavaScript で状態のクラスを付けずに `:has()` を使う。（`has-over-state-class`）
  - 理由: 状態をHTMLとCSSだけで表せ、クラスの付け外しと実際の状態がずれることがないため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/pseudo/has/#rule-has-over-state-class
- 【推奨・仕様上の制約】「X を持たない要素」は `:not(:has(X))` で書き、`:has(:not(X))` は使わない。（`not-has-for-absence`）
  - 理由: `:has(:not(X))` は「X 以外の要素を子孫に持つ要素」を選ぶので、X 以外の子孫が1つでもあれば、X を持つ要素にも当てはまるため。
  - 補足: 2つの詳細度は同じなので、入れ子の順序を取り違えても、見た目の差から気づけません。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/pseudo/has/#rule-not-has-for-absence
- 【禁止・仕様上の制約】`:has()` を、起点のセレクタなしで書かない（`:has(.foo)` や `*:has(.foo)` は使わず、`&:has(> .foo)` や `.card:has(> img)` のように直前に起点を書く）。（`no-unanchored-has`）
  - 理由: 起点がないと、ページのすべての要素が照合の対象になり、DOM が変わるたびにブラウザが調べ直す範囲がページ全体に広がって、スタイルの再計算が重くなるため。
  - 補足: ネストしたルールの中で `&` を省いて `:has(> img)` と書くと、`& :has(> img)` と解釈され、親の子孫のすべての要素が起点になります。`@scope` の直下に書いた `:has()` も、`:scope :has()` と同じく、スコープの中のすべての要素が起点になります。`&:not(:has(> img))` のように擬似クラスの引数の中に書くときは、外側の擬似クラスの直前に起点を書きます。
  - 自動チェック: Stylelint: `book/no-unanchored-has`（本書の独自ルール）
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/pseudo/has/#rule-no-unanchored-has
- 【推奨・実装上の判断】`:has()` の起点は `:root` や `body` ではなくコンポーネントのルートのような狭い要素にし、引数は `>` や `+` で範囲を絞る（例：`&:has(> ._input:checked)`）。（`has-narrow-anchor`）
  - 理由: DOM が変わるたびに、ブラウザは起点の子孫を調べ直すので、起点と引数の範囲が広いと、要素の多いページでスタイルの再計算が重くなるため。
  - 補足: `:root:has(:modal)` のように、ページ全体の状態を表すもので、ほかに起点がないものは例外です。重さは Chrome の開発者ツールの「CSS selector stats」で測ります。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/pseudo/has/#rule-has-narrow-anchor

## 5-4 子要素の位置で選ぶ

https://t-arai-pnrm.github.io/css-coding-guideline/pseudo/child-index/

- 【推奨・仕様上の制約】クラスや状態で絞った中での順番は `:nth-child(N of S)` で書き、`:nth-of-type()` を代わりに使わない（`._post:nth-of-type(2)` ではなく `:nth-child(2 of ._post)`）。（`nth-child-of-over-nth-of-type`）
  - 理由: `:nth-of-type()` は要素の種類（タグ名）ごとにしか数えず、`._item:nth-of-type(2)` は「2番目の `._item`」ではなく「同じ種類の兄弟の中で2番目にあり、かつ `._item` でもある要素」を選ぶため。
  - 補足: 絞り込みで `hidden` 属性を付けた行を除いて縞模様を付けるときは、`&:nth-child(even of :not([hidden]))` と書きます。`of S` の詳細度は、擬似クラス1つ分に S の中でいちばん高いセレクタの詳細度を足したものになります。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/pseudo/child-index/#rule-nth-child-of-over-nth-of-type
- 【推奨・実装上の判断】子要素を位置で選ぶのは、縞模様や先頭の数個のように順番そのものが条件になるときに限り、役割の決まった子はタイプセレクタか子クラスで選ぶ。（`select-roles-not-positions`）
  - 理由: 位置で選んだスタイルは、HTMLの順番を入れ替えたり要素を足したりすると別の子に当たり、役割とスタイルがずれるため。
  - 補足: 子要素の間隔を作るために、`:last-child` や `:first-child` で余白を打ち消すことはしません。間隔は親の `gap`（第11章のルール `gap-over-child-margin`）か、コンポジション `prose` で作ります。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/pseudo/child-index/#rule-select-roles-not-positions
- 【推奨・仕様上の制約】`sibling-index()` と `sibling-count()` は、色相や遅延のように未対応の環境で失われても困らない装飾の値に限って使い、`@supports (z-index: sibling-index())` の中に書いて、外に未対応の環境で使う値を書く。（`sibling-functions-for-decoration`）
  - 理由: 2026年10月の時点で、本書の対象のブラウザのうち Safari 18 系が対応しておらず、カスタムプロパティに入れた式は未対応の環境でもそのまま受け取られて、それを使う宣言が計算値の時点で無効になるため。
  - 補足: 件数で見た目を切り替える処理は数量クエリで書きます（ルール `quantity-query-for-count-conditions`）。レイアウトの要に使わない理由は、第1章のルール `no-unsupported-layout-features` と同じです。数える対象は `:nth-child()` と同じで、`hidden` 属性で隠した要素も数えます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/pseudo/child-index/#rule-sibling-functions-for-decoration

## 5-5 数量クエリ

https://t-arai-pnrm.github.io/css-coding-guideline/pseudo/quantity-queries/

- 【推奨・実装上の判断】子要素の数で親や兄弟の見た目を変えるときは、`&:has(> :nth-child(3))` のように親を起点にした `:has()` で数え、数えた子要素そのものの見た目を変えるときは、`& > :nth-child(2n + 1):nth-last-child(1)` のように子の側で `:nth-child()` と `:nth-last-child()` を組み合わせる。（`quantity-query-with-has`）
  - 理由: スタイルを当てる要素をセレクタの主語にすれば、条件と対象が1つのセレクタで読めるため。子の側で数えると親のプロパティは切り替えられず、兄弟を変えるには `~` で後ろの兄弟を拾う組が要る。反対に、数えた子を `:has()` で変えると、同じ条件が親と子の2か所に現れる。
  - 補足: 親を起点にする形は、ちょうどN個が `&:has(> :nth-child(N):last-child)`、N個以上が `&:has(> :nth-child(N))`、N個以下が `&:has(> :last-child:nth-child(-n + N))`、N〜M個が `&:has(> :nth-child(N)):not(:has(> :nth-child(M + 1)))` です。1個だけなら `&:has(> :only-child)` で足ります。`li:nth-last-child(n + 3), li:nth-last-child(n + 3) ~ li` のように、兄弟を変えるために子の側で数える形は使いません。どちらの形でも、`>` で直接の子に絞ります（絞らないと、孫の位置の要素も数えます）。起点のない `:has()` は書きません（ルール `no-unanchored-has`）。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/pseudo/quantity-queries/#rule-quantity-query-with-has
- 【推奨・実装上の判断】列数のようなレイアウトの切り替えは `auto-fit` やコンテナサイズクエリで行い、数量クエリは「1件だけなら中央に置く」「最終行の端数を中央に寄せる」のように、子要素の数そのものが条件のときに限って使う。（`quantity-query-for-count-conditions`）
  - 理由: 列数を決める本当の条件は、項目の数よりも、その一覧が使える幅であることが多いため。
  - 補足: 「3件以上なら3列」のように数で列数を決めると、狭い場所に置いたときに列が細くなりすぎます。項目が少ないときに列を行いっぱいに広げるだけなら、`auto-fit` が空の列を畳むので、数量クエリは要りません。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/pseudo/quantity-queries/#rule-quantity-query-for-count-conditions

## 5-6 フォームの状態を表す擬似クラス

https://t-arai-pnrm.github.io/css-coding-guideline/pseudo/form-states/

- 【推奨・仕様上の制約】入力の有無で見た目を変えるときは、入力例を書いた `placeholder` 属性のある入力欄に `:placeholder-shown` を使い、`placeholder` 属性のない入力欄を `:not(:placeholder-shown)` で「入力済み」と判定しない。（`placeholder-shown-with-hint`）
  - 理由: `:placeholder-shown` は `placeholder` 属性のない入力欄には当てはまらないので、`:not(:placeholder-shown)` は空の入力欄にも当てはまってしまうため。
  - 補足: 未入力の状態を `&:placeholder-shown` の側に書けば、`placeholder` 属性のない入力欄では何も起きません。`:not()` で書く必要があるときは、`&[placeholder]:not(:placeholder-shown)` のように属性の有無も条件にします。判定のためだけに空白1文字の `placeholder` を付ける書き方は使いません。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/pseudo/form-states/#rule-placeholder-shown-with-hint
- 【推奨・仕様上の制約】同じ状態をネイティブの属性と ARIA 属性の両方で表すことがあるときは、`&:is(:disabled, [aria-disabled="true"])` や `&:is(:user-invalid, [aria-invalid="true"])` のように、擬似クラスと属性セレクタをまとめて指定する。（`native-and-aria-state-together`）
  - 理由: `aria-disabled="true"` を付けた要素は `:disabled` に、JavaScript で `aria-invalid="true"` を付けた要素は `:user-invalid` に当てはまらず、片方だけに指定すると、同じ状態なのに見た目が変わらない要素が出るため。
  - 補足: `disabled` 属性で表せる状態は `disabled` 属性を優先します。`aria-disabled="true"` は、フォーカスを残したまま無効であることを伝えたい場合に使い、操作を止める処理は JavaScript で書きます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/pseudo/form-states/#rule-native-and-aria-state-together
- 【推奨・仕様上の制約】読み取り専用の入力欄の見た目は `&[readonly]` に指定し、`input:read-only` のように、要素の種類を限らずに `:read-only` を使わない。（`readonly-attribute-for-text-field`）
  - 理由: `:read-only` は「編集できない要素」すべてに当てはまり、`input` に限っても、チェックボックス、ボタン、ファイルの選択、無効にした入力欄まで選ぶため。
  - 補足: `:read-write` は、`contenteditable` を付けた要素にも当てはまります。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/pseudo/form-states/#rule-readonly-attribute-for-text-field
- 【必須・仕様上の制約】`::placeholder` の文字は `color` で色を指定し、背景とのコントラスト比を 4.5:1 以上にする。`opacity` で薄くしない。（`placeholder-color-contrast`）
  - 理由: ブラウザの既定のプレースホルダーは薄い色で表示されることが多く、入力例を読めないユーザーが出るため。
  - 補足: Firefox は既定でプレースホルダーを半透明にするので、kiso.css は `::placeholder` の `opacity` を初期値に戻しています。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/pseudo/form-states/#rule-placeholder-color-contrast

## 5-7 開閉と表示の状態を表す擬似クラス

https://t-arai-pnrm.github.io/css-coding-guideline/pseudo/open-states/

- 【推奨・仕様上の制約】`<details>` と `<dialog>` の開いた状態は `[open]` 属性セレクタで選び、対象のすべてのブラウザが対応するまで `:open` を使わない。（`open-attribute-for-details-dialog`）
  - 理由: `<details>` と `<dialog>` では `[open]` と `:open` の当てはまる条件が同じで、`:open` に対応していないブラウザ（Safari 26.4 以前）では、`:open` を含むルールがセレクタリストごと無効になるため。
  - 補足: `<select>` や `<input>` のピッカーを開いている状態は `:open` でしか選べないので、対応していない環境で見た目が変わらなくても困らない装飾に限り、ほかのセレクタと分けたルールに書きます。詳細度は `[open]` も `:open` も 0.1.0 です。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/pseudo/open-states/#rule-open-attribute-for-details-dialog
- 【必須・仕様上の制約】`popover` 属性の要素の表示中の状態は `:popover-open` で選び、`[open]`、`:open`、`.is-open` のようなクラスで選ばない。（`popover-open-for-popover`）
  - 理由: ポップオーバーには `open` 属性が付かず、`:open` も当てはまらないので、表示中かどうかをブラウザの状態のまま参照できるのは `:popover-open` だけであるため。
  - 補足: 閉じた状態は `:not(:popover-open)` で選びます。開くボタンの見た目を変えるときは、`&:has(+ :popover-open)` のように、ボタンから見た位置を結合子で絞ります。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/pseudo/open-states/#rule-popover-open-for-popover
- 【推奨・仕様上の制約】モーダルとして開いたダイアログだけに当てるスタイルは `:modal` で選び、`dialog[open]` で代用しない。（`modal-pseudo-for-modal-styles`）
  - 理由: `open` 属性は `show()` で開いたモーダルでないダイアログにも付くので、`dialog[open]` では開き方を区別できないため。
  - 補足: `:modal` は `requestFullscreen()` で全画面表示にした要素にも当てはまります。背面のスクロールを止める `:root:has(:modal)` は、第8章のルール `modal-scroll-lock-root` で定めています。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/pseudo/open-states/#rule-modal-pseudo-for-modal-styles
- 【推奨・仕様上の制約】`:empty` は、空白や改行が入らないことを確かめた要素にだけ使い、テンプレートや CMS が改行を出力しうる要素の判定に使わない。（`empty-without-whitespace`）
  - 理由: 2026年10月の時点のブラウザでは、空白や改行だけを含む要素にも `:empty` が当てはまらず、見た目では空の要素が空として扱われないため。
  - 補足: コメントだけを含む要素には `:empty` が当てはまります。Selectors Level 4 の草案は空白だけの要素も空とみなす定義に変わりましたが、その定義どおりに実装したブラウザはありません。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/pseudo/open-states/#rule-empty-without-whitespace

## 5-8 生成コンテンツと装飾の擬似要素

https://t-arai-pnrm.github.io/css-coding-guideline/pseudo/generated-content/

- 【禁止・仕様上の制約】必須の印、単位、注意書き、副題のように、読み手が知る必要のある文字を、`::before` や `::after` の `content` で入れない（HTML に書く）。（`no-meaningful-generated-content`）
  - 理由: 生成コンテンツは DOM に含まれず、機械翻訳、選択してのコピー、ページ内検索の対象にならないうえ、支援技術とブラウザの組み合わせによっては読み上げられず、スタイルを無効にした環境では表示もされないため。
  - 補足: 生成コンテンツに入れてよいのは、ほかの手段で意味が伝わっている装飾（リンクの文字の後ろの矢印、見出しの前の線など）だけです。印刷のときに外部リンクの URL を添えるような、HTML にある情報を紙の上で補う指定は例外です。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/pseudo/generated-content/#rule-no-meaningful-generated-content
- 【推奨・仕様上の制約】装飾として文字や記号を生成コンテンツで入れるときは、`content: "→" / ""` のように代替テキストを空にする。（`empty-alt-for-decorative-content`）
  - 理由: 代替テキストがないと、装飾の記号の名前がスクリーンリーダーで読み上げられ、本文の読み上げを妨げるため。
  - 補足: `content: ""` で作る文字のない箱には、代替テキストは要りません。擬似要素そのものが操作の対象になる `::scroll-button()` のような場合は、空にせず、`content: "←" / "前の事例"` のように名前を書きます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/pseudo/generated-content/#rule-empty-alt-for-decorative-content
- 【推奨・仕様上の制約】`::marker` に指定するのは `color` と `font-size` だけにし、記号を変える、太くする、アイコンにするといった装飾は、`list-style-type: ""` でマーカーを空にして `::before` で描く。（`marker-color-and-font-size-only`）
  - 理由: Safari の `::marker` は `color` と `font-size` しか反映せず、ほかのプロパティや `content` を指定しても、Safari だけ見た目が変わらないため。
  - 補足: `list-style: none` でマーカーを消すと、Safari の VoiceOver がリストとして読み上げなくなるので、`list-style-type: ""` を使います。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/pseudo/generated-content/#rule-marker-color-and-font-size-only
- 【推奨・仕様上の制約】`::selection` で選択範囲の色を変えるときは、`color` と `background-color` の両方を指定し、2つの色のコントラスト比を確かめる。（`selection-color-and-background`）
  - 理由: 片方だけを変えると、もう片方にはブラウザやユーザーの設定の色が残り、選択した文字が背景に埋もれることがあるため。
  - 補足: 文字と背景のコントラスト比の基準は、第15章のルール `text-contrast-aa` と同じです。iOS の Safari は `::selection` に対応していないので、選択範囲はシステムの色のままになります。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/pseudo/generated-content/#rule-selection-color-and-background
- 【推奨・実装上の判断】検索結果のページで検索語に付ける目印のように、内容の一部として読み手に伝える強調は `<mark>` で書き、`::highlight()` は、ページ内検索の一致や構文の色分けのように、操作に合わせて描き直す表示に使う。（`mark-over-highlight-for-meaning`）
  - 理由: ハイライトは DOM を変えないので、CSS や JavaScript が動かない環境では範囲が表示されず、支援技術への伝わり方も `Highlight` の `type` と環境の対応によって異なるため。
  - 補足: `::highlight()` に指定できるのは、`color`、`background-color`、`text-decoration` とその関連のプロパティ、`text-shadow` などに限られます。範囲は色だけで区別せず、下線を組み合わせます（第15章のルール `no-color-only-information`）。強制カラーモードでは色が置き換わり、`text-shadow` は `none` になります。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/pseudo/generated-content/#rule-mark-over-highlight-for-meaning
