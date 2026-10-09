# 第9章 記法の規約：ルール

- ガイドラインのバージョン: 0.44.2（2026-10-09 生成）
- ルールの数: 48
- 本文: 約11.1万字
- 読む条件: すべてのCSS（命名、ネスト、@scope、プロパティの並び、記法）（常に読む）

このファイルは「CSSコーディングガイドライン」のルールから自動生成しています。直接編集しないでください。
強度は「必須」「推奨」「非推奨」「禁止」の4段階です。「必須」と「禁止」は、各ルールの補足に書いた適用範囲と例外を除いて必ず守り、「推奨」と「非推奨」は理由があれば外れてかまいません。
性質は3種類です。「仕様上の制約」はCSS・HTML・ブラウザの振る舞いやWCAGから導かれ、守らないと表示や操作が崩れます。「実装上の判断」は状況とトレードオフで決まり、適用する条件があります。「本書の規約」は一貫性のために本書が選んだ約束で、ほかの約束を選んでも同じように成り立ちます。
背景とコード例は、各節の本文にあります。本文は MCP の `get_page`（ページID）か、URL で読みます。

## この章の節

- `notation` 第9章 記法の規約（約4,200字）https://t-arai-pnrm.github.io/css-coding-guideline/notation/
- `notation/naming` 9-1 命名規則（約1.8万字）https://t-arai-pnrm.github.io/css-coding-guideline/notation/naming/
- `notation/terminology` 9-2 名前に使う語（約1.4万字）https://t-arai-pnrm.github.io/css-coding-guideline/notation/terminology/
- `notation/scope-and-nesting` 9-3 @scopeとネストの使い分け（約1.2万字）https://t-arai-pnrm.github.io/css-coding-guideline/notation/scope-and-nesting/
- `notation/nesting` 9-4 ネストの書き方（約1.3万字）https://t-arai-pnrm.github.io/css-coding-guideline/notation/nesting/
- `notation/nesting-criteria` 9-5 ネストの判断基準（約1.4万字）https://t-arai-pnrm.github.io/css-coding-guideline/notation/nesting-criteria/
- `notation/property-order` 9-6 プロパティの並び順（約3,900字）https://t-arai-pnrm.github.io/css-coding-guideline/notation/property-order/
- `notation/modern-syntax` 9-7 モダンな記法にそろえる（約1.2万字）https://t-arai-pnrm.github.io/css-coding-guideline/notation/modern-syntax/
- `notation/logical-properties` 9-8 論理プロパティと論理値（約1.1万字）https://t-arai-pnrm.github.io/css-coding-guideline/notation/logical-properties/
- `notation/comments` 9-9 コメントの書き方（約8,900字）https://t-arai-pnrm.github.io/css-coding-guideline/notation/comments/

## 9-1 命名規則

https://t-arai-pnrm.github.io/css-coding-guideline/notation/naming/

- 【推奨・本書の規約】コンポーネントのルートに付ける `scoped <名前>` の `<名前>` は、kebab-case にする（例：`class="scoped media-card"`）。（`root-name-kebab-case`）
  - 理由: ルートの名前はコンポーネントの名前そのものなので、ブロック名やファイル名と対応させておくと、CSS から実装のファイルをたどりやすいため。
  - 補足: `scoped` のクラスを付ける理由は 9-3 で、`@scope` の仕組みは第4章で扱います。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/notation/naming/#rule-root-name-kebab-case
- 【必須・本書の規約】コンポーネントの子要素のクラス名は、`_` で始まる kebab-case にする（例：`._main-link`、`._nav-links`）。（`child-class-underscore`）
  - 理由: HTML を見ただけで、そのコンポーネントの中だけで意味を持つ名前だと分かるため。`@scope` で範囲を閉じているので、短い名前でもほかのコンポーネントと衝突しない。
  - 補足: BEM の `block__element` や `block--modifier` の形にはしません。バリエーションや状態は、クラス名ではなく属性で表します。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/notation/naming/#rule-child-class-underscore
