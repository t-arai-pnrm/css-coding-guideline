/** 原稿とデモから、版に対応したサンプル一式と補足サイトの入口を作る。 */
import { createHash } from 'node:crypto';
import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { createRequire, stripTypeScriptTypes } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { parse } from 'yaml';
import { BASELINE_CHECKED, CHAPTERS } from '../src/lib/book.mjs';
import { pageUrl } from '../src/lib/site.mjs';

const root = new URL('../', import.meta.url).pathname;
const require = createRequire(import.meta.url);
const read = (file) => readFile(join(root, file), 'utf8');
const version = JSON.parse(await read('package.json')).version;
const out = join(root, 'public/sample-files', `v${version}`);
const archive = join(root, 'public/sample-files', `recss-guideline-v${version}.zip`);
const snapshot = archive.replace(/\.zip$/, '.manifest.json');
const support = join(root, 'public/book-support');
const escape = (text) => String(text).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);

// Webのデモと同じ関数を使う。?rawだけを解決し、TypeScriptの型を外す。
let source = await read('src/lib/demo.ts');
for (const match of [...source.matchAll(/^import (\w+) from '([^']+)\?raw';$/gm)]) {
  const specifier = match[2];
  const file = specifier.startsWith('.') ? resolve(root, 'src/lib', specifier) : require.resolve(specifier);
  source = source.replace(match[0], `const ${match[1]} = ${JSON.stringify(await readFile(file, 'utf8'))};`);
}
const { buildSrcdoc } = await import(`data:text/javascript;base64,${Buffer.from(stripTypeScriptTypes(source)).toString('base64')}`);

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
await mkdir(support, { recursive: true });
const put = async (name, content) => {
  const file = join(out, name);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, content);
};

// 最小構成の正本は本文のコード例。ファイル名付きの例だけを取得する。
const quick = await read('src/content/docs/introduction/quick-start.mdx');
for (const match of quick.matchAll(/^```(?:html|css) title="([^"]+)"\n([\s\S]*?)^```/gm)) {
  const name = match[1].match(/(?:^|: )(index\.html|css\/[\w/.-]+\.css)(?: |$)/)?.[1];
  if (name) await put(`quick-start/${name}`, match[2]);
}
await put('quick-start/css/kiso.css', await readFile(require.resolve('kiso.css/kiso.css'), 'utf8'));

// 手を動かす課題の答え。各章のフォルダーには変えたファイルだけを置き、最小構成に前の章の答えから順に重ねる。
const taskKit = join(root, 'src/kits/tasks');
let previousTask = join(out, 'quick-start');
for (const entry of (await readdir(taskKit, { withFileTypes: true })).filter((item) => item.isDirectory()).sort((a, b) => a.name.localeCompare(b.name))) {
  const target = join(out, 'tasks', entry.name);
  await cp(previousTask, target, { recursive: true });
  await cp(join(taskKit, entry.name), target, { recursive: true });
  previousTask = target;
}
await cp(join(taskKit, 'README.md'), join(out, 'tasks/README.md'));
await cp(join(root, 'src/demos/tokens'), join(out, 'tokens'), { recursive: true });
await cp(join(root, 'public/exercise-files'), join(out, 'exercise'), { recursive: true });
await cp(join(root, 'public/ai-coding-files'), join(out, 'ai-coding'), { recursive: true });

// 4-3と同じViteの構成で、学習用ファイルをそのままビルドする。
await cp(join(out, 'quick-start'), join(out, 'practical'), { recursive: true });
const astroVersion = JSON.parse(await readFile(require.resolve('astro/package.json'), 'utf8')).version;
const astroRequire = createRequire(require.resolve('astro/package.json'));
const viteVersion = JSON.parse(await readFile(astroRequire.resolve('vite/package.json'), 'utf8')).version;
await put('practical/package.json', `${JSON.stringify({ name: 'recss-guideline-sample', private: true, type: 'module', engines: { node: '>=22.12.0' }, scripts: { dev: 'vite', build: 'vite build', preview: 'vite preview' }, devDependencies: { vite: viteVersion } }, null, 2)}\n`);

