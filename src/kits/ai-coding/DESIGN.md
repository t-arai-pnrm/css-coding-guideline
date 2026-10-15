# <プロジェクトの名前> のデザインの決まり

<!--
値で表せないデザインの判断を書くファイルです。AI は、UI を書く前と plan を書く前に読みます。
色、文字サイズ、余白、角丸の値は書きません。値はトークンのファイル（例：src/styles/tokens/）が正本で、ここではトークンを名前で参照します。
節の見出しは、Google Labs の DESIGN.md の仕様の8つの節を借りています。仕様と違い、YAML の front matter に値を書きません。
例の項目は、「RECSSガイドライン」のデモのトークンの決まりです。プロジェクトのトークンの名前と判断に書き換えます。
-->

## Overview

- <!-- このサイトの見た目の方針を1〜2文で書く。例：装飾を抑え、記事の本文を読ませる。 -->
- 1つの画面で、人に押してほしい主ボタンは1つにする。

## Colors

- 文字色は `--foreground--base` と `--foreground--muted` の2つだけを使う。`opacity` や半透明の色で薄くしない。
- accent（`--foreground--accent`、`--background--accent-subtle`）は、リンク、フォーカスリング、選んだ状態にだけ使う。ボタンの背景や見出しの飾りには使わない。
- 主ボタンは文字色（`--background--inverse`）で塗る。
- 成功とエラーは、`--foreground--success` と `--foreground--danger` の文字で示し、色だけに頼らず文言かアイコンを添える。
- ライトとダークのどちらのテーマでも、文字は背景に対して読める濃さを保つ。新しい組み合わせは、両方のテーマで確かめる。

## Typography

- 文字の大きさと行の高さは、役割のトークン（`--text--<役割>--font-size` と `--text--<役割>--leading`）で選ぶ。役割は display、title、subtitle、body、body-compact、caption。
- 太さは `--font-weight--regular` と `--font-weight--bold` の2段階だけにする。
- <!-- 例：記事の一覧のカードの見出しは title、サイドバーの見出しは subtitle。 -->

## Layout

- 余白は `--spacing--*` から選ぶ。トークンにない値は、その場に書いて plan に理由を残す（CLAUDE.md の判断基準に従う）。
- 項目の間を移る背景を付けるリストは、項目の間に隙間を作らず、項目の内側の余白で間隔を作る。

## Elevation & Depth

- 面は、`--background--base`、`surface`、`raised`、`overlay` の4段階から役割で選ぶ。ページが base、カードが surface、ダイアログが overlay、メニューとポップオーバーが raised。
- 影は `--shadow--*` だけを使う。

## Shapes

- 角丸は、外側のパネルに `--rounded--lg`、その中の項目に `--rounded--md` を使う。ピルの形は `--rounded--full`。

## Components

- <!-- 部品の種類と変種を並べる。例：ボタンは「主」と「背景なし」の2つ。カードは「記事」と「人気記事」の2つ。 -->
- 背景が透明な項目のホバーと押下は、`--background--hover` と `--background--active` で示す。
- ここにない変種が要るときは、既存の変種の値を変えて作らず、人に確かめる。

## Do's and Don'ts

- Do：同じ種類の部品は、同じ変種のトークンで書く。
- Do：強調を足す前に、同じ画面で強調しているものを減らせないかを考える。
- Don't：このファイルに色、大きさ、余白の値を書かない。
- Don't：トークンの名前を変えたら、このファイルの参照を直し忘れない。
