/**
 * ルールの定義（src/content/rules/*.yaml）と原稿から、AI 向けの配布物を生成する。
 *
 * コミットするもの（GitHub から入れるため）
 * - plugin/skills/css-coding-guideline/: Agent Skill。SKILL.md と、章ごとのルール集（references/）
 * - plugin/.claude-plugin/plugin.json、plugin/.mcp.json: Claude Code のプラグイン
 * - .claude-plugin/marketplace.json: プラグインのマーケットプレイス
 * - packages/mcp/package.json の version: 本のバージョンにそろえる
 *
 * コミットしないもの（npm に公開するときに作る）
 * - packages/mcp/data/: MCP サーバーが読むルールと本文、本書の Stylelint 設定の写し
 */
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { BASE, pageUrl, REPOSITORY, SITE } from '../src/lib/site.mjs';
import {
  buildOutline,
  CHAPTERS,
  chapterLabel,
  formatRule,
  loadPages,
  loadRules,
  ROOT,
  RULE_KINDS,
} from './lib/guideline-data.mjs';

const SKILL_NAME = 'css-coding-guideline';
const PLUGIN_DIR = join(ROOT, 'plugin');
const SKILL_DIR = join(PLUGIN_DIR, 'skills', SKILL_NAME);
const MCP_DIR = join(ROOT, 'packages/mcp');
const MCP_DATA_DIR = join(MCP_DIR, 'data');
const MCP_PACKAGE = 'css-coding-guideline-mcp';
const TOKENS_DIR = join(ROOT, 'src/demos/tokens');
const TOKEN_FILES = ['colors.css', 'shadows.css', 'sizes.css', 'typography.css', 'motion.css', 'z-index.css'];

const { version, description } = JSON.parse(await readFile(join(ROOT, 'package.json'), 'utf8'));
const today = new Date().toISOString().slice(0, 10);
const HOME = pageUrl('');
const GUIDE = pageUrl('appendix/ai-tools');

const rules = await loadRules();
const pages = await loadPages(rules);
const outline = buildOutline(pages, rules);
const pageById = new Map(pages.map((page) => [page.id, page]));
const aiProne = rules.filter((rule) => rule.aiProne);

const pad = (number) => String(number).padStart(2, '0');
const chapterFile = (chapter) => `references/${pad(chapter.number)}-${chapter.dir}.md`;
const chapters = CHAPTERS.map((chapter) => {
  const chapterPages = pages.filter((page) => page.section === chapter.dir).sort((a, b) => a.order - b.order);
  return {
    ...chapter,
    label: chapterLabel(chapter),
    file: chapterFile(chapter),
    pages: chapterPages,
    chars: chapterPages.reduce((sum, page) => sum + page.markdown.length, 0),
    rules: rules.filter((rule) => rule.page.split('/')[0] === chapter.dir),
  };
});
/** レビューで1つのサブエージェントに割り当てる本文の上限（字）。 */
const READ_BUDGET = 80_000;
const formatChars = (chars) =>
  chars >= 10_000 ? `約${(Math.round(chars / 1000) / 10).toLocaleString('ja-JP')}万字` : `約${(Math.round(chars / 100) * 100).toLocaleString('ja-JP')}字`;
const outsideChapters = rules.filter((rule) => !CHAPTERS.some((chapter) => rule.page.split('/')[0] === chapter.dir));
if (outsideChapters.length > 0) {
  throw new Error(`章の外のページに掲載したルールがあります: ${outsideChapters.map((rule) => rule.id).join(', ')}`);
}

const writeJson = (path, data) => writeFile(path, `${JSON.stringify(data, null, 2)}\n`);

const LEVELS_AND_KINDS = `強度は「必須」「推奨」「非推奨」「禁止」の4段階です。「必須」と「禁止」は、各ルールの補足に書いた適用範囲と例外を除いて必ず守り、「推奨」と「非推奨」は理由があれば外れてかまいません。
性質は3種類です。「${RULE_KINDS.spec}」はCSS・HTML・ブラウザの振る舞いやWCAGから導かれ、守らないと表示や操作が崩れます。「${RULE_KINDS.judgment}」は状況とトレードオフで決まり、適用する条件があります。「${RULE_KINDS.convention}」は一貫性のために本書が選んだ約束で、ほかの約束を選んでも同じように成り立ちます。`;

