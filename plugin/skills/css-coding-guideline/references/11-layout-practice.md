# 第11章 レイアウトを組む：ルール

- ガイドラインのバージョン: 0.50.2（2026-10-10 生成）
- ルールの数: 61
- 本文: 約24.7万字
- 読む条件: 余白の設計、内容の変化への耐性、はみ出しとスクロール、重なり、z-index、アンカーポジショニング、表

このファイルは「CSSコーディングガイドライン」のルールから自動生成しています。直接編集しないでください。
強度は「必須」「推奨」「非推奨」「禁止」の4段階です。「必須」と「禁止」は、各ルールの補足に書いた適用範囲と例外を除いて必ず守り、「推奨」と「非推奨」は理由があれば外れてかまいません。
性質は3種類です。「仕様上の制約」はCSS・HTML・ブラウザの振る舞いやWCAGから導かれ、守らないと表示や操作が崩れます。「実装上の判断」は状況とトレードオフで決まり、適用する条件があります。「本書の規約」は一貫性のために本書が選んだ約束で、ほかの約束を選んでも同じように成り立ちます。
背景とコード例は、各節の本文にあります。本文は MCP の `get_page`（ページID）か、URL で読みます。

## この章の節

- `layout-practice` 第11章 レイアウトを組む（約6,700字）https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/
- `layout-practice/choosing` 11-1 レイアウト手法の選び方（約1.6万字）https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/choosing/
- `layout-practice/spacing` 11-2 余白を設計する（約2.4万字）https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/spacing/
- `layout-practice/defensive` 11-3 サイズと内容の変化に耐える（約2.1万字）https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/defensive/
- `layout-practice/overflow` 11-4 はみ出しとスクロール（約1.4万字）https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/overflow/
- `layout-practice/quantity-layouts` 11-5 件数で配置を組み替える（約1.8万字）https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/quantity-layouts/
- `layout-practice/layering` 11-6 重なりと全幅（約1.3万字）https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/layering/
- `layout-practice/sticky-header` 11-7 固定ヘッダー（約7,800字）https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/sticky-header/
- `layout-practice/anchor-positioning` 11-8 アンカーポジショニング（約2万字）https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/anchor-positioning/
- `layout-practice/overlap-detection` 11-9 要素どうしの重なりを検出する（約1万字）https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/overlap-detection/
- `layout-practice/root-scroller` 11-10 ページのスクロールとルートスクローラー（約1.1万字）https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/root-scroller/
- `layout-practice/masonry` 11-11 grid-lanesで石積みのレイアウトを組む（約1.2万字）https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/masonry/
- `layout-practice/reading-flow` 11-12 表示順と読み上げ順を合わせる（約1.3万字）https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/reading-flow/
- `layout-practice/icon-alignment` 11-13 アイコンを配置する（約1.9万字）https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/icon-alignment/
- `layout-practice/float` 11-14 floatで文章を回り込ませる（約1万字）https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/float/
- `layout-practice/tables` 11-15 表を組む（約2.4万字）https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/tables/
- `layout-practice/truncation-and-skeletons` 11-16 文字の切り詰めと読み込み中の表示（約8,200字）https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/truncation-and-skeletons/

## 11-1 レイアウト手法の選び方

https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/choosing/

- 【推奨・実装上の判断】レイアウトを組むときは、まず親の `grid-template` で子要素の配置と大きさを決められないかを検討する。（`grid-template-first`）
  - 理由: 配置が親の指定だけで完結し、子要素の側に幅の計算や個別の指定を書かずに済むため。
  - 補足: 「1次元なら Flexbox、2次元なら Grid」という分け方は正確ではありません。1列や1行の並びでも、Grid のほうが簡潔に書ける場面は多くあります。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/choosing/#rule-grid-template-first
- 【推奨・実装上の判断】タグやメニューのように、中身の量で幅が決まる要素を並べて折り返すときは、Flexbox を使う。（`flexbox-for-content-sized-items`）
  - 理由: 子要素の幅を決めずに並べられ、入りきらない要素は自動で次の行へ回るため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/choosing/#rule-flexbox-for-content-sized-items
- 【推奨・実装上の判断】Flexbox の並びで一部の要素だけを行末側へ寄せるときは、その要素に `margin-inline-start: auto` を指定し、空の要素や `flex-grow` を使わない。（`flex-auto-margin-for-end-items`）
  - 理由: 余白の吸収先が1か所に決まり、要素の数が変わっても、寄せる位置が変わらないため。
  - 補足: 均等に散らす `justify-content: space-between` は、寄せる位置が要素の数で変わるので、この用途には向きません。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/choosing/#rule-flex-auto-margin-for-end-items
- 【推奨・実装上の判断】縦に積む要素の間隔が、前後の要素の種類や有無によって変わるときは、Flexbox や Grid にせず、通常フローのまま次兄弟結合子で選んだ要素の `margin-block-start` で間隔を作る。（`normal-flow-for-conditional-spacing`）
  - 理由: `gap` はすべての間に同じ値を空けるので、条件で変わる間隔を作るには子の `margin` を足したり打ち消したりする必要があるため。通常フローなら、要素の関係ごとに書いた `margin` と、マージンの相殺がそのまま働く。
  - 補足: 間隔を一律にしてよい部品は Flexbox の `gap`（コンポジション `stack`）で、要素の種類と順番が決まっていて間ごとの余白だけが違う部品は空のグリッドセルで作ります。見出しや段落が続く流れを自分で HTML に書くときは、コンポジション `prose` を使えます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/choosing/#rule-normal-flow-for-conditional-spacing

## 11-2 余白を設計する

https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/spacing/

