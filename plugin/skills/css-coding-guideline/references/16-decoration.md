# 第16章 画像・装飾：ルール

- ガイドラインのバージョン: 0.47.0（2026-10-10 生成）
- ルールの数: 32
- 本文: 約14.2万字
- 読む条件: 画像、SVG、アイコン、mask、影、角丸、枠線、区切り線、印刷

このファイルは「CSSコーディングガイドライン」のルールから自動生成しています。直接編集しないでください。
強度は「必須」「推奨」「非推奨」「禁止」の4段階です。「必須」と「禁止」は、各ルールの補足に書いた適用範囲と例外を除いて必ず守り、「推奨」と「非推奨」は理由があれば外れてかまいません。
性質は3種類です。「仕様上の制約」はCSS・HTML・ブラウザの振る舞いやWCAGから導かれ、守らないと表示や操作が崩れます。「実装上の判断」は状況とトレードオフで決まり、適用する条件があります。「本書の規約」は一貫性のために本書が選んだ約束で、ほかの約束を選んでも同じように成り立ちます。
背景とコード例は、各節の本文にあります。本文は MCP の `get_page`（ページID）か、URL で読みます。

## この章の節

- `decoration` 第16章 画像・装飾（約3,500字）https://t-arai-pnrm.github.io/css-coding-guideline/decoration/
- `decoration/images` 16-1 画像の配置と読み込み（約2.4万字）https://t-arai-pnrm.github.io/css-coding-guideline/decoration/images/
- `decoration/icons-and-masks` 16-2 アイコン・SVG・マスク（約2万字）https://t-arai-pnrm.github.io/css-coding-guideline/decoration/icons-and-masks/
- `decoration/surfaces` 16-3 面・影・角丸（約1.7万字）https://t-arai-pnrm.github.io/css-coding-guideline/decoration/surfaces/
- `decoration/text-ornaments` 16-4 文字とリストの装飾（約1.5万字）https://t-arai-pnrm.github.io/css-coding-guideline/decoration/text-ornaments/
- `decoration/shapes` 16-5 角の形を変える（約2万字）https://t-arai-pnrm.github.io/css-coding-guideline/decoration/shapes/
- `decoration/outlines` 16-6 輪郭と枠線を描く（約2.8万字）https://t-arai-pnrm.github.io/css-coding-guideline/decoration/outlines/
- `decoration/separators` 16-7 区切り線を引く（約1.4万字）https://t-arai-pnrm.github.io/css-coding-guideline/decoration/separators/

## 16-1 画像の配置と読み込み

https://t-arai-pnrm.github.io/css-coding-guideline/decoration/images/

- 【必須・実装上の判断】要素の縦横比は `aspect-ratio` で決め、`padding-top` の割合で高さを作らない。（`aspect-ratio-for-ratios`）
  - 理由: 比率のための擬似要素や絶対配置が要らず、比率の指定だとコードから読み取れるため。
  - 補足: 正方形や正円は `aspect-ratio: 1` で作ります。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/decoration/images/#rule-aspect-ratio-for-ratios
- 【推奨・仕様上の制約】大きさを決めた画像や動画には `object-fit` の `cover` か `contain` を指定し、初期値の `fill` で引き伸ばさない。（`object-fit-cover-or-contain`）
  - 理由: 比率の違う画像が入っても歪まないようにするため。
  - 補足: 写真のように枠を埋めたい画像は `cover`、ロゴのように切り取られると困る画像は `contain` にします。ベーススタイルで `img` と `video` を `cover` にしておく方法もあります。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/decoration/images/#rule-object-fit-cover-or-contain
- 【必須・仕様上の制約】`<img>` には、画像の実際の大きさを `width` と `height` の属性で書く。（`img-width-height-attributes`）
  - 理由: ブラウザが読み込む前から縦横比を計算して場所を確保し、読み込んだときにレイアウトがずれるのを防ぐため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/decoration/images/#rule-img-width-height-attributes
- 【必須・仕様上の制約】画像や動画の上に文字を載せるときは、画像が表示されなくても文字を読める背景色を指定する。（`text-on-image-fallback-background`）
  - 理由: 画像を読み込めないと、文字と背景の色が近くなり、文字を読めなくなることがあるため。
  - 補足: 背景色は文字色から決めます。`sign()` の宣言を先に書き、`contrast-color(currentColor)` で上書きします（ルール `contrast-color-for-image-fallback`）。`contrast-color()` だけだと、対応していない環境で背景色が付かず、画像が表示されないときに文字が読めなくなります。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/decoration/images/#rule-text-on-image-fallback-background
