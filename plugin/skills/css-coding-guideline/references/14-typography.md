# 第14章 タイポグラフィと和文組版：ルール

- ガイドラインのバージョン: 0.50.3（2026-10-10 生成）
- ルールの数: 32
- 本文: 約7.4万字
- 読む条件: font-*、line-height、文字の大きさ、和文組版、改行、文字の色の役割

このファイルは「CSSコーディングガイドライン」のルールから自動生成しています。直接編集しないでください。
強度は「必須」「推奨」「非推奨」「禁止」の4段階です。「必須」と「禁止」は、各ルールの補足に書いた適用範囲と例外を除いて必ず守り、「推奨」と「非推奨」は理由があれば外れてかまいません。
性質は3種類です。「仕様上の制約」はCSS・HTML・ブラウザの振る舞いやWCAGから導かれ、守らないと表示や操作が崩れます。「実装上の判断」は状況とトレードオフで決まり、適用する条件があります。「本書の規約」は一貫性のために本書が選んだ約束で、ほかの約束を選んでも同じように成り立ちます。
背景とコード例は、各節の本文にあります。本文は MCP の `get_page`（ページID）か、URL で読みます。

## この章の節

- `typography` 第14章 タイポグラフィと和文組版（約3,800字）https://t-arai-pnrm.github.io/css-coding-guideline/typography/
- `typography/fonts` 14-1 フォントを指定する（約1.7万字）https://t-arai-pnrm.github.io/css-coding-guideline/typography/fonts/
- `typography/japanese-typesetting` 14-2 和文組版を整える（約1.3万字）https://t-arai-pnrm.github.io/css-coding-guideline/typography/japanese-typesetting/
- `typography/line-height` 14-3 行の高さとハーフレディング（約1.5万字）https://t-arai-pnrm.github.io/css-coding-guideline/typography/line-height/
- `typography/size-and-line-breaks` 14-4 文字サイズと改行（約1.5万字）https://t-arai-pnrm.github.io/css-coding-guideline/typography/size-and-line-breaks/
- `typography/text-roles` 14-5 文字の役割と色（約1.1万字）https://t-arai-pnrm.github.io/css-coding-guideline/typography/text-roles/

## 14-1 フォントを指定する

https://t-arai-pnrm.github.io/css-coding-guideline/typography/fonts/

- 【推奨・実装上の判断】デザインで特に指定がなければ、`font-family` は総称ファミリーの `sans-serif` だけにする。（`font-family-sans-serif`）
  - 理由: 主要な OS に読みやすい和文フォントが入っており、ユーザーが自分で設定した読みやすいフォントも尊重できるため。
  - 補足: kiso.css で指定済みです。欧文のフォントを使うときも、最後に `sans-serif` を置き、和文は総称ファミリーに任せます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/typography/fonts/#rule-font-family-sans-serif
- 【非推奨・仕様上の制約】日本語のサイトでは、`font-family` に `system-ui` を使わない。（`no-system-ui-for-japanese`）
  - 理由: Windows では Noto Sans JP ではなく、游ゴシックの画面表示用の書体が使われるため。
  - 補足: 海外製のフレームワークやリセット CSS（Tailwind CSS の初期設定など）が `system-ui` を指定していることがあるので、導入時に確かめます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/typography/fonts/#rule-no-system-ui-for-japanese
- 【推奨・実装上の判断】どの環境でも Noto Sans JP を表示するときは、`local()` だけを `src` に書いた `@font-face` をフォントスタックの先頭に置き、端末に入っているフォントを優先する。（`local-first-font-face`）
  - 理由: フォントが入っている Windows と Android で、同じフォントを Web フォントとして読み込まずに済むため。
  - 補足: 端末のフォントで表示してよいかを、先にデザイナーに確かめます。明朝体の Noto Serif JP でも同じ書き方をします。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/typography/fonts/#rule-local-first-font-face
