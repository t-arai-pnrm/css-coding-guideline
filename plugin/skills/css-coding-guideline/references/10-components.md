# 第10章 コンポーネントとカスタムプロパティ：ルール

- ガイドラインのバージョン: 0.48.0（2026-10-10 生成）
- ルールの数: 51
- 本文: 約15.6万字
- 読む条件: すべてのCSS（コンポーネントの境界、カスタムプロパティ、デザイントークン）（常に読む）

このファイルは「CSSコーディングガイドライン」のルールから自動生成しています。直接編集しないでください。
強度は「必須」「推奨」「非推奨」「禁止」の4段階です。「必須」と「禁止」は、各ルールの補足に書いた適用範囲と例外を除いて必ず守り、「推奨」と「非推奨」は理由があれば外れてかまいません。
性質は3種類です。「仕様上の制約」はCSS・HTML・ブラウザの振る舞いやWCAGから導かれ、守らないと表示や操作が崩れます。「実装上の判断」は状況とトレードオフで決まり、適用する条件があります。「本書の規約」は一貫性のために本書が選んだ約束で、ほかの約束を選んでも同じように成り立ちます。
背景とコード例は、各節の本文にあります。本文は MCP の `get_page`（ページID）か、URL で読みます。

## この章の節

- `components` 第10章 コンポーネントとカスタムプロパティ（約8,200字）https://t-arai-pnrm.github.io/css-coding-guideline/components/
- `components/what-is-a-component` 10-1 何をコンポーネントにするか（約1.4万字）https://t-arai-pnrm.github.io/css-coding-guideline/components/what-is-a-component/
- `components/boundaries` 10-2 コンポーネントの境界を守る（約3万字）https://t-arai-pnrm.github.io/css-coding-guideline/components/boundaries/
- `components/compositions-and-utilities` 10-3 コンポジションとユーティリティ（約2.1万字）https://t-arai-pnrm.github.io/css-coding-guideline/components/compositions-and-utilities/
- `components/design-tokens` 10-4 デザイントークン（約1.6万字）https://t-arai-pnrm.github.io/css-coding-guideline/components/design-tokens/
- `components/custom-properties` 10-5 公開プロパティと内部プロパティ（約1.5万字）https://t-arai-pnrm.github.io/css-coding-guideline/components/custom-properties/
- `components/style-queries` 10-6 スタイルクエリで状態を伝える（約2.1万字）https://t-arai-pnrm.github.io/css-coding-guideline/components/style-queries/
- `components/placement-and-child-states` 10-7 置き場所と子の状態を伝える（約1.3万字）https://t-arai-pnrm.github.io/css-coding-guideline/components/placement-and-child-states/
- `components/web-components` 10-8 Web Components（約1.8万字）https://t-arai-pnrm.github.io/css-coding-guideline/components/web-components/

## 10-1 何をコンポーネントにするか

https://t-arai-pnrm.github.io/css-coding-guideline/components/what-is-a-component/

- 【推奨・実装上の判断】コンポーネントにするかは、繰り返し使うか、全インスタンスで HTML の構造・クラス・ARIA 属性・data 属性・条件分岐・JavaScript の振る舞いを制御したいか、既知の要件として構造の拡張があるか、の順に判定する。（`component-decision-tests`）
  - 理由: コンポーネントが役に立つのは、HTML の構造や振る舞いを1つの定義から管理したいときで、見た目の共通化だけなら CSS で足りるため。
  - 補足: 繰り返し使わないものは、親のスコープの中に書きます。繰り返し使っていても CSS だけで管理できるなら、コンポーネントにしません。全インスタンスで制御したいものがはっきりあれば、2つ目の問いでコンポーネントにすると決まります。制御したいものはあるが決め手に欠けるときは、既知の構造の拡張があればコンポーネントにし、なければまだコンポーネントにしません。「3回出てきた」はパターンへの昇格の目安で、コンポーネントにする目安ではありません。セクションの導入（小見出し、見出し、リード文の組）のように判定に迷うまとまりは、デフォルトでは親の子要素として書き、バリエーションや補助の要素の有無を入力点として管理したいときにコンポーネントにします。コンポーネントにしたものは、ルートに `scoped <名前>` を付けて `@scope (.scoped.<名前>) to (.scoped)` で書き、外から変えてよい値を公開プロパティにします。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/components/what-is-a-component/#rule-component-decision-tests
