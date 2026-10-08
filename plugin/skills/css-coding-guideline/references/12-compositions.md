# 第12章 レイアウトコンポジション：ルール

- ガイドラインのバージョン: 0.43.0（2026-10-08 生成）
- ルールの数: 37

このファイルは「CSSコーディングガイドライン」のルールから自動生成しています。直接編集しないでください。
強度は「必須」「推奨」「非推奨」「禁止」の4段階です。「必須」と「禁止」は、各ルールの補足に書いた適用範囲と例外を除いて必ず守り、「推奨」と「非推奨」は理由があれば外れてかまいません。
性質は3種類です。「仕様上の制約」はCSS・HTML・ブラウザの振る舞いやWCAGから導かれ、守らないと表示や操作が崩れます。「実装上の判断」は状況とトレードオフで決まり、適用する条件があります。「本書の規約」は一貫性のために本書が選んだ約束で、ほかの約束を選んでも同じように成り立ちます。
背景とコード例は、各節の URL のページにあります。

## 12-1 stack：子要素を縦に積み、間隔をそろえる

https://t-arai-pnrm.github.io/css-coding-guideline/compositions/stack/

- 【推奨・実装上の判断】構成が決まっていて、間隔を一律にしてよい要素を縦に積むときは `stack` を、見出しや段落、図が続き、子ごとに間隔を変えたい本文の流れには `prose` を使う。（`stack-vs-prose`）
  - 理由: `stack` の子はフレックスアイテムになり、`float` による回り込みと `margin` の相殺が使えず、間隔も子ごとに変えられないため。
  - 補足: 横に並べるときは、`stack` に `flex-direction: row` を上書きせず、`cluster` や `apart` を使います。CMS で編集者が入力する本文エリアの中には、どちらも使わず `.wysiwyg` で余白を決めます（`prose-not-on-cms-body`）。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/compositions/stack/#rule-stack-vs-prose
- 【推奨・実装上の判断】`stack` の一部の間隔だけを変えたいときは、子に `margin` を足さず、近い要素を `stack` で包んで入れ子にするか、`grid-template` の空のセルに切り替える。（`stack-uneven-gaps`）
  - 理由: フレックスアイテムの `margin` は相殺されずに `gap` に足され、間隔が2か所の指定の和で決まって読み取りにくくなるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/compositions/stack/#rule-stack-uneven-gaps
- 【推奨・仕様上の制約】`stack` を入れ子にするときは、内側の `stack` にも `--stack--gap` を渡し、間隔を空けない場合も `0` と明示する。（`stack-nested-gap`）
  - 理由: カスタムプロパティは継承されるので、値を渡さない内側の `stack` には、デフォルト値の `0` ではなく外側の値が使われるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/compositions/stack/#rule-stack-nested-gap
- 【推奨・仕様上の制約】`stack` の子のうち、ボタンやリンクのように中身の幅で見せたい要素には、置く側の CSS で `align-self: start` を指定する。（`stack-align-self-start`）
  - 理由: `align-items` のデフォルト値 `normal` はフレックスアイテムでは `stretch` と同じに振る舞い、子が `stack` の幅いっぱいに広がるため。
  - 補足: 子が別のコンポーネントのルートなら、そのコンポーネントの中には書かず、置く側のコンポーネントが子クラスで指定します。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/compositions/stack/#rule-stack-align-self-start

## 12-2 cluster：子を横に並べ、入りきらなければ折り返す

https://t-arai-pnrm.github.io/css-coding-guideline/compositions/cluster/

- 【推奨・実装上の判断】子を両端に分けて置くときは、`cluster` に `--cluster--justification: space-between` を渡さず、`apart` を使う。（`cluster-apart-for-two-ends`）
  - 理由: 子が3つ以上ある `cluster` で `space-between` を使うと、行ごとに子の間隔がばらつき、最後の行の子が左右に離れて置かれるうえ、クラス名から「両端に分ける」意図を読み取れないため。
  - 補足: `cluster` の寄せ方は `start`（デフォルトの `normal`）、`center`、`end` から選びます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/compositions/cluster/#rule-cluster-apart-for-two-ends