- 【推奨・実装上の判断】Flexbox や Grid の子要素の間隔は、子要素の `margin` ではなく、親の `gap` で作る。（`gap-over-child-margin`）
  - 理由: 端の要素の余白を打ち消す指定が要らず、折り返したときに行の頭へ余計な余白が残ることもないため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/spacing/#rule-gap-over-child-margin
- 【推奨・実装上の判断】要素の間ごとに大きさの違う余白は、`grid-template` に空のセル（`.`）の行や列を置いて作る。（`empty-grid-cells-for-spacing`）
  - 理由: 余白の指定が `grid-template` の1か所にまとまり、見れば構造が分かるうえ、余白のための要素を足さずに済むため。
  - 補足: 余白の差を作るためだけに、`padding` を持つ `div` を足しません。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/spacing/#rule-empty-grid-cells-for-spacing
- 【推奨・実装上の判断】状況によって要素の有無や数が変わる場所では、`* + *` で2つ目以降の要素にだけ `margin-block-start` を付けて間隔を作る。（`owl-margin-for-optional-elements`）
  - 理由: 空のセルで余白を決めておくと、要素が欠けたときに余白だけが残るため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/spacing/#rule-owl-margin-for-optional-elements
- 【必須・実装上の判断】要素の間のブロック方向の `margin` は、`& > * + *` や `& > :is(:heading, h1, h2, h3, h4, h5, h6) + *` のように、次兄弟結合子で前の要素を条件にしたセレクタで選び、後ろの要素の `margin-block-start` に指定する。（`block-margin-with-sibling-combinator`）
  - 理由: 要素の間の余白は、隣り合う2つの要素の関係から生まれるため。前の要素を条件にしておけば、その関係が成り立つときだけ余白が付き、要素が欠けたり並びが変わったりしても、余計な余白が残らない。
  - 補足: 要素そのものに条件なしの `margin-block-start` や `margin-block-end` を付けたり、`:first-child` や `:last-child` で打ち消したりしません。Flexbox と Grid の子の間隔は、親の `gap` で作ります（`gap-over-child-margin`）。間隔ではなく位置を決める `margin`（`auto` で寄せる、`padding` を打ち消す負の値、アンカーポジショニングで基準の要素から離す距離など）と、マージンの相殺そのものを説明する例は対象外です。`:heading` は、ルール `heading-with-fallback` のとおり従来のタイプセレクタと並べて書きます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/spacing/#rule-block-margin-with-sibling-combinator
- 【推奨・実装上の判断】本文のように種類の違う要素が続く領域は、Flexbox や Grid の `gap` にせず、通常フローのまま `margin` で間隔を作る。（`prose-in-normal-flow`）
  - 理由: `float` による回り込みや `margin` の相殺が働き、要素ごとの余白の大小を自然に調整できるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/spacing/#rule-prose-in-normal-flow
- 【推奨・実装上の判断】親子のマージンの相殺を止めたいときは、`overflow: auto` や見えない `padding`、`border` ではなく、親に `display: flow-root` を指定する。（`flow-root-for-margin-collapse`）
  - 理由: `overflow` はスクロールコンテナを作り、中の `position: sticky` を妨げるほか、影や絶対配置の要素を切り取る副作用があるため。
  - 補足: Flexbox や Grid にした親と、その子の間では、余白は相殺しません。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/spacing/#rule-flow-root-for-margin-collapse
- 【推奨・実装上の判断】ページのコンテンツの最大幅と画面の端の余白は、グリッドの左右に余白の列（ガター）を作って決める。（`gutter-columns-for-content-width`）
  - 理由: 画面幅いっぱいに広げたい要素を、ガターの列まで広げるだけで作れるため。
  - 補足: 第12章のコンポジション `primary-layout` は、この形を部品にしたものです。画面幅いっぱいに広げる子要素がない1つの要素なら、`box-sizing: unset` と `padding` で書けます（7-3 のルール `unset-box-sizing-for-content-max-width`）。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/spacing/#rule-gutter-columns-for-content-width
- 【推奨・実装上の判断】ページに縦に並べるセクションの上下の余白は、親の `gap` やセクションの外側の `margin` ではなく、各セクションのルートの `padding-block` で作る。（`section-padding-block`）
  - 理由: 背景は `margin` の領域や親の `gap` の部分には描かれないため、`gap` や `margin` で空けるとセクションの間に親の背景が帯のように見えるため。`padding-block` なら背景が途切れず、中身と背景の端の間にも余白が確保される。
  - 補足: 背景が同じセクションが続く箇所では、`padding` は相殺しないので、上下のセクションの値が足し合わされます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/spacing/#rule-section-padding-block
- 【推奨・実装上の判断】余白の大きさは、グループの間の余白をグループの中の余白より大きくして、要素のまとまりが見て分かるようにする。（`spacing-proximity`）
  - 理由: 人は近くにあるものを同じまとまりとして読み取るので、余白の差が小さいと、どの要素がどのグループに属するのかが分からなくなるため。
  - 補足: カードの一覧なら、カードの中の間隔より、カードとカードの間隔を大きくします。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/spacing/#rule-spacing-proximity

## 11-3 サイズと内容の変化に耐える

https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/defensive/

- 【推奨・実装上の判断】CSS を書くときは、テキストが2倍の長さになったら、画像がなかったら、要素の数が変わったらと考え、そのパターンで表示を確かめる。（`design-for-content-changes`）
  - 理由: CMS での更新や改修によって、デザインカンプにない内容が入ることは避けられないため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/defensive/#rule-design-for-content-changes
