# 第7章 レイアウトの仕組み：ルール

- ガイドラインのバージョン: 0.44.6（2026-10-09 生成）
- ルールの数: 39
- 本文: 約26.6万字
- 読む条件: display、Flexbox、Grid、position、margin、ボックスモデル、幅と高さ

このファイルは「CSSコーディングガイドライン」のルールから自動生成しています。直接編集しないでください。
強度は「必須」「推奨」「非推奨」「禁止」の4段階です。「必須」と「禁止」は、各ルールの補足に書いた適用範囲と例外を除いて必ず守り、「推奨」と「非推奨」は理由があれば外れてかまいません。
性質は3種類です。「仕様上の制約」はCSS・HTML・ブラウザの振る舞いやWCAGから導かれ、守らないと表示や操作が崩れます。「実装上の判断」は状況とトレードオフで決まり、適用する条件があります。「本書の規約」は一貫性のために本書が選んだ約束で、ほかの約束を選んでも同じように成り立ちます。
背景とコード例は、各節の本文にあります。本文は MCP の `get_page`（ページID）か、URL で読みます。

## この章の節

- `layout` 第7章 レイアウトの仕組み（約4,900字）https://t-arai-pnrm.github.io/css-coding-guideline/layout/
- `layout/fundamentals` 7-1 レイアウトの基礎（約2.1万字）https://t-arai-pnrm.github.io/css-coding-guideline/layout/fundamentals/
- `layout/normal-flow` 7-2 通常フローの基礎（約2.2万字）https://t-arai-pnrm.github.io/css-coding-guideline/layout/normal-flow/
- `layout/box-model` 7-3 ボックスモデルの基礎（約1.9万字）https://t-arai-pnrm.github.io/css-coding-guideline/layout/box-model/
- `layout/sizing` 7-4 大きさの決まり方（約1.2万字）https://t-arai-pnrm.github.io/css-coding-guideline/layout/sizing/
- `layout/margin-role` 7-5 marginの役割（約1.1万字）https://t-arai-pnrm.github.io/css-coding-guideline/layout/margin-role/
- `layout/margin-collapse` 7-6 マージンの相殺（約1.8万字）https://t-arai-pnrm.github.io/css-coding-guideline/layout/margin-collapse/
- `layout/flexbox-basics` 7-7 Flexboxの基礎（約3.8万字）https://t-arai-pnrm.github.io/css-coding-guideline/layout/flexbox-basics/
- `layout/grid-basics` 7-8 Gridの基礎（約2.5万字）https://t-arai-pnrm.github.io/css-coding-guideline/layout/grid-basics/
- `layout/grid-alignment` 7-9 Gridでアイテムをそろえる（約2.3万字）https://t-arai-pnrm.github.io/css-coding-guideline/layout/grid-alignment/
- `layout/positioning` 7-10 positionの基礎（約2.9万字）https://t-arai-pnrm.github.io/css-coding-guideline/layout/positioning/
- `layout/anchor-basics` 7-11 アンカーポジショニングの基礎（約2.6万字）https://t-arai-pnrm.github.io/css-coding-guideline/layout/anchor-basics/
- `layout/display-contents` 7-12 display: contentsで箱をなくす（約1.7万字）https://t-arai-pnrm.github.io/css-coding-guideline/layout/display-contents/

## 7-1 レイアウトの基礎

https://t-arai-pnrm.github.io/css-coding-guideline/layout/fundamentals/

- 【推奨・実装上の判断】配置が思いどおりにならないときは、値を足したり `position` でずらしたりする前に、その要素がどのレイアウトの方式（通常フロー、Flexbox、Grid、位置指定）の中にあり、どの要素が包含ブロックとスタッキングコンテキストになっているかを確かめる。（`identify-layout-mode-first`）
  - 理由: 効かない指定の多くは、その方式の規則どおりの振る舞いで、値を足して見た目を合わせても原因が残り、内容や文字の大きさが変わったときに崩れるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout/fundamentals/#rule-identify-layout-mode-first

## 7-2 通常フローの基礎

https://t-arai-pnrm.github.io/css-coding-guideline/layout/normal-flow/