- 【必須・本書の規約】ユーティリティのクラス名は `-` で始まる kebab-case にし、段階や種類は `--` で続ける（例：`.-visually-hidden`、`.-fluid-text--md`）。（`utility-class-hyphen`）
  - 理由: コンポーネントの子要素やコンポジションと見分けられ、どこからでも使える単機能のクラスだと分かるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/notation/naming/#rule-utility-class-hyphen
- 【必須・本書の規約】コンポジションのクラス名は、接頭辞を付けない kebab-case にする（例：`.cluster`、`.switcher`）。（`composition-class-plain`）
  - 理由: 配置のパターンの名前をそのまま使え、接頭辞の付いたほかの種類のクラスと並べたときに役割の違いが分かるため。
  - 補足: パターンにも接頭辞を付けません。コンポジションは `stack` や `sidebar` のような配置の名前に、パターンは `section-heading` や `icon` のような役割の名前（`name-by-role`）にして、名前の種類で区別します。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/notation/naming/#rule-composition-class-plain
- 【必須・実装上の判断】コンポーネント、子要素、パターンの名前は、見た目ではなく役割で付ける（`._big-title` ではなく `._heading`）。（`name-by-role`）
  - 理由: 見た目の名前はデザインが変わると実態とずれるが、役割の名前なら見た目を変えても名前を変えずに済むため。
  - 補足: ユーティリティは1つのことしかしないので、`.-text-center` のように効果をそのまま名前にします。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/notation/naming/#rule-name-by-role
- 【禁止・実装上の判断】`container`、`button`、`columns` のように HTML や CSS で意味が決まっている語を、別の意味の名前に使わない。（`no-redefining-web-terms`）
  - 理由: 名前から CSS の機能や HTML の要素を連想させ、読む人の誤解を招くため。
  - 補足: `<a>` の要素は、見た目がボタンでも `link` と呼びます。`.container` のクラスについては、第13章のルール `no-container-utility-class` も参照してください。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/notation/naming/#rule-no-redefining-web-terms
- 【非推奨・実装上の判断】`wrapper`、`block`、`module`、`widget` のように、責務を表さない総称を名前に使わない。（`no-vague-names`）
  - 理由: 何のための要素なのかが名前から分からず、責務の境界もあいまいになるため。
  - 補足: 内容の幅を制限する要素は `._section-inner`、外側との余白や配置を調整する要素は `._card-outer` のように、「何の」を併記して責務を表す名前を付けます（ルール `inner-outer-names`）。名前に迷ったら、その要素が何なのかを日本語で1文に書き、特徴的な語を名前にします（`text-box` や `center-box` のような見た目や配置だけの名前は避けます）。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/notation/naming/#rule-no-vague-names
- 【推奨・実装上の判断】子要素のクラス名に HTML の階層を映さない。孫にあたる要素にも、親の名前をつなげず、役割の名前を `._kebab` で付ける（`._tags-item-link` ではなく `._tag-link`）。（`child-name-flat`）
  - 理由: 階層を名前に写すと名前が要素の位置を表し、HTML の構造を変えるたびにクラス名とセレクタも変えなければならなくなるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/notation/naming/#rule-child-name-flat
- 【推奨・実装上の判断】互いに独立して選ばれるバリエーションの軸は、軸ごとに別の属性で表し、1つの属性には1つの値だけを書く（`data-variant="warning" data-size="small"`）。（`variant-attribute-per-axis`）
  - 理由: 属性名から軸が分かり、セレクタを完全一致で書けるため。値を空白で区切って1つの属性に詰めると、`~=` のセレクタが必要になり、どの値がどの軸に属し、同時に指定できるのかが読み取れなくなる。
  - 補足: 見た目の種類を表す軸には `data-variant` を、それと組み合わせる軸には `data-size` のように軸の名前を属性名に使います。2つの軸のセレクタは詳細度が同じなので、軸ごとに変えるプロパティを分けます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/notation/naming/#rule-variant-attribute-per-axis
