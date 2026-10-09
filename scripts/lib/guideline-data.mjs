/**
 * ルール（src/content/rules/*.yaml）と原稿（src/content/docs/**\/*.mdx）を読み、
 * AI 向けの配布物（スキルと MCP サーバーのデータ）に共通の形にする。scripts/gen-ai.mjs が使う。
 *
 * 原稿は MDX のまま渡さず、本書のコンポーネントを Markdown に置き換える。
 * AI は本文だけを読むので、デモはコードに、図は代替テキストに、対応状況は文に変える。
 */
import { readFileSync } from 'node:fs';
import { readdir, readFile } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { features } from 'web-features';
import { parse } from 'yaml';
import { BASELINE_CHECKED, CHAPTERS, PARTS, chapterLabel } from '../../src/lib/book.mjs';
import { RULE_KINDS } from '../../src/lib/rule-kinds.mjs';
import { pageUrl } from '../../src/lib/site.mjs';

const ROOT = new URL('../..', import.meta.url).pathname.replace(/\/$/, '');
const RULES_DIR = join(ROOT, 'src/content/rules');
const DOCS_DIR = join(ROOT, 'src/content/docs');

const WEB_FEATURES_VERSION = JSON.parse(
  readFileSync(join(ROOT, 'node_modules/web-features/package.json'), 'utf8'),
).version;

/** ルールをファイル名の順、ファイルの中の記述順に読む。 */
export const loadRules = async () => {
  const rules = [];
  for (const file of (await readdir(RULES_DIR)).filter((name) => name.endsWith('.yaml')).sort()) {
    rules.push(...parse(await readFile(join(RULES_DIR, file), 'utf8')));
  }
  for (const rule of rules) {
    if (!RULE_KINDS[rule.kind]) throw new Error(`ルール「${rule.id}」の kind がありません。`);
  }
  return rules;
};

/** ルールの公開 URL（掲載ページの `#rule-<id>`）。 */
export const ruleUrl = (rule) => `${pageUrl(rule.page)}#rule-${rule.id}`;

/** ルールの見出し行（例: 【必須・本書の規約】…（`id`））。 */
export const ruleHeadline = (rule) => `【${rule.level}・${RULE_KINDS[rule.kind]}】${rule.rule}（\`${rule.id}\`）`;

/** ルールを、理由・補足・自動チェックを含む Markdown のリストにする。 */
export const formatRule = (rule, { withUrl = true } = {}) => {
  const lines = [`- ${ruleHeadline(rule)}`, `  - 理由: ${rule.reason}`];
  if (rule.note) lines.push(`  - 補足: ${rule.note}`);
  if (rule.lint) lines.push(`  - 自動チェック: ${rule.lint}`);
  if (withUrl) lines.push(`  - 詳細: ${ruleUrl(rule)}`);
  return lines.join('\n');
};

/** 原稿のファイルパスからページ ID を作る（`responsive/index.mdx` → `responsive`、トップは空文字）。 */
const pageIdOf = (file) =>
  relative(DOCS_DIR, file)
    .replace(/\.mdx$/, '')
    .replace(/(^|\/)index$/, '');

const listMdx = async (dir) => {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await listMdx(path)));
    else if (entry.name.endsWith('.mdx')) files.push(path);
  }
  return files;
};

const splitFrontmatter = (source) => {
  const match = source.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) return { data: {}, body: source };
  return { data: parse(match[1]) ?? {}, body: source.slice(match[0].length) };
};

/**
 * JSX の属性を読む。本書の原稿で使う形（`a="…"`、`a={識別子}`、`a={[…]}`、`a={false}`）だけを扱う。
 */
const parseAttributes = (source) => {
  const attributes = {};
  const pattern = /([A-Za-z]+)(?:=(?:"([^"]*)"|\{([^}]*)\}))?/g;
  for (const [, name, text, expression] of source.matchAll(pattern)) {
    if (text !== undefined) attributes[name] = { text };
    else if (expression !== undefined) attributes[name] = { expression: expression.trim() };
    else attributes[name] = { expression: 'true' };
  }
  return attributes;
};

const formatMonth = (date) => {
  if (!date) return '';
  const [year, month] = date.split('-');
  return `${year}年${Number(month)}月`;
};

/** `<Baseline />` と同じ内容を1文にする。 */
const baselineText = ({ id, compatKey, name }) => {
  const feature = features[id];
  if (!feature || feature.kind !== 'feature') throw new Error(`web-features に機能「${id}」がありません。`);
  const status = compatKey ? feature.status.by_compat_key?.[compatKey] : feature.status;
  if (!status) throw new Error(`web-features の「${id}」に「${compatKey}」がありません。`);
  const summary = { high: '広く利用可能', low: '新しく利用可能', false: '一部のブラウザのみ' }[String(status.baseline)];
  const since =
    status.baseline === 'high'
      ? `。${formatMonth(status.baseline_high_date)}から（新しく利用可能になったのは${formatMonth(status.baseline_low_date)}）`
      : status.baseline === 'low'
        ? `。${formatMonth(status.baseline_low_date)}から`
        : '';
  const browsers = [
    ['chrome', 'Chrome'],
    ['edge', 'Edge'],
    ['firefox', 'Firefox'],
    ['safari', 'Safari'],
    ['safari_ios', 'iOS Safari'],
  ]
    .map(([key, label]) => `${label} ${status.support[key] ?? '未対応'}`)
    .join('、');
  return `> Baseline: \`${name ?? feature.name}\` は「${summary}」${since}。${browsers}（web-features ${WEB_FEATURES_VERSION} のデータ、${BASELINE_CHECKED}確認）`;
};