- 【非推奨・仕様上の制約】要素を横に並べるために `display: inline-block`（`inline flow-root`）を使わず、親を Flexbox か Grid にして `gap` で間隔を決める。（`no-inline-block-for-rows`）
  - 理由: タグの間の改行や空白が匿名のインラインボックスになり、親の `font-size` で幅の変わる隙間が要素の間に入るため。
  - 補足: `inline flow-root` は、文中のインライン要素に上下の余白や幅を持たせたいときに使います。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout/normal-flow/#rule-no-inline-block-for-rows
- 【非推奨・実装上の判断】`gap`、`align-items`、`justify-content` のように Flexbox や Grid でだけ働くプロパティを、`display` が `flex` でも `grid` でもない通常フローの要素に書かない。（`no-flex-grid-props-in-flow`）
  - 理由: 通常フローのブロックコンテナではこれらのプロパティは何も変えず、書いてあると間隔や配置がそこで決まっていると読まれて、実際の指定（子の `margin` など）を見誤らせるため。
  - 補足: `align-content` は、ブロックコンテナでも中身をブロック方向にそろえるので、この対象から外れます。`gap` は段組み（`column-count` など）でも働きます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout/normal-flow/#rule-no-flex-grid-props-in-flow

## 7-3 ボックスモデルの基礎

https://t-arai-pnrm.github.io/css-coding-guideline/layout/box-model/

- 【推奨・本書の規約】`box-sizing` はベーススタイル（kiso.css）の全称セレクタで `border-box` にそろえ、コンポーネントで `box-sizing: border-box` を書き足さない。（`box-sizing-border-box-base`）
  - 理由: `inline-size` に指定した値が `border` までを含んだ幅になり、`padding` や `border` を変えても幅の計算を直さずに済むため。全称セレクタで指定済みなら、コンポーネントでの指定は何も変えない。
  - 補足: 内容の幅を固定したい要素（`max-inline-size` で本文の幅を決め、左右の `padding` だけを変えたい要素など）に限り、`box-sizing: unset` で初期値の `content-box` に戻します（ルール `unset-box-sizing-for-content-max-width`）。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout/box-model/#rule-box-sizing-border-box-base
- 【推奨・実装上の判断】画面幅いっぱいに広げる子要素を持たない要素を、最大幅と左右の `padding` で中央に寄せ、内容の幅を最大幅にそろえるときは、`calc()` で最大幅に `padding` を足さず、`box-sizing: unset` で `content-box` に戻す。（`unset-box-sizing-for-content-max-width`）
  - 理由: `max-inline-size` が内容の領域の幅を指すようになり、`padding` の値を変えても最大幅の式を直さずに済むため。
  - 補足: `box-sizing` は継承しないプロパティなので、`unset` は初期値の `content-box` になります。`content-box` と書かずに `unset` と書くのは、ベーススタイルの `border-box` を取り消す意図を示すためです。画面幅いっぱいに広げる子要素が混ざるなら、余白の列を持つ Grid で組みます（11-2 のルール `gutter-columns-for-content-width`）。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout/box-model/#rule-unset-box-sizing-for-content-max-width
- 【推奨・仕様上の制約】ホバーや選択などの状態で枠線を足すときは、`border-width` を変えず、同じ太さの透明な `border` を最初から置いて色だけを変えるか、`outline` か `box-shadow` で描く。（`box-state-border-without-shift`）
  - 理由: `border` はボックスの大きさに含まれ、状態によって太さが変わると要素が広がって周りの要素が押し出されるが、`outline` と `box-shadow` は大きさに含まれないため。
  - 補足: 枠線を消すときに `border: none` ではなく `border-color: transparent` にする理由は、第15章の `transparent-border-over-none` を参照してください。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout/box-model/#rule-box-state-border-without-shift
- 【必須・仕様上の制約】ブロックの左右の中央寄せには、`margin: 0 auto` や `margin: auto` ではなく `margin-inline: auto` を使う。（`margin-inline-auto-centering`）
  - 理由: `margin: 0 auto` は上下のマージンまで上書きし、周りのレイアウトが子要素の間に入れた余白を消してしまうため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout/box-model/#rule-margin-inline-auto-centering

## 7-4 大きさの決まり方

https://t-arai-pnrm.github.io/css-coding-guideline/layout/sizing/

