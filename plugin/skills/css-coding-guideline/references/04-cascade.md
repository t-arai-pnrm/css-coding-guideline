# 第4章 カスケードを制御する：ルール

- ガイドラインのバージョン: 0.44.1（2026-10-09 生成）
- ルールの数: 22
- 本文: 約7.3万字
- 読む条件: @layer、!important、詳細度、セレクタの重ね掛け、:is()、:where()、上書きの順番

このファイルは「CSSコーディングガイドライン」のルールから自動生成しています。直接編集しないでください。
強度は「必須」「推奨」「非推奨」「禁止」の4段階です。「必須」と「禁止」は、各ルールの補足に書いた適用範囲と例外を除いて必ず守り、「推奨」と「非推奨」は理由があれば外れてかまいません。
性質は3種類です。「仕様上の制約」はCSS・HTML・ブラウザの振る舞いやWCAGから導かれ、守らないと表示や操作が崩れます。「実装上の判断」は状況とトレードオフで決まり、適用する条件があります。「本書の規約」は一貫性のために本書が選んだ約束で、ほかの約束を選んでも同じように成り立ちます。
背景とコード例は、各節の本文にあります。本文は MCP の `get_page`（ページID）か、URL で読みます。

## この章の節

- `cascade` 第4章 カスケードを制御する（約3,200字）https://t-arai-pnrm.github.io/css-coding-guideline/cascade/
- `cascade/cascade-basics` 4-1 カスケード・詳細度・継承（約1.3万字）https://t-arai-pnrm.github.io/css-coding-guideline/cascade/cascade-basics/
- `cascade/selectors` 4-2 セレクタで詳細度を設計する（約1.1万字）https://t-arai-pnrm.github.io/css-coding-guideline/cascade/selectors/
- `cascade/layers` 4-3 カスケードレイヤーで順位を決める（約1.8万字）https://t-arai-pnrm.github.io/css-coding-guideline/cascade/layers/
- `cascade/scope` 4-4 @scopeでスタイルを閉じ込める（約1.6万字）https://t-arai-pnrm.github.io/css-coding-guideline/cascade/scope/
- `cascade/nesting` 4-5 CSSネストの基礎（約1.2万字）https://t-arai-pnrm.github.io/css-coding-guideline/cascade/nesting/

## 4-1 カスケード・詳細度・継承

https://t-arai-pnrm.github.io/css-coding-guideline/cascade/cascade-basics/

- 【推奨・実装上の判断】スタイルの優先順位は詳細度の高さで決めず、レイヤーの順番と書く順番で決める。（`order-by-layer-not-specificity`）
  - 理由: 詳細度で優先順位を決めると、上書きのたびにセレクタが重くなり、後から誰も上書きできなくなるため。
  - 補足: 詳細度は、ベースでは 0、コンポーネントの中ではクラス1つ分（0.1.0）を基本にそろえます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/cascade/cascade-basics/#rule-order-by-layer-not-specificity
- 【禁止・実装上の判断】詳細度や読み込み順の競争に勝つ目的で `!important` を使わない。（`no-important-for-specificity`）
  - 理由: スタイルの宣言どうしでは `!important` を打ち消せるのは `!important` だけなので、上書きのたびに `!important` が増えていくため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/cascade/cascade-basics/#rule-no-important-for-specificity
- 【推奨・実装上の判断】`!important` は、`[hidden]` を確実に隠す、CMS が要素に出力する `style` 属性を打ち消すなど、ほかの手段では実現できない場面に限って使う。（`important-only-for-guarantees`）
  - 理由: どのような上書きにも負けてはいけない指定だけに絞れば、`!important` 同士の競争が起きないため。
  - 補足: レイヤーの中の `!important` は、前のレイヤーほど強くなります。ユーティリティは `utilities` レイヤーに置けば、`!important` なしで勝ちます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/cascade/cascade-basics/#rule-important-only-for-guarantees
