/**
 * `class` 属性の中のクラスが、種類ごとに `|` で区切られ、決まった順に並んでいるかを調べる（ルール `group-classes-with-pipe`）。
 * 順番：ルート（`scoped <名前>`）| 子要素（`_`）| コンポジション | パターン | ユーティリティ（`-`）
 *
 * 使い方: node scripts/lint-classes.mjs [ファイル…]
 * 引数がなければ、デモとひな形の HTML と、原稿の MDX をすべて調べる。
 */
import { readFile, readdir } from 'node:fs/promises';
import { join, relative } from 'node:path';

const ROOT = process.cwd();

// 接頭辞のないクラスのうち、パターンとして扱う名前。ほかはコンポジションとみなす。
// 原稿やデモで新しいパターンを使ったら、ここに足す。
const PATTERNS = new Set(['section-heading', 'icon', 'status-badge']);
const KINDS = ['root', 'child', 'composition', 'pattern', 'utility'];
const LABELS = { root: 'ルート', child: '子要素', composition: 'コンポジション', pattern: 'パターン', utility: 'ユーティリティ' };

const listFiles = async (dir, ext) => {
  const entries = await readdir(dir, { withFileTypes: true, recursive: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(ext))
    .map((entry) => join(entry.parentPath, entry.name));
};

const kindOf = (token) => {
  if (token.startsWith('_')) return 'child';
  if (token.startsWith('-')) return 'utility';
  if (PATTERNS.has(token)) return 'pattern';
  return 'composition';
};

/** 1つのグループ（`|` の間）の種類を返す。種類が混ざっていれば null */
const groupKind = (tokens) => {
  if (tokens.includes('scoped')) {
    // `scoped <名前>` と、その前に置く CMS のブロックのクラスだけを許す。
    // カスタム要素は要素名がコンポーネントの名前なので、`scoped` だけでもよい
    const at = tokens.indexOf('scoped');
    return at >= tokens.length - 2 ? 'root' : null;
  }
  const kinds = new Set(tokens.map(kindOf));
  return kinds.size === 1 ? [...kinds][0] : null;
};

/** 問題があれば説明の文字列を、なければ null を返す */
export const checkClassValue = (value) => {
  if (value.includes('{')) return null; // テンプレートの式は対象外
  const groups = value
    .split('|')
    .map((group) => group.trim().split(/\s+/).filter(Boolean));
  if (groups.some((tokens) => tokens.length === 0)) return '空のグループがある';
  const kinds = groups.map(groupKind);
  const mixed = kinds.indexOf(null);
  if (mixed !== -1) return `種類の違うクラスが \`|\` で区切られていない（${groups[mixed].join(' ')}）`;
  for (let i = 1; i < kinds.length; i++) {
    if (kinds[i] === kinds[i - 1]) return `同じ種類（${LABELS[kinds[i]]}）のグループが分かれている`;
    if (KINDS.indexOf(kinds[i]) < KINDS.indexOf(kinds[i - 1])) {
      return `${LABELS[kinds[i]]}が${LABELS[kinds[i - 1]]}より後ろにある`;
    }
  }
  return null;
};

const files = process.argv.slice(2).length
  ? process.argv.slice(2)
  : [
      ...(await listFiles(join(ROOT, 'src/demos'), '.html')),
      ...(await listFiles(join(ROOT, 'src/kits'), '.html')),
      ...(await listFiles(join(ROOT, 'src/content/docs'), '.mdx')),
    ];

let count = 0;
for (const file of files) {
  const lines = (await readFile(file, 'utf8')).split('\n');
  lines.forEach((line, index) => {
    for (const [, value] of line.matchAll(/class="([^"]*)"/g)) {
      const problem = checkClassValue(value);
      if (problem) {
        count++;
        console.log(`${relative(ROOT, file)}:${index + 1}  class="${value}"  ${problem}`);
      }
    }
  });
}

if (count > 0) {
  console.log(`\n${count} 件`);
  process.exitCode = 1;
}