- 【推奨・実装上の判断】`flex-wrap: balance` は `@supports (flex-wrap: balance)` の中に書き、その外には `flex-wrap: wrap` を書く。（`cluster-balance-inside-supports`）
  - 理由: 新しい値に頼った指定であることが条件から読み取れ、未対応の環境では通常の折り返しのまま表示でき、すべての対象ブラウザが対応したときに分岐ごと消せるため。
  - 補足: 2026年10月時点で `flex-wrap: balance` に対応しているのは Chrome と Edge の150以降だけです。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/compositions/cluster/#rule-cluster-balance-inside-supports
- 【推奨・仕様上の制約】入れ子にした `cluster` で行と列の間隔を別々に指定するときは、`--cluster--gap: initial` も渡し、外側から継承した一括の間隔を打ち消す。（`cluster-reset-inherited-gap`）
  - 理由: カスタムプロパティは継承し、フォールバックの連鎖では一括の `--cluster--gap` が個別の指定より優先されるので、打ち消さないと内側の `--cluster--row-gap` と `--cluster--column-gap` が使われないため。
  - 補足: 内側でも一括の `--cluster--gap` を渡すなら、外側の値は上書きされるので不要です。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/compositions/cluster/#rule-cluster-reset-inherited-gap

## 12-3 apart：子要素を両端に分ける

https://t-arai-pnrm.github.io/css-coding-guideline/compositions/apart/

- 【推奨・実装上の判断】`apart` は役割の違う2つのまとまりを両端に分けるときに使い、片側に複数の要素を置くときは1つの要素に包む。（`apart-for-two-groups`）
  - 理由: `justify-content: space-between` は子の数と幅によって間隔と折り返した行の位置が変わるので、子が3つ以上あると並び方が予測しにくくなるため。
  - 補足: タグの一覧やナビゲーションのリンクのように、同じ種類の要素を並べるときは `cluster` を使います。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/compositions/apart/#rule-apart-for-two-groups
- 【推奨・仕様上の制約】`apart` には、両端の要素の最小の間隔を `--apart--column-gap`（または `--apart--gap`）で渡す。（`apart-column-gap-as-minimum`）
  - 理由: `space-between` が配る余白は幅が狭くなると0まで減るので、列の間隔がないと、両端の要素が接するまで折り返さないため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/compositions/apart/#rule-apart-column-gap-as-minimum
- 【推奨・仕様上の制約】折り返した2行目でも行末側の要素を行末に寄せたいときは、`apart` ではなく、その要素に `margin-inline-start: auto` を指定する。（`apart-auto-margin-for-wrapped-end`）
  - 理由: `space-between` は行に要素が1つしかないとき行頭に置くが、`auto` の `margin` は2行目でも余った空間を吸収して要素を行末に寄せるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/compositions/apart/#rule-apart-auto-margin-for-wrapped-end

## 12-4 switcher：n列と1列を幅で切り替える

https://t-arai-pnrm.github.io/css-coding-guideline/compositions/switcher/

- 【推奨・実装上の判断】対等な項目を「指定の列数か1列か」のどちらかで並べたいときは `switcher` を使い、列数が段階的に減ってよい一覧には `grid` を使う。（`switcher-for-all-or-nothing`）
  - 理由: `auto-fit` だけで並べると、途中の幅で最後の項目が1つだけ次の行に落ち、項目が対等に見えなくなるため。
  - 補足: 幅の違う2つの要素（メインとサイド）を並べるときは `sidebar` を使います。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/compositions/switcher/#rule-switcher-for-all-or-nothing
