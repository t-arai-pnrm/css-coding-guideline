/**
 * 原稿のリンクの文字列に書いた節番号・章番号・付録の記号とタイトルが、リンク先のページのタイトルと一致するかを調べる。
 * - 節：`[7-4 大きさの決まり方](/layout/sizing/)`、`[7-4](/layout/sizing/)`
 * - 章：`第7章「[レイアウトの仕組み](/layout/)」`
 * - 付録：`付録A「[ルール一覧](/appendix/rules/)」`
 * 節のタイトルは、リンク先のタイトルの先頭と一致すればよい（`12-1 stack` のような短縮を認める）。
 * 更新履歴（appendix/changelog.mdx）は、当時の番号を残す記録なので対象外。
 *
 * 使い方: node scripts/lint-refs.mjs [ファイル…]
 */
import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const DOCS = join(ROOT, 'src/content/docs');

const listFiles = async (dir, ext) => {
  const entries = await readdir(dir, { withFileTypes: true, recursive: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(ext))
    .map((entry) => join(entry.parentPath, entry.name));
};

const titles = new Map();
const titleOf = async (path) => {
  if (titles.has(path)) return titles.get(path);
  const candidates = [join(DOCS, `${path}.mdx`), join(DOCS, path, 'index.mdx')];
  const file = candidates.find((candidate) => existsSync(candidate));
  let title = null;
  if (file) {
    const match = (await readFile(file, 'utf8')).match(/^title:\s*"?(.*?)"?\s*$/m);
    title = match?.[1] ?? null;
  }
  titles.set(path, title);
  return title;
};

const args = process.argv.slice(2);
const files = (args.length ? args : await listFiles(DOCS, '.mdx')).filter((file) => !file.endsWith('appendix/changelog.mdx'));

let count = 0;
const report = (file, source, index, message) => {
  const line = source.slice(0, index).split('\n').length;
  console.log(`${relative(ROOT, file)}:${line}  ${message}`);
  count++;
};

for (const file of files) {
  const source = await readFile(file, 'utf8');

  for (const match of source.matchAll(/\[(\d+-\d+)(?: ([^\]]+))?\]\(\/([a-z-]+\/[a-z-]+)\/[^)]*\)/g)) {
    const [, number, text, path] = match;
    const title = await titleOf(path);
    if (!title) continue;
    const [realNumber, ...rest] = title.split(' ');
    const realText = rest.join(' ');
    if (realNumber !== number) report(file, source, match.index, `「${number}」→ リンク先は「${title}」`);
    else if (text && !realText.startsWith(text)) report(file, source, match.index, `「${number} ${text}」→ リンク先は「${title}」`);
  }

  for (const match of source.matchAll(/第(\d+)章「\[([^\]]+)\]\(\/([a-z-]+)\/(?:#[^)]*)?\)」/g)) {
    const [, number, text, path] = match;
    const title = await titleOf(path);
    if (!title) continue;
    const expected = title.match(/^第(\d+)章\s*(.*)$/);
    if (!expected) continue;
    if (expected[1] !== number || expected[2] !== text) report(file, source, match.index, `「第${number}章 ${text}」→ リンク先は「${title}」`);
  }

  for (const match of source.matchAll(/付録([A-Z])「\[([^\]]+)\]\(\/appendix\/([a-z-]+)\/[^)]*\)」/g)) {
    const [, letter, text, slug] = match;
    const title = await titleOf(`appendix/${slug}`);
    if (!title) continue;
    if (title !== `付録${letter} ${text}`) report(file, source, match.index, `「付録${letter} ${text}」→ リンク先は「${title}」`);
  }
}

if (count > 0) {
  console.log(`\n${count} 件`);
  process.exitCode = 1;
}
