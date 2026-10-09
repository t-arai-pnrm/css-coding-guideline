# 第13章 レスポンシブデザイン：ルール

- ガイドラインのバージョン: 0.44.3（2026-10-09 生成）
- ルールの数: 39
- 本文: 約11万字
- 読む条件: @media、@container、ブレイクポイント、画面幅やコンテナの幅による切り替え、safe-area

このファイルは「CSSコーディングガイドライン」のルールから自動生成しています。直接編集しないでください。
強度は「必須」「推奨」「非推奨」「禁止」の4段階です。「必須」と「禁止」は、各ルールの補足に書いた適用範囲と例外を除いて必ず守り、「推奨」と「非推奨」は理由があれば外れてかまいません。
性質は3種類です。「仕様上の制約」はCSS・HTML・ブラウザの振る舞いやWCAGから導かれ、守らないと表示や操作が崩れます。「実装上の判断」は状況とトレードオフで決まり、適用する条件があります。「本書の規約」は一貫性のために本書が選んだ約束で、ほかの約束を選んでも同じように成り立ちます。
背景とコード例は、各節の本文にあります。本文は MCP の `get_page`（ページID）か、URL で読みます。

## この章の節

- `responsive` 第13章 レスポンシブデザイン（約4,300字）https://t-arai-pnrm.github.io/css-coding-guideline/responsive/
- `responsive/escalation` 13-1 検討する順番（約8,500字）https://t-arai-pnrm.github.io/css-coding-guideline/responsive/escalation/
- `responsive/breakpoints` 13-2 ブレイクポイントの決め方（約1.6万字）https://t-arai-pnrm.github.io/css-coding-guideline/responsive/breakpoints/
- `responsive/container-size-queries` 13-3 コンテナサイズクエリ（約2万字）https://t-arai-pnrm.github.io/css-coding-guideline/responsive/container-size-queries/
- `responsive/container-units-and-side-effects` 13-4 コンテナの副作用とコンテナ単位（約1.5万字）https://t-arai-pnrm.github.io/css-coding-guideline/responsive/container-units-and-side-effects/
- `responsive/media-queries` 13-5 メディアクエリ（約1.4万字）https://t-arai-pnrm.github.io/css-coding-guideline/responsive/media-queries/
- `responsive/min-viewport-width` 13-6 375px未満の画面の扱い（約7,200字）https://t-arai-pnrm.github.io/css-coding-guideline/responsive/min-viewport-width/
- `responsive/design-comp-pattern` 13-7 カンプの幅で全体を拡大・縮小しない（約8,200字）https://t-arai-pnrm.github.io/css-coding-guideline/responsive/design-comp-pattern/
- `responsive/safe-area` 13-8 セーフエリアに対応する（約1.7万字）https://t-arai-pnrm.github.io/css-coding-guideline/responsive/safe-area/

## 13-1 検討する順番

https://t-arai-pnrm.github.io/css-coding-guideline/responsive/escalation/

- 【必須・実装上の判断】レスポンシブ対応は「静的 → イントリンシック → コンテナサイズクエリ → メディアクエリ」の順に検討し、上の段階で解決できるなら下の段階を使わない。（`responsive-escalation-order`）
  - 理由: 条件分岐が減り、想定していない幅や置き場所でも崩れにくくなるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/responsive/escalation/#rule-responsive-escalation-order
- 【推奨・実装上の判断】タグ、バッジ、アイコンのように本質的に固定サイズの要素は、レスポンシブにしない。（`no-responsive-for-static-elements`）
  - 理由: `clamp()` やクエリを足しても見た目はほとんど変わらず、コードの複雑さだけが増えるため。
  - 補足: アイコンは `1em` で文字サイズに追従させれば十分です。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/responsive/escalation/#rule-no-responsive-for-static-elements
- 【推奨・実装上の判断】幅は固定値ではなく `max-inline-size` で上限を決め、固定値が必要なときは `min(100%, …)` ではみ出しを防ぐ。（`max-inline-size-over-fixed-width`）
  - 理由: 狭い画面や狭い場所に置かれたときにも、内容に合わせて縮むため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/responsive/escalation/#rule-max-inline-size-over-fixed-width
- 【推奨・実装上の判断】`pages` レイヤーのスタイルではメディアクエリを、`components` レイヤーのスタイルではコンテナサイズクエリを優先する。（`query-choice-by-layer`）
  - 理由: ページ全体の段組みはビューポートに依存するが、コンポーネントはどこに置かれるかを自分では知らないため。
  - 補足: モーダルやトーストのように、ビューポートに固定されるコンポーネントはメディアクエリを使います。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/responsive/escalation/#rule-query-choice-by-layer