- 【必須・本書の規約】自分で付けて値として使う名前（`@keyframes`、グリッドの線とエリア、アンカー、スタイルクエリの値）は、`--` で始める。（`dashed-ident-names`）
  - 理由: 自分で付けた名前だとすぐに分かり、プロパティごとに `--` が必要かどうかを覚えずに済むため。将来 CSS に追加されるキーワードとも衝突しにくい。
  - 補足: `view-transition-name` の名前にも付けます。コンテナの名前は、第13章のルール `container-name-dashed-ident` で扱います。`@layer` の名前のように、値として使わない名前には付けません。
  - 自動チェック: Stylelint: `keyframes-name-pattern`（`@keyframes` のみ）
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/notation/naming/#rule-dashed-ident-names

## 9-2 名前に使う語

https://t-arai-pnrm.github.io/css-coding-guideline/notation/terminology/

- 【推奨・本書の規約】クラス名とカスタムプロパティの名前は、単語を省略せずに書く（`._btn` ではなく `._button`、`._ttl` ではなく `._title`）。省略してよいのは、`img` や `nav` のように Web 標準で使われている略語と、`cta` のようにプロジェクトの中で浸透している略語だけにする。（`no-abbreviation`）
  - 理由: 文字数を削っても節約できるのはわずかなバイト数で、読む人には略語を元の語に戻す負担が残り、略し方が揺れると名前で検索しても見つからなくなるため。
  - 補足: プロジェクトで使う略語は、元の語とともに用語集に書いておきます。本書のトークンの段階（`sm`、`md`、`lg`）や、内部プロパティの接頭辞（`--_c--` など）は、本書で定めた略語として扱います。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/notation/terminology/#rule-no-abbreviation
- 【必須・実装上の判断】名前に使う語は、プロジェクトの中で1つの意味だけで使い、コンポーネントの名前、子要素のクラス名、カスタムプロパティの名前のどこでも同じ意味にそろえる。（`one-term-one-meaning`）
  - 理由: 1つの語が2つの意味を持つと、名前から役割を読み取れず、値を変えてよいかを判断するために使っている箇所をすべて読むことになるため。
  - 補足: 値がたまたま同じでも、意味の違う値を1つのカスタムプロパティにまとめません。新しい語は、何を指すかと何を指さないかを、プロジェクトの用語集に書き足します。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/notation/terminology/#rule-one-term-one-meaning
- 【必須・本書の規約】`inner`、`outer`、`container` を名前に使うときは、`._section-inner`、`._card-outer`、`._list-container` のように、必ず「何の」を併記する（`._inner` だけにしない）。（`inner-outer-names`）
  - 理由: `._inner` だけでは何の内側なのかをクラス名から読み取れず、HTML や開発者ツールで見た人がルートまでたどらないと対象が分からないため。
  - 補足: 内容の幅を制限する要素は `inner`、親が子のコンポーネントの配置と外側の余白を決める要素は `outer` と呼び、どちらもコンポーネントの子要素にします（`outer` を単独のコンポーネントにしない）。「何の」には包む対象の語を書き、コンポーネント名を繰り返す必要はありません（`site-header` の中なら `._header-inner`）。`wrapper` は使いませんが、既存のコードで使われているときも同じく何を包むのかを併記します。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/notation/terminology/#rule-inner-outer-names
- 【必須・本書の規約】コンテンツの外縁と画面の端のあいだのインライン方向の余白は `gutter`、子要素どうしの間隔は `gap` と呼び、取り違えない（列の間隔を `gutter` と呼ばない）。（`gutter-vs-gap`）
  - 理由: 名前と CSS のプロパティの意味が一致し、ガターを変えたときに要素の間隔まで変わるといった取り違えを防げるため。
  - 補足: ガターの値は区画ごとに決めず、サイト全体で同じトークンを参照します。通常フローのマージンは `gap` と呼びません。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/notation/terminology/#rule-gutter-vs-gap