- 【推奨・実装上の判断】Web フォントの `@font-face` には `font-display` を指定し、本文のフォントは `swap`、装飾のフォントは `optional` にする。（`font-display-by-role`）
  - 理由: 本文はフォントの読み込みを待たずに表示でき、装飾のフォントは表示の途中で切り替わってレイアウトがずれるのを防げるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/typography/fonts/#rule-font-display-by-role
- 【非推奨・実装上の判断】和文に斜体を使わず、強調は太字で表す。（`no-italic-for-japanese`）
  - 理由: 日本語では斜体を使う習慣がなく、文字を傾けて作った斜体は読みにくいため。
  - 補足: kiso.css は、日本語の文書（`:lang(ja)`）で `em`、`i`、`cite`、`dfn`、`address` の斜体を解除し、`em` を太字にしています。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/typography/fonts/#rule-no-italic-for-japanese
- 【推奨・本書の規約】`font-weight` は `bold` のようなキーワードではなく数値で指定し、トークンにする。（`font-weight-numeric`）
  - 理由: 数値ならデザインカンプの指定とトークンの値をそのまま照らし合わせられ、`bolder` や `lighter` のような相対的なキーワードは継承した太さによって表示が変わるため。
  - 補足: kiso.css はブラウザのデフォルトに合わせて `bolder` を使っているので、太さをそろえたいときは `base` レイヤーで上書きします。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/typography/fonts/#rule-font-weight-numeric
- 【推奨・実装上の判断】本文の Web フォントを `font-display: swap` で使うときは、`local()` で参照する代わりのフォントの `@font-face` に `size-adjust` などの補正を指定し、Web フォントの直後に置く。（`fallback-font-metric-overrides`）
  - 理由: 代わりのフォントから Web フォントに切り替わるときの、字幅や行の高さの違いによるレイアウトのずれを小さくできるため。
  - 補足: 値はフォントのファイルの寸法から、Capsize や fontaine のようなツールで計算します。`ascent-override`、`descent-override`、`line-gap-override` は Safari が対応していません（2026年9月）。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/typography/fonts/#rule-fallback-font-metric-overrides
- 【非推奨・仕様上の制約】和文を含む要素に `font-size-adjust` を指定しない。（`no-font-size-adjust-for-japanese`）
  - 理由: 和文の文字も欧文のフォントの x-height などの比に合わせて拡大・縮小され、デザインで決めた文字サイズから外れることがあるため。
  - 補足: 欧文だけのページで書体の字面をそろえるときは、`:root` に `font-size-adjust: from-font` を一度だけ指定します。`ic-width` と `ic-height` は和文のフォントでは比がほぼ1になり、補正されません。Web フォントの読み込みの前後のずれは、`@font-face` の `size-adjust` で抑えます（`fallback-font-metric-overrides`）。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/typography/fonts/#rule-no-font-size-adjust-for-japanese
- 【推奨・実装上の判断】カウンター、価格、タイマーのように表示したまま値が変わる数字には、`font-variant-numeric: tabular-nums` を指定する。（`tabular-nums-for-changing-numbers`）
  - 理由: 数字の幅が字ごとに違う書体では、値が変わるたびに数字の列の幅が変わり、数字とその後ろに続く単位やボタンが左右に揺れるため。
  - 補足: 等幅の数字は、フォントが OpenType の `tnum` 機能を持っているときだけ表示されます。表や一覧で数値を縦に並べる列は `tabular-nums-for-number-columns` で扱います。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/typography/fonts/#rule-tabular-nums-for-changing-numbers

## 14-2 和文組版を整える

https://t-arai-pnrm.github.io/css-coding-guideline/typography/japanese-typesetting/

- 【必須・仕様上の制約】`html` 要素と、ほかの言語で書いた部分に `lang` 属性を付け、言語ごとの組版を `:lang()` で切り替える。（`lang-for-typesetting`）
  - 理由: 和文と欧文では適した組版が異なり、`lang` がないと言語に合った指定を当て分けられないため。
  - 補足: ブラウザの翻訳機能で言語が変わると、`:lang(ja)` の指定は外れます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/typography/japanese-typesetting/#rule-lang-for-typesetting