## 13-2 ブレイクポイントの決め方

https://t-arai-pnrm.github.io/css-coding-guideline/responsive/breakpoints/

- 【必須・実装上の判断】ブレイクポイントはデバイスの幅ではなく、レイアウトが崩れる幅から決める。（`breakpoint-from-content`）
  - 理由: 画面幅の種類は無数にあり、特定の端末の幅に合わせても、その間の幅で崩れるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/responsive/breakpoints/#rule-breakpoint-from-content
- 【禁止・実装上の判断】`sp`、`tablet`、`pc` のようにデバイスを連想させる名前を、ブレイクポイントやクラス名（`.sp-only` など）に使わない。（`no-device-names`）
  - 理由: 画面の幅とデバイスの種類は一致せず、名前と実態がずれていくため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/responsive/breakpoints/#rule-no-device-names
- 【推奨・実装上の判断】ブレイクポイントを変数として持つフレームワークを使う案件では、独自の値を足さず、フレームワークの変数を使う。（`framework-breakpoint-variables`）
  - 理由: 案件の中でブレイクポイントの値がばらばらになるのを防ぐため。
  - 補足: Sass の変数や Tailwind CSS の設定のように、ビルド時に値へ展開される変数が対象です。CSS のカスタムプロパティは、メディアクエリの条件では使えません（`no-var-in-query`）。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/responsive/breakpoints/#rule-framework-breakpoint-variables
- 【必須・仕様上の制約】ブレイクポイントは rem で指定し、`calc(640 / 16 * 1rem)` のようにピクセル値からの変換を式で書く。（`breakpoint-in-rem`）
  - 理由: 文字サイズを大きくしているユーザーは実質的に使える幅が狭くなるので、rem で指定すれば切り替えもそれに追従するため。式にすれば、元のピクセル値も読み取れる。
  - 補足: 閾値の式に px で指定した `gap` や `padding` を含めるときは、その項だけ rem へ換算せず、px のまま足します（`threshold-as-formula`）。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/responsive/breakpoints/#rule-breakpoint-in-rem
- 【推奨・実装上の判断】クエリの閾値は、「列の最小幅×列数＋隙間×隙間の数」や「中身の幅＋`padding`＋`border`」のように、レイアウトが成り立つ条件を `calc()` の式で書く。（`threshold-as-formula`）
  - 理由: 数値の根拠がコードに残り、列数や隙間を変えたときにも直しやすいため。
  - 補足: 根拠を式にしたほうが意図が明確になるときと、列数、個数、隙間、最小幅を後で変える可能性があるときに式にします。分解しても意味が増えない固定の値は、そのまま書いてかまいません。根拠のない値を `calc(48rem)` のように包むだけにはしません。一度しか使わない長い式には、何列・何個分なのかをコメントで補います。式の各項は、その値を宣言したときの単位で書きます。rem で指定した幅は変換の式で、px で指定した `gap`、`padding`、`border` は px のまま足し、`calc(560 / 16 * 1rem + 240 / 16 * 1rem + 32px)` のように書きます。px の値まで rem に換算すると、ユーザーが文字サイズを変えたときに閾値の中でだけ隙間が広がり、実際に並べられる幅とずれます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/responsive/breakpoints/#rule-threshold-as-formula
- 【必須・仕様上の制約】閾値の式には、レイアウトが成り立つ条件に関わる `gap`、`padding`、`border` を省かずに含める。（`threshold-includes-gap-and-padding`）
  - 理由: 省くと閾値が実際に並べられる幅より狭くなり、切り替わった直後の幅で中身がはみ出したり詰まったりするため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/responsive/breakpoints/#rule-threshold-includes-gap-and-padding
- 【禁止・仕様上の制約】`@media` の条件と、コンテナサイズクエリの条件の中で `var()` を使わない。（`no-var-in-query`）
  - 理由: メディアクエリの条件ではカスタムプロパティを参照できず、コンテナサイズクエリの条件では仕様で認められていても対象のブラウザでそろって動かず、値が問い合わせるコンテナで解決されて意図とずれやすいため。
  - 補足: スタイルクエリで `style(--a: var(--b))` のようにカスタムプロパティどうしを比べる条件は、対象にしません。同じ閾値を複数の要素で使いたいときは、閾値を変数にせず、フラグを宣言する要素だけにコンテナサイズクエリを書き、ほかの子孫はスタイルクエリで切り替えます（`density-via-style-query`）。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/responsive/breakpoints/#rule-no-var-in-query