- 【推奨・仕様上の制約】要素の高さは `block-size` で固定しない。一定の高さが要るときは `min-block-size` で下限を、上限が要るときは `max-block-size` で上限を決め、縦横比が決まっている要素（画像、動画、擬似要素で描くアイコンなど）は `aspect-ratio` で決める。（`min-block-size-over-fixed-height`）
  - 理由: 内容が増えたときや、ユーザーが文字サイズを大きくしたときにも、中身があふれないため。`aspect-ratio` なら幅に応じて高さが決まり、どの幅でも比率が保たれる。
  - 補足: `inline-size` と `block-size` に同じ値を書いて正方形を作らず、`inline-size` と `aspect-ratio: 1` で書きます。行の高さに合わせる `1lh`、読み込み中の表示の `2lh` のように、高さそのものが行数で決まる指定は対象外です。`appearance: none` で描き直す `input` 要素は、`aspect-ratio` で大きさを決めると Safari で比率を保てずに潰れることがあるので、`inline-size` と `block-size` の両方で指定します（17-6）。画面全体を覆う `position: fixed` の背景やダイアログのように、高さが画面の大きさで決まる指定（`100lvb`、`100%`）も対象外です。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/defensive/#rule-min-block-size-over-fixed-height
- 【必須・仕様上の制約】`minmax()` の最小値や `min-inline-size` に固定の長さを書くときは、`min(100%, …)` で親の幅を上限にする。（`minmax-min-capped-at-100-percent`）
  - 理由: 親がその長さより狭くなったときに、はみ出すのを防ぐため。
  - 補足: 例：`repeat(auto-fit, minmax(min(100%, calc(360 / 16 * 1rem)), 1fr))`、`min-inline-size: min(100%, 320px)`。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/defensive/#rule-minmax-min-capped-at-100-percent
- 【推奨・本書の規約】列を均等や比率で分けるときは、`minmax(0, 1fr)` ではなく `1fr` と書く。（`fr-without-minmax-zero`）
  - 理由: ベーススタイルの全称セレクタの `min-inline-size: 0` でグリッドアイテムの最小幅が0になっており、`1fr` の列も中身に押し広げられないため。`minmax(0, 1fr)` は同じ守りを重ねるだけで、意図して下限を決めた `minmax()` との区別もつかなくなる。
  - 補足: 列を比率で分けるときに `%` を使わない理由は、`%` が `gap` を除かない親の幅を基準にし、列の合計が `gap` の分だけ親を超えるためです。`fr` は `gap` を除いた残りを分けます。ベーススタイルの届かない Shadow DOM の中では、Shadow DOM のスタイルにも全称セレクタの `min-inline-size: 0`（第8章のルール `global-min-inline-size-zero`）を書きます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/defensive/#rule-fr-without-minmax-zero
- 【推奨・仕様上の制約】Flexbox で画像や動画を文章と横に並べるときは、メディアに `align-self: start` などを指定し、`stretch` で交差軸に引き伸ばさない。（`no-stretched-media-in-flex`）
  - 理由: `align-items` の初期値は `stretch` なので、`aspect-ratio` を指定した画像も隣の文章の高さまで伸び、文章の長さで比率が変わるため。
  - 補足: Grid では、縦横比を持つアイテムは引き伸ばされず始点に置かれるので、この指定は要りません。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/defensive/#rule-no-stretched-media-in-flex
- 【推奨・実装上の判断】Flexbox で要素を並べるときは、`flex-wrap: wrap` を既定にし、`nowrap` のままにするのは1行に収める理由がある並びだけにする。（`flex-wrap-for-variable-items`）
  - 理由: 要素が増えたとき、文字が長くなったとき、狭い場所に置かれたときに、折り返せずに縮みすぎたりはみ出したりするのを防ぐため。折り返しなら、ブレイクポイントを決めずに実際の幅で並びが組み替わる。
  - 補足: 折り返した後の行の間隔は `gap` の1つ目の値で決まるので、`gap: 8px 16px` のように行と要素の間隔を分けて書きます。ボタンの中のアイコンとラベルのように、折り返すと意味が崩れる並びは `nowrap` のままにし、理由をコメントに残します。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/defensive/#rule-flex-wrap-for-variable-items
- 【推奨・実装上の判断】文字を含む flex アイテムが縮みすぎないようにするときは、`flex-shrink: 0` ではなく `min-inline-size: fit-content` を使う。（`fit-content-over-flex-shrink-zero`）
  - 理由: `flex-shrink: 0` の要素は親より長くても縮まずにはみ出すが、`fit-content` なら親の幅を超えるときだけ折り返すため。
  - 補足: アイコンのように、大きさを変えたくない要素には `flex-shrink: 0` を指定します。`fit-content` の上限はフレックスコンテナの中身の幅全体で、ほかのアイテムや `gap` の分を差し引かないので、ボタンの中でアイコンと並ぶラベルには指定しません。ボタン全体を外側の並びのアイテムとして守り、ラベルは最小幅を0のままにして、残りの幅で折り返させます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/defensive/#rule-fit-content-over-flex-shrink-zero
- 【非推奨・実装上の判断】明確な理由がない限り、`white-space: nowrap` を指定しない。（`no-nowrap-without-reason`）
  - 理由: 内容が長くなったときや画面が狭いときに、折り返せずにはみ出すため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/defensive/#rule-no-nowrap-without-reason

## 11-4 はみ出しとスクロール

https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/overflow/

- 【推奨・実装上の判断】横スクロールが起きたら、はみ出しを隠す前に、はみ出している要素を特定して原因を直す。（`find-overflow-source-first`）
  - 理由: 隠すだけでは、はみ出した内容が切れて読めなくなることがあり、同じ原因の不具合がほかの場所でも残るため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/overflow/#rule-find-overflow-source-first
