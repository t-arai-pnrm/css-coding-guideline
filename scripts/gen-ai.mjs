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
const chapters = CHAPTERS.map((chapter) => ({
  ...chapter,
  label: chapterLabel(chapter),
  file: chapterFile(chapter),
  pages: pages.filter((page) => page.section === chapter.dir).sort((a, b) => a.order - b.order),
  rules: rules.filter((rule) => rule.page.split('/')[0] === chapter.dir),
}));
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

このファイルは「CSSコーディングガイドライン」のルールから自動生成しています。直接編集しないでください。
${LEVELS_AND_KINDS}
背景とコード例は、各節の URL のページにあります。

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
      `| ${chapter.label} | \`${chapter.file}\` | ${chapter.rules.length} | ${chapter.pages
        .filter((page) => page.order > 0)
        .map((page) => page.title)
        .join('、')} |`,
  )
  .join('\n');

const skillMd = `---
name: ${SKILL_NAME}
description: 「CSSコーディングガイドライン」に従ってCSSを書く・直す・レビューする。CSSの記法、命名、カスケードとレイヤー、@scope、単位、レスポンシブ、タイポグラフィと和文組版、色、モーション、CMSでの運用などを扱うタスクで使う。
license: CC-BY-4.0
---

# CSSコーディングガイドライン Skill

- ガイドラインのバージョン: ${version}（${today} 生成）
- ルールの数: ${rules.length}（うち AI が誤りやすいもの ${aiProne.length}）
- 本書: ${HOME}

以下のようなタスクでこの Skill を使うこと。

- CSSを新しく書く、または既存のCSSを直す
- CSSのコードレビューをする
- CSSの設計（レイヤー、命名、コンポーネントの分け方、トークン）を決める
- AIが生成したCSSを、ガイドラインに沿っているか確認する

---

## 基本原則

1. CSSはブラウザへの「提案」である。ブラウザに任せられることは任せ、書かずに済むCSSを選ぶ
2. 保守しやすさを最優先にする。重複を恐れず、共通化は3回目から考える
3. ルールの強度に従う。「必須」と「禁止」は、補足に書いた適用範囲と例外を除いて必ず守る。例外に当たるコードは違反として扱わない
4. 古い書き方を使わない。とくに「AIが誤りやすいルール」は生成のたびに確認する
5. 根拠のない数値を書かない。値の根拠は \`calc()\` の式やトークンで残す

## ルールの強度と性質

${LEVELS_AND_KINDS}

## 必須の手順

MCP サーバー \`css-coding-guideline\`（npm の \`${MCP_PACKAGE}\`）が使える環境では、ファイルを読む代わりにそのツールを使ってよい。\`search_rules\` で語句や章、\`aiProne\` で絞り込み、\`get_rule\` で ID からルールを、\`get_page\` で節の本文を引き、\`lint_css\` で本書の Stylelint 設定で検査する。

### Step 1: AIが誤りやすいルールを確認する

\`references/ai-prone.md\` を読む。

### Step 2: 関係する章のルールを読む

下の「章の索引」から、タスクに関係する章のファイルを選んで読む。各ルールに理由、補足、自動チェックの手段、掲載ページの URL がある。

### Step 3: 背景とコード例を確かめる

ルールの理由と補足だけで判断できないときは、掲載ページの本文を読む（MCP の \`get_page\`、または URL の取得）。本文を取得できない環境では、ルールの理由と補足で判断し、その旨を明示する。

### Step 4: 書く・直す

ルールに従ってCSSを書く。ガイドラインに書かれていない判断が必要な場合は、その旨を明示する。

### Step 5: 最終確認

- [ ] 「AIが誤りやすいルール」に違反していないか
- [ ] 「必須」と「禁止」のルールに違反していないか
- [ ] 本書の Stylelint 設定で検出できる違反が残っていないか（MCP の \`lint_css\`）。lint で検出できるルールは一部なので、通っても Step 1 と Step 2 の確認を省かない

## 章の索引

| 章 | ファイル | ルールの数 | 節 |
| --- | --- | --- | --- |
${chapterIndex}

## トークンの例

\`references/tokens.md\` は、本書のデモが使っているトークンの全文である。プロジェクトにトークンがないときに、分け方（色と文字の役割はプリミティブとセマンティクスの2層、ほかは1層のスケール）と名前の付け方の手本にする。プロジェクトに定義済みのトークンがあれば、そちらを使う。

## 返答フォーマット

### 新しくCSSを書くとき

1. **コード**: ガイドラインに沿ったCSS
2. **根拠**: 判断の根拠になったルールの ID
3. **注意点**: ガイドラインに書かれていない判断をした箇所

### レビューするとき

1. **違反**: ルールの ID、強度、該当箇所
2. **修正案**: 具体的なコード
3. **補足**: ルールに書かれていないが気になる点
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