- 【必須・仕様上の制約】`switcher` の列の幅の目安は「（100% − 列の間隔 ×（列数 − 1））÷ 列数」で計算する。（`switcher-preferred-width-formula`）
  - 理由: 「100% ÷ 列数 − 列の間隔 ×（列数 − 1）」と書くと目安が小さくなりすぎ、`auto-fit` が指定より多くの列を作るため。
  - 補足: 例：列数4、列の最小幅200px、列の間隔24pxで要素の幅が1000pxのとき、正しい式では4列、誤った式では5列になります。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/compositions/switcher/#rule-switcher-preferred-width-formula
- 【必須・仕様上の制約】閾値などの `calc()` で長さと足し合わせる間隔のデフォルト値は、単位のない `0` ではなく `0px` と書く。（`switcher-gap-default-with-unit`）
  - 理由: 単位のない `0` は数値として扱われ、「長さ＋数値」の式が無効になって、宣言全体が初期値に戻るため。
  - 補足: `switcher` では、`grid-template-columns` が `none` に戻り、どの幅でも1列になります。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/compositions/switcher/#rule-switcher-gap-default-with-unit

## 12-5 sidebar：メインとサイドの2カラムにし、狭ければ縦に積む

https://t-arai-pnrm.github.io/css-coding-guideline/compositions/sidebar/

- 【推奨・実装上の判断】幅の決まったサイドと伸び縮みするメインの2つを横に並べ、狭ければ縦に積む配置は、クエリで閾値を書かず、`sidebar` コンポジションで組む。（`sidebar-before-queries`）
  - 理由: 折り返す幅が「メインの最小幅＋サイドの幅＋列の間隔」として子の幅の指定から決まり、サイドの幅や間隔を変えても閾値を計算し直さずに済むため。
  - 補足: 要素が3つ以上ある配置、折り返す幅をデザインの都合で決めたい配置、並べたときと積んだときで見た目の順番を変えたい配置は、`grid-template` のエリアとコンテナサイズクエリで組む。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/compositions/sidebar/#rule-sidebar-before-queries
- 【必須・仕様上の制約】`sidebar` の直接の子は2つだけにし、それぞれに `.main-column` と `.side-column` を付ける。（`sidebar-two-direct-children`）
  - 理由: `flex-grow` と `flex-basis` は2つのクラスにだけ指定されており、クラスのない子や3つ目の子が加わると、折り返す幅の計算が成り立たなくなるため。
  - 補足: `:first-child` のような位置で選ばず、クラスで役割を指定するので、サイドを先に書いてもメインとサイドは入れ替わらない。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/compositions/sidebar/#rule-sidebar-two-direct-children
- 【推奨・仕様上の制約】`sidebar` のサイドを左右どちらに置くかは HTML の順番で決め、`flex-direction: row-reverse` や `order` で見た目だけを入れ替えない。（`sidebar-side-position-by-source-order`）
  - 理由: 横に並んでいる間、キーボードで移動する順番と読み上げの順番が、見た目の順番と食い違うため。
  - 補足: 本文の後に見る補助の内容（関連記事など）は本文の後に、先に知っておくと便利な内容（章の目次、絞り込みの条件など）は本文の前に書く。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/compositions/sidebar/#rule-sidebar-side-position-by-source-order
- 【推奨・仕様上の制約】`--sidebar--main-min-width` と `--sidebar--side-width` には、それぞれの子の中身の最小幅（長い単語、固定幅の画像、表など）より大きな値を渡す。（`sidebar-widths-above-min-content`）
  - 理由: フレックスアイテムは中身の最小幅より狭くならず、折り返しの判定にも大きいほうが使われるので、指定より広い幅で折り返すようになるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/compositions/sidebar/#rule-sidebar-widths-above-min-content

## 12-6 grid：列の最小幅と最大数から列数を決める

https://t-arai-pnrm.github.io/css-coding-guideline/compositions/grid/