// ── スキル ──────────────────────────────────────────────────────────────

const chapterReference = (chapter) => {
  const sections = chapter.pages
    .filter((page) => chapter.rules.some((rule) => rule.page === page.id))
    .map((page) => {
      const pageRules = chapter.rules.filter((rule) => rule.page === page.id);
      return `## ${page.title}\n\n${page.url}\n\n${pageRules.map((rule) => formatRule(rule)).join('\n')}`;
    });
  return `# ${chapter.label}：ルール

- ガイドラインのバージョン: ${version}（${today} 生成）
- ルールの数: ${chapter.rules.length}
- 本文: ${formatChars(chapter.chars)}
- 読む条件: ${chapter.review}${chapter.always ? '（常に読む）' : ''}

このファイルは「CSSコーディングガイドライン」のルールから自動生成しています。直接編集しないでください。
${LEVELS_AND_KINDS}
背景とコード例は、各節の本文にあります。本文は MCP の \`get_page\`（ページID）か、URL で読みます。

## この章の節

${chapter.pages.map((page) => `- \`${page.id}\` ${page.title}（${formatChars(page.markdown.length)}）${page.url}`).join('\n')}

${sections.join('\n\n')}
`;
};

const aiProneReference = `# AIが誤りやすいルール

- ガイドラインのバージョン: ${version}（${today} 生成）
- ルールの数: ${aiProne.length}

AIが生成するコードで特に誤りやすいルールです。CSSを書く前とレビューの前に、必ず確認してください。1件1行で、強度とルールの本文と ID だけを並べています。理由と補足は、章ごとのファイル（\`references/<章>.md\`）を ID で検索して読んでください。

${chapters
  .filter((chapter) => chapter.rules.some((rule) => rule.aiProne))
  .map(
    (chapter) =>
      `## ${chapter.label}（${chapter.file}）\n\n${chapter.rules
        .filter((rule) => rule.aiProne)
        .map((rule) => `- 【${rule.level}】${rule.rule}（\`${rule.id}\`）`)
        .join('\n')}`,
  )
  .join('\n\n')}
`;

const chapterIndex = chapters
  .filter((chapter) => chapter.rules.length > 0)
  .map(
    (chapter) =>
      `| ${chapter.label} | \`${chapter.file}\` | ${chapter.rules.length} | ${formatChars(chapter.chars)} | ${chapter.always ? '**常に読む**。' : ''}${chapter.review} |`,
  )
  .join('\n');

