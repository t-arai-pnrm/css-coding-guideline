/**
 * 原稿（MDX）の構文を検証する。本番ビルドを走らせずに、地の文の `<` や `{` による
 * 構文エラーを見つけるためのもの。引数にファイルを渡すとそのファイルだけを検証する。
 *
 * @example
 * node scripts/check-mdx.mjs src/content/docs/responsive/*.mdx
 */
import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { compile } from '@mdx-js/mdx';

const ROOT = new URL('..', import.meta.url).pathname;
const DOCS_DIR = join(ROOT, 'src/content/docs');

const listMdx = async (dir) => {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) return listMdx(path);
      return entry.name.endsWith('.mdx') ? [path] : [];
    }),
  );
  return files.flat();
};

const files = process.argv.length > 2 ? process.argv.slice(2) : await listMdx(DOCS_DIR);
let errorCount = 0;
for (const file of files) {
  const source = (await readFile(file, 'utf8')).replace(/^---\n[\s\S]*?\n---\n/, '');
  try {
    await compile(source);
  } catch (error) {
    errorCount++;
    console.log(`${relative(ROOT, file)}:${error.line ?? '?'}:${error.column ?? '?'}  ${error.reason ?? error.message}`);
  }
}
console.log(`${files.length} 件の MDX を検証しました。`);
if (errorCount > 0) process.exit(1);