- 【推奨・実装上の判断】要素の幅を中身に合わせるときは、`display: inline-block` や `float` に変えず、`inline-size: fit-content` を指定する。（`box-fit-content-over-display-change`）
  - 理由: `display` や `float` を変えると、前後の文字と同じ行に並ぶ、ベースラインにそろうといった外側の振る舞いまで変わるが、`fit-content` ならブロックのまま幅だけが変わるため。
  - 補足: 親より長い中身は、`fit-content` なら親の幅で折り返します。折り返させたくない場合だけ `max-content` を使います。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout/sizing/#rule-box-fit-content-over-display-change
- 【推奨・仕様上の制約】利用できる幅いっぱいに広げる指定が要る要素には、`inline-size: 100%` ではなく、`inline-size: -webkit-fill-available` と `inline-size: stretch` をこの順に書く。（`stretch-over-width-100`）
  - 理由: `100%` は `margin` を含めずに包含ブロックの幅をそのまま当てはめるので、`margin` や `box-sizing: content-box` と組み合わさると親からはみ出すためです。`stretch` は `margin` を含めた箱を包含ブロックの幅に収めます。
  - 補足: フォーム部品、行方向のフレックスアイテム、左右の位置を片方しか決めていない絶対配置の要素などが対象です。揃えを変えていないグリッドアイテムは、指定しなくても広がります。子の周りの余白は、子の `margin` ではなく親の `padding` や `gap` で取ることを優先します（ルール `parent-owns-child-placement`）。`-moz-available` は書きません。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout/sizing/#rule-stretch-over-width-100
- 【推奨・仕様上の制約】子要素の高さを親にそろえるときは、`height: 100%` ではなく、親を grid にして `stretch` に任せる。（`stretch-over-height-100`）
  - 理由: `height: 100%` は親の高さが明示されているときしか効かず、`min-block-size` で最小値だけを決めた親では成り立たないためです。高さのパーセント指定は、親の高さが中身から決まるときに循環して解決できず、`auto` として扱われます。
  - 補足: 置換要素（`img` など）のように、`stretch` では伸びず、明示しないと広がらない要素には、`block-size: 100%` を書いてよいです。ただし、`stretch` で広がるなら `stretch` を優先し、`100%` は `stretch` に任せられない場合に限ります。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout/sizing/#rule-stretch-over-height-100

## 7-5 marginの役割

https://t-arai-pnrm.github.io/css-coding-guideline/layout/margin-role/

- 【推奨・仕様上の制約】親の背景や枠線の内側に余白を取るときは、最初の子の `margin-block-start` や最後の子の `margin-block-end` ではなく、親の `padding-block` で作る。（`margin-collapse-padding-for-inner-space`）
  - 理由: 通常フローでは、親に `padding` や `border` がないと子の `margin` が親の `margin` と相殺して親の外へ出て、背景の外に余白ができるため。
  - 補足: コンポーネントのルートに外側の `margin` を持たせない方針（第10章）も、子の `margin` が外へ出ると守れなくなります。相殺そのものを止めたいときは、親に `display: block flow-root` を指定します（ルール `flow-root-for-margin-collapse`）。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout/margin-role/#rule-margin-collapse-padding-for-inner-space

## 7-6 マージンの相殺

https://t-arai-pnrm.github.io/css-coding-guideline/layout/margin-collapse/

- 【非推奨・仕様上の制約】余白を作るために、空の要素、`<br>`、`<p>&nbsp;</p>` を置かない。（`margin-collapse-no-empty-spacers`）
  - 理由: 中身のない要素は上下の `margin` が相殺して通り抜けるので余白にならず、`&nbsp;` や `<br>` の行は行の高さで余白が決まり、文字の大きさで変わるため。
  - 補足: 余白は、前後の要素の `margin` か、親の `gap` や `grid-template` で作ります。CMS の本文に入った空の段落は、通常フローでは相殺で消えますが、`gap` で並べた領域では `gap` の2つ分の間隔になります。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout/margin-collapse/#rule-margin-collapse-no-empty-spacers

## 7-7 Flexboxの基礎

https://t-arai-pnrm.github.io/css-coding-guideline/layout/flexbox-basics/