const demos = [];
for (const entry of await readdir(join(root, 'src/content/docs'), { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  for (const file of await readdir(join(root, 'src/content/docs', entry.name))) {
    if (!file.endsWith('.mdx')) continue;
    const path = join(root, 'src/content/docs', entry.name, file);
    const mdx = await readFile(path, 'utf8');
    const front = parse(mdx.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '');
    if (front.draft) continue;
    const page = file === 'index.mdx' ? entry.name : `${entry.name}/${file.slice(0, -4)}`;
    const label = front.title.match(/^(\d+-\d+|第\d+章|付録[A-Z])\s/)?.[1] ?? page.replaceAll('/', '-');
    const imports = new Map();
    for (const match of mdx.matchAll(/^import (\w+) from '([^']+)\?raw';$/gm)) {
      imports.set(match[1], await readFile(resolve(dirname(path), match[2]), 'utf8'));
    }
    const calls = [...mdx.matchAll(/<Demo\b([\s\S]*?)\/>/g)];
    for (const [index, match] of calls.entries()) {
      const attr = match[1];
      const text = (name) => attr.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
      const raw = (name) => {
        const binding = attr.match(new RegExp(`\\b${name}=\\{(\\w+)\\}`))?.[1];
        if (!binding) return undefined;
        if (!imports.has(binding)) throw new Error(`${page}: ${name}={${binding}} を解決できません。`);
        return imports.get(binding);
      };
      const id = `${label}-${index + 1}`;
      const name = `demos/${page}/${index + 1}/index.html`;
      await put(name, buildSrcdoc({ html: raw('html'), css: raw('css'), js: raw('js'), base: text('base'), scheme: text('scheme') }));
      demos.push({ id, page, title: text('title'), file: name, url: pageUrl(page), chapter: CHAPTERS.find((item) => item.dir === entry.name)?.number ?? 0, order: front.sidebar?.order ?? 0 });
    }
  }
}
demos.sort((a, b) => a.chapter - b.chapter || a.order - b.order || a.id.localeCompare(b.id, 'ja', { numeric: true }));
await put('README.md', `# RECSSガイドライン v${version} のサンプル\n\n原稿の版：${version}。ブラウザの対応状況：${BASELINE_CHECKED}確認のデータ。\n\n## 最小構成\n\nquick-start/index.htmlをブラウザで開きます。淡い灰色のカードに、青い見出し、日付、本文が出れば開始できます。見出しの色はarticleのstyle属性で変えます。\n\n## 実務配信への移行\n\npractical/でnpm install、npm run buildを実行します。Node.js 22.12以降で、Vite ${viteVersion}がcss/style.cssの@importを展開します。dist/index.htmlとdist/assets/のCSSを配信します。npm run previewでカードの見た目を確認します。インストールにはネットワークが必要です。\n\n## デモと演習\n\ndemos/のHTMLには、Web版と同じ共通トークン、リセット、CSS、必要なJavaScriptを含めています。デモ番号とファイルの対応はmanifest.jsonにあります。演習はexercise/の開始版、中間版、完成版を使います。tasks/には、第4章、第10章、第13章、第19章の概要にある「手を動かす課題」の答えの例を、最小構成に章ごとの変更を重ねた形で入れています。ai-coding/は第20章のひな形です。\n\n## 検証と更新\n\nmanifest.jsonに、元の依存関係と各ファイルのSHA-256を記録しています。刊行した版を再現するときは、その版のZIPを保存して使います。依存するブラウザの機能には対応状況の差があり、全デモの全状態を検証した記録ではありません。\n\n文章：CC BY 4.0、コード：MIT-0。出典：RECSSガイドライン、TAK、${pageUrl('')}\n`);

const files = [];
const hashes = async (dir, prefix = '') => {
  for (const entry of (await readdir(dir, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name))) {
    const name = prefix + entry.name;
    if (entry.isDirectory()) await hashes(join(dir, entry.name), name + '/');
    else files.push({ file: name, sha256: createHash('sha256').update(await readFile(join(dir, entry.name))).digest('hex') });
  }
};
await hashes(out);
const manifest = { version, baselineChecked: BASELINE_CHECKED, dependencies: { astro: astroVersion, vite: viteVersion, kiso: JSON.parse(await readFile(require.resolve('kiso.css/package.json'), 'utf8')).version, webFeatures: JSON.parse(await read('node_modules/web-features/package.json')).version }, lockfileSha256: createHash('sha256').update(await read('pnpm-lock.yaml')).digest('hex'), demos, files };
const manifestText = `${JSON.stringify(manifest, null, 2)}\n`;
await put('manifest.json', manifestText);
let previous;
try { previous = await readFile(snapshot, 'utf8'); } catch (error) { if (error.code !== 'ENOENT') throw error; }
// 正式刊行後は、同じ版の内容を差し替えない。変更があれば版を上げる。
if (!version.startsWith('0.') && previous && previous !== manifestText) {
  throw new Error(`v${version}の刊行済みサンプルと内容が違います。版を上げてください。`);
}
if (version.startsWith('0.') || !previous) {
  await rm(archive, { force: true });
  execFileSync('zip', ['-q', '-r', archive, `v${version}`], { cwd: dirname(out) });
  await writeFile(snapshot, manifestText);
}

const rows = demos.map((demo) => `<tr><td>デモ${escape(demo.id)}</td><td>${escape(demo.title)}</td><td><a href="${escape(demo.url)}">説明と操作</a></td><td><a href="../sample-files/v${version}/${escape(demo.file)}">サンプル</a></td></tr>`).join('\n');
// 0.60.2 までの ZIP は旧書名「CSSコーディングガイドライン」のファイル名のまま残している
const savedVersions = (await readdir(dirname(out)))
  .map((name) => name.match(/^((?:recss-guideline|css-coding-guideline)-v([\d.]+))\.zip$/))
  .filter(Boolean)
  .map(([, base, saved]) => ({ base, saved }))
  .sort((a, b) => b.saved.localeCompare(a.saved, 'en', { numeric: true }));
const versionList = savedVersions.map(({ base, saved }) => `<li>v${escape(saved)}${saved.startsWith('0.') ? '（試し組み）' : ''}：<a href="../sample-files/${base}.zip">サンプル一式</a>／<a href="../sample-files/${base}.manifest.json">版とファイルの記録</a></li>`).join('');
await writeFile(join(support, 'index.html'), `<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>書籍の補足とサンプル</title></head><body><h1>RECSSガイドラインの補足</h1><p>現在の原稿：v${version}。執筆中の試し組み用です。刊行版の正誤表は、刊行したときに版ごとに追加します。</p><p><a href="../sample-files/recss-guideline-v${version}.zip">v${version}のサンプル一式（ZIP）</a>／<a href="../sample-files/v${version}/manifest.json">ファイルと版の記録</a>／<a href="${pageUrl('appendix/changelog')}">刊行後の変更を調べるための更新履歴</a></p><p>紙面にあるデモ番号から、次の一覧を探してください。サンプルには同じ版のCSS・HTML・JavaScriptを含めています。説明のリンクは更新されるWeb版を開きます。</p><table><thead><tr><th>番号</th><th>内容</th><th>Web版</th><th>原稿と同じ版</th></tr></thead><tbody>${rows}</tbody></table></body></html>`);
const supportFile = join(support, 'index.html');
await writeFile(supportFile, (await readFile(supportFile, 'utf8')).replace('<table>', `<h2>紙面の版から選ぶ</h2><p>冒頭の版と同じZIPを選んでください。古い版のデモ番号とファイル名は、その版の記録か、ZIP内のmanifest.jsonで調べられます。</p><ul>${versionList}</ul><h2>現在の原稿のデモ一覧（v${version}）</h2><table>`));
process.stdout.write(`v${version}: デモ${demos.length}件、${files.length}ファイルを ${archive} にまとめました。\n`);