- 【非推奨・実装上の判断】見た目が共通だという理由だけで、コンポーネントを作らない（段落、区切り線、単純な見出し、見た目だけをまとめた wrapper はコンポーネントにしない）。（`no-component-for-look-only`）
  - 理由: 管理したい構造や振る舞いを持たないものをコンポーネントにすると、ファイルとルートが増えるうえ、wrapper のルートの `.scoped` で親のスコープが打ち切られ、親の CSS から中身を選べなくなるため。
  - 補足: 段落と区切り線はベーススタイルとトークンで、役割のある見た目の断片はパターンで、配置はコンポジションで、単機能の補助はユーティリティで扱います。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/components/what-is-a-component/#rule-no-component-for-look-only
- 【非推奨・実装上の判断】将来必要になりそう、ほかの案件でよくある、という予測だけでコンポーネントを作らない。（`no-component-for-future-guess`）
  - 理由: 使われない入力点と分岐が定義に残り、読む人がそれを維持し続けることになるため。
  - 補足: 構造の拡張をコンポーネントにする根拠にできるのは、いまの要件、既存の実装、仕様書、既知の派生要件に書かれているときだけです。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/components/what-is-a-component/#rule-no-component-for-future-guess
- 【推奨・実装上の判断】親の中でしか意味を持たない区画（カードの見出し、本文、フッター、内側を包む要素など）は、別のコンポーネントにせず、親の `@scope` の中でタイプセレクタか子クラスで選ぶ。（`local-parts-stay-in-parent`）
  - 理由: 区画をコンポーネントに分けると、区画のルートの `.scoped` で親のスコープが打ち切られ、親の中の並びを親の CSS だけで決められなくなるため。
  - 補足: 親の外でも独立した責務と再利用の価値を持つ子要素（カードの中のボタンなど）は、別のコンポーネントにしてかまいません。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/components/what-is-a-component/#rule-local-parts-stay-in-parent
- 【推奨・実装上の判断】見た目が似ていても、役割や中に入る内容が異なるものは、別のコンポーネントにする。（`component-split-by-role`）
  - 理由: 別物を1つにまとめると分岐が増えて肥大化し、後から不要になった部分も捨てられなくなるため。
  - 補足: 見た目の共通化だけを理由に、新しいコンポーネントを作ることもしません。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/components/what-is-a-component/#rule-component-split-by-role
- 【推奨・実装上の判断】別のコンポーネントの間で見た目をそろえたいときは、コンポーネントを統合せず、同じトークンを参照する。（`share-look-with-tokens`）
  - 理由: 見た目の変更はトークンの値を変えるだけで済み、それぞれのコンポーネントは独立したまま保てるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/components/what-is-a-component/#rule-share-look-with-tokens

## 10-2 コンポーネントの境界を守る

https://t-arai-pnrm.github.io/css-coding-guideline/components/boundaries/

- 【必須・本書の規約】コンポーネントの CSS は、コンポーネントごとに1つのファイルに書き、複数のコンポーネントの CSS を1つのファイルに混ぜない。（`one-component-per-file`）
  - 理由: 混ぜると、どこに何が書いてあるかがファイル名から分からなくなり、使わなくなったコンポーネントを安全に消せなくなるため。
  - 補足: ファイル名はルートの名前とそろえます。Astro のように CSS をコンポーネントのファイルに書く環境では、そのファイルが単位になります。小さな部品でも例外にしません。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/components/boundaries/#rule-one-component-per-file
- 【非推奨・実装上の判断】コンポーネントのルートに、外部関連型のレイアウト（`margin`、`position: absolute` と `inset`、`flex`、`grid-area`、`align-self`、`inline-size`、`block-size` など）を指定しない。（`no-external-layout-on-root`）
  - 理由: 置かれる場所を前提にしたコンポーネントになり、ほかの場所に置いたときに打ち消しや上書きが必要になるため。
  - 補足: 例外は、`position: fixed` で表示するモーダル、ビューポートに粘着するグローバルヘッダーの `position: sticky` と `inset`、`inline-size: 1em` などで文字サイズに追従させるアイコンのような小さな要素です。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/components/boundaries/#rule-no-external-layout-on-root
- 【推奨・実装上の判断】子のコンポーネントの配置と外側の余白は、親の `gap` やグリッドか、親の子要素として置く Outer の要素で指定する。（`parent-owns-child-placement`）
  - 理由: 配置を決める責任を置く側にまとめれば、子のコンポーネントはどこに置かれても同じように振る舞えるため。
  - 補足: Outer は親のコンポーネントの子要素として扱い、単独のコンポーネントにはしません。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/components/boundaries/#rule-parent-owns-child-placement
- 【非推奨・実装上の判断】子のコンポーネントに `class` 属性を渡して、親から見た目や配置を変えない。（`no-class-to-child-component`）
  - 理由: 親が子のルートに自由にスタイルを当てられるようになり、どこまでが子の責任なのかが曖昧になるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/components/boundaries/#rule-no-class-to-child-component