- 【推奨・実装上の判断】`color` や `font-size` のように継承されるプロパティは、`:root` やコンポーネントのルートでまとめて指定し、子要素では継承を使う。（`inherit-from-root`）
  - 理由: 同じ値を子要素ごとに指定し直すと、ルートの値を変えたときに直す場所が増えるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/cascade/cascade-basics/#rule-inherit-from-root
- 【推奨・実装上の判断】値を戻すときは、`initial`、`unset`、`revert`、`revert-layer` のうち、戻したい先に合うキーワードを選んで書く。（`explicit-rollback-keyword`）
  - 理由: 具体的な値を書き直すより、どこまで戻したいのかという意図がコードに残るため。
  - 補足: `display: initial` は、要素の種類に関係なく `inline` になります。ブラウザのデフォルトスタイルに戻すなら `revert` を使います（`revert` はサイトの CSS の指定を取り除くので、ユーザーのスタイルがあればその値になります）。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/cascade/cascade-basics/#rule-explicit-rollback-keyword
- 【非推奨・仕様上の制約】プロパティをまとめて戻すときに `all: unset` を使わず、レイヤーを使うなら `all: revert-layer`、使わないなら `all: revert` を指定する。（`no-all-unset`）
  - 理由: `unset` は継承されないプロパティを初期値に戻すので、`display` が `inline` になり、ブラウザのデフォルトスタイルのうち必要なものまで消えるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/cascade/cascade-basics/#rule-no-all-unset

## 4-2 セレクタで詳細度を設計する

https://t-arai-pnrm.github.io/css-coding-guideline/cascade/selectors/

- 【禁止・実装上の判断】ID セレクタでスタイルを指定しない。（`no-id-selector`）
  - 理由: 詳細度が 1.0.0 になり、クラスをいくつ重ねても上書きできなくなるため。
  - 補足: id 属性は、JavaScript から参照するとき、ARIA の属性で参照するとき、ページ内リンクの移動先にするときに限って使います。
  - 自動チェック: Stylelint: `selector-max-id`
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/cascade/selectors/#rule-no-id-selector
- 【禁止・実装上の判断】上書きのために、`.a.a`、`.a[class]`、`.a:not(#_)` のような詳細度を上げるためだけのセレクタや、祖先やタイプセレクタを足したセレクタを書かない。（`no-specificity-hacks`）
  - 理由: 意図がコードから読み取れず、次の上書きでさらに詳細度を上げる必要が生まれるため。
  - 補足: 上書きが必要になったら、レイヤーの順番、`:where()`、公開カスタムプロパティで解決できないかを先に検討します。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/cascade/selectors/#rule-no-specificity-hacks
- 【必須・仕様上の制約】`@layer` を使えない場合に限り、ベーススタイルのセレクタを `:where()` で包み、詳細度を 0 にする（例：`:where(a:any-link)`）。（`where-for-base-selectors`）
  - 理由: レイヤーがなければ優先順位が読み込む順番と詳細度だけで決まり、`a:any-link`（0.1.1）のような指定をクラス1つでは上書きできなくなるため。
  - 補足: `@layer` を使う場合は、ベーススタイルを `base` レイヤーに素のセレクタ（`a:any-link`、`:focus-visible`、`:root:has(:modal)` など）で書きます。後のレイヤーの指定は詳細度に関係なく勝つので、コンポーネントのクラス1つで上書きできます。リセット CSS の kiso.css が `:where()` で書かれているのは、レイヤーなしでも使える配布物だからです。上書きされる前提のデフォルト値（リセットで消した `list-style-type` を戻す `:where(ul, ol)` など）は、`@layer` や `@scope` の中でも `:where()` で詳細度を 0 にしてかまいません（`is-for-state-selectors`）。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/cascade/selectors/#rule-where-for-base-selectors
- 【推奨・仕様上の制約】`:is()`、`:not()`、`:has()` の引数には、詳細度の高いセレクタを混ぜない。（`is-keeps-highest-specificity`）
  - 理由: これらの擬似クラスの詳細度は、引数の中でいちばん高いセレクタの詳細度になるため。
  - 補足: まとめたいだけで詳細度を加えたくないときは、`:where()` を使います。ただし、状態のセレクタは詳細度を残すために `:is()` でまとめます（ルール `is-for-state-selectors`）。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/cascade/selectors/#rule-is-keeps-highest-specificity