- 【推奨・実装上の判断】背景に写真を敷くときは、`background-image` ではなく、`object-fit` を指定した `<img>` を本文と同じグリッドのエリアに置く。（`img-over-background-image`）
  - 理由: `<picture>` や `srcset` と `sizes` で表示される幅に合った画像を読み込め、`opacity` やフィルターで画像だけを加工でき、`alt` で意味を伝えられるうえ、HTML を解析する段階でプリロードスキャナーに見つかり、LCP の候補でも表示が遅れないため。
  - 補足: `background-image` は、`background-repeat` で敷き詰めるパターン画像や、内容と関係のない細かな装飾に使います。単色やグラデーションだけの背景も `background-image` で足ります。装飾の写真なら `alt=""` にします。重ねるだけの入れ物には、コンポジションの `pile` を使えます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/decoration/images/#rule-img-over-background-image
- 【推奨・実装上の判断】`srcset` と `sizes` の値は、手で計算せず、RespImageLint などのツールで確かめて決める。（`sizes-by-tool`）
  - 理由: 表示される幅は余白や段組みの切り替えによって変わり、手で計算すると誤りやすいため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/decoration/images/#rule-sizes-by-tool
- 【禁止・仕様上の制約】ファーストビューに表示される画像に、`loading="lazy"` を指定しない。（`no-lazy-loading-first-view`）
  - 理由: ページでいちばん大きな要素の表示が遅れるため。
  - 補足: `fetchpriority="high"` は、LCP の候補になる画像（ファーストビューでいちばん大きく表示される画像）にだけ指定します。ファーストビューの画像すべてに指定すると、優先する画像どうしで帯域を奪い合うためです。`loading="lazy"` は、スクロールしないと見えない画像と `<iframe>` にだけ付けます。ページ内のすべての `<img>` に一括では付けません。遅延読み込みは処理を先送りするだけで、スクロールや操作の最中に処理が重なると INP や体感を悪くするためです。遅延読み込みする要素にも、`width` と `height` の属性か `aspect-ratio` で場所を確保します。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/decoration/images/#rule-no-lazy-loading-first-view
- 【推奨・実装上の判断】`<img>` に `decoding="async"` を指定せず、デフォルトの `auto` に任せる。（`no-decoding-async`）
  - 理由: キャッシュのない通常の読み込みでは `sync` と `async` に目立った性能の差がなく、キャッシュがあるときに `async` だと、画像以外が先に表示されて画像があとから現れ、画面がちらつくため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/decoration/images/#rule-no-decoding-async
- 【推奨・実装上の判断】写真のような画像は、AVIF で書き出す。（`avif-for-photos`）
  - 理由: WebP より10〜30%ほど小さく、すべての主要なブラウザが対応しているため。
  - 補足: AVIF への変換は WebP より時間がかかるので、画像の多いサイトではビルドの時間を見積もります。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/decoration/images/#rule-avif-for-photos

## 16-2 アイコン・SVG・マスク

https://t-arai-pnrm.github.io/css-coding-guideline/decoration/icons-and-masks/

- 【推奨・実装上の判断】三角形などの図形は `border` の組み合わせではなく `clip-path` で描き、`polygon()` の値は `--shape--triangle-bottom` のようなトークンにする。（`clip-path-shape-tokens`）
  - 理由: 図形の大きさを幅と高さで決められ、どのような形なのかが名前から分かるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/decoration/icons-and-masks/#rule-clip-path-shape-tokens
- 【推奨・実装上の判断】スクロールできる領域の端を薄くして続きを示すときは、端に線や背景と同じ色のグラデーションを重ねず、スクロールコンテナの `mask-image` に両端が透明になるグラデーションを指定する。（`scroll-edge-fade-with-mask`）
  - 理由: 中身そのものが端で薄れるので、背景が写真や別の色でも帯が浮かず、線のように区切りとして読まれることもないため。
  - 補足: `linear-gradient()` の向きには論理方向のキーワードがないので、両端を同じ幅で薄くして書字方向に左右されない形にします。マスクは要素の外側に描く `outline` も切り取るので、スクロールコンテナがフォーカスを受けるときは、リングを親の `:has(:focus-visible)` に出します。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/decoration/icons-and-masks/#rule-scroll-edge-fade-with-mask
- 【推奨・実装上の判断】単色のアイコンの色は `currentColor` で文字色に合わせ、状態ごとにアイコンの色を指定し直さない。（`icon-current-color`）
  - 理由: 文字色を切り替えるだけでアイコンも追従し、色を2か所に書く必要がなくなるため。
  - 補足: `border` の色も、省略すれば `currentColor` になります。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/decoration/icons-and-masks/#rule-icon-current-color
