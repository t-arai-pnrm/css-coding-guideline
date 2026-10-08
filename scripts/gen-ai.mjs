/**
 * ルールの定義（src/content/rules/*.yaml）から、AI 向けのルール集とスキルを生成する。
 * - skills/css-coding-guideline/rules.md: AI が誤りやすいルールを先頭に置いたルール集
 * - skills/css-coding-guideline/SKILL.md: Claude Code のスキル
 * - skills/css-coding-guideline/tokens.md: 本書のデモが読み込んでいる共通トークン（src/demos/tokens/*.css）
 * スキルは `~/.claude/skills/css-coding-guideline` からこのディレクトリへシンボリックリンクを張って使う。
 * 公開 URL が決まるまでは、詳細ページをローカルのファイルパスで参照する。
 */
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { parse } from 'yaml';
import { CHAPTERS, chapterLabel } from '../src/lib/book.mjs';
import { RULE_KINDS } from '../src/lib/rule-kinds.mjs';

const ROOT = new URL('..', import.meta.url).pathname.replace(/\/$/, '');
const RULES_DIR = join(ROOT, 'src/content/rules');
const DOCS_DIR = join(ROOT, 'src/content/docs');
const OUT_DIR = join(ROOT, 'skills/css-coding-guideline');
const TOKENS_DIR = join(ROOT, 'src/demos/tokens');
const TOKEN_FILES = ['colors.css', 'shadows.css', 'sizes.css', 'typography.css', 'motion.css', 'z-index.css'];

const { version } = JSON.parse(await readFile(join(ROOT, 'package.json'), 'utf8'));
const today = new Date().toISOString().slice(0, 10);

const rules = [];
for (const file of (await readdir(RULES_DIR)).filter((name) => name.endsWith('.yaml')).sort()) {
  rules.push(...parse(await readFile(join(RULES_DIR, file), 'utf8')));
}

/** ページ ID（例: responsive/escalation）からタイトルとファイルの場所を引く。 */
const pageInfo = async (page) => {
  for (const candidate of [`${page}.mdx`, `${page}/index.mdx`]) {
    try {
      const source = await readFile(join(DOCS_DIR, candidate), 'utf8');
      const title = source.match(/^title:\s*"?(.+?)"?\s*$/m)?.[1] ?? page;
      return { title, path: join(DOCS_DIR, candidate) };
    } catch {
      // 次の候補を試す
    }
  }
  throw new Error(`ルールの掲載ページ「${page}」が見つかりません。`);
};

for (const rule of rules) {
  if (!RULE_KINDS[rule.kind]) throw new Error(`ルール「${rule.id}」の kind がありません。`);
}

const pages = new Map();
for (const rule of rules) {
  if (!pages.has(rule.page)) pages.set(rule.page, await pageInfo(rule.page));
}

const formatRule = (rule) => {
  const lines = [`- 【${rule.level}・${RULE_KINDS[rule.kind]}】${rule.rule}（\`${rule.id}\`）`, `  - 理由: ${rule.reason}`];
  if (rule.note) lines.push(`  - 補足: ${rule.note}`);
  if (rule.lint) lines.push(`  - 自動チェック: ${rule.lint}`);
  lines.push(`  - 詳細: ${pages.get(rule.page).title}（${pages.get(rule.page).path}）`);
  return lines.join('\n');
};

const aiProne = rules.filter((rule) => rule.aiProne);
const byChapter = CHAPTERS.map((chapter) => ({
  label: chapterLabel(chapter),
  rules: rules.filter((rule) => rule.page.split('/')[0] === chapter.dir),
})).filter((group) => group.rules.length > 0);

const rulesMd = `# CSSコーディングガイドライン ルール集

- バージョン: ${version}
- 生成日: ${today}
- ルールの数: ${rules.length}

このファイルは「CSSコーディングガイドライン」のルールから自動生成しています。直接編集しないでください。
強度は「必須」「推奨」「非推奨」「禁止」の4段階です。「必須」と「禁止」は、各ルールの補足に書いた適用範囲と例外を除いて必ず守り、「推奨」と「非推奨」は理由があれば外れてかまいません。
性質は3種類です。「仕様上の制約」はCSS・HTML・ブラウザの振る舞いやWCAGから導かれ、守らないと表示や操作が崩れます。「実装上の判断」は状況とトレードオフで決まり、適用する条件があります。「本書の規約」は一貫性のために本書が選んだ約束で、ほかの約束を選んでも同じように成り立ちます。
各ルールの背景とコード例は、「詳細」に書いたページを読んでください。

## AIが誤りやすいルール

AIが生成するコードで特に誤りやすいルールです。CSSを書く前とレビューの前に、必ず確認してください。

${aiProne.map(formatRule).join('\n') || '（まだありません）'}

## すべてのルール

${byChapter.map((group) => `### ${group.label}\n\n${group.rules.map(formatRule).join('\n')}`).join('\n\n')}
`;

const skillMd = `---
name: css-coding-guideline
description: 「CSSコーディングガイドライン」に従ってCSSを書く・直す・レビューする。CSSの記法、命名、カスケードとレイヤー、@scope、単位、レスポンシブ、タイポグラフィと和文組版、色、モーション、CMSでの運用などを扱うタスクで使う。
---

# CSSコーディングガイドライン Skill

- ガイドラインのバージョン: ${version}（${today} 生成）

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

## 必須の手順

### Step 1: ルール集を読む

同じディレクトリの \`rules.md\` を読み、とくに「AIが誤りやすいルール」を確認する。

### Step 2: 関係する章の詳細を読む

タスクに関係するルールの「詳細」に書かれたページを読み、背景とコード例を確認する。

### Step 3: 書く・直す

ルールに従ってCSSを書く。ガイドラインに書かれていない判断が必要な場合は、その旨を明示する。

### Step 4: 最終確認

- [ ] 「AIが誤りやすいルール」に違反していないか
- [ ] 「必須」と「禁止」のルールに違反していないか
- [ ] Stylelint（本書の設定）で検出できる違反が残っていないか

## トークンの例

同じディレクトリの \`tokens.md\` は、本書のデモが使っているトークンの全文である。プロジェクトにトークンがないときに、分け方（色と文字の役割はプリミティブとセマンティクスの2層、ほかは1層のスケール）と名前の付け方の手本にする。プロジェクトに定義済みのトークンがあれば、そちらを使う。

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

await mkdir(OUT_DIR, { recursive: true });
await writeFile(join(OUT_DIR, 'rules.md'), rulesMd);
await writeFile(join(OUT_DIR, 'SKILL.md'), skillMd);

const tokenSections = [];
for (const file of TOKEN_FILES) {
  const css = (await readFile(join(TOKENS_DIR, file), 'utf8')).trim();
  tokenSections.push(`## ${file}\n\n\`\`\`css\n${css}\n\`\`\``);
}
const tokensMd = `# 本書のデモの共通トークン

- ガイドラインのバージョン: ${version}（${today} 生成）
- 元のファイル: src/demos/tokens/*.css（付録I）

本書のデモは、次のトークンを \`@layer tokens\` に入れて読み込んでいる。デモからは、色はセマンティクス（\`--background--*\`、\`--foreground--*\`、\`--border--*\`）だけを、文字は役割（\`--text--<役割>--font-size\` と \`--text--<役割>--leading\`）を参照する。

${tokenSections.join('\n\n')}
`;
await writeFile(join(OUT_DIR, 'tokens.md'), tokensMd);
console.log(`${rules.length} 件のルールから skills/css-coding-guideline を生成しました（v${version}）。`);