- 【必須・実装上の判断】はみ出しを切り取るだけなら、`overflow: hidden`（`overflow-x: hidden`）ではなく `clip` を使う。（`overflow-clip-over-hidden`）
  - 理由: `hidden` は要素をスクロールコンテナにするので、中の `position: sticky` が効かなくなり、フォーカスやプログラムからのスクロールで中身がずれ、片方の軸だけ指定してももう一方が `auto` になるため。
  - 補足: `hidden` を使うのは、スクロールコンテナが要る場面に限ります（例：`grid-template-rows` を `0fr` と `1fr` で切り替えて開閉する中身。スクロールコンテナになると自動の最小サイズが0になり、`0fr` まで畳めます）。`contain: paint` も、中の `position: fixed` の基準を変えてしまうので、はみ出しの対策には使いません。`sticky` が動かない原因の切り分けは、7-10 を参照してください。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/overflow/#rule-overflow-clip-over-hidden
- 【推奨・仕様上の制約】はみ出したときだけスクロールさせる要素には、`overflow: scroll` ではなく `overflow: auto` を指定する。（`overflow-auto-over-scroll`）
  - 理由: `scroll` は、中身が収まっていてもスクロールバーを常に表示し、スクロールバーを常に表示する環境では使えない帯が残るため。
  - 補足: スクロールバーが現れたときの中身の幅の揺れを防ぐなら、`scrollbar-gutter: stable` を合わせて指定します。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/overflow/#rule-overflow-auto-over-scroll
- 【推奨・仕様上の制約】スクロールさせる要素の中身を `justify-content` や `align-content` で中央に寄せるときは、`safe center` と書く。（`safe-center-for-scrollable`）
  - 理由: `center` のままでは、中身がはみ出したときに先頭側がスクロールで戻れない位置に置かれ、読めなくなるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/overflow/#rule-safe-center-for-scrollable

## 11-5 件数で配置を組み替える

https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/quantity-layouts/

- 【推奨・実装上の判断】区画（ゾーン）の有無と件数で配置を組み替えるときは、並べられるかどうかをコンテナサイズクエリで判定し、どの区画をどこに置くかを `&:not(:has(> ._quotes))` や `&:has(> ._quotes):has(> ._recent > :nth-child(6))` のように親を起点にした `:has()` で判定して、`grid-template` を書き換える。（`zone-layout-by-content`）
  - 理由: 幅と中身の判定を分ければ、どちらかの条件を変えるときに片方だけを直せばよく、件数や有無を表すクラスをテンプレートで出力する必要もないため。
  - 補足: 「ない」は `:not(:has())` で書き、`:has(:not())` は使いません。2つの条件をどちらも満たすときは `:has()` を連結します（引数をカンマで区切ると、どちらか一方で当てはまります）。テンプレートを書き換えるルールには `reading-flow` を指定し、中身のない区画は出力しません。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/quantity-layouts/#rule-zone-layout-by-content

## 11-6 重なりと全幅

https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/layering/

- 【推奨・実装上の判断】要素を重ねるときは、`position: absolute` の前に、Grid の同じエリアに置く方法を検討する。（`grid-stack-before-absolute`）
  - 理由: 重ねたどの要素の大きさも親の高さに反映されるので、文字が増えても画像からはみ出さないため。
  - 補足: 第12章のコンポジション `pile` は、この形を部品にしたものです。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/layering/#rule-grid-stack-before-absolute
- 【推奨・仕様上の制約】重なり順がおかしいときは、z-index の値を大きくする前に、どのスタッキングコンテキストの中で比べられているかを確かめる。（`check-stacking-context-first`）
  - 理由: z-index は同じスタッキングコンテキストの中でしか比べられず、祖先のコンテキストの順位を超えられないため。
  - 補足: 不要なコンテキストは指定を外して消し、必要なものは `isolation: isolate` で意図して作ります。`html` 要素は最初からコンテキストを作ります。z-index の値の決め方と `isolation` は、第10章のルール `z-index-tokens-only`、`isolation-for-relative-z-index` で扱います。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/layering/#rule-check-stacking-context-first
- 【推奨・仕様上の制約】Flexbox と Grid の子の重なり順を変えるだけなら、`position: relative` を足さずに z-index を指定する。（`z-index-on-items-without-position`）
  - 理由: フレックスアイテムとグリッドアイテムには `position: static` のままでも z-index が効き、`position: relative` を足すと、子孫の絶対配置の要素の包含ブロックまで変わるため。
  - 補足: 通常フローの要素では、z-index を効かせるのに `static` 以外の `position` が要ります。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/layering/#rule-z-index-on-items-without-position
- 【推奨・実装上の判断】要素を画面幅いっぱいに広げるときは、まずレイアウトのガターの列まで広げる方法を使い、ビューポート単位で広げるのは、背景の装飾と横にスクロールする領域に限る。（`full-bleed-via-layout-first`）
  - 理由: ビューポート単位はスクロールバーの幅の扱いがブラウザによって異なり、横スクロールの原因になりやすいため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/layering/#rule-full-bleed-via-layout-first
- 【必須・実装上の判断】親の幅を超えて画面の端まで広げる量は、`calc((100lvi - 100%) / -2)` のように「画面の幅と親の幅の差の半分」の式で書き、`100vw` や `calc(50% - 50vw)` を使わない。（`full-bleed-offset-formula`）
  - 理由: 何をどれだけ広げているのかが式から読め、`vw` の曖昧さも避けられるため。
  - 補足: `100lvi` もクラシックなスクロールバーの幅を含むので、この式を使うときは、ルートで横方向のはみ出しを `overflow-x: clip` で切る前提にします。横にスクロールする領域では、`100%` の代わりに名前付きのコンテナの `100cqi` を使います。`vw` を使わない理由は、第6章のルール `no-vw-vh` を参照してください。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/layering/#rule-full-bleed-offset-formula

## 11-7 固定ヘッダー

https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/sticky-header/