- 【推奨・本書の規約】`@scope` の中の要素はタイプセレクタで選び、子クラスは同じ種類の要素を役割で区別するときと、`div` と `span` に役割を示すときだけ付ける（`._list` や `._link` のように要素の種類と同じ意味のクラスを付けない）。（`type-selector-in-scope`）
  - 理由: `@scope` の中のタイプセレクタはそのコンポーネントの範囲にしか当たらず、要素の種類を繰り返すだけのクラス名は情報を増やさずに記述量を増やすため。`div` と `span` は要素そのものが意味を持たず、要素の種類から役割を読み取れないため、1つしかなくてもクラスで補う。
  - 補足: `div` と `span` に付けるクラスは、`._body` や `._badge` のように役割の名前にします。役割を区別するクラスは `._main-link` と `._sub-link` のように要素の役割の語まで含めて名付け、共通のスタイルはタイプセレクタに、固有のスタイルは子クラスに書きます。スコープの中のタイプセレクタは詳細度が 0.0.1 なので `:where()` で包みません（ベーススタイルの `:where()` は第4章のルール `where-for-base-selectors`）。`a:focus-visible` や `a:any-link:hover` のように擬似クラスを付けると 0.1.1 や 0.2.1 になり子クラスに勝つので、役割ごとに違う状態のスタイルは `._sub-link:focus-visible` や `._sub-link:any-link:hover` のように子クラスの側に書きます。同じコンポーネントの中で同じ種類の要素が入れ子になるときは役割が分かれるので子クラスを付け、任意の HTML が入る領域は別のコンポーネントにします。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/components/boundaries/#rule-type-selector-in-scope
- 【推奨・実装上の判断】子要素のクラスの下にある要素を、子孫結合子のタイプセレクタ（`._summary p`）で選ばない。同じ種類の要素を領域ごとに変えたいときは、その要素にクラスを付ける。（`no-type-under-child-class`）
  - 理由: 子孫結合子は深さを問わないので、領域の中に後から足した同じ種類の要素にも当たり、どの要素が対象かを HTML の入れ子から確かめることになるため。詳細度も 0.1.1 に上がり、クラス1つのセレクタでは上書きできなくなる。
  - 補足: 領域の直下の要素を配置や余白のために選ぶときは、子要素のクラスのルールの中にネストして `& > p` と子結合子で書きます。ネストに書くのは、要素の間の余白や `grid-area` のように親のレイアウトで決まる宣言だけで、色や大きさは直下の要素でもクラスを付けて書きます（`nest-child-placement-only`）。ネストしても子孫結合子（`& p`）は使わず、`._summary > p` のように1つのセレクタに並べても書きません。CMSが出力する本文のように、マークアップにクラスを付けられない領域は例外です。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/components/boundaries/#rule-no-type-under-child-class
- 【禁止・実装上の判断】ほかのコンポーネントのルートや内部の要素を、セレクタで選んで見た目を上書きしない。（`no-other-component-internals`）
  - 理由: 詳細度の競争が起き、子の構造を変えたときに親の CSS も直す必要が出るため。
  - 補足: 値を変えたいときは、子のコンポーネントが用意した公開プロパティに値を渡します。ページの CSS から子のルートを選ぶしかない場合も、指定するのは公開プロパティの値と配置だけにします。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/components/boundaries/#rule-no-other-component-internals
- 【必須・本書の規約】z-index の値は、数値を直接書かずにトークンで指定する。（`z-index-tokens-only`）
  - 理由: 重なり順の関係が名前から読め、値の積み増しを防げるため。
  - 補足: 相対的な値の 1 と -1 も、`--z--forwards` と `--z--backwards` で指定します。
  - 自動チェック: Stylelint: `declaration-property-value-disallowed-list`（1 と -1 を含むすべての数値を警告）
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/components/boundaries/#rule-z-index-tokens-only
- 【必須・本書の規約】コンポーネントのルートには絶対的な z-index だけを、内部の要素には相対的な z-index（`--z--forwards` と `--z--backwards`）だけを指定する。（`z-index-absolute-root-relative-inside`）
  - 理由: ページ全体の重なり順と、コンポーネントの中の前後関係を分けて管理できるため。
  - 補足: 重なり順は、まず HTML の順番で解決し、足りないときだけ相対的な z-index を使います。子のコンポーネントどうしの前後は、ルートに相対的な z-index を持たせず、親のコンポーネントが子を包む Outer の要素で指定します。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/components/boundaries/#rule-z-index-absolute-root-relative-inside