const skillMd = `---
name: ${SKILL_NAME}
description: 「CSSコーディングガイドライン」に従ってCSSを書く・直す・レビューする。レビューでは関係する章を通読し、指摘をルールと照合してから報告する。CSSの記法、命名、カスケードとレイヤー、@scope、単位、レスポンシブ、タイポグラフィと和文組版、色、モーション、CMSでの運用などを扱うタスクで使う。
license: CC-BY-4.0
---

# CSSコーディングガイドライン Skill

- ガイドラインのバージョン: ${version}（${today} 生成）
- ルールの数: ${rules.length}（うち AI が誤りやすいもの ${aiProne.length}）
- 本書: ${HOME}

## 基本原則

1. CSSはブラウザへの「提案」である。ブラウザに任せられることは任せ、書かずに済むCSSを選ぶ
2. 保守しやすさを最優先にする。重複を恐れず、共通化は3回目から考える
3. ルールの強度に従う。「必須」と「禁止」は、補足に書いた適用範囲と例外を除いて必ず守る。例外に当たるコードは違反として扱わない
4. 古い書き方を使わない。とくに「AIが誤りやすいルール」は生成のたびに確認する
5. 根拠のない数値を書かない。値の根拠は \`calc()\` の式やトークンで残す

## ルールの強度と性質

${LEVELS_AND_KINDS}

## ルールと本文の読み方

- MCP サーバー \`css-coding-guideline\`（npm の \`${MCP_PACKAGE}\`）が使えるときは、そのツールで読む。\`list_chapters\` で章と節と字数、\`get_page\` で節の本文、\`get_rule\` でルールを引き、\`lint_css\` で本書の Stylelint の設定で検査する。使えないときは、\`references/\` のファイルと、節の URL の本文を読む。
- 節は全文で読む。\`get_page\` は \`heading\` を付けずに呼ぶ。\`heading\` と \`search_rules\` は、一度読んだ節やルールに戻って確かめるときに使う。
- ルールを当てはめる前に、補足まで読む。補足には、適用範囲と例外が書いてある。
- プロジェクトに独自の規約（\`CLAUDE.md\`、\`AGENTS.md\` など）があれば、そちらを優先する。本書のルールと違う点は「食い違い」として示す。

## CSSを書く・直すとき

### Step 1: AIが誤りやすいルールを確認する

\`references/ai-prone.md\` を読む。

### Step 2: 関係する節を読む

「章の索引」の読む条件から、書く内容に関係する章を選び、その章のルール（\`references/<章>.md\`）を読む。書く内容に直接関わる節は、本文を全文で読む。

### Step 3: 書く

ルールに従って書く。ガイドラインに書かれていない判断をしたときは、その旨を明示する。

### Step 4: 最終確認

- [ ] 「AIが誤りやすいルール」に違反していないか
- [ ] 「必須」と「禁止」のルールに違反していないか
- [ ] 本書の Stylelint の設定で検出できる違反が残っていないか（MCP の \`lint_css\`）。lint で検出できるルールは一部なので、通っても Step 1 と Step 2 の確認は省かない

返答には、1. ガイドラインに沿ったコード、2. 判断の根拠にしたルールの ID、3. ガイドラインに書かれていない判断をした箇所、を書く。

## レビューするとき

レビューは、関係する章を通読してから指摘する。指摘は、自分のものもサブエージェントのものも、すべてルールと照合してから報告する。

### Step 1: 範囲を決める

対象のファイルを列挙する。1回のレビューの対象は、1つのコンポーネントか数ファイルにする。それより大きいときは、コンポーネントごとに分け、Step 1 から繰り返す。

「章の索引」の読む条件を対象のCSSに当て、関係する章を決める。「常に読む」の章は必ず含める。外した章には、外した理由を1行ずつ書く。

完了条件: 索引のすべての章が、「読む」か「外す（理由）」のどちらかになっている。

### Step 2: 読了表を作る

関係する章のすべての節を、ページID、タイトル、字数とともに読了表に並べる（\`list_chapters\`、または \`references/<章>.md\` の「この章の節」）。

完了条件: 関係する章の節が、1つ残らず読了表にある。

### Step 3: 通読する

読了表の節を、すべて全文で読む。

- サブエージェントを使えるときは、節を合計${formatChars(READ_BUDGET).replace('約', '')}以内のまとまりに分け、まとまりごとに1つのサブエージェントへ割り当てる。章の途中で分けてよい。依頼文は \`references/review.md\` の形で書く。
- サブエージェントを使えないときは、節を1つずつ読む。1つ読み終えるたびに、その節のルールIDと、適用の条件と例外をメモしてから、次の節に進む。

完了条件: 読了表のすべての節が「読了」になっている。サブエージェントが返した「読んだ節」が割り当てと一致しないときは、足りない節を割り当て直す。

### Step 4: 照合する

指摘を1件ずつ、次の順に確かめる。

1. ルールの本文、強度、補足を読み（\`get_rule\` か \`references/<章>.md\`）、補足の適用範囲と例外に当たらないかを確かめる。
2. 指摘したファイルと行を開き、そのコードがルールの対象に当たることを確かめる。
3. プロジェクトの規約と比べ、本書のルールと違うときは「食い違い」にする。
4. 「確認済み」「却下（理由）」「食い違い」のどれかに振り分ける。

lint の結果（\`lint_css\`、またはプロジェクトの Stylelint）も、同じ手順で振り分ける。

完了条件: すべての指摘が3つのどれかに振り分けられ、確認済みの指摘に、ルールIDと根拠の節がある。

### Step 5: 報告する

\`references/review.md\` の報告の形で書く。読了表、確認済みの違反、食い違い、却下した指摘を、すべて載せる。

## 章の索引

| 章 | ファイル | ルールの数 | 本文 | 読む条件 |
| --- | --- | --- | --- | --- |
${chapterIndex}

## トークンの例

\`references/tokens.md\` は、本書のデモが使っているトークンの全文である。プロジェクトにトークンがないときに、分け方（色と文字の役割はプリミティブとセマンティクスの2層、ほかは1層のスケール）と名前の付け方の手本にする。プロジェクトに定義済みのトークンがあれば、そちらを使う。
`;

