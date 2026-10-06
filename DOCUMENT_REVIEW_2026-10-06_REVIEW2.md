# 読者視点の再レビュー（2026年10月6日）

## 総評と確認範囲

前回より読み進めやすくなっています。第1章と第2章の役割が分かれ、positionの応用は実装編へ移り、画像・アイコン・表面の装飾も別の節になりました。第12章を参照用と位置づけ、読む順番を案内したことも適切です。現時点では、大きく章順を変えるより、新しい規約の適用範囲とコード例の整合性を直すことを優先したいです。

現在の作業ツリーを対象に、章概要・節番号・内部リンクを横断確認し、前回の指摘箇所、新設のmarginの役割とスタイルクエリ、コンテナサイズクエリ、分割後の画像・アイコン・表面・角・輪郭、カルーセルなどを読み直しました。関係するルール定義も照合しています。**全151ページの全文通読を完了したレビューではありません。** 全デモの操作、全対象ブラウザでの表示、外部リンクの網羅検証も含みません。未確認箇所に問題がないという判定はしていません。

原稿やデモは変更していません。`pnpm check:mdx` は成功し、151件を検証しました。内部リンクのページ存在と、数字で示された参照名と参照先タイトルの照合では問題を検出しませんでした。ただし、ページ内アンカーの網羅検証はしていません。節番号の連続性は、リンク名の照合とは別に確認しました。

著者の独自の方針自体を誤りとは扱いません。初見の読者が同じ判断に到達できるか、本文・必須ルール・推奨例が一致するかを評価しています。

## 優先して直したい点

### 1. ホバーの必須ルールをボタンに適用すると、ホバー側だけ動かない

対象：[hocus-via-style-query](/Users/araitakahiro/dev/css-coding-guideline/src/content/rules/10-components.yaml:327)、[スタイルクエリの説明](/Users/araitakahiro/dev/css-coding-guideline/src/content/docs/components/style-queries.mdx:136)、[要素別の正しい書き分け](/Users/araitakahiro/dev/css-coding-guideline/src/content/docs/interaction/states-and-focus.mdx:54)

10-6の本文は「リンクやボタン」を対象にしていますが、必須ルールは `&:any-link:hover` だけを指定しています。ボタンはリンクではないので、この形をそのままボタンに使うと、フォーカスではフラグが立ち、ホバーでは立ちません。17-1では、リンクは `:any-link:hover`、ボタンは `:enabled:hover`、summaryなどは `:hover` と正しく書き分けています。

ルールにもこの書き分けを入れ、10-6にボタンの短い例を足したいです。`:has(:any-link:hover)` で子の状態を受ける補足も、リンクだけを対象にした例だと明示するか、ボタンの状態を受ける形を併記します。

### 2. 密度フラグが必要な範囲を、本文と必須ルールでそろえたい

対象：[density-via-style-query](/Users/araitakahiro/dev/css-coding-guideline/src/content/rules/10-components.yaml:318)、[10-6の導入](/Users/araitakahiro/dev/css-coding-guideline/src/content/docs/components/style-queries.mdx:16)、[列数から位置を決める例](/Users/araitakahiro/dev/css-coding-guideline/src/content/docs/responsive/breakpoints.mdx:91)、[zoomの推奨例](/Users/araitakahiro/dev/css-coding-guideline/src/content/docs/responsive/container-size-queries.mdx:235)

導入は「複数の子要素をそろって変えるとき」の重複を解く話ですが、必須ルールはコンテナサイズクエリ全般にフラグを要求します。一方、13-2の推奨例は、フラグを使わず、クエリの中で子の配置を変えています。13-3末尾のzoomの推奨例にもフラグがありません。

このままでは、読者は推奨例をコピーしても必須ルール違反になります。また、数量に応じた配置や単一要素の縮小まで「compact / spacious」の密度として表す必要があるのかが分かりません。

複数要素の共通条件をフラグで共有する規約に絞るのか、単一要素・数量による配置・連続的な縮小を例外とするのかを決め、ルールと例をそろえたいです。例外を設ける場合は、例の直前とルールの補足の両方に書きます。

### 3. command属性を付ける要素が誤っている

対象：[第17章の導入](/Users/araitakahiro/dev/css-coding-guideline/src/content/docs/interaction/index.mdx:11)