- 【必須・仕様上の制約】内部の要素で相対的な z-index を使うコンポーネントは、ルートに `isolation: isolate` を指定する。（`isolation-for-relative-z-index`）
  - 理由: 内部の z-index がほかのコンポーネントと干渉せず、-1 の要素がルートや親の背景の下に隠れることもなくなるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/components/boundaries/#rule-isolation-for-relative-z-index
- 【推奨・仕様上の制約】トップレイヤーに表示する `<dialog>` や `popover` 属性の要素にも、`z-index: var(--z--top)`（値は `calc(infinity)`）を指定する。（`top-layer-z-index-top`）
  - 理由: `transition-property: overlay` に対応していないブラウザでは、閉じるアニメーションの途中で z-index の大きい要素の下に潜り込むことがあるため。
  - 補足: 2026年9月の時点で、`overlay` に対応しているのは Chromium 系のブラウザだけです。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/components/boundaries/#rule-top-layer-z-index-top

## 10-3 コンポジションとユーティリティ

https://t-arai-pnrm.github.io/css-coding-guideline/components/compositions-and-utilities/

- 【推奨・実装上の判断】積む、並べて折り返す、列数を切り替えるといった、コンポーネントに依存しない配置は、コンポジション（`stack`、`cluster`、`switcher` など）で書く。（`compositions-for-layout-patterns`）
  - 理由: 折り返しなどの守りの指定が1か所に集まり、HTML のクラス名から配置の意図が読めるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/components/compositions-and-utilities/#rule-compositions-for-layout-patterns
- 【推奨・実装上の判断】コンポジションには配置に関わる指定だけを書き、色や文字の大きさなどの見た目を持たせない。（`composition-layout-only`）
  - 理由: どのコンポーネントの中でも、配置の部品として同じように使えるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/components/compositions-and-utilities/#rule-composition-layout-only
- 【推奨・実装上の判断】コンポジションの間隔や列数は、修飾のクラスを増やさず、`--stack--gap` のような公開プロパティで受け取る。（`composition-configurable-via-props`）
  - 理由: 使う側が `style` 属性で値を渡せ、1つのクラスでさまざまな間隔や列数に対応できるため。
  - 補足: 公開プロパティの一覧は、ファイルの先頭の説明ブロックに `@prop` で書きます（第9章のルール `prop-tag-for-public-properties`）。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/components/compositions-and-utilities/#rule-composition-configurable-via-props
- 【推奨・実装上の判断】コンポジションの間隔のデフォルト値は `0` にし、間隔は使う側で指定する。（`composition-default-gap-zero`）
  - 理由: 間隔は置く文脈で決まる値なので、指定し忘れた箇所に意図しない余白が付くのを防ぐため。
  - 補足: 行と列の間隔を持つコンポジションでは、`--cluster--gap` で一括に、`--cluster--row-gap` と `--cluster--column-gap` で個別に指定できるようにします。`switcher` や `grid` のように間隔を `calc()` で長さと足し合わせるコンポジションでは、デフォルト値を `0px` にします（`switcher-gap-default-with-unit`）。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/components/compositions-and-utilities/#rule-composition-default-gap-zero
- 【推奨・実装上の判断】ユーティリティは、`.-visually-hidden` のように、どこに付けても同じ意味を持つ単機能のクラスに限る。（`utility-single-purpose`）
  - 理由: `utilities` レイヤーはコンポーネントより優先されるので、どこで勝っても困らないものでなければならないため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/components/compositions-and-utilities/#rule-utility-single-purpose
- 【推奨・実装上の判断】余白や配置の細かな調整は、まずコンポーネントの CSS で行い、次にコンポジションやユーティリティ、その次にパターンを検討する。（`adjust-locally-first`）
  - 理由: その場の都合で共通の部品を増やすと、共通の部品が何のためにあるのかが分からなくなるため。
  - 補足: 「ここだけ影がほしい」のような都合だけで、パターンやコンポーネントを作りません。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/components/compositions-and-utilities/#rule-adjust-locally-first
- 【推奨・仕様上の制約】パターンには、重ねるコンポーネントが指定しないプロパティだけを書き、コンポーネントの側で変える値は `--<パターン>--<プロパティ>` の公開プロパティで受け取る。（`pattern-leaves-component-properties`）
  - 理由: `patterns` は `components` より後ろのレイヤーにあり、パターンを付けた要素では、コンポーネントの CSS（状態や `@container` の中の指定を含む）が同じプロパティに詳細度を上げても勝てないため。
  - 補足: 公開プロパティは、パターンの中で宣言せず、`--_p--size: var(--icon--size, 1em);` のように `--_p--` で始まる内部プロパティに受けて、デフォルト値をフォールバックに書きます。`:hover` などの状態で見た目が変わるものは、パターンにせずコンポーネントにします。強さはレイヤーの順番で決まるので、パターンのセレクタを `:where()` で包んで詳細度を下げる必要はありません。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/components/compositions-and-utilities/#rule-pattern-leaves-component-properties

