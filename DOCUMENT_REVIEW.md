# ドキュメントレビュー（2026-10-03）

## 総評と確認範囲

結論を先に置く文章、実装例、デモへの導線は読みやすい。一方、厳格なガイドラインとして公開するなら、数値の保証、仕様説明の条件、独自の推奨の根拠を先に整えたい。文法的な読みづらさより、「この断定は仕様なのか、本書の規約なのか」「どの条件なら成立するのか」が読者の負担になっている。

全136 MDXを対象に構文・文章lint・文書リンクの検査を実施した。本文はカスケード、値、レスポンシブ、タイポグラフィ、配色、操作性を中心に精読し、他の章も参照した。ただし、全136ページの全コード・全デモを一字一句精読・実機検証したレビューではない。以下は確認できた箇所の指摘であり、未掲載の章に問題がないことを保証しない。

本文や既存の作業中ファイルは変更していない。優先度「高」は誤学習・実装への影響が大きいもの、「中」は説明や判断根拠を改善したいもの、「低」は編集上の修正とする。

## 1. 高：操作対象の最小サイズがCSSピクセルの下限を保証していない

対象：[16-1 状態とフォーカスを表す](/Users/araitakahiro/dev/css-coding-guideline/src/content/docs/interaction/states-and-focus.mdx:146)

WCAGの24×24 CSS px／44×44 CSS pxを説明した直後に、`calc(24 / 16 * 1rem)`／`calc(44 / 16 * 1rem)`を最小サイズとして示している。ルートのフォントサイズが12pxなら、それぞれ18px／33pxになる。文字とともに拡大する方針はよいが、これだけでは説明した下限を保証できない。

改善案：`max(24px, calc(24 / 16 * 1rem))`、タッチ環境では`max(44px, calc(44 / 16 * 1rem))`とする。例外に該当する対象は別途判断する。「remを使う」ことと「CSS pxの下限を守る」ことを両立できる。

これは、すべての小さい対象が直ちに不適合になるという指摘ではない。間隔や文章中のリンク等の例外は本文にも正しく説明されている。[W3C：Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)

## 2. 高：ハーフレディングの計算を厳密な値として説明している

対象：[13-3 行の高さとハーフレディング](/Users/araitakahiro/dev/css-coding-guideline/src/content/docs/typography/line-height.mdx:20)、[計算による補正](/Users/araitakahiro/dev/css-coding-guideline/src/content/docs/typography/line-height.mdx:115)

「16pxの文字、行高28pxなら上下6px」「ハーフレディングは1emと1lhの差の半分」「厳密に取り除きたい場所では余白で打ち消す」という説明は、emの大きさ、フォントのメトリクス、実際に見える字面を同一視させる。

