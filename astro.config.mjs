// @ts-check
import starlight from '@astrojs/starlight';
import { satteri } from '@astrojs/markdown-satteri';
import { defineConfig } from 'astro/config';
import starlightLinksValidator from 'starlight-links-validator';
import starlightLlmsTxt from 'starlight-llms-txt';
import { readdirSync, readFileSync } from 'node:fs';
import { parse } from 'yaml';
import { chapterLabel, PARTS } from './src/lib/book.mjs';
import { BASE, SITE } from './src/lib/site.mjs';

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
  const match = link.slice(BASE.length).match(/^\/(.+?)\/?#rule-([a-z0-9-]+)$/);
  return Boolean(link.startsWith(`${BASE}/`) && match && rulePages.get(match[2]) === match[1]);
};

/**
 * 原稿のリンクはルート始まり（`/responsive/...`）で書く。
 * Markdown のリンクには `base` が付かないので、ビルド時に付ける。
 */
const prefixBaseToLinks = {
  name: 'prefix-base-to-links',
  element: {
    filter: ['a'],
    visit(node, ctx) {
      const href = node.properties?.href;
      if (typeof href !== 'string' || !href.startsWith('/') || href.startsWith('//')) return;
      if (href === BASE || href.startsWith(`${BASE}/`)) return;
      ctx.setProperty(node, 'href', `${BASE}${href}`);
    },
  },
};

export default defineConfig({
  site: SITE,
  base: BASE,
  markdown: {
    processor: satteri({
      hastPlugins: [prefixBaseToLinks],
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
      // 公開前なので、検索エンジンに載せない
      head: [{ tag: 'meta', attrs: { name: 'robots', content: 'noindex, nofollow' } }],
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
            items: [{ autogenerate: { directory: chapter.dir } }],
          })),
        })),
        {
          label: '付録',
          collapsed: true,
          items: [{ autogenerate: { directory: 'appendix' } }],
        },
      ],
      plugins: [
        starlightLinksValidator({ exclude: isValidRuleLink }),
        // AI のツールに渡す本文（/llms.txt、/llms-full.txt、/llms-small.txt）。使い方は付録J。
        starlightLlmsTxt({
          // 要確認: 著者の判断。配布物の提供を始めたら、MCPサーバーかスキルでルールを引くよう案内する文に戻す
          details:
            'ルールには「必須」「推奨」「非推奨」「禁止」の強度と、英語のID（例: `query-range-syntax`）が付いています。ルールだけを引くためのMCPサーバーとスキルは、提供に向けて対応中です（付録J「AIツールで使う」）。',
          // 版ごとの変更点は長いので、要約版からは外す
          exclude: ['appendix/changelog'],
        }),
      ],
    }),
  ],
});
