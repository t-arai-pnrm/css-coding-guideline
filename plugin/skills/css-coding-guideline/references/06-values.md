# 第6章 値と単位：ルール

- ガイドラインのバージョン: 0.49.1（2026-10-10 生成）
- ルールの数: 29
- 本文: 約7.5万字
- 読む条件: px、rem、em、vw、vh、cqi などの単位、calc()、min()、max()、clamp()、if()、attr()

このファイルは「CSSコーディングガイドライン」のルールから自動生成しています。直接編集しないでください。
強度は「必須」「推奨」「非推奨」「禁止」の4段階です。「必須」と「禁止」は、各ルールの補足に書いた適用範囲と例外を除いて必ず守り、「推奨」と「非推奨」は理由があれば外れてかまいません。
性質は3種類です。「仕様上の制約」はCSS・HTML・ブラウザの振る舞いやWCAGから導かれ、守らないと表示や操作が崩れます。「実装上の判断」は状況とトレードオフで決まり、適用する条件があります。「本書の規約」は一貫性のために本書が選んだ約束で、ほかの約束を選んでも同じように成り立ちます。
背景とコード例は、各節の本文にあります。本文は MCP の `get_page`（ページID）か、URL で読みます。

## この章の節

- `values` 第6章 値と単位（約3,600字）https://t-arai-pnrm.github.io/css-coding-guideline/values/
- `values/px-and-rem` 6-1 pxとremを使い分ける（約1.6万字）https://t-arai-pnrm.github.io/css-coding-guideline/values/px-and-rem/
- `values/viewport-and-container-units` 6-2 ビューポート単位とコンテナ単位（約1.2万字）https://t-arai-pnrm.github.io/css-coding-guideline/values/viewport-and-container-units/
- `values/math-functions` 6-3 計算関数で根拠を式に残す（約1.3万字）https://t-arai-pnrm.github.io/css-coding-guideline/values/math-functions/
- `values/advanced-math-functions` 6-4 計算関数を応用する（約1.3万字）https://t-arai-pnrm.github.io/css-coding-guideline/values/advanced-math-functions/
- `values/if-and-attr` 6-5 if()とattr()で条件と属性を値にする（約1.8万字）https://t-arai-pnrm.github.io/css-coding-guideline/values/if-and-attr/

## 6-1 pxとremを使い分ける

https://t-arai-pnrm.github.io/css-coding-guideline/values/px-and-rem/

- 【必須・実装上の判断】単位は「ユーザーがブラウザの文字サイズを大きくしたとき、この値も一緒に大きくなるべきか」で選び、大きくなるべき値は rem（または em）、そうでない値は px にする。（`unit-by-text-scaling`）
  - 理由: 文字サイズの設定を尊重しつつ、余白や線まで大きくなって読みにくくなるのを防ぐため。
  - 補足: すべてを rem にする書き方も、すべてを px にする書き方も、この基準に合いません。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/values/px-and-rem/#rule-unit-by-text-scaling
- 【必須・仕様上の制約】`font-size` は rem（要素の文字サイズに比例させるなら em）で指定し、px を使わない。（`font-size-in-rem`）
  - 理由: px で指定した文字は、ブラウザの文字サイズの設定を変えても大きくならないため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/values/px-and-rem/#rule-font-size-in-rem
- 【推奨・実装上の判断】段落の間の縦の余白、テキストを含む要素の幅、ボタンの最小の高さのように、文字と一緒に大きくなるべき寸法は rem で指定する。（`text-related-sizes-in-rem`）
  - 理由: 文字だけが大きくなると、段落の区切りが分かりにくくなったり、1行に入る文字数が減って窮屈になったりするため。
  - 補足: ブレイクポイントを rem で指定するのも同じ理由です（13-2）。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/values/px-and-rem/#rule-text-related-sizes-in-rem
- 【推奨・実装上の判断】`padding`（とくに水平方向）と、`border-width`、`box-shadow`、`outline-width`、`outline-offset` のような装飾的な値は px で指定する。（`padding-and-decoration-in-px`）
  - 理由: 余白まで大きくなると1行に入る文字数がさらに減り、線や影の太さは文字の大きさと関係がないため。
  - 補足: `gap` や `margin` は、この基準に照らして1つずつ判断します。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/values/px-and-rem/#rule-padding-and-decoration-in-px
- 【推奨・実装上の判断】アイコンの大きさ、アイコンとラベルの間の `gap`、見出しに隣接する `margin` のように、その要素自身の文字サイズに比例させたい値は em で指定する。（`em-for-own-font-size`）
  - 理由: 大きさの違う文字の隣に置かれても、文字との比率を保てるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/values/px-and-rem/#rule-em-for-own-font-size