- 【必須・本書の規約】`columns` の語は段組み（マルチカラム）の配置にだけ使い、Flexbox や Grid の列には使わない。（`columns-for-multicol`）
  - 理由: CSS の `columns` プロパティを連想させ、配置の方式を誤解させるため。
  - 補足: Grid の配置には `grid` を使い、Flexbox で列を並べる要素に名前が必要なら `flex-columns` のように方式を含めます。`row` は配置の結果を表す語なので、要素の名前にしません。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/notation/terminology/#rule-columns-for-multicol
- 【推奨・実装上の判断】サイトの中を移動する導線は `navigation`（または `nav`）、操作を実行したり選んだりする選択肢の一覧は `menu` と呼ぶ。（`navigation-not-menu`）
  - 理由: HTML の `<menu>` 要素と ARIA の `menu` ロールは操作の一覧を表すので、導線を `menu` と呼ぶと、メニューの振る舞いを実装すべきだと誤解させるため。
  - 補足: 導線が複数あるときは、`global-navigation` や `footer-navigation` のように、どの導線かを語で示します。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/notation/terminology/#rule-navigation-not-menu
- 【推奨・本書の規約】`text` だけの名前を付けず、1つの段落と、見出しや段落やリストを含む編集領域を呼び分ける。（`no-text-only-name`）
  - 理由: `text` では、段落なのか CMS の本文のような編集領域なのかを区別できないため。
  - 補足: 子要素の名前は役割で付けるので、多くは `._lead` や `._body` のような役割の名前になります。種類を示したいときは、段落を `paragraph`、編集領域を `rich-text` と呼びます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/notation/terminology/#rule-no-text-only-name
- 【推奨・仕様上の制約】公開プロパティやコンポーネントの名前に使った語を変えるときは、互換性のない変更として扱い、使っている箇所をすべて同時に直す。（`renaming-terms-is-breaking`）
  - 理由: 公開プロパティの名前が変わると、古い名前で値を渡している呼び出し側が、エラーを出さずにデフォルト値に戻るため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/notation/terminology/#rule-renaming-terms-is-breaking
- 【推奨・実装上の判断】クラス名に番号を使わない（`._card-1` と `._card-2` ではなく、役割の名前、`data-variant` のような属性、`:nth-child()` で区別する）。（`no-numbers-in-class-names`）
  - 理由: 番号は要素が何なのかを表さず並び順を表すだけなので、要素を足したり並べ替えたりすると番号と実体がずれるため。
  - 補足: 番号を付けたくなるのは、要素の違いがまだ言葉になっていないときです。役割がはっきりするまでは、タイプセレクタや `:nth-child()` で選び、名前を付けるのは役割を説明できるようになってからにします。段階を表すときは `--md` のような段階の名前を使います。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/notation/terminology/#rule-no-numbers-in-class-names

## 9-3 @scopeとネストの使い分け

https://t-arai-pnrm.github.io/css-coding-guideline/notation/scope-and-nesting/

- 【必須・本書の規約】スコープのルートになる要素には、必ず `scoped` クラスを付ける（例：`class="scoped news-card"`）。（`scoped-class-on-root`）
  - 理由: `scoped` クラスが外側のスコープの下限（`to (.scoped)`）になり、入れ子のコンポーネントとの境界になるため。
  - 自動チェック: Stylelint に対応する設定がないため、レビューで確認する（HTML の `class` 属性と `@scope` の前置きは、どちらも Stylelint の検査の対象外）
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/notation/scope-and-nesting/#rule-scoped-class-on-root
- 【推奨・仕様上の制約】スコープのルート要素は `:scope` で選び、`@scope` の直下では `&` を使わない。（`scope-root-with-scope-pseudo`）
  - 理由: `@scope` の直下の `&` を `:where(:scope)` として扱うブラウザは新しく、Safari では 26.2 以降に限られるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/notation/scope-and-nesting/#rule-scope-root-with-scope-pseudo
- 【推奨・本書の規約】ページ固有のスタイルは、ページのルート要素に `scoped page-<スラッグ>` を付け、`@scope (.scoped.page-<スラッグ>) to (.scoped)` の中に書く。（`page-scope-root`）
  - 理由: ページのスタイルもほかのページやコンポーネントに漏れず、コンポーネントと同じ書き方で管理できるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/notation/scope-and-nesting/#rule-page-scope-root