「`<dialog>` の `command` 属性」とありますが、`command` と `commandfor` を付けるのは操作する側の `<button>` です。dialogは操作の対象です。「`<button>` の `command`・`commandfor` 属性によるdialogの開閉、`popover` 属性…」のように直すと、実際のHTMLに対応します。[HTML Standardのbuttonの定義](https://html.spec.whatwg.org/multipage/form-elements.html#attr-button-command)で確認しました。

### 4. aria-labelが機械翻訳されないという断定は避けたい

対象：[インラインSVGの代替テキスト](/Users/araitakahiro/dev/css-coding-guideline/src/content/docs/decoration/icons-and-masks.mdx:247)

SVGのtitleとaria-labelをまとめて「機械翻訳されず」と断定しています。しかし、HTML Standardはaria-labelを翻訳可能な属性の例として挙げています。仕様上の翻訳対象と、個々のブラウザや翻訳サービスが実際に翻訳するかは分ける必要があります。[HTML Standardのtranslateの説明](https://html.spec.whatwg.org/multipage/dom.html#the-translate-attribute)で確認しました。

隣に通常のテキストを置くという本書の方針は、そのままでよいです。理由を「翻訳機能によって扱いが異なる」「ページ内検索やコピーを含め、通常のテキストとして扱えることを重視する」とすれば、実装依存の現象を普遍的な性質として教えずに済みます。特定環境の観察を残すなら、環境と確認時点を添えます。

## 読む流れと削減の提案

### 5. 10-6では、クエリの最小限の仕組みを比較例より先に置きたい

対象：[10-6の比較例](/Users/araitakahiro/dev/css-coding-guideline/src/content/docs/components/style-queries.mdx:22)、[問い合わせ先の説明](/Users/araitakahiro/dev/css-coding-guideline/src/content/docs/components/style-queries.mdx:172)

節自体の順序は、重複の問題→フラグで解決→仕組み→応用です。ただし、問題を説明する最初の例から名前付きのサイズクエリが登場し、本格的な説明は第13章にあります。初見では、閾値の重複を理解する前に、何の幅を調べているのかで止まりやすくなります。

比較例の前に「サイズクエリは名前を付けた祖先の幅を調べる。スタイルクエリは祖先のカスタムプロパティを調べる。どちらも自分自身を調べない」という最小限の説明を置きたいです。問い合わせ先の詳細は今の位置で構いません。章を入れ替えるほどの問題ではありません。

### 6. ヒーロー画像の説明を1つの実装例にまとめたい

対象：[画像の上の文字と背景色](/Users/araitakahiro/dev/css-coding-guideline/src/content/docs/decoration/images.mdx:129)、[背景の写真をimgで置く説明](/Users/araitakahiro/dev/css-coding-guideline/src/content/docs/decoration/images.mdx:161)

前の項目で画像と本文を同じGridエリアに置く実装を説明した後、次の項目でも同じヒーローをHTML側から説明し、本文の高さに合わせること、同じセルに重ねることを繰り返しています。別の理由を説明しているので完全な重複ではありませんが、初見では同じ実装を2度組み立てる感覚になります。

「背景の写真もimgで置く」を先にし、採用理由→HTMLとCSS→画像が読み込めないときの背景色、という順に同じ例を通して説明すると短くできます。高さを合わせる仕組みは直前の項目への参照で済ませられます。

### 7. 出典が未確定の講演への言及は、いったん削ってよい

対象：[ページ全体をコンテナにしない説明](/Users/araitakahiro/dev/css-coding-guideline/src/content/docs/responsive/container-size-queries.mdx:219)

「提唱者も講演でアンチパターンとして挙げている」という説明に、講演名とURLがありません。仕様で不可能なのか、本書の設計上の方針なのか、講演者の推奨なのかが混ざって見えます。

ページ全体はメディアクエリ、部品はコンテナクエリと責任を分けるという、本書自身の理由だけで説明は成り立っています。講演の出典が確定するまでは、この一文を削ってよいと思います。残すなら、何をアンチパターンと呼んだのかの条件も確かめたいです。

## 前回から改善を確認できた点

- 最終確認時には7-4「marginの役割」が追加され、確認途中に見つかった第7章の欠番と概要の節数は解消しています。新設本文も確認し、欠番の指摘は残していません。

- 最小構成のブラウザでのimportは学習用の例外と明記され、ルールの補足にも反映されています。
- scopeの原則に、カスタム要素、Shadow DOM、WYSIWYGの例外が入りました。
- Web Componentsの属性値と公開プロパティの説明は、型付きattr()と対象ブラウザの条件を含む形に変わりました。
- flow-rootの説明は、親子の相殺だけでなくfloatの収容・回避にも影響することを説明しています。
- JavaScript等との比較は「同じ入力なら同じ結果」と修正され、CSSでは入力が広いことを説明しています。
- CMSのファイル分割は、編集するソースと配信するブロック単位を分ける形で整合しています。
- positionの応用と装飾の話題が分割されました。
- カルーセルからドロワーが移り、実装から確認表までの流れが続くようになりました。スクロールスパイも末尾の発展項目と明示されたので、前回と同じ問題としては扱いません。
- 第12章には参照用という位置づけと読む順番が加わりました。
- CSS設計の3つの性質に、カードを変更する具体例が加わりました。

先に1〜4の整合性と事実の修正を行い、その後に5〜7の説明順と削減を検討するのがよいと思います。