## 13-3 コンテナサイズクエリ

https://t-arai-pnrm.github.io/css-coding-guideline/responsive/container-size-queries/

- 【必須・本書の規約】コンポーネントのルートをコンテナにするときは `container: --scoped / inline-size` と書いて `@container --scoped (…)` で問い合わせ、ルート以外の子要素をコンテナにするときはクラス名から下線を除いた名前（`._body` なら `--body`）を付ける。外側のコンポーネントのコンテナは問い合わせない。（`container-name-required`）
  - 理由: 名前のない `@container` はいちばん近い祖先のコンテナを参照するので、コンテナが入れ子になると参照先がコードから読み取れないため。ルートの名前をそろえておけば、`@scope` の下限で閉じた範囲の中では `--scoped` が常にそのコンポーネントのルートを指す。外側のコンポーネントのコンテナを問い合わせると、外のコンポーネントの定義に依存し、別の場所に置いたときに条件が成り立たなくなる。
  - 補足: 外側から変えたい値は、公開用のカスタムプロパティで渡します。`:scope` のルールに `@container --scoped (…)` を書くと、ルートは自分自身を問い合わせられないので、外側のコンポーネントのルートを参照してしまいます。サイズの条件を持たない `@container style(…)` のスタイルクエリには、名前を付けません。コンテナサイズクエリを書くのはコンポーネントの中で1つのルール（フラグを宣言する要素）だけにし、ほかの子孫はスタイルクエリで切り替えます（`density-via-style-query`）。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/responsive/container-size-queries/#rule-container-name-required
- 【必須・本書の規約】コンテナの名前は `--` で始める（例：`--scoped`、`--body`）。（`container-name-dashed-ident`）
  - 理由: 自分で付けた名前だとすぐに分かり、将来 CSS に追加されるキーワードとも衝突しないため。
  - 自動チェック: Stylelint: `container-name-pattern`
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/responsive/container-size-queries/#rule-container-name-dashed-ident
- 【必須・本書の規約】コンテナは `container` ショートハンドで、名前と種類をまとめて指定する（`container-type` を単体で書かない）。（`container-shorthand`）
  - 理由: 名前の付け忘れを防ぐため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/responsive/container-size-queries/#rule-container-shorthand
- 【必須・本書の規約】コンテナサイズクエリの条件では、`width` ではなく `inline-size` を使う。（`container-query-inline-size`）
  - 理由: 書字方向に依存しない、論理的な指定にそろえるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/responsive/container-size-queries/#rule-container-query-inline-size
- 【推奨・仕様上の制約】アイコンとラベルを並べた部品で、置かれた場所が狭いときにラベルを隠すなら、コンテナサイズクエリの中で `display: none` ではなく視覚的に隠す指定を書く。（`hide-label-visually-in-container-query`）
  - 理由: アイコンを `aria-hidden="true"` にしている場合、ラベルまで消すとリンクやボタンの名前がなくなるため。幅の違う複数の場所に置いても、修飾クラスなしで切り替えられる。
  - 補足: 隠し方は `.-visually-hidden` と同じ考え方です。ユーティリティのクラスはクエリの条件で付け外しできないので、同じ種類の指定をコンポーネントの中に書きます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/responsive/container-size-queries/#rule-hide-label-visually-in-container-query
- 【非推奨・実装上の判断】`zoom` による縮小は最後の手段にとどめ、使うときは、ルートの直下で中身を包む要素に `@container --scoped (inline-size < 最小幅)` の条件を付けて、`zoom: min(progress(100cqi, 0px, 最小幅), 1)` と書く。（`zoom-as-last-resort`）
  - 理由: 文字も含めてすべてが縮小され、レイアウトの問題を解決せずに隠してしまうため。先にイントリンシックなレイアウトとコンテナサイズクエリで組み替え、それでも想定の最小幅を下回ると破綻するコンポーネントに限る。
  - 補足: `1` を上限にして、拡大には使いません。`progress()` に未対応の環境では縮小されないので、縮小しなくても読めて操作できる状態を保ちます（プログレッシブ・エンハンスメント）。文字サイズを縮める代わりにも使いません。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/responsive/container-size-queries/#rule-zoom-as-last-resort

## 13-4 コンテナの副作用とコンテナ単位

https://t-arai-pnrm.github.io/css-coding-guideline/responsive/container-units-and-side-effects/