- 【推奨・仕様上の制約】Flexbox のアイテムを中身にかかわらず比率で分けるときは `flex: 1` のように `flex-basis` も0にし、中身の大きさに余りを足して伸ばすときは `flex-grow` だけを指定して、2つを区別する。（`flexbox-basis-zero-for-ratio`）
  - 理由: `flex-grow` は `flex-basis` を除いた余りだけを配るので、`flex-basis` が `auto` のままだと中身の大きさの差が残り、同じ値を指定しても同じ幅にならないため。
  - 補足: `flex: 1` は `flex-basis` を `0%` にします（仕様の定義は `1 1 0` ですが、ブラウザの算出値は `0%` です）。高さの決まっていない縦の Flexbox で0を起点にするなら、`flex: 1 1 0` と書きます。`flex: 1` を `flex-grow: 1` に書き換えると動きが変わります（第1章のルール `longhand-for-partial-change`）。アイテムの `padding` や `border` が違うと `flex: 1` でも幅はそろわないので、列の幅を確実にそろえるなら Grid で列を決めます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout/flexbox-basics/#rule-flexbox-basis-zero-for-ratio
- 【推奨・仕様上の制約】フレックスアイテムが縮まずにはみ出すときは、固定の幅を足したり `overflow: hidden` で隠したりする前に、自動の最小幅（`min-inline-size: auto`）が中身の最小幅になっていないかを確かめる。（`flexbox-check-auto-min-size`）
  - 理由: フレックスアイテムの `min-inline-size: auto` は中身の最小幅（`min-content`）として扱われ、`flex-shrink` で縮む量を計算してもそれより小さくならないため。`overflow: hidden` でも最小幅は0になるが、中身を切り取って隠すだけになる。
  - 補足: 本書のベーススタイルでは、全称セレクタの `min-inline-size: 0`（第8章のルール `global-min-inline-size-zero`）で前もって防いでいます。`flex-direction: column` のコンテナでは、同じことが `min-block-size` で起きます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout/flexbox-basics/#rule-flexbox-check-auto-min-size
- 【非推奨・仕様上の制約】フォーカスできる要素や、順番に意味のある要素を並べた Flexbox で、`order` や `row-reverse`・`column-reverse` によって見た目の順番を入れ替えない。（`flexbox-no-visual-reorder`）
  - 理由: 読み上げの順番とキーボードでフォーカスが移る順番は HTML の順番のままなので、見た目の順番と食い違うため。
  - 補足: 順番に意味がなく、フォーカスできる要素も含まない並び（装飾の画像と本文など）は対象外です。見た目の順番に合わせてフォーカスを移す `reading-flow` は、2026年10月の時点で Baseline ではありません。それでも並べ替えるときは、ルール `reading-flow-when-reordered` に従って `reading-flow` を指定します。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout/flexbox-basics/#rule-flexbox-no-visual-reorder
- 【推奨・実装上の判断】2カラムのどちらを先に縮めるかを決めるときは、先に縮める列に `flex-shrink: 9999` のような大きな値と `min-inline-size` を指定し、もう一方の列に `flex-shrink: 0` を指定しない。（`large-flex-shrink-for-shrink-order`）
  - 理由: 不足は `flex-shrink` と `flex-basis` の積の比で配られるので、大きな値の列がほぼすべてを受け持ち、最小幅に届いてから残りがもう一方に配られるため。`flex-shrink: 0` はどの幅でも縮まなくなり、狭い幅ではみ出す。
  - 補足: 縦に積む切り替えは、コンテナサイズクエリや `sidebar` の折り返しで別に行います。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout/flexbox-basics/#rule-large-flex-shrink-for-shrink-order

## 7-8 Gridの基礎

https://t-arai-pnrm.github.io/css-coding-guideline/layout/grid-basics/

- 【推奨・仕様上の制約】アイテムの数で行数が変わるグリッドでは、`grid-template-rows` で行を決めず、`grid-auto-rows` で暗黙の行の大きさを決める。（`grid-auto-rows-for-item-count`）
  - 理由: 明示的な行の数を超えたアイテムは暗黙の行に入り、`grid-template-rows` の大きさが当てはまらず、行の高さが途中から変わるため。
  - 補足: 暗黙の行の大きさの初期値は `auto`（中身の大きさ）です。列の方向に足していく `grid-auto-flow: column` では、`grid-auto-columns` で決めます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout/grid-basics/#rule-grid-auto-rows-for-item-count