- 【推奨・仕様上の制約】ヘッダーを固定するときは、`@media (height >= calc(600 / 16 * 1rem))` のように、ビューポートの高さが十分なときだけ固定する。（`sticky-header-height-query`）
  - 理由: 高さの低い画面や拡大した画面では、固定したヘッダーが画面の多くを覆い、フォーカスした要素も隠すため。
  - 補足: ヘッダーの高さが決まっているなら、同じ条件でルートに `scroll-padding-block-start` を指定し、スクロールで見せる範囲からヘッダーの分を除きます。閾値の600px相当は目安です。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/sticky-header/#rule-sticky-header-height-query
- 【推奨・実装上の判断】`sticky` の要素が留まっている間だけ見た目を変えるときは、`scroll` イベントではなく `container-type: scroll-state` と `@container scroll-state(stuck: …)` を使い、変える内容は見えなくても操作に困らない装飾に限る。（`scroll-state-for-sticky-styles`）
  - 理由: スクロールのたびに JavaScript で位置を調べる処理が要らなくなり、クエリに対応していない環境でも装飾が付かないだけで済むため。
  - 補足: コンテナクエリなので、変えられるのはコンテナの子孫だけです。2026年10月の時点で対応しているのは Chrome 系のブラウザだけです。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/sticky-header/#rule-scroll-state-for-sticky-styles

## 11-8 アンカーポジショニング

https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/anchor-positioning/

- 【推奨・仕様上の制約】繰り返し置くコンポーネントの中でアンカーポジショニングを使うときは、ルートに `anchor-scope` を指定して、アンカーの名前が届く範囲をコンポーネントの中に限る。（`anchor-scope-for-repeated-components`）
  - 理由: 同じ名前のアンカーが複数あると、別のコンポーネントのアンカーが基準に選ばれることがあるため。
  - 補足: アンカーポジショニングをレイアウトの要として使わない規則は、第1章のルール `no-unsupported-layout-features` で扱います。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/anchor-positioning/#rule-anchor-scope-for-repeated-components
- 【推奨・実装上の判断】ホバーやフォーカスした項目へ背景が移る表現は、リストの擬似要素を `inset: anchor(inside)` で状態のある項目に合わせて作り、指定を `@supports` の中に書いて、未対応の環境では背景が付かないだけになる装飾として扱う。（`anchor-indicator-as-decoration`）
  - 理由: 項目ごとの背景では項目の間を移動させられない一方、アンカーポジショニングは対象のブラウザの一部が対応していないので、なくても内容と操作に影響しない形でだけ使えるため。
  - 補足: アンカーの名前は、`&:any-link:hover`（`@media (any-hover)` の中）と `&:focus-visible` のときだけリンクに付けます。どの項目も状態を持たない間は `anchor()` を解決できないので、リストに立てた `--_has-hocus` のフラグを擬似要素のスタイルクエリで読み、`opacity: 0` にします。使うのは、すべての項目が押せ、項目が隙間なく並び、ホバーしている間に項目が動かない部品に限ります。項目の間を移動させる `inset` のトランジションは `prefers-reduced-motion: no-preference` の中に書き、`opacity` のトランジションはその外に書いて、動きを減らす設定でも薄れる変化は残します。フォーカスしたリンクがある間は、どちらのトランジションも外します。ルートには `anchor-scope` を指定します（`anchor-scope-for-repeated-components`）。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/anchor-positioning/#rule-anchor-indicator-as-decoration

## 11-9 要素どうしの重なりを検出する

https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/overlap-detection/

- 【推奨・実装上の判断】アンカーポジショニングとスクロール駆動アニメーションで要素どうしの重なりを検出する技法は、隠れても内容と操作に影響しない装飾にだけ使い、指定はすべて `@supports` の中に書く。（`overlap-detection-for-decoration-only`）
  - 理由: Firefox などの未対応の環境では検出が働かないので、隠す対象が本文や操作の部品だと、環境によって読める内容が変わるため。
  - 補足: 測る範囲に置く要素は、はみ出したときにスクロールコンテナになるので、`inert` 属性を付けてフォーカスと支援技術から外します。重ならないレイアウト（Grid の列に装飾を置くなど）を組めるなら、そちらを先に検討します。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/overlap-detection/#rule-overlap-detection-for-decoration-only

## 11-10 ページのスクロールとルートスクローラー

https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/root-scroller/

- 【推奨・仕様上の制約】ページ全体のスクロールはビューポート（ルートスクローラー）に任せ、`html`、`body`、ページ全体を包むラッパーをスクロールコンテナにしない。（`root-scroller-for-page-scroll`）
  - 理由: 戻ったときのスクロール位置の復元、キーボードでのスクロール、`window.scrollY` とスクロールのイベント、ルートに書いた `scroll-padding` や背面の固定など、ページのスクロールを前提にした機能が働かなくなるため。
  - 補足: 表やコードブロックのように、ページの一部だけをスクロールさせる要素は対象外です。ページがどこでスクロールしているかは、スクロールしてから `window.scrollY` が0のままでないかで確かめます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/root-scroller/#rule-root-scroller-for-page-scroll
- 【非推奨・仕様上の制約】`html` と `body` に `height: 100%` を指定しない。画面の高さが必要なら、ページのレイアウトの要素に `min-block-size: 100svb` で最小値を決める。（`root-scroller-no-fixed-root-height`）
  - 理由: 高さを固定すると内容があふれ、あふれた分のための `overflow` が入れ子のスクロールコンテナを作るため。`overflow-x: hidden` と組み合わせると、`body` がスクロールコンテナになる。
  - 補足: kiso.css は `body` に `min-block-size: 100dvb` を指定しています。`body` の直下の要素には `%` の高さが効かないので、その要素にも `100svb` を指定します。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/root-scroller/#rule-root-scroller-no-fixed-root-height