const fence = (lang, code, title) => {
  const body = code.replace(/\n+$/, '');
  const longest = Math.max(2, ...[...body.matchAll(/`{3,}/g)].map(([ticks]) => ticks.length));
  const ticks = '`'.repeat(longest + 1);
  return `${ticks}${lang}${title ? ` title="${title}"` : ''}\n${body}\n${ticks}`;
};

const DEMO_LABELS = {
  recommended: '🙆‍♂ Recommended',
  'not-recommended': '🙅‍♂ Not Recommended',
  neutral: '',
};

/** 本書のコンポーネントを Markdown に置き換える。 */
const renderComponent = (name, attributes, context) => {
  const text = (key) => attributes[key]?.text;
  const value = (key) => {
    const expression = attributes[key]?.expression;
    if (expression === undefined) return undefined;
    if (!(expression in context.imports)) throw new Error(`${context.file}: ${name} の ${key}={${expression}} を解決できません。`);
    return context.imports[expression];
  };
  switch (name) {
    case 'Demo': {
      const variant = text('variant') ?? 'recommended';
      const label = DEMO_LABELS[variant];
      const showHtml = attributes.showHtml?.expression !== 'false';
      const css = variant === 'not-recommended' ? `/* 🙅‍♂ Not Recommended */\n${value('css')}` : value('css');
      // ページのデモと同じく、CSS を先に、HTML を後に置く
      const parts = [`**デモ: ${text('title')}**`, fence('css', css, label ? `${label}: style.css` : 'style.css')];
      if (showHtml) parts.push(fence('html', value('html'), 'index.html'));
      return parts.join('\n\n');
    }
    case 'Baseline':
      return baselineText({ id: text('id'), compatKey: text('compatKey'), name: text('name') });
    case 'Guideline': {
      const rules = context.rulesByPage.get(text('page') ?? context.id) ?? [];
      if (rules.length === 0) throw new Error(`${context.file}: 掲載するルールがありません。`);
      return rules.map((rule) => formatRule(rule, { withUrl: false })).join('\n');
    }
    case 'Figure':
      return `（図: ${text('alt')}）`;
    case 'ImagePlaceholder':
      return `（画像: ${text('alt')}）`;
    case 'Code':
      return fence(text('lang') ?? '', value('code'), text('title'));
    case 'RuleList':
      return '（ここにはすべてのルールの一覧が入ります。MCP サーバーでは `search_rules`、スキルでは `references/` のファイルで参照してください。）';
    default:
      throw new Error(`${context.file}: Markdown に置き換えられないコンポーネント <${name}> があります。`);
  }
};

/** コードブロックの外側だけを置き換える。 */
const mapOutsideFences = (body, transform) => {
  const segments = body.split(/(^[ \t]*(`{3,}|~{3,})[^\n]*\n[\s\S]*?^[ \t]*\2[ \t]*$)/m);
  const out = [];
  for (let index = 0; index < segments.length; index += 1) {
    const segment = segments[index];
    // split のキャプチャには、フェンス全体と、フェンスの記号が交互に入る
    if (index % 3 === 1) out.push(segment);
    else if (index % 3 === 0) out.push(transform(segment));
  }
  return out.join('');
};

/**
 * 自己終了のコンポーネント（`<Name … />`）を置き換える。
 * 属性の値に `>` が入ることがある（`name="<select>"` など）ので、引用符と波かっこを数えて終わりを探す。
 */
const replaceComponents = (text, render) => {
  const open = /<([A-Z][A-Za-z]*)\b/g;
  let out = '';
  let last = 0;
  for (let match = open.exec(text); match; match = open.exec(text)) {
    let index = match.index + match[0].length;
    let quote = '';
    let depth = 0;
    for (; index < text.length; index += 1) {
      const char = text[index];
      if (quote) {
        if (char === quote) quote = '';
      } else if (depth > 0) {
        if (char === '{') depth += 1;
        else if (char === '}') depth -= 1;
      } else if (char === '"' || char === "'") {
        quote = char;
      } else if (char === '{') {
        depth += 1;
      } else if (char === '/' && text[index + 1] === '>') {
        break;
      } else if (char === '>') {
        throw new Error(`<${match[1]}> は自己終了の形（<${match[1]} … />）で書いてください。`);
      }
    }
    out += text.slice(last, match.index) + render(match[1], text.slice(match.index + match[0].length, index));
    last = index + 2;
    open.lastIndex = last;
  }
  return out + text.slice(last);
};

/** MDX の本文を Markdown にする。 */
const mdxBodyToMarkdown = (body, context) => {
  const withoutImports = body.replace(/^import\s[^\n]*\n/gm, '');
  return mapOutsideFences(withoutImports, (segment) => {
    // インラインコードの中は置き換えないように、いったん退避する
    const codes = [];
    const masked = segment.replace(/(`+)(?:[^`]|[^`][\s\S]*?[^`])\1(?!`)/g, (code) => {
      codes.push(code);
      return `\u0000${codes.length - 1}\u0000`;
    });
    const replaced = replaceComponents(
      // 著者向けの印（{/* 要確認: … */} など）は、読者には出ないので消す
      masked.replace(/\{\/\*[\s\S]*?\*\/\}/g, ''),
      (name, attributes) => renderComponent(name, parseAttributes(attributes), context),
    )
      // 原稿のリンクはルート始まりなので、公開 URL にする
      .replace(/\]\((\/[^)\s]*)\)/g, (_, path) => {
        const [pathname, hash = ''] = path.split('#');
        const id = pathname.replace(/^\/|\/$/g, '');
        // 配布ファイル（/exercise-files/…/index.html など）は、ページではないので末尾に / を付けない
        const url = /\.\w+$/.test(id) ? pageUrl('').concat(id) : pageUrl(id);
        return `](${url}${hash ? `#${hash}` : ''})`;
      });
    return replaced.replace(/\u0000(\d+)\u0000/g, (_, index) => codes[Number(index)]);
  })
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};

/** `import 名前 from '…?raw'` を読み、名前からファイルの内容を引けるようにする。 */
const resolveRawImports = async (body, file) => {
  const imports = {};
  for (const [, name, path] of body.matchAll(/^import\s+(\w+)\s+from\s+'([^']+)\?raw';?$/gm)) {
    imports[name] = await readFile(join(dirname(file), path), 'utf8');
  }
  return imports;
};