- 【推奨・実装上の判断】意味を持つインライン SVG のアイコンは `aria-hidden="true"` にし、隣に視覚的に隠したテキストを置く。（`inline-svg-hidden-with-text`）
  - 理由: `<title>` や `aria-label` と違って、機械翻訳、ページ内検索、選択してのコピーの対象になるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/decoration/icons-and-masks/#rule-inline-svg-hidden-with-text

## 16-3 面・影・角丸

https://t-arai-pnrm.github.io/css-coding-guideline/decoration/surfaces/

- 【推奨・実装上の判断】面の背景は、ページ、カード、ダイアログ、メニューの役割で決めた段階のトークンから選び、置かれた面からの相対的な高さで決めない。（`surface-levels-by-role`）
  - 理由: 役割で固定すれば、どこに置かれても同じトークンを参照するだけで済み、祖先の値をスタイルクエリで読む例外を作らずに済むため。
  - 補足: 本書のデモでは `--background--base`（ページ）、`--background--surface`（カード）、`--background--overlay`（ダイアログ）、`--background--raised`（メニューやポップオーバー）の4段階です。メニューはダイアログの中でも開くので、ダークモードでは `raised` を `overlay` より明るくします。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/decoration/surfaces/#rule-surface-levels-by-role
- 【推奨・実装上の判断】ダークモードでは、高い面ほど背景を明るくし、面の高さを影だけで表さない。（`lighter-surface-in-dark-mode`）
  - 理由: 暗い背景の上では影がほとんど見えず、影だけでは面の重なりが読み取れないため。
  - 補足: 明るい背景は、ページの背景のプリミティブから `oklch(from var(--color--neutral--900) calc(l + 0.085) c h)` のように相対カラー構文で作ります。ライトモードでは、ページ以外の面を白にし、高さを影で表します。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/decoration/surfaces/#rule-lighter-surface-in-dark-mode
- 【推奨・実装上の判断】影の色は `light-dark()` で切り替える色のトークンにし、ダークモードでも黒のまま不透明度を上げる。（`shadow-black-in-dark-mode`）
  - 理由: `box-shadow` の値は `light-dark()` で書き分けられず、暗い背景に白い影を付けると、影ではなく光って見えるため。
  - 補足: 影の形は1組だけ定義し、各層の色に `--shadow--color` などのトークンを使います。ダークモードで面の端を見せる上辺のハイライトと内側の縁取りは、ライトモードでは `transparent` にします。色のある背景に落とす影は、背景の色相に寄せると背景がくすみません。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/decoration/surfaces/#rule-shadow-black-in-dark-mode
- 【推奨・実装上の判断】影のトークンは光源の向きをそろえ、段階が上がるほど、オフセットとぼかしを倍にした層を足す。（`shadow-tokens-light-source`）
  - 理由: 各層の不透明度が同じでも、要素の近くほど層が重なって濃くなり、段階が高いほど影が遠くまで落ちるので、段階ごとに調整しなくても高さの関係が一貫して読み取れるため。
  - 補足: 本書のデモでは、層のオフセットとぼかしを1、3、6、12、24、48pxとし、広がりをその半分の負の値にしています。最も低い段階は1pxの縁取りだけで、枠線の代わりに使えます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/decoration/surfaces/#rule-shadow-tokens-light-source
- 【非推奨・実装上の判断】重ねた影（複数の `box-shadow`）そのものを、`transition` や `animation` で動かさない。（`no-animate-layered-shadow`）
  - 理由: 描画の計算量が層の数に比例して増え、段階の高い影ほど層が多いので、古い端末ではコマ落ちしやすいため。
  - 補足: 影を動かしたいときは、影を付けた擬似要素の `opacity` を動かします。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/decoration/surfaces/#rule-no-animate-layered-shadow

## 16-4 文字とリストの装飾

https://t-arai-pnrm.github.io/css-coding-guideline/decoration/text-ornaments/

- 【推奨・実装上の判断】番号付きリストの番号の色や大きさを変えるときは、`list-style: none` と `::before` ではなく、`::marker` に `color` と `font-size` を指定する。（`marker-for-list-number-style`）
  - 理由: リストの意味を保ったまま番号の見た目を変えられ、`list-style: none` の問題も避けられるため。
  - 補足: `::marker` には `background` や `border` を指定できず、Safari は `color` と `font-size` しか反映しません（`marker-color-and-font-size-only`）。太くする、円で囲むなど、それ以上の装飾が必要なときだけ、`list-style-type: ""` でマーカーを空にして `::before` に `counter()` で番号を描きます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/decoration/text-ornaments/#rule-marker-for-list-number-style