- 【推奨・実装上の判断】画面に残したいヘッダーやサイドバーは、本文だけをスクロールさせる構造ではなく、`position: sticky` で留める。（`root-scroller-sticky-instead-of-pane`）
  - 理由: ページ全体がビューポートでスクロールしたまま、留めたい要素だけが位置を保てるため。
  - 補足: ヘッダーは、ビューポートの高さが十分なときだけ留めます（11-7）。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/root-scroller/#rule-root-scroller-sticky-instead-of-pane

## 11-11 grid-lanesで石積みのレイアウトを組む

https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/masonry/

- 【推奨・実装上の判断】`display: block grid-lanes` は `@supports (display: block grid-lanes)` の中に書き、その外には通常の Grid（`display: block grid`）と同じ `grid-template-columns` を書く。（`grid-lanes-inside-supports`）
  - 理由: 未対応の環境では行の高さがそろった Grid として読めて操作でき、分岐の条件がコードに残るので、全ブラウザが対応した時点で検索して消せるため。
  - 補足: `display` を2つ並べて後の宣言の無効化に頼る書き方は、意図が読めず、重複として消されやすいので使いません。写真を正方形にそろえるなど、フォールバックだけの宣言を切り替えるときも、各要素の中の `@supports` に書きます。`display` は、ほかの値と同じく `block grid-lanes` の2値構文で書きます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/masonry/#rule-grid-lanes-inside-supports
- 【非推奨・仕様上の制約】`grid-lanes` で順序に意味のある項目を並べるときは、項目に `grid-column: span N` や線の番号による配置を指定しない。（`grid-lanes-no-placement-for-ordered-items`）
  - 理由: 複数の列にまたがる項目や、位置を決めた項目が空きを作り、後の項目が前に表示されて、読み上げやフォーカスの順番と見た目の順番が大きく食い違うため。
  - 補足: ランキングや手順のように、順番そのものが内容になる一覧には `grid-lanes` を使いません。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/masonry/#rule-grid-lanes-no-placement-for-ordered-items
- 【非推奨・実装上の判断】`flow-tolerance` に `infinite` を指定しない。並び順を優先したいときは、`3em` のように初期値（`1em`）より大きい長さを指定する。（`flow-tolerance-no-infinite`）
  - 理由: `infinite` は列の高さを無視して左から順に置くので、隣り合う項目が縦に大きく離れた位置に置かれ、読み手が順番を追えなくなるため。
  - 補足: 仕様も、`infinite` の代わりに大きめの長さを指定するよう勧めています。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/masonry/#rule-flow-tolerance-no-infinite
- 【推奨・実装上の判断】上から下へ読む1つのリストを段に分けるときは `columns` を使い、項目に `break-inside: avoid` を指定して、間隔は `margin` ではなく `padding-block` で空ける。（`columns-for-top-to-bottom-lists`）
  - 理由: 段組みは並び順が縦なので HTML の順番と読む順番がそろい、2段目以降の先頭の `margin` は段の境目で切り取られて上端がそろわないため。
  - 補足: `column-width` は `%` を受け付けず、`min(100%, …)` と書くと宣言ごと無効になります。段の幅をコンテナに比例させるときは `cqi` を使います。横方向の順番で並べながら高さの違いを詰めるなら `grid-lanes` を使います。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/masonry/#rule-columns-for-top-to-bottom-lists

## 11-12 表示順と読み上げ順を合わせる

https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/reading-flow/

- 【必須・仕様上の制約】`grid-template-areas`、`flex-direction: row-reverse | column-reverse`、`flex-wrap: wrap-reverse`、`grid-auto-flow: dense` を書いたルールには、同じルールに `reading-flow` を指定する。（`reading-flow-when-reordered`）
  - 理由: 見た目の順番が DOM の順番から離れても、対応したブラウザでは読み上げとフォーカスが見た目の順番に追従し、見た目と DOM の順番が一致しているときも読む順番を確かめた印としてコードに残るため。
  - 補足: エリアの文字列を含む `grid-template` と `grid`、逆順を含む `flex-flow` も対象です。Grid には `grid-rows` か `grid-columns`、Flexbox には `flex-visual` か `flex-flow` を選びます。空のセル（`.`）を含まず、エリアの名前が1種類しかないテンプレート（`"--pile"` のように、すべての子を同じセルに重ねるもの）は、並べ替えにならないので対象外です。子の `order` や明示的な `grid-row`・`grid-column` で並べ替えるときも親のコンテナに指定しますが、これは Stylelint では検出できません。
  - 自動チェック: Stylelint: `book/reading-flow-when-reordered`（本書の独自ルール）
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/reading-flow/#rule-reading-flow-when-reordered
- 【必須・本書の規約】`order` と `reading-order` の値には、`1` か `-1` だけを使う。（`order-one-or-minus-one`）
  - 理由: 初期値の0に対して「ほかのすべての子より後」か「前」かが1つの値で読み取れ、各子の値を集めて並べ直さなくても順番が分かるため。
  - 補足: z-index の相対的な値を `--z--forwards`（1）と `--z--backwards`（-1）に限るのと同じ考え方です。2つ以上の子の順番を入れ替えたくなったら、HTML の順番を直すか、コンテナの `reading-flow` に `grid-rows` や `flex-visual` を指定します。`order` で見た目の順番を入れ替えるときは、ルール `flexbox-no-visual-reorder` と `reading-flow-when-reordered` にも従います。
  - 自動チェック: Stylelint: `declaration-property-value-allowed-list`
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/reading-flow/#rule-order-one-or-minus-one

## 11-13 アイコンを配置する

https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/icon-alignment/