- 【推奨・実装上の判断】同じ形のアイテムを並べる一覧で列の数に上限があるときは、メディアクエリで列数を切り替えず、`grid` の `--grid--column-min-width` と `--grid--column-max-count` で列の最小幅と最大数を渡す。（`grid-max-count-over-queries`）
  - 理由: 列数が画面ではなく一覧自身の幅から決まり、どこに置いても最小幅を下回らず、最大数を超えないため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/compositions/grid/#rule-grid-max-count-over-queries
- 【推奨・実装上の判断】件数が変わる一覧では `--grid--mode` をデフォルトの `auto-fill` のままにし、`auto-fit` は件数が最大数に届かないときに行いっぱいに広げたい並びにだけ渡す。（`grid-mode-auto-fill-default`）
  - 理由: `auto-fit` では件数が少ないときにアイテムが行いっぱいに広がり、件数によってカードの幅や見た目が変わるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/compositions/grid/#rule-grid-mode-auto-fill-default
- 【必須・仕様上の制約】`grid` の列の間隔には、`0` を渡すときも `0px` のように単位の付いた長さを渡す。（`grid-gap-with-unit`）
  - 理由: 列の幅の計算で間隔を `100%` から引くので、単位のない `0` を渡すと `grid-template-columns` の宣言が無効になり、1列に並ぶため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/compositions/grid/#rule-grid-gap-with-unit
- 【推奨・実装上の判断】数が決まっていて揃いで見せたいアイテム（特徴や料金プランなど）は、`grid` ではなく `switcher` で並べる。（`grid-switcher-for-fixed-sets`）
  - 理由: `grid` は列が1つずつ減るので、幅によっては1つのアイテムだけが次の行に残り、揃いの印象が崩れるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/compositions/grid/#rule-grid-switcher-for-fixed-sets

## 12-7 columns：上から下へ読むリストを段に分ける

https://t-arai-pnrm.github.io/css-coding-guideline/compositions/columns/

- 【推奨・仕様上の制約】`columns` コンポジションの直下には段に分けるリストを1つだけ置き、見出しなどはその外に置く。（`columns-single-list-child`）
  - 理由: 段組みと負のマージンは直下の子すべてに付くので、リスト以外の要素を入れると、その要素まで段組みになり、余白も崩れるため。
  - 補足: 項目の `li` や `div` は、段組みを付けたリストの直下に置きます。`dl` では用語と説明を `div` で包むと、まとめて段の境目で分かれなくなります。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/compositions/columns/#rule-columns-single-list-child
- 【非推奨・実装上の判断】画面の高さを超える長さのリストを、1つの段組みにしない。（`columns-not-for-tall-lists`）
  - 理由: 1段目を読み終えるたびに、2段目の先頭まで上へスクロールして戻る必要があるため。
  - 補足: 長いサイトマップは、見出しとリストのまとまりに分けて `grid` や `masonry` で並べ、各まとまりの中だけを `columns` にします。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/compositions/columns/#rule-columns-not-for-tall-lists
- 【推奨・仕様上の制約】コンポジションの中の要素に負のマージンを付けて端の余白を打ち消すときは、ルートを `display: block flow-root` にする。（`columns-negative-margin-in-flow-root`）
  - 理由: 通常のフローでは、先頭の子の負のマージンが親を突き抜けて外の要素のマージンと相殺し、コンポジションの外側の余白が変わるため。
  - 補足: 負のマージンはルートには付けず、内側の要素に付けます。ルートに付けると、親の `gap` や隣の要素との間隔が変わります。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/compositions/columns/#rule-columns-negative-margin-in-flow-root

## 12-8 masonry：高さの違う子を短い列へ詰めて並べる

https://t-arai-pnrm.github.io/css-coding-guideline/compositions/masonry/