## 10-4 デザイントークン

https://t-arai-pnrm.github.io/css-coding-guideline/components/design-tokens/

- 【必須・本書の規約】トークンは `--<分類>--<名前>` の形で名付ける（例：`--color--neutral--500`、`--spacing--md`）。（`token-naming-category-first`）
  - 理由: 先頭の分類で値の種類が分かり、コンポーネントの公開プロパティとも見分けられるため。
  - 補足: 色の役割を表すセマンティクスのトークンは、`--<役割>--<バリエーション>`（例：`--foreground--muted`）にします。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/components/design-tokens/#rule-token-naming-category-first
- 【推奨・本書の規約】トークンは分類ごとのファイルに分けて `:root` に定義し、`tokens` レイヤーに入れる。（`tokens-on-root`）
  - 理由: サイト全体の値の一覧が1か所にまとまり、CSS から参照できるデザインガイドとして使えるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/components/design-tokens/#rule-tokens-on-root
- 【推奨・実装上の判断】色のトークンはプリミティブとセマンティクスの2層で定義し、デザインにない固有の色はグローバルなトークンにしない。（`color-token-two-layers`）
  - 理由: 配色の変更やダークモードをセマンティクスの層で吸収でき、トークンの一覧もデザインの取り決めだけに保てるため。
  - 補足: 固有の色は、コンポーネントの内部プロパティか、直接書いた値で扱います。影は形をスケールのトークンにし、各層の色だけをセマンティクスにします（`box-shadow` の値全体は `light-dark()` で切り替えられないため）。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/components/design-tokens/#rule-color-token-two-layers
- 【推奨・実装上の判断】文字のトークンは、プリミティブの `--font-size--*` と、役割ごとの `--text--<役割>--font-size` と `--text--<役割>--leading` の組の2層で定義し、コンポーネントからは役割を参照する。（`typography-token-two-layers`）
  - 理由: 同じ文字サイズを複数の役割が使うので、役割ごとに大きさを変えられ、文字サイズと行の高さも役割を選ぶだけでそろうため。
  - 補足: 文字サイズは単位なしのピクセル相当の数値で持ち、`calc(var(--text--body--font-size) / 16 * 1rem)` のように使う場所で変換します。余白、角丸、影の形、モーションは1層のスケールのままにします。役割の層を作ると、1つのコンポーネントでしか使わない名前が増えるためです（`no-single-use-token`）。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/components/design-tokens/#rule-typography-token-two-layers
- 【禁止・実装上の判断】1回しか使わない値や、特定のコンポーネントだけで使う値を、グローバルなトークンにしない。（`no-single-use-token`）
  - 理由: トークンがサイト全体の取り決めではなくなり、一覧から選ぶだけで取り決めに沿えるという利点が失われるため。
  - 補足: 1つのコンポーネントの中で意味を持つ値は、内部プロパティにして名前を付けます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/components/design-tokens/#rule-no-single-use-token
- 【推奨・実装上の判断】トークンとして定義されている値は、数値や色を直接書かずにトークンを参照する。（`use-defined-tokens`）
  - 理由: デザインの変更をトークンの修正だけで反映でき、わずかに違う値が紛れ込むのを防げるため。
  - 補足: トークンに定義されていない特殊な値は、トークンを追加せずにその場に直接書きます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/components/design-tokens/#rule-use-defined-tokens
- 【推奨・実装上の判断】イージングと再生時間はトークンにし、イージングは `--ease--out-quint` のように強さと方向が分かる名前にする。（`motion-tokens`）
  - 理由: サイトの中で動きの速さと質感がそろい、全体の調整もトークンの値を変えるだけで済むため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/components/design-tokens/#rule-motion-tokens
- 【推奨・本書の規約】z-index のトークンは、絶対的な値を100刻みで定義し、相対的な値は `--z--forwards`（1）と `--z--backwards`（-1）の2つだけにする。（`z-index-token-scale`）
  - 理由: 後から新しい要素を間に差し込め、コンポーネントの中の重なりも2つの値で足りるため。
  - 補足: ヘッダーのすぐ手前に重ねるときは、`calc(var(--z--header) + 1)` のようにトークンを基準に計算します。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/components/design-tokens/#rule-z-index-token-scale