- 【推奨・実装上の判断】和文と英数字の間に空白を手で入れず、`text-autospace: normal` に任せる。（`no-manual-space-for-autospace`）
  - 理由: 空白を原稿に入れると表示の側で調整できず、書く人によって表記もそろわないため。
  - 補足: kiso.css で指定済みです。指定しないとアキを入れないブラウザもあるので、値は明示します。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/typography/japanese-typesetting/#rule-no-manual-space-for-autospace
- 【推奨・実装上の判断】`pre`、`time`、入力欄では `text-autospace: no-autospace` にし、`pre` には `text-spacing-trim: space-all` も指定する。（`no-autospace-for-fixed-text`）
  - 理由: 等幅のそろい、日付の表記、入力中の文字にアキが入ると不自然になるため。
  - 補足: kiso.css で指定済みです。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/typography/japanese-typesetting/#rule-no-autospace-for-fixed-text
- 【非推奨・実装上の判断】和文の本文に `font-feature-settings: "palt"` やカーニングを指定せず、ベタ組みにする。（`solid-setting-for-body-text`）
  - 理由: 文字が等間隔に並ぶベタ組みのほうが、長い文章を読み進めやすいため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/typography/japanese-typesetting/#rule-solid-setting-for-body-text
- 【推奨・実装上の判断】日本語の文書では `:root` に `font-kerning: none` を指定し、英語の要素には `font-kerning: normal` を指定する。（`kerning-none-on-root`）
  - 理由: 初期値の `auto` ではカーニングの有無がブラウザに任され、和文の本文にもカーニングが掛かることがあるため。
  - 補足: `:lang(ja)` のすべての要素に指定すると、見出しで指定した `normal` が子要素に継承されなくなります。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/typography/japanese-typesetting/#rule-kerning-none-on-root
- 【推奨・実装上の判断】見出しと `caption` には `font-kerning: normal` を指定し、日本語のときは `font-feature-settings: "palt"` で文字を詰める。（`palt-for-headings`）
  - 理由: 大きな文字では約物や仮名の周りのアキが目立ち、詰めたほうが引き締まって読みやすいため。
  - 補足: 縦書きでは `"vpal"` を使います。見出し以外を詰めたいときは `.-kerning` のようなユーティリティを使います。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/typography/japanese-typesetting/#rule-palt-for-headings
- 【推奨・仕様上の制約】`hanging-punctuation` は段落にだけ指定し、インライン方向の `padding` と組み合わせる。（`hanging-punctuation-with-padding`）
  - 理由: ぶら下げた約物は要素の幅の外に出るので、余白がないと親からはみ出し、横スクロールの原因になるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/typography/japanese-typesetting/#rule-hanging-punctuation-with-padding

## 14-3 行の高さとハーフレディング

https://t-arai-pnrm.github.io/css-coding-guideline/typography/line-height/

- 【必須・仕様上の制約】ベースの `line-height` は 1.5 以上にして、各要素に継承させる。（`base-line-height-min`）
  - 理由: 行の間が狭いと、認知に障害のある人を含め、読んでいる行を目で追いにくくなるため。
  - 補足: WCAG 2.1 の達成基準 1.4.8 は 1.5 倍以上の行送りを達成できる仕組みを求める基準で、初期値を 1.5 以上にするのは本書の方針です。kiso.css は 1.5 を指定しています。見出しは、ベースより狭い値を個別に指定します。ユーザーが行の高さを 1.5 倍に上書きしても中身が切れないことも求められます（WCAG 2.1 の達成基準 1.4.12）。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/typography/line-height/#rule-base-line-height-min
- 【禁止・仕様上の制約】`line-height: 1` を指定しない。（`no-line-height-one`）
  - 理由: 文言の変更、画面の幅、文字サイズの設定、機械翻訳で改行が起きたとき、行が重なって読めなくなることがあるため。
  - 補足: 上下の余白を詰めたいときは、`text-box-trim` でハーフレディングを取り除きます。
  - 自動チェック: Stylelint: `declaration-property-value-disallowed-list`（警告）
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/typography/line-height/#rule-no-line-height-one
- 【推奨・本書の規約】行の高さのトークンは、`tight`、`snug`、`normal`、`relaxed`、`loose` のような段階の名前で定義し、要素ごとに選ぶ。（`leading-tokens`）
  - 理由: 数値ではなく名前で選ぶことで、本文や見出しに使う値がサイトの中でそろうため。
  - 補足: 目安は、和文の本文が 1.7〜2、英文の本文が 1.5〜1.8、和文の見出しが 1.25〜1.5、英文の見出しが 1.2〜1.4 です。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/typography/line-height/#rule-leading-tokens