- 【推奨・実装上の判断】`masonry` コンポジションは、新着順の一覧のように高さがそろわず、おおよその順番が伝われば足りる項目に使い、高さのそろう項目や順番が内容になる項目は `grid` コンポジションで並べる。（`masonry-for-loose-order-lists`）
  - 理由: 高さがそろう項目では詰める隙間がなく、`grid-lanes` の配置では見た目の順番と HTML の順番（読み上げとフォーカスの順番）がずれる可能性だけが残るため。
  - 補足: 上から下へ読む1つのリストを段に分けるときは、`columns` コンポジションを使います。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/compositions/masonry/#rule-masonry-for-loose-order-lists
- 【推奨・実装上の判断】`masonry` コンポジションの `--masonry--tolerance` のデフォルト値は `flow-tolerance` の初期値と同じ `normal` にし、項目が左右へ飛んで見えるときだけ `3em` のような大きめの長さを渡す。（`masonry-tolerance-default-normal`）
  - 理由: `0` にすると、ほぼ同じ高さの列のどちらに置くかを厳密に決めることになり、項目が左右へ大きく飛ぶ配置が起きやすいため。
  - 補足: `infinite` は渡しません。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/compositions/masonry/#rule-masonry-tolerance-default-normal

## 12-9 pile：子要素を同じセルに重ねる

https://t-arai-pnrm.github.io/css-coding-guideline/compositions/pile/

- 【推奨・仕様上の制約】`pile` の子の位置を変えるときは、`--pile--placement` などの公開プロパティを、`.pile` ではなく動かしたい子の `style` 属性で渡す。（`pile-placement-on-target-child`）
  - 理由: `.pile` で渡すと、継承ですべての子に同じ配置がかかり、大きさを指定していない背景用の要素が中身の大きさに縮むため。
  - 補足: `--pile--placement` に渡すキーワードは1つだけです。方向ごとに違う値を使うときは、`--pile--alignment` と `--pile--justification` を個別に指定します。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/compositions/pile/#rule-pile-placement-on-target-child
- 【禁止・仕様上の制約】`pile` の子に、コンポーネントの CSS で `grid-area`、`grid-row`、`grid-column` を指定しない。（`pile-no-grid-placement-on-children`）
  - 理由: `components` レイヤーが `compositions` レイヤーより優先されるので、子が `--pile` のエリアから外れて重ならなくなるため。
  - 補足: `.pile > *` で選ばれない `::before` と `::after` は例外で、重ねるならコンポーネントの側で `grid-area: --pile` を指定します。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/compositions/pile/#rule-pile-no-grid-placement-on-children
- 【推奨・仕様上の制約】`pile` で画像の上に文字を重ねるときは、文字と画像の間に暗い層を置き、どの画像でも文字のコントラスト比が保たれるようにする。（`pile-scrim-for-text-on-image`）
  - 理由: 画像の差し替えや文字の折り返しで、文字の下に来る部分の明るさが変わるため。
  - 補足: 白い文字なら、黒い層の不透明度を55％以上にすると、真っ白な画像の上でもコントラスト比が4.5:1を超えます。画像を読み込めなかったときのために、ルートに暗い `background-color` も指定します。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/compositions/pile/#rule-pile-scrim-for-text-on-image
- 【推奨・仕様上の制約】枠の外へはみ出させる要素（角からはみ出すバッジ、ドロップダウンなど）は、`pile` で重ねず、絶対配置やトップレイヤーで表示する。（`pile-not-for-overflowing-layers`）
  - 理由: `pile` の子は親の大きさに反映されて枠の中に収まり、`isolation: isolate` で重なり順も `pile` の中に閉じるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/compositions/pile/#rule-pile-not-for-overflowing-layers

## 12-10 primary-layout：コンテンツ幅とガターを決め、子に5段階の幅を選ばせる

https://t-arai-pnrm.github.io/css-coding-guideline/compositions/primary-layout/

