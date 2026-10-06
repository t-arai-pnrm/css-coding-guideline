# 読者視点のドキュメントレビュー（2026年10月6日）

## 総評と確認範囲

「考え方 → 基礎 → 設計 → 実装 → 運用」という5部の流れは自然です。レイアウトの仕組みを基礎編に移した構成も、実装の選択を学ぶ前に計算の規則を理解できる点で適切です。大きな章順の変更より、各節で扱う深さ、原則と例外の提示順、繰り返す説明の整理を優先したいと感じました。

結論から始め、避ける例と勧める例を比べ、デモで確かめる構成は、本書の強みです。ただし、結論の適用条件が後半に出る節では、冒頭だけ読むと違う理解になりえます。また、基本の説明が途中から高度な技法の紹介に変わる節があり、初見の読者は「ここまで理解しないと先へ進めないのか」と感じます。

対象は現在の作業ツリーです。144個のMDXの構成・見出し・導入を横断確認し、以下の指摘の対象本文、関係する節、ルール定義を精読・照合しました。**全144ページの全文通読は完了していません。この報告は、依頼された全文通読レビューの途中成果であり、全体の校了判定ではありません。** 技術的な指摘の一部はMDNで確認しました。全デモの操作、各対象ブラウザでの表示、外部リンクの網羅確認はしていません。原稿とコードは変更していません。

著者独自の規約は、その採用自体を誤りとは扱っていません。説明が一貫しているか、条件が読者に伝わるか、本文とルール集が同じ判断になるかを基準にしました。前日のレビューの指摘も現行本文で再確認し、修正済みの説明をそのまま再指摘していません。

## 先に直したい説明と規約の不整合

### 1. 最小の構成と、必須のビルド規約をつなぐ説明がない

対象：[最小の構成で始める](/Users/araitakahiro/dev/css-coding-guideline/src/content/docs/introduction/quick-start.mdx:148)、[ルール定義](/Users/araitakahiro/dev/css-coding-guideline/src/content/rules/04-cascade.yaml:111)

最小の構成は、ビルドツールなしでブラウザに`@import`を読ませる方法を案内しています。一方、`import-resolved-at-build`は、それを例外の記載なしで「必須」として禁止しています。技法として動くかどうかではなく、読者に「本書の最小の構成をそのまま使えば規約を守れる」と思わせる点が問題です。

学習用にファイルを直接読む構成であることと、実務ではビルドして配信することを、最初に区別したいです。学習用の例外を認めるならルールの補足にも入れます。実務用の出発点として紹介するなら、ビルド済みの単一CSSか、実行手順のある小さなスターターを添えるほうが迷いません。

### 2. 本文で認めるスコープの例外が、原則のルールから分からない

対象：[スコープの原則](/Users/araitakahiro/dev/css-coding-guideline/src/content/rules/04-cascade.yaml:167)、[WYSIWYGの例外](/Users/araitakahiro/dev/css-coding-guideline/src/content/docs/operations/wysiwyg.mdx:16)、[Web Components](/Users/araitakahiro/dev/css-coding-guideline/src/content/docs/components/web-components.mdx:139)

`scope-with-donut`はコンポーネントを`@scope (.scoped.<名前>) to (.scoped)`に書く「必須」ルールですが、例外の補足がありません。本文ではWYSIWYGに別のルートと下限を認め、Shadow DOMでは`@scope`を使わないと説明しています。カスタム要素のLight DOMも、前置きにはクラス名ではなく要素名を使います。

例外の設計には理由があります。ただし、「本書の読み方」は例外を各ルールの補足で読むよう案内しているので、原則側からも例外にたどれる必要があります。原則の`note`に適用範囲と該当する例外を明記し、ルールだけ読む人やAIも本文と同じ結論になるようにしたいです。

### 3. 属性から色や数値を渡すとJavaScriptが必要、という断定がまだ広い

対象：[Web Components](/Users/araitakahiro/dev/css-coding-guideline/src/content/docs/components/web-components.mdx:117)、[型付きattr()](/Users/araitakahiro/dev/css-coding-guideline/src/content/docs/values/if-and-attr.mdx:35)

有限のバリエーションを属性セレクタで変えられることは、現行本文で説明済みです。ただし「任意の色や数値を属性で受け取ると、JavaScriptが必要」という部分は、型付き`attr()`を説明する第6章と整合しません。対応環境なら、属性をCSSの値として読めます。