- 【推奨・実装上の判断】ハーフレディングを取り除くときは `text-box-trim` を使い、`text-box-edge` は和文ではデフォルト値のまま、英文では `cap alphabetic` にする。（`text-box-trim-for-half-leading`）
  - 理由: `line-height` を小さくせずに、1行目の上と最後の行の下の余白だけを削れるため。
  - 補足: 和文に `cap alphabetic` を使うと詰まりすぎます。対象のすべてのブラウザが対応しているので、フォールバックは書きません。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/typography/line-height/#rule-text-box-trim-for-half-leading
- 【推奨・実装上の判断】画像と文章を2カラムで横に並べるときは、文章の側の先頭の要素に `text-box-trim: trim-start` を指定し、画像の上端と文字の上端をそろえる。（`trim-start-beside-media`）
  - 理由: 1行目の上のハーフレディングがなくなり、行の高さを変えずに、文字の上端が画像の上端と同じ高さになるため。
  - 補足: `trim-both` にすると、見出しと本文の間が `gap` より狭く見えます。英文では `text-box-edge: cap alphabetic` にします。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/typography/line-height/#rule-trim-start-beside-media

## 14-4 文字サイズと改行

https://t-arai-pnrm.github.io/css-coding-guideline/typography/size-and-line-breaks/

- 【推奨・実装上の判断】和文の見出しには、`@supports (word-break: auto-phrase)` の中で `word-break: auto-phrase` と `text-wrap: balance` を指定する。（`auto-phrase-for-headings`）
  - 理由: 文節の区切りで折り返し、各行の長さもそろうので、見出しが読みやすくなるため。
  - 補足: 2026年9月の時点で対応しているのは Chrome 系のブラウザだけで、ほかのブラウザでは通常の折り返しになります。英文の見出しには `text-wrap: balance` を指定します。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/typography/size-and-line-breaks/#rule-auto-phrase-for-headings
- 【非推奨・実装上の判断】本文の段落には、`word-break: auto-phrase`、`text-wrap: balance`、手動の改行を使わない。（`no-auto-phrase-for-body`）
  - 理由: 段落の中に不自然なすき間ができ、画面の幅が変わると改行の位置も崩れて読みにくくなるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/typography/size-and-line-breaks/#rule-no-auto-phrase-for-body
- 【非推奨・仕様上の制約】和文には `text-wrap: pretty` を指定しない。（`no-text-wrap-pretty-for-japanese`）
  - 理由: Safari で、和文の `pretty` が `balance` と似た折り返しになる不具合があるため。
  - 補足: 英文の段落には `text-wrap: pretty` を指定します（kiso.css で指定済み）。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/typography/size-and-line-breaks/#rule-no-text-wrap-pretty-for-japanese
- 【推奨・実装上の判断】`text-align: center` を指定するときは、`text-wrap: balance` と組み合わせる。（`center-with-balance`）
  - 理由: 中央揃えで行の長さがばらつくと、最後の行だけが短く残り、見栄えが悪くなるため。
  - 補足: 枠線や背景のある左揃えの要素には `text-wrap: balance` を指定しません（行の幅が縮んでも要素の幅は変わらず、枠の中で右にすき間が偏るため）。全称セレクタで、すべての要素に指定することもしません。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/typography/size-and-line-breaks/#rule-center-with-balance
- 【非推奨・実装上の判断】段落に `text-align: justify` を指定しない。（`no-text-align-justify`）
  - 理由: 英単語や URL が混ざると、両端をそろえるために行の中に大きなすき間ができるため。
  - 補足: 1行で収まる表の見出しを均等に割り付けるなら、`text-align-last: justify` を使えます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/typography/size-and-line-breaks/#rule-no-text-align-justify