## 9-4 ネストの書き方

https://t-arai-pnrm.github.io/css-coding-guideline/notation/nesting/

- 【推奨・本書の規約】セレクタのネストは2層（親と、その中の1段）までにする。（`nesting-depth-one`）
  - 理由: ネストはスタイルの持ち主を示すために使うもので、HTML の階層を写したり詳細度を上げたりするために使うと、構造への依存が強まり詳細度も読み取りにくくなるため。
  - 補足: `@scope` `@media` `@container` `@supports` `@layer` などの@ルールは層に数えません。@ルールまで数えると、ファイルの構造によって同じセレクタが書けたり書けなかったりして、ルールが分散し、分かりにくくなるためです。ID は初期の「1段まで」の名残で、変えません。
  - 自動チェック: Stylelint に対応する設定がないため、レビューで確認する（`max-nesting-depth` は @ルールを数えるため使わない）
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/notation/nesting/#rule-nesting-depth-one
- 【推奨・本書の規約】ネストするのは、要素自身の擬似クラス・擬似要素・属性の状態、レイアウトに欠かせない直下の子、条件付きのアットルールに限る。（`nest-own-states-only`）
  - 理由: 1つの要素のスタイルが1か所にまとまり、独立した要素のスタイルを親のルールに抱え込まずに済むため。
  - 補足: 独立した基本のスタイルを持つ子要素は、ネストせずに同じ階層に並べます。状態の書き方は `nest-own-states` に、祖先の状態で変わるスタイルは `is-for-ancestor-context` に従います。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/notation/nesting/#rule-nest-own-states-only
- 【必須・本書の規約】要素自身の擬似クラス・擬似要素・属性の状態は、主語のセレクタに連結せず（`[popover]:popover-open`、`._link::after`）、主語のルールの中に `&:popover-open` のようにネストして書く。（`nest-own-states`）
  - 理由: 要素がどの状態でどう見えるかが1つのルールの中にまとまり、基本のスタイルを変える人が状態のルールを見落とさないため。親が1つのセレクタなら、展開した結果と詳細度は連結と同じになる。
  - 補足: ネストは2層まで、`&` で始めるという規約（`nesting-depth-one`、`nested-selector-ampersand`）の中で書きます。親（祖先）の状態で子の見た目を変えるときは、第4章のルール `is-for-ancestor-context` に従い、子のルールの中に `&:is(:scope[aria-expanded="true"] *)` のように書きます（擬似要素なら `&:is(:scope[open] *)::after`）。詳細度の違うセレクタリストの中では、ネストせずにセレクタごとのルールに分けます（`no-nesting-under-selector-list`）。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/notation/nesting/#rule-nest-own-states
- 【必須・本書の規約】ネストしたセレクタは、`&:focus-visible` や `& > ._icon` のように `&` で始める。（`nested-selector-ampersand`）
  - 理由: 親のセレクタとの関係（自身の状態か、直下の子か、子孫か）が先頭を見ただけで分かり、ネストが長くなっても、どれが親を指すかを読み違えないため。
  - 自動チェック: Stylelint: `selector-nested-pattern`
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/notation/nesting/#rule-nested-selector-ampersand
- 【禁止・仕様上の制約】`&__title` や `&--large` のように、`&` に文字をつなげてクラス名を作らない。（`no-nesting-concatenation`）
  - 理由: Sass の書き方で、素の CSS では無効なセレクタになり、ルールごと無視されるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/notation/nesting/#rule-no-nesting-concatenation
- 【必須・仕様上の制約】`@media` と `@container` は、`@scope` やファイルの直下に置かず、各セレクタの中に書く。（`conditions-inside-rules`）
  - 理由: 条件のブロックが元のルールより前に並ぶと、同じ詳細度の元のルールが後から勝ち、上書きが効かなくなるため。
  - 補足: ルート要素の条件は `:scope` の中に書きます。`@supports` も同じようにセレクタの中に書きます。
  - 自動チェック: Stylelint: `book/conditions-inside-rules`（本書の独自ルール）
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/notation/nesting/#rule-conditions-inside-rules