- 【推奨・本書の規約】px の値を rem に変換するときは `calc(24 / 16 * 1rem)` のように変換の式で書き、計算した結果（`1.5rem`）を書かない。（`px-to-rem-formula`）
  - 理由: デザインカンプのピクセル値をそのまま読み取れ、計算の手間と誤りも減るため。
  - 補足: `clamp()`、`min()`、`max()` の中では、`calc()` を省いて `24 / 16 * 1rem` と書けます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/values/px-and-rem/#rule-px-to-rem-formula
- 【禁止・仕様上の制約】`html { font-size: 62.5% }` のように、rem の計算を簡単にする目的でルートの文字サイズを変えない。（`no-root-font-size-change`）
  - 理由: 16px を前提に rem で書かれた外部の CSS が崩れ、px で指定した場合はユーザーの文字サイズの設定も効かなくなるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/values/px-and-rem/#rule-no-root-font-size-change
- 【必須・仕様上の制約】`line-height` は単位のない数値で指定する。（`unitless-line-height`）
  - 理由: 単位のある値は計算後の長さのまま子要素に継承され、文字サイズの違う子要素で行が重なったり空きすぎたりするため。
  - 補足: 見出しや本文ごとの値と、`line-height: 1` を使わない理由は第14章で扱います。例外は、インラインの要素の行ごとに座布団を敷くときに、座布団の高さから `line-height` を長さで決める場合です（16-4）。この場合は、座布団の中に文字サイズの違う子要素を置かず、理由のコメントを添えて Stylelint の警告を無効にします。
  - 自動チェック: Stylelint: `declaration-property-unit-allowed-list`
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/values/px-and-rem/#rule-unitless-line-height
- 【推奨・本書の規約】サイズのトークンは単位のない数値（px 相当）で持ち、使う場所で `calc(var(--spacing--md) / 16 * 1rem)` や `calc(var(--spacing--md) * 1px)` に変換する。（`unitless-size-tokens`）
  - 理由: 同じ大きさでも、使う場所によって選ぶべき単位が変わるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/values/px-and-rem/#rule-unitless-size-tokens
- 【必須・実装上の判断】rem を使ったら、ブラウザの文字サイズの設定を大きくして表示を確かめる。（`verify-with-text-scaling`）
  - 理由: 設定が効いているかどうかと、文字が大きくなったときに崩れないかどうかは、設定を変えて見なければ分からないため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/values/px-and-rem/#rule-verify-with-text-scaling

## 6-2 ビューポート単位とコンテナ単位

https://t-arai-pnrm.github.io/css-coding-guideline/values/viewport-and-container-units/

- 【禁止・仕様上の制約】`vw`、`vh`、`vi`、`vb`、`vmin`、`vmax` を使わない。（`no-vw-vh`）
  - 理由: ブラウザの UI が引っ込んだ最も大きい画面（ラージビューポート）が基準で、どの状態に合わせたいのかがコードから読み取れず、モバイルでは UI が表示された状態で要素が見切れたり、スクロールバーの幅の分だけ横スクロールが起きたりするため。
  - 補足: 代わりに `svi` や `svb` などを使います。
  - 自動チェック: Stylelint: `unit-disallowed-list`（警告）
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/values/viewport-and-container-units/#rule-no-vw-vh
- 【推奨・実装上の判断】ビューポート単位は、横方向は `svi`、縦方向は `svb` を優先する。（`prefer-svi-svb`）
  - 理由: ブラウザの UI が表示されている最も小さい画面でも収まり、有効なコンテナがないときの `cqi` の計算（`svi`）ともそろうため。
  - 補足: 画面の高さいっぱいの要素は `min-block-size: 100svb` と、最小の高さとして指定します。`svh` や `svw` のような物理方向の単位は、`logical-css/require-logical-units` が警告します。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/values/viewport-and-container-units/#rule-prefer-svi-svb
- 【非推奨・実装上の判断】要素の大きさを `dvb`（`dvh`）で指定しない。（`avoid-dvb`）
  - 理由: スクロールに合わせてブラウザの UI が出入りするたびに値が変わり、レイアウトシフトが起きるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/values/viewport-and-container-units/#rule-avoid-dvb
- 【推奨・実装上の判断】ブラウザの UI の有無にかかわらず画面の高さいっぱいに広げたい要素（固定した背景など）には、`lvb` を使う。（`lvb-for-fixed-background`）
  - 理由: UI が引っ込んだときの最大の高さを基準にするので、スクロール中にも背景が途切れないため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/values/viewport-and-container-units/#rule-lvb-for-fixed-background
