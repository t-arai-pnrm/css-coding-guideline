/**
 * 第20章「AIにコーディングさせる」のひな形を、配布用に `public/ai-coding-files/` へ写す。
 * サイトの `/ai-coding-files/` から読める。
 *
 * ひな形の元は `src/kits/ai-coding/` に1つずつ置き、本文は Starlight の `<Code>` でそこから読み込む。
 * 本文と配布物が同じファイルを使うので、ひな形を直したら、このスクリプトを実行し直す。
 *
 * `mcp.json` の本書の MCP サーバーの版は、本のバージョン（`package.json`）にそろえる。
 * `pnpm gen:ai` の後にも実行されるので、版を上げたときに書き換え忘れない。
 */
import { mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = join(root, 'src/kits/ai-coding');
const outDir = join(root, 'public/ai-coding-files');

const { version } = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const mcpJson = join(srcDir, 'mcp.json');
const current = readFileSync(mcpJson, 'utf8');
const synced = current.replace(/css-coding-guideline-mcp@\d+\.\d+\.\d+/, `css-coding-guideline-mcp@${version}`);
if (synced !== current) {
  writeFileSync(mcpJson, synced);
  console.log(`mcp.json の版を ${version} にそろえた`);
}

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });

rmSync(outDir, { recursive: true, force: true });
const files = walk(srcDir);
for (const file of files) {
  const out = join(outDir, relative(srcDir, file));
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, readFileSync(file));
}
// テストページが読み込む CSS は、演習の 21-7 を終えた時点の配布ファイル（pnpm gen:exercise が作る）から写す
const EXERCISE_CSS = {
  'base.css': 'public/exercise-files/base.css',
  'compositions.css': 'public/exercise-files/featured/compositions.css',
  'article-card.css': 'public/exercise-files/featured/article-card.css',
};
for (const [name, from] of Object.entries(EXERCISE_CSS)) {
  writeFileSync(join(outDir, 'tests/pages/article-card', name), readFileSync(join(root, from)));
}
console.log(`${files.length + Object.keys(EXERCISE_CSS).length} 個のファイルを public/ai-coding-files/ に写した`);