- 【非推奨・仕様上の制約】`container` は、コンテナサイズクエリか `cqi` で実際に問い合わせる要素にだけ指定し、「とりあえず」すべてのルートや要素に付けない。（`no-container-just-in-case`）
  - 理由: コンテナにすると、インライン方向のサイズの封じ込めで幅が中身から決まらなくなり、`subgrid` も使えなくなるため。問い合わせないコンテナは、副作用だけを残す。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/responsive/container-units-and-side-effects/#rule-no-container-just-in-case
- 【禁止・仕様上の制約】`html`、`body`、ページ全体のレイアウト要素をコンテナにしない。（`no-container-on-page-root`）
  - 理由: ページ全体の切り替えはメディアクエリの役割であり、古い実装では中にある `position: fixed` の要素が正しく配置されなくなるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/responsive/container-units-and-side-effects/#rule-no-container-on-page-root
- 【禁止・仕様上の制約】幅が中身で決まる要素（インライン要素、`fit-content` の要素、`flex-basis` を指定していない flex アイテムなど）をコンテナにしない。（`no-container-on-intrinsic-size`）
  - 理由: インライン方向のサイズの封じ込めが働き、幅が極端に小さく計算されるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/responsive/container-units-and-side-effects/#rule-no-container-on-intrinsic-size
- 【非推奨・実装上の判断】コンテナにする要素には `padding` や `border` を指定せず、レイアウトは子要素で行う。（`no-padding-on-container`）
  - 理由: コンテナの幅の計算がずれ、クエリの閾値や `cqi` の値が意図とずれるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/responsive/container-units-and-side-effects/#rule-no-padding-on-container
- 【必須・仕様上の制約】`cqi` は、名前付きのコンテナがあると言い切れる子孫の要素でだけ使う。（`cqi-needs-named-container`）
  - 理由: 有効なコンテナがないと小さいビューポート単位（`svi`）として計算され、置き場所によって値の意味が変わるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/responsive/container-units-and-side-effects/#rule-cqi-needs-named-container
- 【非推奨・実装上の判断】`container-type: size` と、それを前提にした `cqb`、`cqh`、`cqmin`、`cqmax` は使わない。（`no-container-type-size`）
  - 理由: コンテナの高さが確定していないと効かず、使える場面がほとんどないため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/responsive/container-units-and-side-effects/#rule-no-container-type-size
- 【禁止・本書の規約】`.container` のような汎用のクラスを作らない。`container` プロパティを持つ要素にだけ、`.sidebar-container` のように何のコンテナかが分かる名前を付ける。（`no-container-utility-class`）
  - 理由: `container` が CSS で意味を持つ語になったので、ただのラッパーに使うと誤解を招くため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/responsive/container-units-and-side-effects/#rule-no-container-utility-class

## 13-5 メディアクエリ

https://t-arai-pnrm.github.io/css-coding-guideline/responsive/media-queries/

- 【推奨・実装上の判断】メディアクエリは、ページ全体の段組み、ビューポートに固定された要素、常に画面幅いっぱいに表示されるブロックに限って使う。（`media-query-for-macro-layout`）
  - 理由: それ以外の要素は、イントリンシックな手法やコンテナサイズクエリのほうが置き場所の変化に強いため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/responsive/media-queries/#rule-media-query-for-macro-layout
- 【必須・本書の規約】メディアクエリとコンテナサイズクエリの条件は範囲構文（`>=` や `<`）で書き、`min-width` や `max-width` の書き方は使わない。（`query-range-syntax`）
  - 理由: 条件を不等式として読め、境界の値を含むかどうかも明確になるため。
  - 自動チェック: Stylelint: `media-feature-range-notation`（メディアクエリのみ）
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/responsive/media-queries/#rule-query-range-syntax
- 【推奨・実装上の判断】メディアクエリでは狭い画面向けのスタイルを基本に書き、広い画面で必要な差分だけを `width >=` の条件の中に書く。（`mobile-first-queries`）
  - 理由: 狭い画面のレイアウトのほうが単純なことが多く、打ち消すための指定が増えずに済むため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/responsive/media-queries/#rule-mobile-first-queries
- 【禁止・仕様上の制約】`device-width`、`device-height`、`device-aspect-ratio` をメディアクエリの条件に使わない。幅は `width` で判定する。（`no-device-width-feature`）
  - 理由: これらは端末の画面そのものの大きさを調べ、ウィンドウの幅や分割表示、ズームで変わる実際の表示領域を反映しないため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/responsive/media-queries/#rule-no-device-width-feature