- 【推奨・実装上の判断】文字に添えるアイコンは Grid か Flexbox で文章と並べ、`position: absolute` で重ねない。（`icon-grid-over-absolute`）
  - 理由: 絶対配置の要素は行の配置に加わらないので、アイコンの大きさと文章の側の余白が食い違ったときに、アイコンが内容に重なるため。
  - 補足: 手法の優先の順は、Grid・Flexbox、`float`、`position: absolute` です。項目の中身に `strong` や複数の段落が入って Grid にできないときは、`float: inline-start` で置きます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/icon-alignment/#rule-icon-grid-over-absolute
- 【必須・仕様上の制約】文章が折り返すおそれのある行頭や行末のアイコンは、`margin-block: calc((1lh - アイコンの大きさ) / 2)` で1行目の中央に置き、`align-items: center` で項目全体の中央に置かない。（`icon-first-line-with-lh`）
  - 理由: `align-items: center` では、文章が2行以上になるとアイコンが項目全体の高さの中央に移り、どの行にもそろわなくなるため。`1lh` なら文字の大きさや `line-height` を変えても式を直さずに済む。
  - 補足: 1行で折り返さないボタンのラベルのように、項目全体の中央と1行目の中央が一致する場面では `align-items: center` でかまいません。この `margin` はアイコンの位置を決める指定なので、ルール `block-margin-with-sibling-combinator` の対象外です。擬似要素の `font-size` を変えると `1lh` も変わるので、アイコンの大きさは `inline-size` で決めます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/icon-alignment/#rule-icon-first-line-with-lh
- 【必須・実装上の判断】中身の構造が決まらず Grid や Flexbox にできないアイコンを `float` や `position: absolute` で置くときは、位置を `calc()` の式で書き、何の値から決めたかを残す。（`out-of-flow-icon-position-calc`）
  - 理由: アイコンの大きさ、間隔、項目の `padding` を同じカスタムプロパティから計算すれば、どれかを変えたときにほかの値も一緒に変わり、数値の食い違いで重なったりずれたりしないため。
  - 補足: 例：`--_icon-offset: calc(var(--_icon-size) + var(--_gap))` を項目の `padding-inline-start` と擬似要素の負の `margin-inline-start` に使います。`position: absolute` の `inset-block-start` は `padding` を含む領域の上端から測るので、`calc(var(--_padding-block) + (1lh - var(--_icon-size)) / 2)` のように項目の `padding-block` も足します。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/icon-alignment/#rule-out-of-flow-icon-position-calc

## 11-14 floatで文章を回り込ませる

https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/float/

- 【推奨・実装上の判断】画像のまわりに文字を回り込ませるときは `float` を使い、囲む要素には clearfix ではなく `display: flow-root` を指定する。（`float-for-text-wrap`）
  - 理由: 回り込みは `float` の本来の用途で、`flow-root` なら余計な擬似要素なしに `float` を内側に収められるため。
  - 補足: 値は `float: inline-end` のように論理値で書きます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/float/#rule-float-for-text-wrap
- 【推奨・実装上の判断】文章の角に置く要素（モーダルの閉じるボタン、右上の装飾の画像など）は、`position: absolute` ではなく `float` で置き、文章を回り込ませる。（`float-for-corner-elements`）
  - 理由: 画面の幅や文章の量が変わっても文字が要素の下に隠れず、要素より下の空いた場所には文章が広がるため。
  - 補足: スクロールしても上端に留めたい閉じるボタンは、`float` に `position: sticky` と `inset-block-start: 0` を組み合わせます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/float/#rule-float-for-corner-elements

## 11-15 表を組む

https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/tables/

- 【推奨・実装上の判断】表は置かれた場所の幅に合わせて縮めず、`min-inline-size` で最小の幅を決め、表を包む要素に `overflow-x: auto` を指定して、それより狭い場所では横にスクロールさせる。（`table-min-size-with-scroller`）
  - 理由: 表は列の最小の幅の合計までしか縮まないので、`overflow-wrap: anywhere` のもとでは列が1〜2文字の幅まで縮んで数値の途中でも折り返し、折り返せない中身があればページ全体が横にはみ出すため。
  - 補足: 表の `display` を変えて表自体をスクロールさせる書き方は、修正前のブラウザでは表として読み上げられなくなるので使いません。包む要素には `role="region"`、`caption` を指す `aria-labelledby`、`tabindex="0"` を付けます。`overflow-inline` は Safari 26 から対応したので、`overflow-x` を使います（2026年10月時点、ルール `physical-only-where-no-logical`）。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/tables/#rule-table-min-size-with-scroller
- 【推奨・仕様上の制約】表には `caption` で名前を付け、見出しのセルは `th` にして、列の見出しには `scope="col"`、行の見出しには `scope="row"` を付ける。（`table-caption-and-scope`）
  - 理由: 支援技術が、表の名前と、各セルがどの見出しに属するかを伝えられるため。
  - 補足: スクロールさせる表では、包む要素の `aria-labelledby` でこの `caption` を指し、スクロールする枠にも同じ名前を付けます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/tables/#rule-table-caption-and-scope
- 【必須・仕様上の制約】スクロールのラッパーで包んだ表の列の見出しを `position: sticky` で留めるときは、ラッパーに `max-block-size` を指定して、ラッパーの中で縦にスクロールさせる。（`sticky-table-header-needs-block-limit`）
  - 理由: `overflow-x: auto` を指定すると `overflow-y` も `auto` として計算され、ラッパーが縦方向でも基準のスクロールコンテナになるので、ページをスクロールしても見出しは留まらないため。
  - 補足: ラッパーには `scrollbar-gutter: stable` も指定し、縦のスクロールバーの出入りで表の幅が変わらないようにします。縦の上限を設けない表では、行の見出し（先頭の列）だけを `inset-inline-start: 0` で横方向に留めます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/tables/#rule-sticky-table-header-needs-block-limit