- 【推奨・仕様上の制約】文字の縁取りは `-webkit-text-stroke` で描き、`paint-order: stroke fill` で塗りの下に置く。（`text-stroke-paint-order`）
  - 理由: 線は字形の輪郭を中心に描かれるので、塗りの上に重ねると内側の半分が塗りを覆い、文字が細く読みにくくなるため。
  - 補足: 見えるのは線の外側の半分なので、線の幅は見せたい縁取りの2倍にします。`-webkit-text-stroke` には接頭辞のない書き方がないので、理由のコメントを添えて Stylelint の警告を無効にします。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/decoration/text-ornaments/#rule-text-stroke-paint-order
- 【推奨・仕様上の制約】行ごとに背景や枠線を敷く装飾は、インラインの要素に `-webkit-box-decoration-break: clone` と `box-decoration-break: clone` を併記して描く。（`inline-decoration-clone-with-prefix`）
  - 理由: 初期値の `slice` では折り返した位置の `padding` と枠線がなくなり、Safari は接頭辞付きの宣言にしか対応していないため。
  - 補足: 上下の座布団が重ならないように、`line-height` を `1cap + (padding + border + 間隔) * 2` のように座布団の高さから決めます。この `line-height` は長さなので、座布団の中に文字サイズの違う子要素を置かず、理由のコメントを添えて Stylelint の警告を無効にします。改行の位置は `.-br` で決めます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/decoration/text-ornaments/#rule-inline-decoration-clone-with-prefix

## 16-5 角の形を変える

https://t-arai-pnrm.github.io/css-coding-guideline/decoration/shapes/

- 【推奨・仕様上の制約】`corner-shape` は、無視されても角丸のまま崩れない宣言ならそのまま書き、`scoop` の擬似要素のように未対応の環境で形が崩れる指定だけを `@supports (corner-shape: …)` の中に書く。（`corner-shape-guard-when-broken`）
  - 理由: 未対応の環境では `corner-shape` が無視されて通常の角丸になり、擬似要素で作った反り返りが外側へ出っ張るため。
  - 補足: 錠剤型のボタンに足す `corner-shape: squircle` は、無視されても錠剤型のままなので、`@supports` で囲みません。`@supports` の条件には、使うキーワードまで書きます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/decoration/shapes/#rule-corner-shape-guard-when-broken
- 【推奨・実装上の判断】画面いっぱいのときだけ角丸を消すときは、`calc(sign(100lvi - 100% - 許容幅) * 半径) / 半径` のように、要素の幅とビューポートの幅を比べて水平方向の半径だけを切り替える。（`full-bleed-radius-with-sign`）
  - 理由: 余白や最大幅を変えても、要素が画面いっぱいになったときに角丸が消え、ブレイクポイントを別に管理しなくて済むため。
  - 補足: `/` を省くと、垂直方向の半径の `%` が要素の高さを基準にするので、縦に長い要素では角丸が常に消えます。許容幅は、スクロールバーの幅の分です。`vw` ではなく `lvi` を使います。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/decoration/shapes/#rule-full-bleed-radius-with-sign
- 【推奨・仕様上の制約】角丸を `corner-shape: squircle` に置き換えるときは、見た目の大きさが合うように `border-radius` を大きくし、その指定を `@supports` の中に書く。（`squircle-larger-radius`）
  - 理由: スクワークルは同じ半径でも円弧の角丸より角が小さく見え、倍率を `if()` で決めるカスタムプロパティは、未対応の環境では `border-radius` ごと無効にするため。
  - 補足: 倍率は半径によって変わります（著者の CodePen では、8px 以上が2倍、24px 以上が1.67倍で `superellipse(1.75)`、32px 以上が1.5倍で `superellipse(1.5)`）。錠剤型のボタンに `squircle` を1行足すだけの場合は、ルール `corner-shape-guard-when-broken` に従います。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/decoration/shapes/#rule-squircle-larger-radius

## 16-6 輪郭と枠線を描く

https://t-arai-pnrm.github.io/css-coding-guideline/decoration/outlines/

- 【推奨・仕様上の制約】`background-clip: border-area` の透明な枠線のように、未対応の環境で宣言ごと無効になって何も描かれなくなる指定は `@supports` の中に書く。（`guard-new-shapes-with-supports`）
  - 理由: 未対応の環境では、背景の宣言ごと無効になって枠線やグラフが消えたり、枠線だけが透明になったりするため。
  - 補足: 未対応の環境では、単色の枠線や中心まで塗った円グラフのように、意味の読み取れる形に縮退させます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/decoration/outlines/#rule-guard-new-shapes-with-supports