## 10-5 公開プロパティと内部プロパティ

https://t-arai-pnrm.github.io/css-coding-guideline/components/custom-properties/

- 【必須・本書の規約】外から変えてよい値は、`--<コンポーネント>--<プロパティ>` の公開プロパティにする（例：`--card--radius`）。（`public-property-naming`）
  - 理由: ほかのコンポーネントとの名前の衝突を防ぎ、どのコンポーネントの値かが名前から分かるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/components/custom-properties/#rule-public-property-naming
- 【必須・本書の規約】コンポーネントの中だけで使う値は、`--_` で始まる内部プロパティにする。（`internal-property-prefix`）
  - 理由: 外から変えてよい値と、内部の都合の値を名前で見分けられるため。
  - 補足: コンポジションは `--_c--`、パターンは `--_p--`、ユーティリティは `--_u--`、ベースのスタイルは `--_b--` で始めます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/components/custom-properties/#rule-internal-property-prefix
- 【必須・仕様上の制約】公開プロパティはコンポーネント自身では宣言せず、`:scope` で内部プロパティに受けて、デフォルト値を `var()` のフォールバックに書く。（`receive-public-property-with-fallback`）
  - 理由: コンポーネント自身で宣言すると、親から継承した値がその宣言に負けて届かなくなるため。
  - 補足: 例：`--_radius: var(--card--radius, 8px);`
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/components/custom-properties/#rule-receive-public-property-with-fallback
- 【必須・本書の規約】状態やモードで変わる値は、`--_background--hocus` のように `--` で区切った接尾辞で表し、デフォルトの状態には接尾辞を付けない。（`state-suffix-for-custom-properties`）
  - 理由: 状態ごとの値を `:scope` の先頭に並べて見渡せ、状態のセレクタでは参照を切り替えるだけで済むため。
  - 補足: 幅などの条件で変わる値を受け取る公開プロパティにも、`--media-card--gap--wide` のように同じ形の接尾辞を付けます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/components/custom-properties/#rule-state-suffix-for-custom-properties
- 【推奨・実装上の判断】公開プロパティの値は、できるだけ呼び出し側の `style` 属性で渡す。（`pass-values-via-style-attribute`）
  - 理由: 値が対象のタグと同じ場所に書かれ、セレクタや詳細度に依存せずに渡せるため。
  - 補足: 複数の子にまとめて渡すとき、クエリで値を切り替えるとき、`:hover` や `:has()` などの状態で値を変えるときは、CSS で渡してもかまいません。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/components/custom-properties/#rule-pass-values-via-style-attribute
- 【推奨・実装上の判断】`@property` は、型の指定やアニメーションが必要なカスタムプロパティにだけ使い、トークンの定義には使わない。（`at-property-only-when-needed`）
  - 理由: 登録すると値を定義した要素で計算されるなど振る舞いが変わり、不要な登録は予期しない結果を招くため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/components/custom-properties/#rule-at-property-only-when-needed
- 【必須・仕様上の制約】`@property` では、`syntax`、`inherits`、`initial-value` の3つの記述子を省略しない。（`at-property-all-descriptors`）
  - 理由: `syntax` か `inherits` が欠けると、`@property` のルールごと無視されるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/components/custom-properties/#rule-at-property-all-descriptors
- 【推奨・実装上の判断】トランジションやアニメーションで値を動かすカスタムプロパティは、`inherits: false` で登録し、`opacity` や `translate` だけを動かすならカスタムプロパティを介さずに直接動かす。（`animated-property-no-inherit`）
  - 理由: 継承するカスタムプロパティを動かすと、子孫の要素すべてでスタイルの計算がフレームごとに繰り返され、カスタムプロパティを介すと合成処理だけで済まなくなるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/components/custom-properties/#rule-animated-property-no-inherit

## 10-6 スタイルクエリで状態を伝える

https://t-arai-pnrm.github.io/css-coding-guideline/components/style-queries/