- 【推奨・本書の規約】祖先の状態によって変わるスタイルは、子のルールの中に `&:is(<祖先のセレクタ> *)` の形で書く。（`is-for-ancestor-context`）
  - 理由: ひとつの要素のスタイルがひとつのルールにまとまり、ネストのセレクタを `&` で始める規約とも両立するため。
  - 補足: 例：`&:is(:scope[open] *)` は、スコープのルートの `<details>` が開いているときだけ当てはまります。祖先のホバーとフォーカスで変わる見た目は、この形ではなく `hocus-via-style-query` に従い、`--_hocus` のフラグをスタイルクエリで問い合わせます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/cascade/selectors/#rule-is-for-ancestor-context

## 4-3 カスケードレイヤーで順位を決める

https://t-arai-pnrm.github.io/css-coding-guideline/cascade/layers/

- 【必須・本書の規約】レイヤーの順序は、読み込むCSSの先頭で `@layer tokens, reset, base, vendors, compositions, pages, components, patterns, utilities;` と宣言する。（`layer-order-declaration`）
  - 理由: レイヤーの順番は最初に現れた順で決まるので、先頭で宣言すれば `@import` やスタイルを書く順番に左右されなくなるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/cascade/layers/#rule-layer-order-declaration
- 【推奨・本書の規約】ファイル単位でレイヤーに入れるときは、`@import url("…") layer(<レイヤー>);` で割り当てる。（`import-into-layer`）
  - 理由: どのファイルがどのレイヤーに入るのかを1か所で確認でき、各ファイルの中に `@layer` を書かずに済むため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/cascade/layers/#rule-import-into-layer
- 【必須・実装上の判断】`@import` は、フレームワークや PostCSS のプラグインなどでビルド時に展開し、ブラウザで実行させない。（`import-resolved-at-build`）
  - 理由: ブラウザは `@import` を書いたファイルを読み込んで解析するまで次の読み込みを始められず、読み込みが直列になって最初の表示が著しく遅れるため。
  - 補足: Astro（Vite）は `@import` をビルド時に展開し、`layer()` の指定も `@layer` のブロックとして残します。CMS と共存する案件でも、自分で書いた CSS はビルドを通してから配信します。「最小の構成で始める」のように、学習や検証のためにビルドせずに手元で試す場合は除きます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/cascade/layers/#rule-import-resolved-at-build
- 【必須・仕様上の制約】`@layer` と `@import` の `layer()` には、先頭の `@layer` 文で宣言した9つのレイヤー名だけを使う。（`declared-layer-names-only`）
  - 理由: 宣言していない名前はエラーにならず、最後に宣言したレイヤーより後ろに新しいレイヤーとして作られるので、打ち間違えると順番が崩れるため。
  - 自動チェック: Stylelint: `layer-name-pattern`
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/cascade/layers/#rule-declared-layer-names-only
- 【推奨・仕様上の制約】自分で読み込むサードパーティのCSSは、`@import url("…") layer(vendors);` で `vendors` レイヤーに入れる。（`third-party-in-vendors`）
  - 理由: レイヤーの外に置くとどのスタイルよりも強くなり、自分のコンポーネントから上書きできなくなるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/cascade/layers/#rule-third-party-in-vendors
- 【禁止・仕様上の制約】レイヤーを使うプロジェクトでは、`@layer` の外にスタイルを書かない。（`no-unlayered-styles`）
  - 理由: レイヤーの外のスタイルは詳細度に関係なくすべてのレイヤーに勝つので、決めた順番が崩れるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/cascade/layers/#rule-no-unlayered-styles
- 【推奨・本書の規約】ページ固有のセクションは `pages` レイヤーに、複数の場所で使うコンポーネントは `components` レイヤーに書く。（`layer-by-role`）
  - 理由: レイヤーの役割とファイルの置き場所が対応し、クエリの選び方（ページはメディアクエリ、コンポーネントはコンテナサイズクエリ）もそろうため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/cascade/layers/#rule-layer-by-role