- 【必須・仕様上の制約】表の見出しのセルを `position: sticky` で留めるときは、表に `border-collapse: separate` と `border-spacing: 0` を指定し、枠線を各セルに持たせる。（`table-sticky-border-separate`）
  - 理由: `collapse` では隣り合うセルが1本の枠線を共有し、共有の枠線は留めたセルと一緒に動かないので、スクロールすると見出しの境界線が消えて見えるため。
  - 補足: kiso.css は `table` に `border-collapse: collapse` を指定しています。枠線が二重にならないよう、各セルには `border-block-end` のように1辺ずつ指定します。留めたセルには不透明な背景色を指定し、縦と横の両方に留める左上のセルだけを `z-index: var(--z--forwards)` で前に出します。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/tables/#rule-table-sticky-border-separate
- 【推奨・実装上の判断】数値の列のセルは、列の見出しのセルも含めて `text-align: end` で末尾に揃え、表に `font-variant-numeric: tabular-nums` を指定する。（`numeric-cells-tabular-end`）
  - 理由: 末尾に揃えると1の位がそろい、等幅の数字にすると各桁も縦にそろって、値の大きさを見比べられるため。
  - 補足: `tabular-nums` は、フォントに等幅の数字（OpenType の `tnum` 機能）があるときだけ反映されます。スクロールのラッパーで包んだ表では、数値の途中で折り返さないよう、数値のセルに `white-space: nowrap` を指定してかまいません。単位は各セルに繰り返さず、`caption` か列の見出しにまとめます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/tables/#rule-numeric-cells-tabular-end
- 【推奨・仕様上の制約】狭い幅で表の要素の `display` を変えて縦に積むときは、HTML の各要素に `role`（`table`、`rowgroup`、`row`、`columnheader`、`rowheader`、`cell`）を書く。（`stacked-table-aria-roles`）
  - 理由: `display` を変えた表を表として扱わなくなる不具合が以前のブラウザにあり、明示した `role` で、修正前の環境でも表の意味を残せるため。
  - 補足: 縦に積むのは、1行ごとに完結した記録を並べる表に限り、行どうしを比べる表はスクロールのラッパーで包みます。縦に積んだときに表示する列の名前は HTML に書いて `aria-hidden="true"` を付け、`thead` は `display: none` ではなく視覚的にだけ隠します。切り替えは `--_density` で行い、表の形はブラウザのデフォルトのスタイルに任せて、縦に積む指定を `@container style(--_density: --compact)` の中に書きます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/tables/#rule-stacked-table-aria-roles

## 11-16 文字の切り詰めと読み込み中の表示

https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/truncation-and-skeletons/

- 【推奨・仕様上の制約】1行で打ち切るときは、`text-overflow: ellipsis` に `white-space: nowrap` と `overflow-inline: clip` を組み合わせる。（`ellipsis-with-nowrap-and-clip`）
  - 理由: `text-overflow` は折り返さずにはみ出した行にだけ効き、はみ出しを `overflow: hidden` で切り取ると要素がスクロールコンテナになるため。
  - 補足: `overflow-inline` に対応していない Safari 18 のために、`@supports not (overflow-inline: clip)` の中で `overflow-x: clip` を指定します。2行以上で打ち切るときは、第14章のルール `line-clamp-with-overflow-clip` に従います。行数を制限する要素には `padding-block` を付けず、余白は外側の要素に持たせます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/truncation-and-skeletons/#rule-ellipsis-with-nowrap-and-clip
- 【推奨・実装上の判断】文字を切り詰めるときは、リンク先のページや詳細の表示など、全文を読める手段を用意する。（`truncate-with-full-text-access`）
  - 理由: 切り詰めた部分は、画面の上では読めなくなるため。
  - 補足: `title` 属性の吹き出しは、タッチ操作やキーボードでは表示されないので、全文を読む手段にはしません。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/truncation-and-skeletons/#rule-truncate-with-full-text-access
- 【禁止・実装上の判断】金額、数量、日付、型番のような数値を、`text-overflow` や行数の制限で切り詰めない。（`no-truncate-numbers`）
  - 理由: 一部が見えていても値として正しく読めず、「12,800円」が「12…」になると12円と読み違えるおそれがあるため。
  - 補足: 数値と名前が1行に並ぶなら、名前のほうを切り詰め、数値の要素は `min-inline-size: fit-content` で縮ませません。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/truncation-and-skeletons/#rule-no-truncate-numbers
- 【推奨・実装上の判断】表や一覧で数値を縦に並べる列には、`font-variant-numeric: tabular-nums` を指定する。（`tabular-nums-for-number-columns`）
  - 理由: 数字の幅が字ごとに違う書体では、縦に並べた数値の桁の位置がずれ、大小を比べにくくなるため。
  - 補足: カウンターやタイマーのように表示したまま値が変わる数字は、`tabular-nums-for-changing-numbers` で扱います。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/truncation-and-skeletons/#rule-tabular-nums-for-number-columns
- 【推奨・実装上の判断】読み込み中の表示（スケルトン）は読み込み後の内容と同じ寸法にし、画像の枠は `aspect-ratio`、文字の行は `lh` 単位で場所を取る。（`skeleton-matches-final-size`）
  - 理由: 寸法が違うと、内容に差し替わったときに後ろの要素が動き、読んでいた位置や押そうとしたボタンがずれるため。
  - 補足: スピナーだけを置いて、内容が届いたときに場所を取り直す書き方はしません。スピナーは、内容と同じ寸法の枠の中に表示します。`lh` は要素自身の文字サイズと行送りから決まるので、スケルトンにも読み込み後と同じ値を指定します。明滅させるときは、第18章のルール `motion-only-with-no-preference` に従います。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/layout-practice/truncation-and-skeletons/#rule-skeleton-matches-final-size