- 【非推奨・仕様上の制約】暗黙の行や列が作られるグリッドで、アイテムを最後まで届かせるために `-1` などの負の線番号を使わない。（`grid-negative-lines-explicit-only`）
  - 理由: 負の線番号は明示的なグリッドの終わりから数え、暗黙のトラックを数に入れないので、アイテムが途中のトラックで止まるため。
  - 補足: 列を明示的に決めたグリッドで、端から端までまたがらせる `grid-column: 1 / -1` は使えます。明示的な行がないグリッドの `grid-row: 1 / -1` は、1行分にしかまたがりません。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout/grid-basics/#rule-grid-negative-lines-explicit-only
- 【推奨・実装上の判断】意味のある位置にアイテムを置くときは、線の番号ではなく、`--` で始まる線の名前かエリアの名前で指定する。（`grid-named-lines-for-placement`）
  - 理由: トラックを足したり減らしたりしてもアイテムの指定を直さずに済み、どの位置に置くのかがコードから読み取れるため。
  - 補足: `--content-start` と `--content-end` の組を付けると、`grid-column: --content` で置けます。名前を書き間違えるとエラーにならず、アイテムが明示的なグリッドの外に置かれます。端から端までの `1 / -1` や、数でまたがる `span 2` は番号のままでかまいません。名前の付け方は第9章のルール `dashed-ident-names` で扱います。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout/grid-basics/#rule-grid-named-lines-for-placement
- 【推奨・実装上の判断】幅や中身によって配置の構造が変わるレイアウトは、`grid-template` のエリアで書き、条件ごとにテンプレートだけを書き換える。（`grid-areas-for-changing-structure`）
  - 理由: 配置の変化が1か所にまとまり、子要素ごとに条件を書かずに済むため。
  - 補足: エリアの名前を `--` で始める規則は、第9章のルール `dashed-ident-names` で扱います。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout/grid-basics/#rule-grid-areas-for-changing-structure
- 【推奨・本書の規約】グリッドのエリアの名前は、そのエリアに置く子要素のクラス名とそろえる（`._image` を置くエリアは `--image`）。（`grid-area-names-match-children`）
  - 理由: `grid-template` の図と、各要素の `grid-area` の対応をすぐに読み取れるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout/grid-basics/#rule-grid-area-names-match-children
- 【推奨・仕様上の制約】HTML は見た目の順番ではなく文書構造の順番（見出しから）で書き、見た目の順番が違うときは Grid の配置で入れ替える。（`source-order-for-reading`）
  - 理由: スクリーンリーダーの読み上げや、CSS が効かない環境でも、内容が意味の通る順番で伝わるため。
  - 補足: フォーカスできる要素の順番を入れ替えると、キーボードで移動する順番が見た目と食い違います。Grid の配置で入れ替えるときは、同じルールに `reading-flow` を指定します（ルール `reading-flow-when-reordered`）。`reading-flow` は2026年10月の時点で Chrome と Edge の137以降だけが対応しているので、HTML の順番を直す代わりには使いません。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout/grid-basics/#rule-source-order-for-reading
- 【非推奨・仕様上の制約】順序に意味のある要素（フォーカスできる要素、手順、ランキング）を並べた Grid に、`grid-auto-flow: dense` を指定しない。（`no-dense-for-ordered-items`）
  - 理由: 見た目の順番だけが入れ替わり、キーボードで移動する順番や読み上げの順番と食い違うため。
  - 補足: タグやサムネイルの一覧のように、順序に意味のない並びには使えます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout/grid-basics/#rule-no-dense-for-ordered-items

## 7-9 Gridでアイテムをそろえる

https://t-arai-pnrm.github.io/css-coding-guideline/layout/grid-alignment/

- 【推奨・実装上の判断】並べたカードの中の見出し、本文、ボタンの位置をそろえるときは、固定の高さや JavaScript ではなく、サブグリッドを使う。（`subgrid-for-aligned-rows`）
  - 理由: 中身の量が変わっても、同じ行にある要素の高さが自動でそろうため。
  - 補足: `flex-direction: column` と `flex-grow` の組み合わせでは、そろえられるのは1か所だけです。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout/grid-alignment/#rule-subgrid-for-aligned-rows
- 【必須・仕様上の制約】`grid-template-rows: subgrid` を指定した要素には、中の要素の数と同じ行数を `grid-row: span N` で指定する。（`subgrid-span-rows`）
  - 理由: 指定しないと、サブグリッドが親の1行分にしかまたがらず、中の要素がすべて同じ1行に押し込まれるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout/grid-alignment/#rule-subgrid-span-rows