## 9-5 ネストの判断基準

https://t-arai-pnrm.github.io/css-coding-guideline/notation/nesting-criteria/

- 【推奨・実装上の判断】直下の子へネストしたルール（`& > ._icon`）には、`flex-shrink`、`grid-area`、`align-self` のように親のレイアウトによって意味が決まる宣言だけを書き、子自身の大きさや見た目は子のルールに書く。（`nest-child-placement-only`）
  - 理由: 親のレイアウトを変えるときに一緒に見直す宣言が親のルールの中にまとまり、子を別の親に移しても子自身の見た目が失われないため。
  - 補足: 子が自分の状態のルールやネストを持つなら、親のルールには入れず、同じ階層の独立したルールにします。子のコンポーネントの配置は、第10章のルール `parent-owns-child-placement` で扱います。親が `display: contents` にした要素を挟んでいても、その箱がないので子は実質的な直下の子です。サブグリッドの `article` の `grid-column` は、親の `ul` のルールに `& article` と書きます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/notation/nesting-criteria/#rule-nest-child-placement-only
- 【推奨・仕様上の制約】詳細度の違うセレクタを並べたセレクタリスト（`button, ._selected-count`）の中では、セレクタをネストしない。ネストが必要なら、セレクタごとのルールに分ける。（`no-nesting-under-selector-list`）
  - 理由: `&` の詳細度は親のセレクタリストを `:is()` で包んだものと同じになり、詳細度の低いほうのセレクタで一致した要素にも、リストの中でいちばん高い詳細度が付くため。
  - 補足: 宣言だけのセレクタリストと、条件付きのアットルールのネストは、詳細度を変えないので対象にしません。
  - 自動チェック: Stylelint に対応する設定がないため、レビューで確認する
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/notation/nesting-criteria/#rule-no-nesting-under-selector-list

## 9-6 プロパティの並び順

https://t-arai-pnrm.github.io/css-coding-guideline/notation/property-order/

- 【必須・本書の規約】ルールの中は、カスタムプロパティ、宣言、条件付きのアットルール、ネストしたルールの順に書く。（`block-content-order`）
  - 理由: 要素の基本のスタイルが先頭にまとまり、条件による上書きや状態の変化が後に続くので、読む順と上書きの順が一致するため。
  - 補足: 条件付きのアットルールは、`@supports`、`@container`、`@media` の順に並べます。
  - 自動チェック: Stylelint: `order/order`
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/notation/property-order/#rule-block-content-order
- 【必須・本書の規約】プロパティは taks-stylelint-order の順に並べる。（`property-order`）
  - 理由: 並び順が統一され、宣言を探しやすく、差分やレビューで変更を読み取りやすくなるため。
  - 補足: 並び順を覚える必要はありません。`stylelint --fix` で自動で並べ替えます。
  - 自動チェック: Stylelint: `order/properties-order`（taks-stylelint-order）
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/notation/property-order/#rule-property-order

## 9-7 モダンな記法にそろえる

https://t-arai-pnrm.github.io/css-coding-guideline/notation/modern-syntax/

- 【必須・本書の規約】`display` は、`block flex` や `inline flow-root` のような2値構文で書く。（`display-two-value-syntax`）
  - 理由: 要素が周りに対してどう振る舞うか（外側の表示）と、子要素をどう並べるか（内側の表示）を、値から読み取れるため。
  - 補足: `none` や `contents` のように、2値構文のない値はそのまま書きます。
  - 自動チェック: Stylelint: `plugin/display-multi-keyword-syntax`
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/notation/modern-syntax/#rule-display-two-value-syntax
- 【推奨・実装上の判断】移動、回転、拡大・縮小は、`transform` の関数ではなく、`translate`、`rotate`、`scale` の個別のプロパティで書く。（`individual-transform-properties`）
  - 理由: 変形ごとに値を変えたりトランジションを掛けたりでき、ほかの変形の値を書き直さずに済むため。
  - 補足: `skew()` のように個別のプロパティがない変形、変形を適用する順番を変える必要がある場合、X軸とY軸の回転を重ねるような3Dの複合指定（`rotate` は1つの軸しか表せないため）に限り、`transform` を使います。個別のプロパティは、宣言の順やアニメーションの途中でも、見た目の上では `scale`、`rotate`、`translate` の順に作用します。回転した向きに移動する軌道の動きのように、アニメーションで適用の順番を変える場合も `transform` を使います。「1行で書きたいから」は `transform` を使う理由にしません。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/notation/modern-syntax/#rule-individual-transform-properties