- 【必須・本書の規約】コンテナサイズクエリ（`@container --scoped (…)`）は、コンポーネントの中で、フラグを宣言する1つの要素のルールだけに書く。その要素はクエリの外で `--_density: --compact` をデフォルト値として宣言してクエリの中で `--_density: --spacious` に切り替え、ほかの子孫は `@container style(--_density: --spacious)` で切り替える。（`density-via-style-query`）
  - 理由: 閾値が1か所にまとまり、変えるときに直す場所が1つで済むため。子要素ごとにコンテナサイズクエリを書くと、直し忘れたときに、どの幅のデザインにもない中間の状態ができる。
  - 補足: フラグを宣言した要素自身はスタイルクエリで問い合わせられないので、その要素の見た目は同じサイズクエリの中で変えます。`:scope` に書いた `@container --scoped (…)` は外側のコンポーネントを問い合わせるので、フラグは `._body` のようなルートの子孫に置きます。3段階が要るときだけ `--regular` を足し、`--compact`、`--regular`、`--spacious` の順に切り替えます。狭いときの見た目がブラウザのデフォルトのスタイルを打ち消すもの（表を縦に積む、ラベルを隠すなど）は、広いときに戻す宣言が要らないよう、`@container style(--_density: --compact)` の側に書いてかまいません。サイズクエリを書く要素が1つだけで、フラグを読む子孫がない場合はフラグを宣言しません。切り替えが4段階以上あり、閾値の式そのもの（列の最小幅と間隔の掛け算など）を見せる必要がある場合は、例外としてサイズクエリを子のルールに残します。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/components/style-queries/#rule-density-via-style-query
- 【必須・本書の規約】親や自身のホバーとフォーカスで子要素や擬似要素の見た目を変えるときは、`--_hocus: --false` をデフォルト値として宣言し、`&:any-link:hover`（`@media (any-hover)` の中）と `&:focus-visible` で `--_hocus: --true` に切り替え、子要素と擬似要素は `@container style(--_hocus: --true)` で切り替える。（`hocus-via-style-query`）
  - 理由: ホバーとフォーカスの2つの条件を1か所に書けば済み、子孫結合子で子を選ぶ書き方（`&:any-link:hover ._icon`）と違って詳細度が上がらず、子の見た目が子のルールにまとまるため。
  - 補足: 擬似要素（`::before`、`::after`、`::marker`）のスタイルクエリは元の要素を問い合わせるので、自身の擬似要素もこの形で書けます。フラグを立てた要素自身の見た目は、状態のセレクタに直接書きます。子の状態で親自身の見た目を変えるときは `:has()` を使い、子孫のホバーとフォーカスをほかの子孫に伝えるときは、`&:has(:any-link:hover)`（`@media (any-hover)` の中）と `&:has(:focus-visible)` で `--_has-hocus: --true` を立てます。キーボード操作のときにトランジションを外すなど、ホバーとフォーカスで子の振る舞いを分けたいときは、`&:focus-visible` で `--_focus-visible: --true` のような2つ目のフラグを立てます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/components/style-queries/#rule-hocus-via-style-query
- 【必須・本書の規約】スタイルクエリで問い合わせるフラグの値は、`--compact` のような `--` で始まる識別子にし、オンとオフの2値の状態は `--true` と `--false` にそろえる。（`state-flag-values`）
  - 理由: スタイルクエリは値が一致するかどうかだけを調べるので、`1` や `true` が混ざると、書き間違えても条件が成り立たないだけで誤りに気付けないため。`--` で始めれば、自分で付けた名前だと分かる。
  - 補足: `--color-scheme: --light` のように、2値でも状態の名前そのものを値にするフラグは、そのままにします。範囲の比較（`style(--_columns > 2)`）はSafariが対応していないので使いません（2026年10月確認）。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/components/style-queries/#rule-state-flag-values

## 10-7 置き場所と子の状態を伝える

https://t-arai-pnrm.github.io/css-coding-guideline/components/placement-and-child-states/

- 【推奨・実装上の判断】置き場所の構造によってコンポーネントの見た目を変えるときは、置く側が子のルートを包む要素で公開プロパティのフラグ（`--product-card--featured: --true`）を宣言し、子は `:scope` で内部プロパティ（`--_featured: var(--product-card--featured, --false)`）に受けて、自分の幅のフラグと `@container style(--_density: --spacious) and style(--_featured: --true)` のように組み合わせる。（`placement-via-public-flag`）
  - 理由: 子の見た目が子のファイルにまとまり、置き場所が増えても子の CSS を変えずに済むため。置く側のセレクタから子の内部を選んだり、外側の要素のコンテナを問い合わせたりすると、子が置き場所の構造に依存する。
  - 補足: 置く側が渡すのは状態だけにし、文字サイズのような見た目の値は渡しません。編集者が選ぶ特集のように、置き場所の構造から決まらないものは、HTMLの `data-variant` で指定します。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/components/placement-and-child-states/#rule-placement-via-public-flag

## 10-8 Web Components

https://t-arai-pnrm.github.io/css-coding-guideline/components/web-components/