- 【必須・仕様上の制約】CMS のように、レイヤーに入っていない外部のCSSと共存する環境では `@layer` を使わず、9つの分類はディレクトリ構成と `@import` の順番で保つ。（`no-layers-with-unlayered-css`）
  - 理由: レイヤーの外のCSSは詳細度に関係なくレイヤーの中のCSSに勝つので、自分のCSSだけをレイヤーに入れると構造的に負けるため。
  - 補足: 判断の基準は「外部のCSSを自分で読み込み、レイヤーに入れられるかどうか」です。壊れた既存のCSSから新しいコンポーネントを切り離すときに限り、`revert-layer-isolation-for-legacy` の書き方でレイヤーを使ってよいです。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/cascade/layers/#rule-no-layers-with-unlayered-css
- 【推奨・実装上の判断】直せない既存のCSSがコンポーネントに流れ込むときは、レイヤーの中でコンポーネントの要素すべてに `all: revert-layer !important` を指定し、コンポーネント自身のスタイルは同じレイヤーの入れ子の無名レイヤーに書く。（`revert-layer-isolation-for-legacy`）
  - 理由: `!important` どうしではレイヤーの順番が逆になるので、レイヤーの外のスタイルを詳細度や `!important` に関係なく遮断でき、入れ子のレイヤーの値だけを戻せるため。
  - 補足: 後ろのレイヤーやユーティリティクラスも遮断されます。`style` 属性に `!important` を付けた指定は防げません。`all` はカスタムプロパティを戻さず、`*` は擬似要素を選ばないので、継承する値に加え、書き換えられたトークンや擬似要素への指定は別に考えます。既存のCSSを直せるなら、そちらを先に検討します。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/cascade/layers/#rule-revert-layer-isolation-for-legacy

## 4-4 @scopeでスタイルを閉じ込める

https://t-arai-pnrm.github.io/css-coding-guideline/cascade/scope/

- 【必須・本書の規約】コンポーネントのスタイルは、`@scope (.scoped.<名前>) to (.scoped)` の中に書く。（`scope-with-donut`）
  - 理由: スタイルの範囲がコンポーネントの中に限られ、入れ子になった別のコンポーネントにも届かないので、子要素に短い名前を付けてもぶつからないため。
  - 補足: ページ固有のスタイルも、`@scope (.scoped.page-<スラッグ>) to (.scoped)` の同じ形で書きます。例外は3つです。カスタム要素で作る部品は、要素名を前置きにして `@scope (<要素名>.scoped) to (.scoped)` と書きます（`custom-element-as-scope-root`）。Shadow DOM の中の CSS では `@scope` を使いません（`shadow-dom-host-and-element-selectors`）。CMS の WYSIWYG が出力する本文エリアは `@scope (.wysiwyg)` で書き、独自のブロックの手前を下限にします（`wysiwyg-scope-root`、`wysiwyg-scope-exception`）。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/cascade/scope/#rule-scope-with-donut

## 4-5 CSSネストの基礎

https://t-arai-pnrm.github.io/css-coding-guideline/cascade/nesting/

- 【推奨・仕様上の制約】ネストしたセレクタの意味と詳細度は、`&` を親のセレクタリストを包んだ `:is()` に置き換えて確かめ、Sass の展開結果として読まない（`.news, #pickup { & ._title {} }` は `:is(.news, #pickup) ._title`）。（`nesting-read-as-is`）
  - 理由: 素の CSS のネストは文字列の展開ではなく、`&` が `:is()` と同じ決まり方で一致と詳細度を決めるので、Sass の展開結果で読むと、当たる要素や詳細度を取り違えるため。
  - 補足: `.a .b { .c & {} }` は `.c :is(.a .b)` になり、Sass の `.c .a .b` と違って、`.a .c .b` の並びにも当てはまります。親が1つのセレクタなら、詳細度は展開した結果と同じです。`&__title` のように `&` に文字をつなげる書き方は無効です（第9章のルール `no-nesting-concatenation`）。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/cascade/nesting/#rule-nesting-read-as-is