const reviewMd = `# レビューの依頼文と報告の形

- ガイドラインのバージョン: ${version}（${today} 生成）

\`SKILL.md\` の「レビューするとき」で使う。

## サブエージェントへの依頼文

山かっこの部分を埋めて、まとまりごとに1つずつ渡す。

\`\`\`md
「CSSコーディングガイドライン」の次の節を通読し、対象のCSSをレビューしてください。

- 対象のCSS: <ファイルのパスを並べる>
- 読む節（すべて全文で読む）:
  - <ページID> <タイトル>（<字数>）
- 読み方: MCP の get_page を heading を付けずに呼んで、節を1つずつ全文で読む（MCP がなければ、節の URL を取得する）。1つの節を読み終えてから、その節のルールに照らして対象のCSSを見る。
- 指摘の範囲: 割り当てた節のルールに当たるものだけを指摘する。ほかの節は、別の担当が読んでいる。
- プロジェクトの規約: <CLAUDE.md などのパス>。本書のルールと違う点は、指摘ではなく「食い違い」として返す。

次の形だけで返してください。

1. 読んだ節: 読み終えたページIDの一覧。読めなかった節があれば、その理由
2. 指摘: 1件ごとに、ファイル:行、ルールID、強度、根拠の節と見出し、該当するコード、直し方
3. 食い違い: プロジェクトの規約と本書のルールが違う点
4. 判断に迷った点: ルールの補足に例外があり、当てはまるかを決められないもの
\`\`\`

## 報告の形

1. **範囲**: 対象のファイル、読んだ章、外した章とその理由
2. **読了表**: 節ごとに、ページID、タイトル、字数、読んだ担当（自分か、どのサブエージェントか）、読了
3. **確認済みの違反**: 「必須」と「禁止」、AIが誤りやすいもの、「推奨」と「非推奨」の順に並べる。1件ごとに、ファイル:行、ルールID、強度、根拠の節、直し方
4. **食い違い**: プロジェクトの規約と本書のルールが違う点と、どちらに従うか
5. **却下した指摘**: 指摘した担当、ルールID、却下した理由（補足の例外に当たる、コードがルールの対象に当たらない、など）
6. **lint の結果**: \`lint_css\` かプロジェクトの Stylelint の結果と、その振り分け
`;

const tokenSections = [];
for (const file of TOKEN_FILES) {
  const css = (await readFile(join(TOKENS_DIR, file), 'utf8')).trim();
  tokenSections.push(`## ${file}\n\n\`\`\`css\n${css}\n\`\`\``);
}
const tokensMd = `# 本書のデモの共通トークン

- ガイドラインのバージョン: ${version}（${today} 生成）
- 元のファイル: src/demos/tokens/*.css（${pageUrl('appendix/demo-tokens')}）

本書のデモは、次のトークンを \`@layer tokens\` に入れて読み込んでいる。デモからは、色はセマンティクス（\`--background--*\`、\`--foreground--*\`、\`--border--*\`）だけを、文字は役割（\`--text--<役割>--font-size\` と \`--text--<役割>--leading\`）を参照する。

${tokenSections.join('\n\n')}
`;

