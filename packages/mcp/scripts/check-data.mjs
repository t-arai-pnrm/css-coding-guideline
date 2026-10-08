/**
 * npm に公開する前に、同梱するデータがパッケージと同じ版で生成されているかを確かめる。
 * データはリポジトリのルートで `pnpm gen:ai` を実行して作る。
 */
import { existsSync, readFileSync } from 'node:fs';

const read = (path) => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'));
const { version } = read('../package.json');

if (!existsSync(new URL('../data/guideline.json', import.meta.url))) {
  console.error('data/guideline.json がありません。リポジトリのルートで pnpm gen:ai を実行してください。');
  process.exit(1);
}
if (!existsSync(new URL('../data/stylelint/stylelint.config.mjs', import.meta.url))) {
  console.error('data/stylelint/ がありません。リポジトリのルートで pnpm gen:ai を実行してください。');
  process.exit(1);
}
const data = read('../data/guideline.json');
if (data.version !== version) {
  console.error(`データの版（${data.version}）がパッケージの版（${version}）と違います。pnpm gen:ai を実行し直してください。`);
  process.exit(1);
}
console.log(`データを確かめました（v${version}、ルール ${data.rules.length} 件、ページ ${data.pages.length} 件）。`);
