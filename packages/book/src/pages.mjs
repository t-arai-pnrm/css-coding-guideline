/**
 * 原稿（src/content/docs）から、巻に入れるページを読む順に並べる。
 * 各ページについて、節番号、タイトル、dist/ の HTML の場所、デモの名前（呼び出した順）を返す。
 */
import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { CHAPTERS } from '../../../src/lib/book.mjs';
import { VOLUMES, volumeOf } from '../config/volumes.mjs';

export const ROOT = new URL('../../../', import.meta.url).pathname;
export const DOCS = join(ROOT, 'src/content/docs');
export const DIST = join(ROOT, 'dist');

const frontmatter = (source) => {
  const block = source.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
  const title = block.match(/^title:\s*"?(.*?)"?\s*$/m)?.[1] ?? '';
  const order = Number(block.match(/^\s+order:\s*(\d+)/m)?.[1] ?? 0);
  const draft = /^draft:\s*true/m.test(block);
  return { title, order, draft };
};

/** MDX の <Demo> の呼び出しを順に読み、デモのディレクトリ名（例：components/density-event-card）を返す */
const demoNames = (source) => {
  const imports = new Map(
    [...source.matchAll(/^import (\w+) from '[./]*\/demos\/([^']+?)\/index\.html\?raw';$/gm)].map((match) => [match[1], match[2]]),
  );
  return [...source.matchAll(/<Demo\b[^>]*?\bhtml=\{(\w+)\}/gs)].map((match) => imports.get(match[1]) ?? null);
};

/** 節番号（例：10-6）。章の概要は「第10章」、付録は「付録E」、はじめには null */
const labelOf = (title) => title.match(/^(\d+-\d+|第\d+章|付録[A-Z])\s/)?.[1] ?? null;

/** 1つのページを読む */
const readPage = async (dir, file) => {
  const source = await readFile(join(DOCS, dir, file), 'utf8');
  const { title, order, draft } = frontmatter(source);
  const slug = file.replace(/\.mdx$/, '');
  const id = slug === 'index' ? dir : `${dir}/${slug}`;
  const html = join(DIST, slug === 'index' ? dir : join(dir, slug), 'index.html');
  const chapter = CHAPTERS.find((item) => item.dir === dir) ?? null;
  return { id, dir, slug, title, order, draft, label: labelOf(title), chapter: chapter?.number ?? null, html, demos: demoNames(source) };
};

/** すべてのページ（下書きを除く）。リンク先の節番号と巻を引くのに使う */
export const allPages = async () => {
  const pages = [];
  for (const entry of await readdir(DOCS, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    for (const file of await readdir(join(DOCS, entry.name))) {
      if (!file.endsWith('.mdx')) continue;
      const page = await readPage(entry.name, file);
      if (!page.draft) pages.push({ ...page, volume: volumeOf(entry.name) });
    }
  }
  return pages;
};

/** 巻に入れるページを、読む順に返す */
export const volumePages = async (number) => {
  const volume = VOLUMES.find((item) => item.number === number);
  if (!volume) throw new Error(`巻${number} は config/volumes.mjs にありません。`);
  const pages = [];
  for (const dir of volume.dirs) {
    const files = (await readdir(join(DOCS, dir))).filter((file) => file.endsWith('.mdx'));
    const inDir = (await Promise.all(files.map((file) => readPage(dir, file))))
      .filter((page) => !page.draft)
      .filter((page) => dir !== 'appendix' || volume.appendix?.includes(page.slug))
      .sort((a, b) => a.order - b.order);
    pages.push(...inDir);
  }
  const missing = pages.filter((page) => !existsSync(page.html));
  if (missing.length) {
    throw new Error(`dist/ に次のページがありません。先に pnpm build を実行してください。\n${missing.map((page) => `- ${page.id}`).join('\n')}`);
  }
  return { volume, pages };
};
