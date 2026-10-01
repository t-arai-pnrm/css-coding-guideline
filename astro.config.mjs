// @ts-check
import starlight from '@astrojs/starlight';
import { satteri } from '@astrojs/markdown-satteri';
import { defineConfig } from 'astro/config';
import starlightLinksValidator from 'starlight-links-validator';
import { readdirSync, readFileSync } from 'node:fs';
import { parse } from 'yaml';
import { chapterLabel, PARTS } from './src/lib/book.mjs';

/**
 * ルールへのリンク（`/<page>/#rule-<id>`）は、見出しではなく `<Guideline />` が出力する id を指す。
 * リンク検証は見出しの id しか知らないので、ルールの定義と照らして正しいものだけを検証から外す。
 */
const RULES_DIR = './src/content/rules';
const rulePages = new Map(
  readdirSync(RULES_DIR)
    .filter((file) => file.endsWith('.yaml'))
    .flatMap((file) => parse(readFileSync(`${RULES_DIR}/${file}`, 'utf8')))
    .map((rule) => [rule.id, rule.page]),
);
const isValidRuleLink = ({ link }) => {
  const match = link.match(/^\/(.+?)\/?#rule-([a-z0-9-]+)$/);
  return Boolean(match && rulePages.get(match[2]) === match[1]);
};

/**
 * 章のサイドバーの項目。章にグループ（`groups`）があると、`autogenerate` はサブディレクトリを
 * ディレクトリ名のラベルで並べてしまうので、節を `sidebar.order` の順に並べ、グループを `after` の節の直後に挟む。
 */
const DOCS_DIR = './src/content/docs';
const chapterItems = (chapter) => {
  if (!chapter.groups) return [{ autogenerate: { directory: chapter.dir } }];
  const pages = readdirSync(`${DOCS_DIR}/${chapter.dir}`)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => {
      const source = readFileSync(`${DOCS_DIR}/${chapter.dir}/${file}`, 'utf8');
      const order = Number(source.match(/^\s+order:\s*(\d+)/m)?.[1] ?? Infinity);
      const name = file.replace(/\.mdx$/, '');
      return { name, order, slug: name === 'index' ? chapter.dir : `${chapter.dir}/${name}` };
    })
    .sort((a, b) => a.order - b.order);
  return pages.flatMap((page) => [
    page.slug,
    ...chapter.groups
      .filter((group) => group.after === page.name)
      .map((group) => ({
        label: group.label,
        collapsed: true,
        items: [{ autogenerate: { directory: `${chapter.dir}/${group.dir}` } }],
      })),
  ]);
};

export default defineConfig({
  // 公開 URL が決まったら `site` を設定し、starlight-llms-txt を追加する。
  markdown: {
    processor: satteri({
      features: {
        // 地の文の `--custom-property` がダッシュに置き換わるのを防ぐ
        smartPunctuation: false,
        gfm: { footnotes: { label: '脚注' } },
      },
    }),
  },
  integrations: [
    starlight({
      title: 'CSSコーディングガイドライン',
      description:
        'CSSの記法と設計の知識をまとめた、実務のためのコーディングガイドライン。',
      locales: {
        root: { label: '日本語', lang: 'ja' },
      },
      social: [
        { icon: 'open-book', label: 'TAKLOG', href: 'https://www.tak-dcxi.com/' },
        { icon: 'notes', label: 'Zenn', href: 'https://zenn.dev/tak_dcxi' },
        { icon: 'github', label: 'GitHub', href: 'https://github.com/tak-dcxi' },
      ],
      lastUpdated: true,
      favicon: '/favicon.svg',
      customCss: ['./src/styles/custom.css'],
      sidebar: [
        {
          label: 'はじめに',
          items: [{ autogenerate: { directory: 'introduction' } }],
        },
        // 章の中の節は、各ページの frontmatter の `sidebar.order` で並べる
        ...PARTS.map((part) => ({
          label: part.label,
          items: part.chapters.map((chapter) => ({
            label: chapterLabel(chapter),
            collapsed: true,
            items: chapterItems(chapter),
          })),
        })),
        {
          label: '付録',
          collapsed: true,
          items: [{ autogenerate: { directory: 'appendix' } }],
        },
      ],
      plugins: [starlightLinksValidator({ exclude: isValidRuleLink })],
    }),
  ],
});