「本書の対象ブラウザすべてで、任意の値を安定して受け渡すために公開プロパティを採用する」と説明すると、技術的な可能性と本書の採用方針が分かれます。第6章へのリンクも添えたいです。根拠：[MDN：attr()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/attr)。

### 4. flow-rootが「ほかのレイアウトに影響しない」は言い過ぎ

対象：[マージンの相殺](/Users/araitakahiro/dev/css-coding-guideline/src/content/docs/layout/margin-collapse.mdx:95)

`flow-root`は親子のマージン相殺を止めるだけではありません。内部のfloatを高さの計算に含め、外部のfloatに対する配置も変えます。「ほかのレイアウトに影響しません」では、相殺だけを止める専用スイッチとして覚えてしまいます。

「スクロールコンテナや切り取りを作らず、新しいブロック整形コンテキストを作れます。floatの扱いも変わります」とすると正確です。第11章のfloatの説明ともつながります。根拠：[MDN：ブロック整形コンテキスト](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Display/Block_formatting_context)。

### 5. 記法の章で「どれも表示の結果を変えない」と説明している

対象：[第9章の概要](/Users/araitakahiro/dev/css-coding-guideline/src/content/docs/notation/index.mdx:9)

スコープの下限、ネストのセレクタと詳細度、ネスト後の宣言の順序、論理プロパティの採用は、対象要素や表示結果に関わります。直後にも、並び順の設定によってメディアクエリの上書きが効かなかった経験が書かれています。

「表記をそろえる規約と、意図しない適用や上書きを防ぐ規約を扱います」としたほうが、章の内容に合います。

### 6. CSSと手続き的な言語の比較は、環境を入力として扱う説明にしたい

対象：[6つの視点](/Users/araitakahiro/dev/css-coding-guideline/src/content/docs/principles/css-mindset.mdx:14)、[ブラウザへの提案](/Users/araitakahiro/dev/css-coding-guideline/src/content/docs/principles/browser-suggestion.mdx:41)

「C#やPythonは同じ入力なら同じ結果」「CSSは同じコードでも画面によって変わる」という対比は、入力とコードという異なるものを比べています。CSSも、画面幅、内容、親のレイアウト、ユーザー設定を含む入力に対して、規則に従って結果を求めます。

「CSSでは、自分の書いた宣言以外にも、ブラウザが受け取る入力が多い」と説明すると、第1章の『アルゴリズムを理解すれば理由を説明できる』という主張につながります。CSSを曖昧で予測不能な言語のように受け取らせないほうが、読者の不安を減らせます。

### 7. CMSのファイル分割は、一般規約と競合したまま

対象：[CMSと共存する](/Users/araitakahiro/dev/css-coding-guideline/src/content/docs/operations/cms.mdx:81)、[1コンポーネント1ファイル](/Users/araitakahiro/dev/css-coding-guideline/src/content/rules/10-components.yaml:55)

CMSの節は、1つのファイルに複数コンポーネントの`@scope`を並べてよいとしています。一般規約は「小さな部品でも例外にしません」としています。MDXコメントにも矛盾が記録されており、読者に見える説明は未解決です。

この節は`draft: true`なので、公開済み本文の不具合とは区別します。公開前に、ソースはコンポーネントごとに分け、配信時にブロック単位にまとめるのか、CMS用の例外を設けるのかを決めたいです。

## 章と節の流れ

### 8. 「positionの基礎」は、基礎と応用を分けたい

対象：[positionの基礎](/Users/araitakahiro/dev/css-coding-guideline/src/content/docs/layout/positioning.mdx:222)

5つの値、包含ブロック、stickyの失敗原因までは、基礎編の流れに合います。その後、スクロール状態クエリ、固定ヘッダー、アンカーポジショニング、さらにアンカー・スクロール駆動アニメーション・スタイルクエリを組み合わせた重なり検出へ進みます。最後の技法は、第13章と第18章の知識まで必要です。

第7章にはpositionと包含ブロックの基本を残し、stickyの実装と問題解決、アンカーポジショニングを実装編へ移す案がよいです。重なり検出は発展コラムとして後ろへ回します。分割しない場合でも、「初読ではここまででよい」という区切りが必要です。

### 9. 「画像と装飾」に別々の目的の話題が集まりすぎている

対象：[画像と装飾](/Users/araitakahiro/dev/css-coding-guideline/src/content/docs/decoration/images-and-decoration.mdx:223)