- 【推奨・実装上の判断】グリッドの列の幅は、列ごとに可変か不変かを決めてから、`max-content`（改行させない）、`fit-content()`（上限まで中身に合わせる）、`1fr`（残りをすべて使う）のように指定する。（`column-width-by-variability`）
  - 理由: 中身の長さが変わっても、どの列が伸び、どの列が伸びないかがコードから読み取れ、意図どおりに振る舞うため。
  - 補足: 一覧の項目は `grid-template-columns: subgrid` で親の列に参加させると、すべての項目で列の位置がそろいます。`fit-content()` の列は `fr` の列より先に上限まで広がるので、隣の `fr` の列には `minmax(下限, 1fr)` で下限を付けます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout/grid-alignment/#rule-column-width-by-variability
- 【推奨・仕様上の制約】`fit-content()` などの中身の幅で決まるトラックに画像とキャプションを置くときは、キャプションに `contain: inline-size` を指定し、列の幅を画像だけで決める。（`contain-caption-in-intrinsic-track`）
  - 理由: キャプションの1行の長さも `max-content` に含まれ、長いキャプションが画像の幅に関係なく列を上限まで押し広げるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout/grid-alignment/#rule-contain-caption-in-intrinsic-track

## 7-10 positionの基礎

https://t-arai-pnrm.github.io/css-coding-guideline/layout/positioning/

- 【推奨・仕様上の制約】`position: absolute` の要素の基準にする祖先には、同じコンポーネントの中で `position: relative` を指定する。（`containing-block-inside-component`）
  - 理由: 基準がコンポーネントの外の祖先に決まると、置く場所によって位置が変わるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout/positioning/#rule-containing-block-inside-component
- 【推奨・実装上の判断】絶対配置の要素を中央に置くときは、`translate: -50% -50%` ではなく、`inset: 0` と `margin: auto` を使う。（`absolute-centering-with-margin-auto`）
  - 理由: 位置を決める指定が `inset` と `margin` にまとまり、変形のプロパティを配置のために使わずに済むため。
  - 補足: `inset: 0` だけでは親いっぱいに広がるので、`inline-size` と `block-size`（`fit-content` など）で大きさを決めます。グリッドやフレックスの中なら、`place-items: center` で足ります。絶対配置にする必要のない通常のブロックなら、縦方向は `align-content: center` で足ります。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout/positioning/#rule-absolute-centering-with-margin-auto
- 【非推奨・仕様上の制約】`position: fixed` の要素を、`transform`、`filter`、`contain` などを指定した祖先の中に置かない。（`no-fixed-inside-transformed-ancestor`）
  - 理由: これらの祖先が包含ブロックになり、要素がビューポートではなくその祖先を基準に配置されるため。
  - 補足: 個別の変形プロパティ（`translate` など）、`backdrop-filter`、`perspective`、`content-visibility: auto` と、これらを書いた `will-change` も包含ブロックを作ります。モーダルは、`<dialog>` の `showModal()` でトップレイヤーに表示します（第17章）。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout/positioning/#rule-no-fixed-inside-transformed-ancestor
- 【必須・仕様上の制約】Grid や Flexbox の子に `position: sticky` を指定するときは、その要素に `align-self: start` を指定する。（`sticky-align-self-start`）
  - 理由: `align-self` の初期値では要素が行の高さいっぱいに伸び、包含ブロックの中でずらす余地がなくなるため。
  - 補足: 親の `align-items: start` でも同じ結果になりますが、ほかの子の高さも変わります。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout/positioning/#rule-sticky-align-self-start
- 【必須・仕様上の制約】`position: sticky` には、留めたい軸の `inset-block-start` などの inset を、`auto` 以外の値で1つ以上指定する。（`sticky-needs-inset`）
  - 理由: 指定がないと、その軸では留まる位置が決まらず、`relative` と同じ動きになるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout/positioning/#rule-sticky-needs-inset
- 【推奨・仕様上の制約】画面より高くなりうる `sticky` の要素には、`max-block-size` と `overflow-y: auto` を指定する。（`sticky-cap-block-size`）
  - 理由: 要素が画面より高いと、下端が見えないまま上端で留まり、末尾に届かなくなるため。
  - 補足: 上限は、`calc(100svb - 16px * 2)` のように、スクロールで値が変わらない `svb` から余白を引いて決めます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout/positioning/#rule-sticky-cap-block-size