- 【必須・本書の規約】色の関数の値はカンマではなくスペースで区切り、不透明度は `/` の後ろにパーセントで書く（`rgb(0 0 0 / 80%)`）。（`color-space-separated`）
  - 理由: `oklch()` などの新しい色の関数はスペース区切りしか受け付けないので、すべての色の関数を同じ書き方にそろえられるため。
  - 自動チェック: Stylelint: `color-function-notation`、`alpha-value-notation`
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/notation/modern-syntax/#rule-color-space-separated
- 【禁止・本書の規約】`rgba()` と `hsla()` を使わず、`rgb()` と `hsl()` に統一する。（`no-rgba-hsla`）
  - 理由: `rgba()` と `hsla()` は `rgb()` と `hsl()` の別名にすぎず、`rgb()` と `hsl()` でも不透明度を指定できるため。
  - 自動チェック: Stylelint: `color-function-alias-notation`
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/notation/modern-syntax/#rule-no-rgba-hsla
- 【必須・本書の規約】色相の値には `deg` を付ける（例：`oklch(60% 0.2 250deg)`）。（`hue-degree-unit`）
  - 理由: その値が角度であることがはっきりし、明度や彩度の値と見分けやすくなるため。
  - 自動チェック: Stylelint: `hue-degree-notation`
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/notation/modern-syntax/#rule-hue-degree-unit
- 【非推奨・実装上の判断】ベンダープレフィックスは、接頭辞なしでは対象のブラウザで動かないプロパティを除いて書かない。（`no-vendor-prefix`）
  - 理由: 対象のブラウザが接頭辞なしで対応している機能に接頭辞を足しても、コードが増えるだけのため。
  - 補足: `-webkit-font-smoothing` のように標準のプロパティがないものや、Safari で `-webkit-` が必要な `box-decoration-break` などは書きます。
  - 自動チェック: Stylelint: `property-no-vendor-prefix`
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/notation/modern-syntax/#rule-no-vendor-prefix

## 9-8 論理プロパティと論理値

https://t-arai-pnrm.github.io/css-coding-guideline/notation/logical-properties/

- 【推奨・実装上の判断】寸法、余白、位置、ボーダーは、物理プロパティではなく論理プロパティで書く（`width` ではなく `inline-size`、`top` ではなく `inset-block-start`）。（`logical-properties`）
  - 理由: Flexbox、Grid、コンテナサイズクエリのような主要なレイアウトの仕組みが、書字方向を基準にした論理的な指定を前提にしているため。
  - 補足: 端末の切り欠きに合わせる `env(safe-area-inset-left)` のように、物理的な方向に意味がある値は物理プロパティで書き、Stylelint の無効化コメントと理由を添えます。論理で書けないものの扱いはルール `physical-only-where-no-logical` に従います。横書きのサイトでは、`margin-inline` を左右の余白として扱ってかまいません。
  - 自動チェック: Stylelint: `logical-css/require-logical-properties`（警告）
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/notation/logical-properties/#rule-logical-properties
- 【推奨・仕様上の制約】対応する論理的な書き方がないもの（メディアクエリの `width`、`translate` の値、`transform-origin`、`background-position`、`mask-position` など）は物理で書き、1つのルールの中で論理と物理が混ざることを許す。（`physical-only-where-no-logical`）
  - 理由: CSS の仕様そのものが論理と物理の両方を含んでおり、論理で書けないものまで論理に寄せようとすると、`direction` を配置に使うハックのような副作用のある回避策が増えるため。
  - 補足: 論理で書けるものは、ルール `logical-properties` に従って論理で書きます。`overflow-inline` と `overflow-block` は Safari 26 から対応したので、本書の対象のブラウザでは `overflow-x` と `overflow-y` を使います（2026年10月時点）。書字方向で値を変える必要があるときは、`:dir(rtl)` で分岐します。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/notation/logical-properties/#rule-physical-only-where-no-logical