画像の比率と読み込み、レスポンシブ画像、マスク、SVG、影、すりガラス、リストマーカー、文字の縁取りは、探すときの目的が違います。節名も章名に近いため、目次からどの説明がどこにあるか判断しにくくなっています。

「画像の配置と読み込み」「アイコン・SVG・マスク」「表面と文字の装飾」に分けたいです。clip-pathとマスクの基礎をここに残すなら、16-3は輪郭・枠線の応用に絞り、基礎の説明は参照でつなぎます。

### 10. カルーセルの節にドロワーと目次の話が入り、主題が途切れる

対象：[CSSでカルーセルを作る](/Users/araitakahiro/dev/css-coding-guideline/src/content/docs/interaction/carousel.mdx:188)

カルーセルの構築と未対応環境の説明を終えた後、目次のスクロールスパイ、ドロワーの背面の不活性化に進み、最後にカルーセルの確認表へ戻ります。同じCSS機能の別用途としては関連しますが、カルーセルを作りたい読者の流れを中断しています。

ドロワーは17-2「開閉するUI」へ移し、目次の強調は短い発展コラムへ分けると、カルーセルの実装から検証までが連続します。本文からは「inertの別用途」「スクロールマーカーの別用途」としてリンクすれば十分です。

### 11. 余白の節の冒頭は、方法の選択条件を先に示したい

対象：[余白を設計する](/Users/araitakahiro/dev/css-coding-guideline/src/content/docs/layout-practice/spacing.mdx:20)、[手法を選ぶ](/Users/araitakahiro/dev/css-coding-guideline/src/content/docs/layout-practice/choosing.mdx:95)

冒頭は「間ごとに違う余白は空のグリッドセルで作る」と説明します。一方、直前の11-1は「前後の要素の種類や有無で間隔が変わる縦の並びは通常フロー」とします。11-3の後半には条件が書かれているので、全面的な矛盾ではありませんが、先に区別されていないため選び方に迷います。

冒頭を「一律の間隔はgap／構造と配置が固定された不均等な間隔は空のトラック／内容や前後関係で変わる間隔は通常フローのmargin」の3つに分けたいです。以降の見出しもこの選択順にそろえると、11-1と一貫します。

### 12. 第12章は参照用の章であることと、読む順番を明示したい

対象：[レイアウトコンポジション](/Users/araitakahiro/dev/css-coding-guideline/src/content/docs/compositions/index.mdx:9)

選択表と、switcher・grid・sidebar、stack・proseの比較は有用です。ただし、全11種類を前から続けて読むと、同じ「公開プロパティを受け取る配置クラス」の説明が繰り返されます。通常フローのproseが章末にあるため、stackとの比較にも往復が生まれます。

「まず選択表で必要なものを選び、詳しい式は使うときに読む」と案内したいです。通読を支援するならstackとproseを近づけ、基本の積む・並べる・格子にする方法を先に、高度なswitcherやmasonryを後に置く案もあります。章全体を削る必要はありません。

## 重複と、削ると読みやすくなる内容

### 13. 第I部の同じ主張は、節ごとの役割を決めて短くしたい

対象：[6つの視点](/Users/araitakahiro/dev/css-coding-guideline/src/content/docs/principles/css-mindset.mdx:20)、[CSS設計](/Users/araitakahiro/dev/css-coding-guideline/src/content/docs/design-mindset/what-is-css-design.mdx:12)、[意図を再現する](/Users/araitakahiro/dev/css-coding-guideline/src/content/docs/design-reproduction/intent.mdx:14)

「命名だけが設計ではない」「内容と環境は変わる」「ピクセル一致より意図」「少ない宣言」「部品の責任を分ける」が、序文、素のCSSで書く理由、1-1、1-3、2-1、3-1、13章の導入に繰り返し現れます。単体で読めるための短い再説明は必要ですが、通読では主張が進まない区間になります。

1-1は環境と制約、1-2は計算の文脈、1-3は本書の地図、2-1は設計判断、3-1はデザイナーとの合意、13章は実装手順、と役割を固定したいです。特に1-3は表と短い説明に寄せ、詳細なz-indexや!importantの説明は該当節へ渡せます。

### 14. 第2章は抽象的な性質の説明より、1つの判断例がほしい

対象：[CSS設計のマインドセット](/Users/araitakahiro/dev/css-coding-guideline/src/content/docs/design-mindset/what-is-css-design.mdx:28)