- 【非推奨・仕様上の制約】レイアウトの切り替えを `orientation` で判定しない。使える幅は `width` で判定する。（`no-orientation-for-layout`）
  - 理由: `orientation` が比べるのはビューポートの幅と高さで、端末の向きではないため。縦向きの端末でもソフトウェアキーボードが出るとビューポートが横長になり、`landscape` と判定されることがある。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/responsive/media-queries/#rule-no-orientation-for-layout
- 【推奨・仕様上の制約】操作の手段に合わせて変える指定は、画面の幅ではなく `@media (any-pointer: fine)` や `@media (any-pointer: coarse)` で判定する。（`any-pointer-not-width-for-input`）
  - 理由: 画面の幅と入力の手段は対応しないため。`pointer` は主な入力だけを調べるので、タブレットにマウスをつないだ場合のように、使える入力が複数ある環境の一方を取りこぼす。
  - 補足: `pointer` を使ってよいのは、主な入力の精度だけに合わせたいときに限る。ホバーの判定は `any-hover` を使う（第17章）。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/responsive/media-queries/#rule-any-pointer-not-width-for-input
- 【推奨・実装上の判断】薄い境界線や補助テキストの色で区別や意味を伝えている部品は、`@media (prefers-contrast: more)` の中で色を濃くする。（`prefers-contrast-more-for-faint-borders`）
  - 理由: OS でコントラストを上げる設定にしているユーザーが、薄い区切りや補助テキストを読み取れる状態を保つため。
  - 補足: `prefers-contrast: custom` は強制カラーモードの配色に対応する値で、色は上書きされるため指定しない。強制カラーモードの扱いは第15章で説明する。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/responsive/media-queries/#rule-prefers-contrast-more-for-faint-borders
- 【推奨・実装上の判断】半透明の背景や `backdrop-filter` の上に文字を置く部品は、`@media (prefers-reduced-transparency: reduce)` の中で背景を不透明にする。（`reduced-transparency-opaque-background`）
  - 理由: OS で透明度を下げる設定にしているユーザーが、背景に左右されずに文字を読める状態を保つため。
  - 補足: 2026年10月の時点で対応しているのは Chrome 系のブラウザだけです。半透明のままでもコントラストが足りる色を選んだうえで、追加の対策として書きます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/responsive/media-queries/#rule-reduced-transparency-opaque-background

## 13-6 375px未満の画面の扱い

https://t-arai-pnrm.github.io/css-coding-guideline/responsive/min-viewport-width/

- 【推奨・実装上の判断】375px 未満の画面でもカンプの配置を保つ要件があるときに限り、`<meta name="viewport">` の直後にインラインで置いたスクリプトで、`content` を `width=375` に書き換え、ビューポートの幅を固定する。要件がなければ固定せず、自然に折り返した表示にする。（`fixed-viewport-below-min-width`）
  - 理由: 固定すると、幅 320px の端末では 16px の本文が約 13.6px に縮小されるため。320 CSS px で崩れない CSS なら固定しなくても内容は読めるので、固定で得られるのはカンプに近い配置だけである。320 CSS px で内容が読めて操作できることは、スクリプトに頼らず CSS で保証する。
  - 補足: 判定には `window.innerWidth` ではなく `window.outerWidth` を使います。`innerWidth` はビューポートを固定すると 375 になって元に戻れなくなります。ズームしたときの `outerWidth` はブラウザで違い、Chrome では変わりませんが、Firefox では小さくなります。`maximum-scale` や `user-scalable=no` は書き加えず、固定した後もズームできる状態を保ちます。外部ファイルにすると、読み込みを待つ間に狭いレイアウトで描画され、固定したときにレイアウトシフトが起きます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/responsive/min-viewport-width/#rule-fixed-viewport-below-min-width

## 13-7 カンプの幅で全体を拡大・縮小しない

https://t-arai-pnrm.github.io/css-coding-guideline/responsive/design-comp-pattern/