- 【推奨・実装上の判断】グラデーションの枠線は `background-clip: border-area` で描いて未対応の環境では単色の枠線に戻し、どの環境でもグラデーションが必要なときだけ、擬似要素の透明な枠線にグラデーションを敷いて `mask-composite: exclude` で内側をくり抜く。（`gradient-border-method`）
  - 理由: `border-area` なら2つの宣言で描けて形がコードから読み取れ、装飾の枠線は単色でも境界を示せるため。
  - 補足: マスクの書き方では、ルートに `position: relative` と `isolation: isolate` を指定し、擬似要素を `z-index: var(--z--backwards)` で背面に回して、ルートの `padding` に枠線の太さを足します。`contain: content` でも配置の基準とスタッキングコンテキストは作れますが、はみ出した子孫の影やポップアップが切り取られます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/decoration/outlines/#rule-gradient-border-method
- 【推奨・実装上の判断】`clip-path: shape()` の座標は、半径などをカスタムプロパティに入れて、そこから計算する。（`shape-function-with-custom-properties`）
  - 理由: `shape()` の値は長く、数値を直接並べると形が読み取れず、大きさを変えるたびにすべての座標を書き直すことになるため。
  - 補足: `shape()` に対応していない環境には、`@supports not` で `border-radius` の形に戻します。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/decoration/outlines/#rule-shape-function-with-custom-properties
- 【推奨・仕様上の制約】吹き出しのように枠線を輪郭に沿わせる形は、`shape()` を1つのカスタムプロパティに入れて `clip-path` と `border-shape` で共有し、`border` と `border-shape` は `@supports (border-shape: …)` の中に書く。（`shared-shape-for-border-shape`）
  - 理由: 同じ輪郭を2か所に書くと片方だけ直したときに塗りと枠線がずれ、`@supports` の外の `border` は未対応の環境で `clip-path` に切り落とされて欠けた枠になるため。
  - 補足: しっぽの高さは `半幅 * tan(60deg)` で正三角形にし、下の `padding` にしっぽの高さを足します。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/decoration/outlines/#rule-shared-shape-for-border-shape

## 16-7 区切り線を引く

https://t-arai-pnrm.github.io/css-coding-guideline/decoration/separators/

- 【推奨・仕様上の制約】並んだ要素の間の区切り線は、各要素の `border` ではなく、要素の間の `gap` に描く。（`separators-in-gap`）
  - 理由: 折り返しや列数の変化で行の末尾に来る要素はセレクタで選べず、要素に線を持たせると、行の端に区切る相手のいない線が残ったり、隣り合う線が二重になったりするため。
  - 補足: gap decorations（`column-rule`、`row-rule`）を使うか、`gap` を線の太さにして各要素の `box-shadow` を重ねます。表の枠線は `border-collapse` で共有します（11-15）。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/decoration/separators/#rule-separators-in-gap
- 【非推奨・仕様上の制約】区切り線のために各要素に `border` を付け、`:last-child` や `:nth-child()` で末尾の要素の `border` を打ち消さない。（`no-last-child-border-reset`）
  - 理由: 打ち消せるのは並び全体の最後の要素だけで、折り返した行の末尾や、列数が変わるグリッドの末尾の列には線が残るため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/decoration/separators/#rule-no-last-child-border-reset
- 【推奨・実装上の判断】gap decorations は、線がなくても内容を読める区切りに使い、線がないと境界が分からないときは `box-shadow` で同じ位置に線を描いたうえで、対応している環境の改善として足す。（`gap-decorations-progressive`）
  - 理由: 2026年10月時点で対応しているのは Chrome と Edge だけで、未対応の環境では線が描かれないため。
  - 補足: Grid と Flexbox の `column-rule` は、未対応の環境では無視されるだけなので、線を足すだけなら `@supports` は要りません。`box-shadow` の線と切り替えるときは `@supports not` の中に `box-shadow` を書き、強制カラーモードでは `outline` に切り替えます（ルール `no-box-shadow-only-boundary`）。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/decoration/separators/#rule-gap-decorations-progressive
- 【必須・仕様上の制約】gap decorations の対応を `@supports` で判定するときは、`column-rule` ではなく `column-rule-inset` のような gap decorations で加わったプロパティを条件にする。（`gap-decorations-supports-condition`）
  - 理由: `column-rule` はマルチカラムのプロパティとしてすべてのブラウザが対応しているので、gap decorations に未対応の環境でも条件が真になるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/decoration/separators/#rule-gap-decorations-supports-condition