- 【推奨・実装上の判断】レビューでは、論理プロパティと物理プロパティが混ざっていること（`margin-inline` と `width` が同じルールにあるなど）だけを理由に指摘しない。（`no-logical-nitpicking`）
  - 理由: 混在しても表示の結果は変わらず、指摘のやり取りが、`margin: 0 auto` の副作用や内容のあふれのような、先に直すべき問題から注意をそらすため。
  - 補足: 本書の規約を採用したプロジェクトでは、物理プロパティは Stylelint の警告で見つけてそろえます。プロジェクトが物理プロパティで統一されているなら、その統一を優先します。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/notation/logical-properties/#rule-no-logical-nitpicking

## 9-9 コメントの書き方

https://t-arai-pnrm.github.io/css-coding-guideline/notation/comments/

- 【必須・本書の規約】CSS ファイルの先頭には、そのファイルの責務と使い方を `/** */` の説明ブロックで書く。（`file-header-doc-block`）
  - 理由: 後からファイルを開いた人が、何のためのスタイルで、どう使うのかを最初に把握できるため。
  - 補足: 使用例は `@example`、参考資料は `@see` で示します。Astro のコンポーネントのように CSS をマークアップと同じファイルに書く場合は、コンポーネントの説明として書きます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/notation/comments/#rule-file-header-doc-block
- 【必須・本書の規約】`/** */` の形式は、ファイル先頭の説明ブロックだけに使う。（`doc-block-file-top-only`）
  - 理由: ファイル全体の説明と、コードの途中の補足とを、記法で見分けられるようにするため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/notation/comments/#rule-doc-block-file-top-only
- 【必須・本書の規約】公開プロパティを持つファイルでは、説明ブロックの `@prop` に、型、デフォルト値、説明を書く。（`prop-tag-for-public-properties`）
  - 理由: 使う人がコードを読まなくても、外から変えられる値とその初期値が分かるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/notation/comments/#rule-prop-tag-for-public-properties
- 【必須・実装上の判断】コードの途中のコメントには「なぜそう書くのか」と「なぜ別の書き方をしないのか」だけを書き、コードが何をしているかは書かない。（`comments-why-only`）
  - 理由: 何をしているかはコードを読めば分かり、コードと食い違ったコメントは誤解のもとになるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/notation/comments/#rule-comments-why-only
- 【禁止・実装上の判断】変更の経緯（以前の実装、日付、タスクや計画書の番号）と、コメントアウトしたコードを残さない。（`no-history-comments`）
  - 理由: 経緯はバージョン管理に残っており、コメントに書くと現在のコードを読む妨げになり、時間とともに古くなるため。
  - 補足: ブラウザの不具合の報告のように、書き方の根拠になる資料は `@see` で示してかまいません。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/notation/comments/#rule-no-history-comments
- 【推奨・本書の規約】見出しのコメントは、大見出し、セクション見出し、小見出しの3つの記法で書き分ける。（`comment-heading-styles`）
  - 理由: 見出しの階層が記法で分かり、ファイルの構造をひと目で把握できるため。
  - 補足: コメントは、インデントを含めて60文字を目安に折り返します。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/notation/comments/#rule-comment-heading-styles
- 【必須・本書の規約】TODO、FIXME、HACK は、`/* TODO: … */` のように、コメントの先頭に大文字で書く。（`todo-comment-format`）
  - 理由: 未完了の作業や一時的な対処を、検索でまとめて見つけられるようにするため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/notation/comments/#rule-todo-comment-format