- 【推奨・実装上の判断】`primary-layout` の子の幅は、子に最大幅や負の `margin` を書かず、`full-column` などのクラスか `grid-column: --wide` のような線の名前で選ぶ。（`primary-layout-width-by-line-names`）
  - 理由: 幅の段階とガターの値が `primary-layout` の1か所にまとまり、画面の幅で値を変えるときも子を直さずに済むため。
  - 補足: 画面の端まで広げる方法の比較は、第11章のルール `full-bleed-via-layout-first` を参照してください。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/compositions/primary-layout/#rule-primary-layout-width-by-line-names
- 【必須・仕様上の制約】中央の列の最大幅は、コンテンツ幅の最大値から、その両側に足す列の上限を2本分引いて求める（`var(--_c--content-max-width) - var(--_c--narrow-reduction) * 2`）。（`primary-layout-center-column-subtract-both-sides`）
  - 理由: 片側の分しか引かないと、コンテンツ幅が指定した最大値より列1本分だけ広くなるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/compositions/primary-layout/#rule-primary-layout-center-column-subtract-both-sides
- 【推奨・本書の規約】コンポジションの子に付けて置き場所を選ぶクラスは、`full-column` のように接頭辞を付けずに名付け、`& > .full-column` のように直下の子に限って効かせる。（`primary-layout-child-classes-unprefixed`）
  - 理由: `_` はコンポーネントの子要素、`-` はどこでも効くユーティリティの印なので、どちらでもないコンポジションの一部であることを名前とセレクタで示すため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/compositions/primary-layout/#rule-primary-layout-child-classes-unprefixed

## 12-11 prose：子ごとに変えられる間隔で、本文の流れを作る

https://t-arai-pnrm.github.io/css-coding-guideline/compositions/prose/

- 【推奨・実装上の判断】`prose` の中で特定の間だけ間隔を変えるときは、`margin` を足さず、その間の後ろにある子に `--prose--space` を渡す。（`prose-space-on-following-child`）
  - 理由: `margin-block-start` の `var(--prose--space)` は子要素の上で解決されるので、渡した子の前の間隔だけが変わり、打ち消しや差分の計算が要らないため。
  - 補足: 見出しの前を広げるなら見出しに、見出しの直後を詰めるなら見出しの次の要素に渡します。値は `style` 属性で渡し、画面の幅で変えるときや複数の子にまとめて渡すときはコンポーネントの CSS で渡します。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/compositions/prose/#rule-prose-space-on-following-child
- 【必須・仕様上の制約】`prose` の `--prose--space` はルートで内部プロパティに受け直さず、子要素の `margin-block-start` の `var()` で直接参照する。（`prose-no-internal-property`）
  - 理由: ルートで受け直すと `var()` がルートの上で解決され、子には解決済みの値が継承されるので、子に渡した `--prose--space` が効かなくなるため。
  - 補足: 公開プロパティを `:scope` で内部プロパティに受ける規約（第10章のルール `receive-public-property-with-fallback`）の例外です。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/compositions/prose/#rule-prose-no-internal-property
- 【推奨・仕様上の制約】`prose` の中に `prose` を入れるときは、内側のルートの `--prose--space` を外側との間隔に使い、内側の間隔は内側の子に渡す。（`prose-nested-inner-space`）
  - 理由: ルートに渡した値は継承によって内側の子にも届き、外側との間隔と内側の間隔が同じ値になってしまうため。
  - 補足: 例：`._note { & > * { --prose--space: calc(var(--spacing--xxs) / 16 * 1rem); } }`
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/compositions/prose/#rule-prose-nested-inner-space
- 【非推奨・仕様上の制約】CMS で編集者が入力する本文エリア（`.wysiwyg` など）には `prose` を付けず、`prose` は本文エリアとその前後の要素を並べる外側に使う。（`prose-not-on-cms-body`）
  - 理由: 編集者は子に `style` 属性を付けられないうえ、本文エリアの余白のルールと同じ `margin-block-start` を指定し合い、`compositions` レイヤーの `prose` が黙って負けるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/compositions/prose/#rule-prose-not-on-cms-body
