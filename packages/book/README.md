# 書籍版の組版

「CSSコーディングガイドライン」の紙の書籍版を、サイトのビルド結果（`dist/`）から組む。原稿の正本は MDX のままで、ここでは紙に合わせた書き換えだけをする。

## 使い方

```sh
pnpm build                                   # サイトを作り、dist/ を最新にする（ルートで実行）
pnpm --filter css-coding-guideline-book html # out/vol1/book.html を作る
pnpm --filter css-coding-guideline-book pdf  # out/vol1.pdf を作る
```

巻を選ぶときは、`node src/build.mjs 2` のように番号を渡す。デモの撮影と PDF には Google Chrome を使う。場所が違う場合は、環境変数 `CHROME_PATH` で指定する。`out/` は git の管理外。

## 設定

- `config/volumes.mjs`：巻と章の対応、巻3に載せる付録
- `config/demo-selection.json`：デモ（`src/demos/` のディレクトリ名）ごとに、紙に静止図を載せるか（`print`）と、撮る幅（`widths`、省略するとデモの幅のボタンから狭い幅と広い幅を選ぶ）

## 紙での書き換え

- 内部リンクは、同じ巻なら「（p.N）」、別の巻なら「（巻N）」を付ける。節末に「この節に関連する節」を置く。
- デモは、静止図にして「図N-M」を付けるか、「デモN-M（補足サイト）」の1行にする。デモのコードのタブは載せない。
- `Figure` の図は、SVG の `<title>` をキャプションにして番号を付ける。
- 各節の「ガイドライン」は、強度と要点と ID だけにする（理由と補足は載せない）。
- 判断の問いの答えは、開いた状態で刷る。