/**
 * 公開しているページ（下書きを除く）を読み、本文を Markdown にする。
 * 返す値は、ページ ID、タイトル、説明、章、並び順、公開 URL、本文。
 */
export const loadPages = async (rules) => {
  const rulesByPage = new Map();
  for (const rule of rules) {
    if (!rulesByPage.has(rule.page)) rulesByPage.set(rule.page, []);
    rulesByPage.get(rule.page).push(rule);
  }
  const pages = [];
  for (const file of (await listMdx(DOCS_DIR)).sort()) {
    const source = await readFile(file, 'utf8');
    const { data, body } = splitFrontmatter(source);
    const id = pageIdOf(file);
    if (data.draft) {
      if (rulesByPage.has(id)) throw new Error(`下書きのページ「${id}」にルールが掲載されています。`);
      continue;
    }
    const context = { id, file: relative(ROOT, file), imports: await resolveRawImports(body, file), rulesByPage };
    pages.push({
      id,
      title: String(data.title),
      description: data.description ? String(data.description) : '',
      section: id.split('/')[0] || 'index',
      order: data.sidebar?.order ?? 0,
      url: pageUrl(id),
      markdown: mdxBodyToMarkdown(body, context),
    });
  }
  for (const page of rulesByPage.keys()) {
    if (!pages.some((entry) => entry.id === page)) throw new Error(`ルールの掲載ページ「${page}」が見つかりません。`);
  }
  return pages.sort((a, b) => a.section.localeCompare(b.section) || a.order - b.order || a.id.localeCompare(b.id));
};

/**
 * 部と章の構成に、各章のページとルールの数を付ける。「はじめに」と付録は章の外に置く。
 * ページの `chars` は本文（Markdown）の字数で、AI が1回に読む量を決めるのに使う。
 */
export const buildOutline = (pages, rules) => {
  const pagesOf = (section) =>
    pages
      .filter((page) => page.section === section)
      .sort((a, b) => a.order - b.order)
      .map(({ id, title, url, markdown }) => ({ id, title, url, chars: markdown.length }));
  const countRules = (section) => rules.filter((rule) => rule.page.split('/')[0] === section).length;
  return {
    introduction: { label: 'はじめに', pages: pagesOf('introduction') },
    parts: PARTS.map((part) => ({
      label: part.label,
      chapters: part.chapters.map((chapter) => ({
        number: chapter.number,
        dir: chapter.dir,
        label: chapterLabel(chapter),
        review: chapter.review ?? '',
        always: Boolean(chapter.always),
        ruleCount: countRules(chapter.dir),
        pages: pagesOf(chapter.dir),
      })),
    })),
    appendix: { label: '付録', pages: pagesOf('appendix') },
  };
};

export { CHAPTERS, chapterLabel, RULE_KINDS, ROOT };