- 【推奨・実装上の判断】ビューポート単位は、ページ全体の余白やヒーローのようにメディアクエリと対になる値に使い、置き場所が変わるコンポーネントの中では使わない。（`viewport-units-with-media-queries`）
  - 理由: ビューポート単位はページ全体の状態と結びついた値で、コンポーネントが置かれた場所の幅とは関係がないため。
  - 補足: コンポーネントの中で幅に応じて変える値は、名前付きのコンテナと `cqi` で書きます（13-3）。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/values/viewport-and-container-units/#rule-viewport-units-with-media-queries
- 【禁止・仕様上の制約】文字サイズをビューポート単位だけで決めない（`font-size: 4svi` など）。（`no-viewport-only-font-size`）
  - 理由: ユーザーの文字サイズの設定が無視され、Chrome 系のブラウザではズームしても文字が大きくならないことがあるため。
  - 補足: 画面の幅に合わせて変えるなら、`clamp()` で rem と組み合わせます（6-3）。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/values/viewport-and-container-units/#rule-no-viewport-only-font-size
- 【推奨・実装上の判断】ビューポート単位は、`%` やイントリンシックなレイアウトで解決できないときだけ使う。（`viewport-units-as-last-resort`）
  - 理由: Chrome 系のブラウザでズームしたときに拡大されないことがあり、スクロールバーの幅の扱いもブラウザによって異なるため。
  - 補足: `inline-size: 100vw` のように要素を画面幅いっぱいに広げる指定は、多くの場合なくても済みます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/values/viewport-and-container-units/#rule-viewport-units-as-last-resort
- 【推奨・実装上の判断】ビューポート単位を使う流体的な値をプロジェクト全体で多用するときは、その都度書かず、トークンかユーティリティにまとめる。（`centralize-viewport-fluid-values`）
  - 理由: 基準の幅や係数が散らばらず、変えるときの修正が1か所で済むため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/values/viewport-and-container-units/#rule-centralize-viewport-fluid-values

## 6-3 計算関数で根拠を式に残す

https://t-arai-pnrm.github.io/css-coding-guideline/values/math-functions/

- 【推奨・本書の規約】計算して決まる値は、計算した結果ではなく `calc()` の式で書き、値の根拠をコードに残す。（`formula-over-result`）
  - 理由: 値が何から決まったのかを読み取れ、元の値を変えたときに計算し直す必要もないため。
  - 補足: 根拠のない値を `calc(48rem)` のように包むだけでは意味がありません。値が本当に固定で、分解しても意味が増えないなら、そのまま書きます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/values/math-functions/#rule-formula-over-result
- 【推奨・実装上の判断】式の中で意味が分かりにくい値や、何度も使う値は、ローカルのカスタムプロパティに名前を付けてから式に使う。（`name-calc-operands`）
  - 理由: 式が読みやすくなり、値を変えるときの修正も1か所で済むため。
  - 補足: 一度しか使わない複雑な式には、何列分・何個分なのかをコメントで補足します。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/values/math-functions/#rule-name-calc-operands
- 【推奨・実装上の判断】幅に応じて連続的に変えたい値は、クエリで段階的に切り替えず、`clamp()` で最小値と最大値の間を補間する。（`fluid-values-with-clamp`）
  - 理由: クエリの数が減り、切り替わる幅の前後で値が急に変わることもなくなるため。
  - 補足: タグやアイコンのように、大きさを変える必要のない要素には使いません（13-1）。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/values/math-functions/#rule-fluid-values-with-clamp
- 【必須・仕様上の制約】文字サイズのように、ユーザーの設定に追従させる値を `clamp()` で書くときは、最小値と最大値を rem にし、推奨値を rem と相対単位（`svi` か `cqi`）の和にする。（`clamp-rem-bounds`）
  - 理由: 相対単位だけの推奨値では、文字サイズの設定やズームが効かなくなるため。
  - 補足: ページ全体の値には `svi` を、コンポーネントの中の値には名前付きのコンテナの `cqi` を使います。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/values/math-functions/#rule-clamp-rem-bounds
- 【推奨・本書の規約】`clamp()` の推奨値は、2つの基準の幅とそのときの値から傾きと切片を求めて書き、ジェネレーターが出した数値だけを貼らない。（`clamp-from-slope-intercept`）
  - 理由: 数値だけでは、どの幅でどの値になるのかを読み取れず、値を変えるときに計算をやり直せないため。
  - 補足: 基準の幅と値は、カスタムプロパティを使った式にするか、少なくともコメントに残します。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/values/math-functions/#rule-clamp-from-slope-intercept