- 【推奨・仕様上の制約】`word-break` は初期値のままにし、長い単語や URL のはみ出しは `overflow-wrap: anywhere` で防ぐ。（`overflow-wrap-over-word-break`）
  - 理由: `word-break: break-all` は次の行に移せば収まる英単語まで途中で分けてしまうが、`overflow-wrap: anywhere` は収まらない単語だけを折り返すため。
  - 補足: kiso.css は `:root` に `overflow-wrap: anywhere` を指定しています。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/typography/size-and-line-breaks/#rule-overflow-wrap-over-word-break
- 【推奨・実装上の判断】本文に長い URL やファイルパスをそのまま表示するときは、`.` や `/` のような区切りの記号の前に `<wbr>` を入れる。（`wbr-for-long-urls`）
  - 理由: `overflow-wrap: anywhere` は区切りと関係のない文字の間で折り返すので、どこまでが1つの語なのか分かりにくくなるため。
  - 補足: 原稿を書く人が `<wbr>` を入れられない CMS の本文などでは、`overflow-wrap: anywhere` に任せます。`word-break: break-all` は使いません。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/typography/size-and-line-breaks/#rule-wbr-for-long-urls
- 【非推奨・実装上の判断】見た目を整えるための改行に `<br>` を使わない。（`no-br-for-visual-breaks`）
  - 理由: どの画面の幅でも同じ位置で改行され、狭い画面で自然な折り返しと重なって短い行が生まれるため。
  - 補足: 詩のように、文章の構造として意味のある改行には `<br>` を使います。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/typography/size-and-line-breaks/#rule-no-br-for-visual-breaks
- 【推奨・実装上の判断】見出しの改行を手で制御するときは、`:lang(ja)` のときだけ効く `.-br` と `.-wbr` のユーティリティを使い、ほかの言語では `display: contents` にする。（`line-break-utilities-for-japanese`）
  - 理由: 手動の改行は日本語の都合なので、翻訳で言語が変わったときには通常の折り返しに戻すため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/typography/size-and-line-breaks/#rule-line-break-utilities-for-japanese
- 【推奨・仕様上の制約】行数を制限するときは、`-webkit-line-clamp` に `display: -webkit-box` と `-webkit-box-orient: block-axis` を組み合わせ、はみ出しは `overflow-block: clip` で隠す。（`line-clamp-with-overflow-clip`）
  - 理由: 接頭辞のない `line-clamp` はまだ使えず、`overflow: hidden` ではぶら下げた約物が切れたり、スクロールバーが出たりするため。
  - 補足: `overflow-block` に対応していない Safari 18 のために、`@supports not (overflow-block: clip)` の中で `overflow-y: clip` を指定します。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/typography/size-and-line-breaks/#rule-line-clamp-with-overflow-clip

## 14-5 文字の役割と色

https://t-arai-pnrm.github.io/css-coding-guideline/typography/text-roles/

- 【推奨・実装上の判断】文字色は、重要度の段階を表す不透明なセマンティクスのトークンから選び、`opacity` や半透明の色で文字を薄くしない。（`two-text-colors`）
  - 理由: 半透明の文字は下にある背景と混ざった色で表示され、置く面やテーマによってコントラスト比が変わるうえ、薄くした意図（補足として控えめにしたいのか、無効の状態なのか）もコードから読み取れないため。
  - 補足: 本書のデモでは、`--foreground--base` と `--foreground--muted` の2段階に絞っています。段階を足すのは、隣の段階と見分けられる差があり、いちばん薄い段階でも置く面のすべてでコントラスト比 4.5:1 以上を保てるときだけです。リンクやエラーの文字は、意味を表す別のトークン（`--foreground--accent`、`--foreground--danger`）を使います。無効の状態も `opacity` で表さず、文字を `--foreground--muted` にし、ホバーと押下の変化をなくして示します。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/typography/text-roles/#rule-two-text-colors