## 7-11 アンカーポジショニングの基礎

https://t-arai-pnrm.github.io/css-coding-guideline/layout/anchor-basics/

- 【推奨・実装上の判断】ポップオーバーを開くボタンを基準に配置するときは、`anchor-name` で名前を付けず、`popovertarget` や `commandfor` による暗黙のアンカーを使う。（`implicit-anchor-first`）
  - 理由: アンカーが要素どうしの結び付きで決まるので、名前が衝突せず、`anchor-scope` も要らないため。
  - 補足: 暗黙のアンカーを `anchor()` で使うときは、`position-anchor: auto` を明示します。初期値の `normal` は、`position-area` を指定したときだけ暗黙のアンカーを使います。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout/anchor-basics/#rule-implicit-anchor-first
- 【推奨・本書の規約】`position-area` の値は、`bottom right` のような物理キーワードではなく、`block-end inline-end` のような論理キーワードで書く。（`position-area-logical-keywords`）
  - 理由: 縦書きや右から左へ書く言語でも、文の流れに対して同じ側に表示され、論理プロパティとも書き方がそろうため。
  - 補足: 論理プロパティを使う規則は、第9章のルール `logical-properties` で扱います。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout/anchor-basics/#rule-position-area-logical-keywords
- 【必須・仕様上の制約】アンカーを基準にした配置の指定は `@supports` の中に書き、その外には、未対応の環境でも内容を読めて操作できる配置を書く。ポップオーバーは `margin: revert` で画面の中央に、ポップオーバーではない要素は `position: absolute` ごと `@supports` に入れて通常フローに置く。（`anchor-fallback-placement`）
  - 理由: 未対応の環境ではアンカーを基準にした指定がすべて無視され、要素が画面の端や静的位置に表示されて、ほかの内容に重なるため。
  - 補足: `@supports` の条件には、`position-area: block-end span-inline-end` のように実際に使う値を書きます。`position-area` が `auto` の `margin` を0として扱わないブラウザ（Chrome 142以前、Safari 26.1以前など）があるので、`@supports` の中では `margin` を指定し直します。レイアウトの要として使わない規則は、第1章のルール `no-unsupported-layout-features` で扱います。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout/anchor-basics/#rule-anchor-fallback-placement

## 7-12 display: contentsで箱をなくす

https://t-arai-pnrm.github.io/css-coding-guideline/layout/display-contents/

- 【推奨・実装上の判断】`display: contents` は、サブグリッドに参加させるときや、幅によってラッパーの箱を出し入れするときなど、箱をなくす理由があるときだけ使う。画面の幅で並びを変えるだけなら `grid-template` のエリアで組む。（`display-contents-with-reason`）
  - 理由: 箱をなくした要素はブラウザによってロールを失い、Flexbox で構造を変えると `order` も必要になって、読み上げやフォーカスの順番が見た目と食い違いやすいため。
  - 補足: エリアで組むときは、テンプレートを `--_template` に入れてコンテナサイズクエリの中で差し替え、同じルールに `reading-flow` を指定します（ルール `reading-flow-when-reordered`）。レイアウトのためだけのラッパーは足しません。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout/display-contents/#rule-display-contents-with-reason
- 【推奨・仕様上の制約】`display: contents` で箱をなくす要素は、ロールを持たない `div` か `span` に限るか、`role` 属性でロールを明示して読み上げを確かめる。（`display-contents-keep-role`）
  - 理由: `display: contents` を指定した要素は、ブラウザによっては見出しやリストなどの暗黙のロールが失われることがあるため。
  - 補足: リストの `li` には `role="listitem"` を明示します。`display: contents` は `[hidden]` の `display: none` も上書きしますが、kiso.css の `[hidden]` の `!important` で防げます（ルール `important-only-for-guarantees`）。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout/display-contents/#rule-display-contents-keep-role
- 【禁止・仕様上の制約】ボタンやリンクのようにフォーカスできる要素に、`display: contents` を指定しない。（`no-display-contents-on-focusable`）
  - 理由: 箱がないのでフォーカスリングを描けず、ブラウザによっては要素がアクセシビリティツリーから外れて、ボタンやリンクとして読み上げられなくなるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout/display-contents/#rule-no-display-contents-on-focusable