- 【推奨・仕様上の制約】文字サイズを `clamp()` で流体的にするときは、最大値を最小値の2.5倍以内にする。（`fluid-font-size-max-ratio`）
  - 理由: 推奨値の相対単位の部分はブラウザのズームで大きくならないが、Chrome と Firefox のデスクトップ版では最大500%のズームで最小値は5倍になるので、最大値が最小値の2.5倍以内なら、どの幅でも文字を2倍以上に拡大でき、WCAG 2.1 の達成基準1.4.4を満たせるため。
  - 補足: 2.5倍は、Chrome と Firefox のズームの最大の500%から導いた十分条件です。超える場合は、最小値を上げるか最大値を下げます。最小値と最大値を rem にするルール `clamp-rem-bounds` と組み合わせて使います。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/values/math-functions/#rule-fluid-font-size-max-ratio

## 6-4 計算関数を応用する

https://t-arai-pnrm.github.io/css-coding-guideline/values/advanced-math-functions/

- 【推奨・本書の規約】長さを単位のない数値に変えるときは、`calc(100svi / 1px)` のように単位のついた値で割り（typed arithmetic）、`tan(atan2(長さ, 1px))` で単位を外さない。（`typed-arithmetic-to-unitless`）
  - 理由: 式がそのまま割り算として読め、角度を経由する三角関数の回り道が要らないため。
  - 補足: デザインカンプの値は、これまでどおり `calc(40 / 1280 * 100svi)` のように単位のない数値で割り、`40px / 1280px` とは書きません。2026年10月の時点で、Firefoxの安定版は単位のついた値での割り算に対応していない（158で対応する予定）ので、宣言が無効になっても内容を読める場面で使います。Chromeでは、この割り算で定義した長さがブラウザのズームで拡大縮小されないので、文字サイズにはremの下限を付けます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/values/advanced-math-functions/#rule-typed-arithmetic-to-unitless

## 6-5 if()とattr()で条件と属性を値にする

https://t-arai-pnrm.github.io/css-coding-guideline/values/if-and-attr/

- 【推奨・実装上の判断】型付きの `attr()` は、`<textarea>` の `rows` のように HTML がすでに持っている属性の値を CSS でも使うときに限り、コンポーネントに値を渡す手段は `style` 属性の公開プロパティのままにする。（`attr-for-html-attributes`）
  - 理由: 型付きの `attr()` に未対応のブラウザがあり（2026年10月確認）、同じ値を属性と `style` 属性の2か所に書くことも避けられるため。
  - 補足: `data-variant` のように選択肢から1つを選ぶバリエーションは、属性セレクタで書きます。`attr()` の値は `url()` に使えないので、背景画像は `style` 属性の公開プロパティで渡します。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/values/if-and-attr/#rule-attr-for-html-attributes
- 【必須・仕様上の制約】`content` 以外のプロパティで `attr()` を使うときは、型と第2引数を書き、その宣言を型付きの `attr()` を条件にした `@supports` の中に書いて、外に未対応の環境で使う宣言を書く。（`typed-attr-fallback`）
  - 理由: 宣言に `var()` が含まれると、未対応の環境でも宣言は計算値の時点で無効になって前の宣言に戻らず、対応した環境でも属性がないか型として読めないと、宣言がプロパティの初期値に戻るため。
  - 補足: 第2引数は、対応した環境でしか使われないので、未対応の環境のフォールバックにはなりません。`@supports` の条件は `min-block-size: calc(attr(rows type(<number>), 3) * 1lh)` のように型付きで書き、`var()` を含めません。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/values/if-and-attr/#rule-typed-attr-fallback
- 【推奨・実装上の判断】`if()` は、要素自身に定義したカスタムプロパティを `style()` で調べるときにだけ使い、条件1つと `else` の形で書く。（`if-for-own-custom-property`）
  - 理由: スタイルクエリは親の要素の値しか調べられず、それ以外の分岐は `@media`、`@supports`、状態のセレクタと接尾辞の内部プロパティで書くほうが、状態の一覧を読み取れるため。
  - 補足: `media()` と `supports()` は使わず、各セレクタの中の `@media` と `@supports` で書きます。例外は、1つの長さを段階ごとの値に置き換える対応表です（16-5 の `squircle` の倍率など）。状態の分岐ではないので、条件を複数並べてかまいません。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/values/if-and-attr/#rule-if-for-own-custom-property
- 【必須・仕様上の制約】`if()` を含む宣言の前に未対応の環境で使う宣言を書き、`if()` には必ず `else` の値を書く。（`if-fallback-and-else`）
  - 理由: 未対応の環境では `if()` を含む宣言が捨てられ、対応した環境ではどの条件も成り立たないと、前の宣言ではなく初期値か継承した値になるため。
  - 補足: 前の宣言に戻るのは、`if()` を含む宣言に `var()` がない場合だけです。`var()` を含むと計算値の時点で無効になり、前の宣言に戻らないので、`@supports` の中に書くか、スタイルクエリや状態のセレクタで書きます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/values/if-and-attr/#rule-if-fallback-and-else
