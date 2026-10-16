/**
 * コード例の区別（コードフェンスの属性）。Web 版（ec.config.mjs のプラグイン）、紙版（packages/book/src/extract.mjs）、
 * AI 向けの配布物（scripts/lib/guideline-data.mjs）、検査（scripts/lint-examples.mjs）で共通に使う。
 *
 * - `use`：🙆‍♂ Recommended の利用単位。省略すると `excerpt`（仕組みの抜粋）
 * - `from`：全体のあるファイル。デモのディレクトリ（`src/demos/` からのパス、例：`values/hanging-label`）か、
 *   配布ファイル（`exercise-files/…`、`tasks/…`。`public/` と `src/kits/` からのパス）
 * - `issue`：🙅‍♂ Not Recommended の理由の種類
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export const CODE_USES = {
  excerpt: '抜粋',
  diff: '差分',
  complete: '完成例',
};

export const CODE_ISSUES = {
  behavior: '動作の問題',
  convention: '規約との差',
};

export const RECOMMENDED = '🙆‍♂ Recommended';
export const NOT_RECOMMENDED = '🙅‍♂ Not Recommended';

const ROOT = new URL('../..', import.meta.url).pathname;

/** コードフェンスの開始行のメタ文字列（`title="…" use="diff"`）から、属性を読む */
export const parseCodeMeta = (meta) => {
  const value = (key) => meta.match(new RegExp(`(?:^|\\s)${key}=(?:"([^"]*)"|'([^']*)')`))?.slice(1).find((item) => item !== undefined);
  return { title: value('title') ?? '', use: value('use'), from: value('from'), issue: value('issue') };
};

/** `from` が配布ファイルを指すか（デモでなければ配布ファイル） */
export const isDistributedFile = (from) => /^(exercise-files|tasks)\//.test(from);

/** `from` の指す先があるか */
export const fromExists = (from) =>
  isDistributedFile(from)
    ? existsSync(join(ROOT, from.startsWith('tasks/') ? 'src/kits' : 'public', from))
    : existsSync(join(ROOT, 'src/demos', from, 'index.html'));

/** デモのページ内の id。Demo.astro が付け、コード例の「全体」から張るリンクの先になる */
export const demoAnchor = (title) => `demo-${title.trim().replace(/\s+/g, '-')}`;

/** 原稿の `<Demo>` から、デモのディレクトリと、そのタイトルの対応を作る（1回だけ読む） */
let demoTitles;
export const loadDemoTitles = () => {
  if (demoTitles) return demoTitles;
  demoTitles = new Map();
  const docs = join(ROOT, 'src/content/docs');
  for (const dir of readdirSync(docs, { withFileTypes: true }).filter((entry) => entry.isDirectory())) {
    for (const file of readdirSync(join(docs, dir.name)).filter((name) => name.endsWith('.mdx'))) {
      const source = readFileSync(join(docs, dir.name, file), 'utf8');
      const imports = new Map(
        [...source.matchAll(/^import (\w+) from '[./]*\/demos\/([^']+?)\/index\.html\?raw';$/gm)].map((match) => [match[1], match[2]]),
      );
      for (const match of source.matchAll(/<Demo\b[\s\S]*?\/>/g)) {
        const title = match[0].match(/\btitle="([^"]*)"/)?.[1];
        const name = imports.get(match[0].match(/\bhtml=\{(\w+)\}/)?.[1]);
        if (title && name && !demoTitles.has(name)) demoTitles.set(name, title);
      }
    }
  }
  return demoTitles;
};

/** 「全体」の案内の文（Web と AI 向け）。紙版はデモ番号で書く */
export const fromText = (from) => {
  if (!from) return '';
  if (isDistributedFile(from)) return `全体：配布ファイル ${from.split('/').at(-1)}`;
  const title = loadDemoTitles().get(from);
  return title ? `全体：デモ『${title}』` : `全体：デモ ${from}`;
};