- 【禁止・実装上の判断】カンプの幅に対する比率で、ページ全体の文字サイズや余白を拡大・縮小しない（フルリキッドにしない）。（`no-full-liquid-scaling`）
  - 理由: 1440px のカンプを幅 768px の画面に縮めると本文が約8.5px になるように、カンプの幅から離れるほど文字が読めなくなり、比率をビューポート単位から求めると文字サイズの設定やズームも効きにくくなるため。どの幅でも同じ配置を縮めるだけなので、画面に合わせて配置を変えるレスポンシブ対応にもならない。
  - 補足: ブレイクポイントはデザインの段階で決めず、実装の段階でデザイナーと、保つもの（本文の読みやすさ、情報の量、画像の縦横比、CTA）と崩れとみなす基準（カラムの数を変える時点、余白を削る順番）をすり合わせて決めます（3-2）。コンポーネントの切り替えはコンテナサイズクエリで、ビューポートに密着する要素とページ全体の段組みはメディアクエリで書き、幅で連続的に変えたい値は値ごとに `clamp()` で範囲を決めます（6-3）。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/responsive/design-comp-pattern/#rule-no-full-liquid-scaling
- 【推奨・実装上の判断】ヒーローのように幅に合わせて拡大・縮小させたい局所は、その部分を名前付きのコンテナにして `cqi` で組み、ビューポート単位を使わない。（`local-liquid-with-cqi`）
  - 理由: 置かれた場所の幅に合わせて振る舞い、ページのほかの部分の文字サイズや余白を巻き込まないため。
  - 補足: 文字サイズは、最小値と最大値を rem にし、推奨値を `cqi` と rem の和にした `clamp()` で書きます（`clamp-rem-bounds`）。`cqi` を使うのは、コンテナの子孫の要素だけです（`cqi-needs-named-container`）。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/responsive/design-comp-pattern/#rule-local-liquid-with-cqi

## 13-8 セーフエリアに対応する

https://t-arai-pnrm.github.io/css-coding-guideline/responsive/safe-area/

- 【必須・仕様上の制約】`<meta name="viewport">` に `viewport-fit=cover` を指定したら、文字やボタンを `env(safe-area-inset-*)` で確保した範囲の内側に置き、上下左右と横向きの画面で確認する。（`safe-area-inset-with-viewport-fit-cover`）
  - 理由: `cover` を指定するとブラウザはページをセーフエリアの内側に寄せなくなり、余白を書かないと、ノッチやホームインジケーターのある端末でだけ内容が隠れるため。
  - 補足: 画面の端まで描画する必要がないページでは、`viewport-fit` をデフォルトの `auto` のままにします。パソコンのブラウザではセーフエリアがすべて0なので、実機か iOS シミュレーターで確かめます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/responsive/safe-area/#rule-safe-area-inset-with-viewport-fit-cover
- 【推奨・仕様上の制約】セーフエリアの値は単独で余白にせず、左右のガターや端に接するバーの余白は `max(16px, env(safe-area-inset-left))` のように通常の余白と比べ、端から浮かせる要素の位置は `calc(16px + env(safe-area-inset-bottom))` のように足す。（`safe-area-combine-with-max`）
  - 理由: セーフエリアの値は切り欠きやシステムの UI が占める幅そのもので、長方形の画面では0になるため。比べるか足すかは、余白の一部をセーフエリアで兼ねてよいかで決まる。
  - 補足: `env()` の第2引数は、ブラウザがその名前の環境変数を知らないときだけ使われます。`env(safe-area-inset-bottom, 16px)` と書いても、セーフエリアのない画面では16pxではなく0になります。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/responsive/safe-area/#rule-safe-area-combine-with-max
- 【推奨・仕様上の制約】セーフエリアの余白は、背景を持つ要素の `padding` に入れ、背景は画面の端まで塗り、中身だけをセーフエリアの内側に寄せる。（`safe-area-background-to-edge`）
  - 理由: `viewport-fit=cover` を指定する目的は背景を端まで描くことで、`margin` や外側の要素の `padding` で空けると、背景が途切れた帯ができるため。
  - 補足: セクションの背景を端まで広げるなら、`body` ではなく、ページのレイアウトのガター（12-10 `primary-layout` など）にセーフエリアを入れます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/responsive/safe-area/#rule-safe-area-background-to-edge
- 【必須・仕様上の制約】画面の下端に `position: fixed` で固定するバーやボタンには、`env(safe-area-inset-bottom)` を加える。（`safe-area-fixed-bottom`）
  - 理由: ホームインジケーターと重なり、ボタンを押すつもりの操作でホーム画面に戻ってしまうため。
  - 補足: 横向きの画面では左右にもセーフエリアがあるので、左右の端に接するバーやボタンには `env(safe-area-inset-left)` と `env(safe-area-inset-right)` も加えます。対象のブラウザはすべて `env()` に対応しているので、固定の値の宣言を前に書く二段構えのフォールバックは書きません。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/responsive/safe-area/#rule-safe-area-fixed-bottom