仕様上のleadingは、行高とフォントのascent／descentに基づく高さとの差から求める。`1em`はfont-sizeであり、字面の高さやそのメトリクスの合計と常に一致するわけではない。式自体はem基準の余白補正に使えるが、フォントを問わず実際のアキを厳密に除ける説明にはしない。[CSS 2：Leading and half-leading](https://www.w3.org/TR/CSS2/visudet.html#leading)

改善案：「emの高さを基準に、行高との差の半分を補正する方法」と表現し、`text-box-trim`が選択したフォントメトリクスに基づく処理であることと区別する。「厳密」は削除し、フォント・混植・複数行での確認を求める。

## 3. 中：cqiが名前付きコンテナに結び付くと読める

対象：[12-3 コンテナサイズクエリ](/Users/araitakahiro/dev/css-coding-guideline/src/content/docs/responsive/container-size-queries.mdx:215)

「同じコンポーネントの中に `container: --scoped / inline-size` があることを確かめてから使う」だけでは、実際にどのコンテナを参照するかが分からない。名前で選ぶ`@container --scoped`と、`cqi`の参照先は別の仕組みである。内側に別の適格なコンテナが入ると、`cqi`はそちらを基準にする。

改善案：「cqiは名前に関係なく、対象要素から最も近い、その軸のサイズを問い合わせられる祖先コンテナを参照する」と明記する。外側を名前付きクエリで選びながら内側のコンテナ単位を使う、小さい入れ子の例があると誤解を防げる。[CSS Conditional Rules 5：Container Relative Lengths](https://drafts.csswg.org/css-conditional-5/#container-lengths)

## 4. 中：autoのgridアイテムをコンテナにできない条件が広すぎる

対象：[コンテナにする要素を選ぶ](/Users/araitakahiro/dev/css-coding-guideline/src/content/docs/responsive/container-size-queries.mdx:203)

「autoのサイズで配置したgridアイテムも同様」と一括りにしているが、内容依存のトラックと、幅の決まったトラックへstretchするアイテムでは事情が違う。後者はアイテム自身に明示的なinline-sizeがなくても、トラックから幅を得られる。「autoだから不可」と覚えさせる説明は避けたい。

改善案：注意対象を「内容からトラック／アイテムの幅を決める配置」とする。幅のあるグリッドに`minmax(0, 1fr)`で並べたカードを、安全な対比例として示す。[CSS Grid 2：Grid Item Sizing](https://drafts.csswg.org/css-grid-2/#grid-item-sizing)

## 5. 中：カスケードの断定に、その場で前提を付けたい

対象：[2-1 カスケード・詳細度・継承](/Users/araitakahiro/dev/css-coding-guideline/src/content/docs/cascade/cascade-basics.mdx:59)、[style属性の説明](/Users/araitakahiro/dev/css-coding-guideline/src/content/docs/cascade/cascade-basics.mdx:77)

「後ろのレイヤーの宣言が勝ちます」「style属性はセレクタで書いたどのルールにも勝ちます」は、単独で読むと成立しない。important宣言のレイヤー順は逆になり、通常のinlineスタイルはimportant宣言に負ける。後段にimportantの説明はあるが、初学者が最初の断定を覚えてから例外で修正する構成になっている。

改善案：レイヤーの文には「同じオリジンの通常宣言どうしでは」、style属性の文には「同じオリジン・重要度の宣言どうしでは」を付ける。並べた比較順自体は有用なので維持する。[CSS Cascade 5：Cascade Sorting Order](https://www.w3.org/TR/css-cascade-5/#cascade-sort)

## 6. 中：文字色の閾値0.7を推奨する根拠が足りない

対象：[14-3 背景色から文字色を決める](/Users/araitakahiro/dev/css-coding-guideline/src/content/docs/color-media/contrast-text.mdx:64)、[導入の問題設定](/Users/araitakahiro/dev/css-coding-guideline/src/content/docs/color-media/contrast-text.mdx:41)

AAを保証しないこと、使用する背景色を検証済みの候補に制限することは明記されており、その点は誤りではない。ただし、青の例と「白のほうを読みやすく感じることが多い」だけでは、全色相に対して0.7を選ぶ根拠にならない。本文にもAPCAとの比較が未確認とある。

さらに、導入は「どの背景色が来ても」文字色を決めたいという問題を立てているが、解決策は使える背景色を制限する方式である。読者は任意色への解決策を期待して読み始め、途中で利用範囲の変更を知ることになる。

改善案：導入から「検証済みの限定パレットの文字色を自動化する」と目的をそろえる。0.7を規約として残すなら、色相・彩度・文字サイズを変えた比較と採用理由を示す。検証済みパレットなら、前景色と背景色を対で管理するトークンも候補になる。MDNの注意はWCAG 2のコントラスト評価の限界を説明するもので、0.7という数値の根拠ではない。[MDN：contrast-color()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/contrast-color)

## 7. 中：375pxへの縮小を選ぶ理由が、同じ節の前提と噛み合わない

対象：[12-5 375px未満の画面ではビューポートを固定する](/Users/araitakahiro/dev/css-coding-guideline/src/content/docs/responsive/min-viewport-width.mdx:77)

CSSは320 CSS pxでも読めて操作できるように書くと明記している。一方、文字を縮小する理由は「横スクロールや重なった要素で内容を読めなくなるよりはよい」としている。前提どおりに実装できているなら、その比較対象はすでに解消されているはずである。

改善案：「320pxへ自然に折り返す実装」と「375pxの配置を縮小する実装」を比較し、どの要件で後者を選ぶのか説明する。本文が認める16px→約13.6pxという読みやすさの代償に対して、カンプの配置を保つ価値を具体化したい。規約として一律に選ぶより、要件次第の選択肢とするほうが読者は判断しやすい。

これは独自方針の根拠への指摘であり、このスクリプトだけを理由にWCAG不適合と断定するものではない。

## 8. 中：一部の節に基礎と応用を詰め込みすぎている

対象：[10-8 ポジショニング](/Users/araitakahiro/dev/css-coding-guideline/src/content/docs/layout/positioning.mdx:1)、[15-1 画像と装飾](/Users/araitakahiro/dev/css-coding-guideline/src/content/docs/decoration/images-and-decoration.mdx:1)

コード等を除いた本文相当の量は、前者約1.7万字、後者約1.5万字。どちらも第2階層の見出しが13あり、読む途中で解決したい問題が変わる。ポジショニングは通常の配置・包含ブロック・sticky・アンカー関連の応用まで、画像と装飾は画像表示・アイコン・SVG・影などを同じ節で扱っている。

改善案：まず「基本の配置／sticky／アンカー配置」「画像を置く／装飾を作る」のように、読者の作業単位で分割する。URLを維持する必要があるなら、冒頭に「困っていること→該当見出し」の短い案内を置く。一般的な前提、推奨する手順、例外・先進的な応用を読む順序で区別すると、情報を削らなくても読みやすくなる。

## 9. 中：仕様と本書独自の規約を、個々の推奨で識別したい

対象：[本書の位置付け](/Users/araitakahiro/dev/css-coding-guideline/src/content/docs/introduction/about.mdx:1)、[記法の方針](/Users/araitakahiro/dev/css-coding-guideline/src/content/docs/notation/modern-syntax.mdx:1)

本書独自の規約であることは導入や個別の説明にある。しかし、Recommended／Not recommendedという表示だけを拾う読者には、互換性・アクセシビリティ上の制約と、表記や設計の統一方針の違いが伝わりにくい。有効な既存CSSまで仕様上の誤りだと受け取る可能性がある。

改善案：個々のルールに「本書の規約」「仕様上の制約」「互換性」「アクセシビリティ」等の理由を短く併記する。表記統一の例は「本書では採用しない」と書く。独自規約を弱める必要はなく、何に対しての禁止・推奨なのかを明示すればよい。

## 10. 低：章の概要を詳細節の条件に合わせる

対象：[第13章の概要](/Users/araitakahiro/dev/css-coding-guideline/src/content/docs/typography/index.mdx:9)

概要は「行の高さは1.5以上を保ちます」とするが、詳細節では見出しに1.25〜1.5を認める。概要だけを読んだ場合に、見出しも1.5未満は禁止だと受け取れる。

改善案：「ベースの行高は1.5以上とし、見出しは用途に応じて調整します」と条件をそろえる。

## 11. 低：参照先の節番号が違う

対象：[7-8 名前に使う言葉](/Users/araitakahiro/dev/css-coding-guideline/src/content/docs/notation/terminology.mdx:159)

「3-3 子要素の位置で選ぶ」は、リンク先の現在のタイトルに合わせて「3-4」へ修正する。URLは正しい。

## 公開前に整理したい未確定事項

MDX内に`要確認:`が150件ある。著者判断待ち、出典待ち、挙動の検証待ちが混在しており、150件すべてを誤りと数えるべきではない。ただし、読者に表示されないコメントで保留したまま、本文で断定している項目は優先して確定したい。特にアクセシビリティ、数値の閾値、ブラウザ固有の挙動を先に扱う。

印刷、CMS、CMSコンテンツの3ページはdraft指定。公開済みの欠陥とは分ける。CMSの[1ファイルに複数scopeを許可する説明](/Users/araitakahiro/dev/css-coding-guideline/src/content/docs/operations/cms.mdx:81)は、1コンポーネント1ファイルの規約と衝突するとコメントにも記されている。公開時には例外の条件か、ファイル分割の方針を確定する。

## 検査結果と限界

- MDX検査：136ファイル、成功。
- textlint：成功。
- Recommendedコード例のlint：389例、成功。
- 文書リンク先の存在検査：確認した内部文書パスに欠落なし。節番号の不一致は上記の1件を指摘。変更履歴にある過去の節番号は修正対象にしていない。
- 全ブラウザのデモ描画、キーボード・スクリーンリーダー、実機操作の検証は未実施。リポジトリの指示に従いbuildも実施していない。

lintが通ることは、本文の技術的正確さや説明の十分さとは別である。修正の順番は、1・2の数値／仕様説明、3〜5の条件補足、6・7の方針の根拠、8・9の構成改善、10・11の小さな編集とする。