await rm(SKILL_DIR, { recursive: true, force: true });
await mkdir(join(SKILL_DIR, 'references'), { recursive: true });
await writeFile(join(SKILL_DIR, 'SKILL.md'), skillMd);
await writeFile(join(SKILL_DIR, 'references/ai-prone.md'), aiProneReference);
await writeFile(join(SKILL_DIR, 'references/tokens.md'), tokensMd);
await writeFile(join(SKILL_DIR, 'references/review.md'), reviewMd);
for (const chapter of chapters.filter((entry) => entry.rules.length > 0)) {
  await writeFile(join(SKILL_DIR, chapter.file), chapterReference(chapter));
}

// ── プラグインとマーケットプレイス ─────────────────────────────────────

const pluginDescription = '「CSSコーディングガイドライン」に従ってCSSを書き、レビューするためのスキルと MCP サーバー';
const author = { name: 'TAK', url: 'https://www.tak-dcxi.com/' };

await mkdir(join(PLUGIN_DIR, '.claude-plugin'), { recursive: true });
await writeJson(join(PLUGIN_DIR, '.claude-plugin/plugin.json'), {
  name: SKILL_NAME,
  displayName: 'CSSコーディングガイドライン',
  version,
  description: pluginDescription,
  author,
  homepage: GUIDE,
  repository: `https://github.com/${REPOSITORY}`,
  license: 'CC-BY-4.0',
  keywords: ['css', 'stylelint', 'guideline', 'japanese'],
});
// MCP サーバーはプラグインと同じ版に固定する
await writeJson(join(PLUGIN_DIR, '.mcp.json'), {
  mcpServers: {
    [SKILL_NAME]: { command: 'npx', args: ['-y', `${MCP_PACKAGE}@${version}`] },
  },
});
await mkdir(join(ROOT, '.claude-plugin'), { recursive: true });
await writeJson(join(ROOT, '.claude-plugin/marketplace.json'), {
  name: SKILL_NAME,
  owner: author,
  description: `${description.replace(/（.*）$/, '')}のスキルと MCP サーバー`,
  plugins: [{ name: SKILL_NAME, source: './plugin', description: pluginDescription }],
});

// ── MCP サーバー ─────────────────────────────────────────────────────────

const mcpPackagePath = join(MCP_DIR, 'package.json');
const mcpPackage = JSON.parse(await readFile(mcpPackagePath, 'utf8'));
if (mcpPackage.version !== version) {
  mcpPackage.version = version;
  await writeJson(mcpPackagePath, mcpPackage);
}
// README の設定例も、版を固定した形で最新にする
const readmePath = join(MCP_DIR, 'README.md');
const readme = await readFile(readmePath, 'utf8');
const pinned = readme.replace(new RegExp(`${MCP_PACKAGE}@\\d+\\.\\d+\\.\\d+`, 'g'), `${MCP_PACKAGE}@${version}`);
if (pinned !== readme) await writeFile(readmePath, pinned);

await rm(MCP_DATA_DIR, { recursive: true, force: true });
await mkdir(MCP_DATA_DIR, { recursive: true });
await writeJson(join(MCP_DATA_DIR, 'guideline.json'), {
  version,
  generatedAt: today,
  site: `${SITE}${BASE}/`,
  outline,
  rules: rules.map(({ id, level, kind, rule, reason, note, lint, aiProne: prone, page, since }) => ({
    id,
    level,
    kind,
    rule,
    reason,
    note,
    lint,
    aiProne: Boolean(prone),
    page,
    pageTitle: pageById.get(page).title,
    since,
  })),
  pages: pages.map(({ id, title, description: summary, url, markdown }) => ({ id, title, description: summary, url, markdown })),
});
// 本書の Stylelint 設定と独自ルールを、そのままの相対パスで写す
await cp(join(ROOT, 'stylelint.config.mjs'), join(MCP_DATA_DIR, 'stylelint/stylelint.config.mjs'));
await cp(join(ROOT, 'stylelint'), join(MCP_DATA_DIR, 'stylelint/stylelint'), { recursive: true });

console.log(
  `${rules.length} 件のルールと ${pages.length} ページから、plugin/ と packages/mcp/data/ を生成しました（v${version}）。`,
);
