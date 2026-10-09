# css-coding-guideline-mcp

「[CSSコーディングガイドライン](https://t-arai-pnrm.github.io/css-coding-guideline/)」のルールと本文を引き、CSS を本書の Stylelint の設定で検査する MCP サーバーです。ルールと本文のデータを同梱しているので、起動したあとはネットワークに接続しません。Node.js 20.19 以降で動きます。

各ツールでの設定方法は、本書の付録J「[AIツールで使う](https://t-arai-pnrm.github.io/css-coding-guideline/appendix/ai-tools/)」にあります。Claude Code では、スキルとこのサーバーをまとめたプラグインを入れられます。

```sh
claude plugin marketplace add t-arai-pnrm/css-coding-guideline
claude plugin install css-coding-guideline@css-coding-guideline
```

ほかのツールでは、stdio のサーバーとして登録します。

```json
{
  "mcpServers": {
    "css-coding-guideline": {
      "command": "npx",
      "args": ["-y", "css-coding-guideline-mcp@0.45.0"]
    }
  }
}
```

## ツール

| ツール | 返すもの |
| --- | --- |
| `search_rules` | 語句、章、強度、性質、AIが誤りやすいかで絞り込んだルールの一覧 |
| `get_rule` | IDで指定したルールの理由、補足、自動チェックの手段、掲載ページ |
| `get_page` | 節の本文（Markdown）。`heading` で見出しを1つに絞れる |
| `list_chapters` | 部、章、節の目次と、章ごとのルールの数 |
| `lint_css` | 本書の Stylelint の設定で検査した結果と、対応するルールのID。`layers` を渡すとレイヤー名も検査する |

`lint_css` で検出できるのは、本書のルールのうち Stylelint で確かめられるものだけです。検査を通っても、ルールを守っているとは限りません。

## 版

パッケージの版は、本書のバージョンと同じです。チームで共有する設定では、`css-coding-guideline-mcp@0.45.0` のように版を固定してください。変更点は付録F「[更新履歴](https://t-arai-pnrm.github.io/css-coding-guideline/appendix/changelog/)」にあります。

## 開発

このパッケージは、本書のリポジトリ（[t-arai-pnrm/css-coding-guideline](https://github.com/t-arai-pnrm/css-coding-guideline)）の `packages/mcp/` にあります。同梱するデータ（`data/`）はコミットしていないので、リポジトリのルートで `pnpm gen:ai` を実行して作ります。`pnpm test:mcp` で、すべてのツールを1回ずつ呼んで確かめます。

## ライセンス

コードは MIT-0、ルールと本文のデータは CC BY 4.0 です。詳しくは [LICENSE.md](./LICENSE.md) を見てください。