- 【推奨・本書の規約】カスタム要素で作る部品は、カスタム要素そのものに `scoped` クラスを付けてルートにし、CSS は外部のファイルに `@scope (<要素名>.scoped) to (.scoped)` の形で書く。（`custom-element-as-scope-root`）
  - 理由: 要素名がコンポーネントの名前を受け持ち、`scoped` クラスが外側のスコープの下限になるので、ほかのコンポーネントと同じ規約で境界を作れるため。
  - 補足: 名前のクラス（`scoped <名前>` の `<名前>`）は付けません。カスタム要素の中に `<style>` を置いて前置きのない `@scope` で書く方法は、部品を置いた数だけ同じ `<style>` が出力され、CSS がコンポーネントごとのファイルにまとまらないので使いません。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/components/web-components/#rule-custom-element-as-scope-root
- 【必須・仕様上の制約】カスタム要素のルートには、`display: block flow` のように `display` を明示する。（`custom-element-root-display`）
  - 理由: カスタム要素にはブラウザのデフォルトスタイルがなく、`display` が初期値の `inline` になるので、中にブロックの要素を置くと幅の指定が効かず、背景や枠線も中身を囲む形で描かれないため。
  - 補足: Shadow DOM で作る部品では、`:host` に書きます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/components/web-components/#rule-custom-element-root-display
- 【推奨・実装上の判断】JavaScript がなくても動く HTML（`popover` 属性、`<dialog>` と `command` 属性など）を先に作り、カスタム要素は振る舞いを足すだけにする。（`custom-element-enhances-html`）
  - 理由: スクリプトの読み込みが遅れたり失敗したりしても部品を操作でき、開閉やフォーカスの扱いを自作せずにブラウザに任せられるため。
  - 補足: ホバーで開く、フォーカスが外に出たら閉じる、View Transitions で開閉をつなぐ、設定を保存する、といった処理をカスタム要素が受け持ちます。定義前の表示を `:not(:defined)` で変えるときも、中身は隠しません（5-7）。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/components/web-components/#rule-custom-element-enhances-html
- 【推奨・実装上の判断】カスタム要素の設定は、振る舞いの設定を属性（`hoverable` など）で、見た目の設定を公開プロパティ（`--<要素名>--<プロパティ>`）で受け取る。（`custom-element-settings-attrs-and-props`）
  - 理由: 見た目の設定を公開プロパティにすれば、JavaScript が動く前から CSS だけで値が届き、親から継承でまとめて渡すこともできるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/components/web-components/#rule-custom-element-settings-attrs-and-props
- 【推奨・実装上の判断】ページから子要素を受け取る部品は Light DOM で作り、Shadow DOM は中身をすべて自分で描く部品に限って使う。（`light-dom-for-received-children`）
  - 理由: 子要素を受け取る部品を Shadow DOM で作ると、子要素はページの DOM に残り、それを囲む要素だけが Shadow DOM に入るので、1つの部品の CSS がページの CSS ファイルと Shadow DOM の中に分かれるため。
  - 補足: Light DOM で作れば、部品の CSS は1つのファイルにまとまり、kiso.css のリセットやユーティリティもそのまま当たります。Shadow DOM の中には、ページのセレクタが当たらず、継承する値（カスタムプロパティを含む）だけが届きます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/components/web-components/#rule-light-dom-for-received-children
- 【推奨・本書の規約】Shadow DOM の CSS では、`:host` に `display` と内部プロパティを書き、中の要素はクラスや `@scope` を使わずに要素と属性のセレクタで選ぶ。（`shadow-dom-host-and-element-selectors`）
  - 理由: Shadow DOM の境界がスコープの役目を果たすので、短いセレクタでも外に漏れず、ページのセレクタも中に当たらないため。
  - 補足: CSS は `<template>` の中の `<style>` に書き、`attachShadow()` で作った Shadow DOM に複製します。ネスト、`@media (any-hover)` の中のホバー、`prefers-reduced-motion: no-preference` の中の動きは、Light DOM と同じ規約で書きます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/components/web-components/#rule-shadow-dom-host-and-element-selectors
- 【推奨・仕様上の制約】Shadow DOM の中では、ページのトークンをカスタムプロパティで参照し、kiso.css のリセットやユーティリティに頼っていた指定は中に書く。（`shadow-dom-restate-page-styles`）
  - 理由: カスタムプロパティは継承で境界を越えて届くが、ページのリセットとユーティリティのクラスは中の要素に当たらないため。
  - 補足: たとえば、ボタンの `font` と `color` はブラウザのデフォルトに戻るので `inherit` を指定し、`.-visually-hidden` と同じ指定は中の要素に直接書きます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/components/web-components/#rule-shadow-dom-restate-page-styles