保守性・拡張性・再利用性それぞれで、変更の手間と費用が減ることを説明しています。内容は妥当ですが、初見の読者には3つの違いが抽象的に見えます。章の概要ページも、1節だけの本文と近い内容です。

たとえば「見た目の似たカードを共通化したが、片方だけ項目が増えた」という1つの例を3つの観点から見ると、違いが分かります。一般的なメリットの反復は短くし、概要はこの章で答える問いを示す程度で十分です。

### 15. 著者の方針を説明するために、不要な断定を足している箇所がある

対象：[序文](/Users/araitakahiro/dev/css-coding-guideline/src/content/docs/introduction/preface.mdx:36)、[必要最小限のCSS](/Users/araitakahiro/dev/css-coding-guideline/src/content/docs/principles/css-mindset.mdx:51)、[デザイナーとの前提](/Users/araitakahiro/dev/css-coding-guideline/src/content/docs/design-reproduction/intent.mdx:79)

「即日サイトが出るのは細部にこだわらない案件に限る」という断定は、本書の必要性を説明するためには要りません。案件と道具の評価が先に立ち、CSSの判断基準を知りたい読者には話がそれます。「品質要件を満たすには生成後の設計確認と検証が要る」で十分です。

「宣言を1つ書くたびに変わる余地を失う」も、宣言の数と柔軟性を直結させています。実際にはmin/maxや折り返しの指定を加えて柔軟にする例が本書にあります。「不要な固定や上書きを避ける」と絞りたいです。

デザイナーとの前提の食い違いを説明するお笑いコンビの比喩は、削っても理解が変わりません。直前の固定幅と伸縮の具体例だけで伝わります。読み手の文化的な知識を必要とする脱線を減らせます。

### 16. 数値の説明は、結論・条件・補足の順に整理したい

対象：[背景から文字色を決める](/Users/araitakahiro/dev/css-coding-guideline/src/content/docs/color-media/contrast-text.mdx:64)

現行本文は、0.7が著者の方針であること、AAを保証しないこと、APCA比較は事後検証であることを明示しています。この区別は良い改善です。ただし、閾値の根拠、比較モデル、除外する背景色、コントラストを確かめる必要性の説明が長く続き、注意が何度も繰り返されます。

本文には「確認済みの背景色だけに使う」「0.7で選ぶ」「選ばれた色との比を検証する」を置き、WCAGとAPCAの交点・Lcの比較は補足へ分けたいです。閾値近辺の代表的な背景色、選ばれる文字色、比、採用可否を表にすると、読者が行う判断が明確になります。APCAの数値を残すなら計算を再現する資料も添えたいです。

## 公開前に確かめたいこと

「要確認」はMDX全体に197件あります。出典の確認、方針の承認、実測の未完了など意味が異なり、件数だけで197個の誤りとは判定できません。しかし、コメントは読者には見えないため、未確認の内容が確定した説明として読まれる箇所は整理が必要です。

特に、[カルーセルの強制カラーモード](/Users/araitakahiro/dev/css-coding-guideline/src/content/docs/interaction/carousel.mdx:251)は、現行例に色以外の違いが加わっていますが、実機確認は未完了です。前日の「対処が入っていない」という指摘は繰り返しません。[sign()と相対カラー構文の組み合わせ](/Users/araitakahiro/dev/css-coding-guideline/src/content/docs/color-media/contrast-text.mdx:62)も、本文はChromeでだけ確認したと記載しています。これらは誤りの断定ではなく、推奨例として対象環境で検証を残している箇所です。

下書きは、印刷、CMSとの共存、CMSの本文エリアの3ページです。第19章の概要が3節しか案内していないのは、残り2節が下書きであることと整合しています。公開するときは概要に追加し、19-3はCMS一般の考え方、19-4は環境と読み込み、19-5はWordPressの編集画面との一致、と役割を分けたいです。CMSの下限に使う目印も、`cms-`と`.scoped`の使い分けを1か所で案内すると迷いません。

## 修正の順序

まず1〜7の説明と規約の不整合を直します。次に8〜11で節の範囲と結論の条件を整理し、その後12〜16の重複と説明の長さを調整します。

部と章の大枠を維持したまま、原則を読む段階で例外が分かり、基本の説明が終わる位置が見え、必要な応用だけを選べるようにするのが、初見の読者に最も効く改善だと考えます。
