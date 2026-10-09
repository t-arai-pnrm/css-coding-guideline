/**
 * 生成したデータ（data/guideline.json）を読み、ルールとページを引く。
 * データは scripts/gen-ai.mjs が、本書のルールの定義と原稿から作る。
 */
import { readFileSync } from 'node:fs';

export const RULE_KINDS = { spec: '仕様上の制約', judgment: '実装上の判断', convention: '本書の規約' };
export const LEVELS = ['必須', '推奨', '非推奨', '禁止'];

/** 全角と半角、大文字と小文字の違いを無視して比べる。 */
const normalize = (text) => String(text ?? '').normalize('NFKC').toLowerCase();

export const loadGuideline = (url = new URL('../data/guideline.json', import.meta.url)) => {
  let data;
  try {
    data = JSON.parse(readFileSync(url, 'utf8'));
  } catch (error) {
    throw new Error(`データ（${url.pathname}）を読めません。リポジトリでは pnpm gen:ai で作ってください。`, {
      cause: error,
    });
  }
  return createGuideline(data);
};

export const createGuideline = (data) => {
  const chapters = data.outline.parts.flatMap((part) => part.chapters);
  const chapterOf = (rule) => chapters.find((chapter) => chapter.dir === rule.page.split('/')[0]);
  const rulesById = new Map(data.rules.map((rule) => [rule.id, rule]));
  const pagesById = new Map(data.pages.map((page) => [page.id, page]));
  const haystacks = new Map(
    data.rules.map((rule) => [
      rule.id,
      {
        id: normalize(rule.id),
        rule: normalize(rule.rule),
        rest: normalize([rule.reason, rule.note, rule.lint, rule.pageTitle].join('\n')),
      },
    ]),
  );

  /** 章の番号（13）、ディレクトリ名（responsive）、見出し（第13章）のどれでも章を引く。 */
  const findChapter = (reference) => {
    const text = normalize(reference).replace(/^第|章.*$/g, '');
    return chapters.find((chapter) => String(chapter.number) === text || chapter.dir === text);
  };

  const searchRules = ({ query = '', chapter, page, level, kind, aiProne, limit = 30 } = {}) => {
    const terms = normalize(query).split(/\s+/).filter(Boolean);
    const target = chapter === undefined || chapter === '' ? undefined : findChapter(chapter);
    if (chapter !== undefined && chapter !== '' && !target) {
      return { error: `章「${chapter}」が見つかりません。list_chapters で章の番号とディレクトリ名を確かめてください。` };
    }
    const targetPage = page ? findPage(page).page : undefined;
    if (page && !targetPage) {
      return { error: `節「${page}」を1つに絞れません。list_chapters でページIDを確かめてください。` };
    }
    const matched = [];
    data.rules.forEach((rule, order) => {
      if (target && chapterOf(rule)?.dir !== target.dir) return;
      if (targetPage && rule.page !== targetPage.id) return;
      if (level && rule.level !== level) return;
      if (kind && rule.kind !== kind) return;
      if (aiProne !== undefined && rule.aiProne !== aiProne) return;
      const haystack = haystacks.get(rule.id);
      let score = 0;
      for (const term of terms) {
        if (haystack.id === term) score += 10;
        else if (haystack.id.includes(term)) score += 3;
        else if (haystack.rule.includes(term)) score += 2;
        else if (haystack.rest.includes(term)) score += 1;
        else return;
      }
      matched.push({ rule, score, order });
    });
    matched.sort((a, b) => b.score - a.score || a.order - b.order);
    return { total: matched.length, rules: matched.slice(0, limit).map(({ rule }) => rule) };
  };

  const getRule = (id) => rulesById.get(String(id).trim().replace(/^`|`$/g, ''));

  /** ID が見つからないときの候補。 */
  const similarRuleIds = (id) => {
    const parts = normalize(id).split('-').filter((part) => part.length > 2);
    return data.rules
      .map((rule) => ({ id: rule.id, hits: parts.filter((part) => rule.id.includes(part)).length }))
      .filter(({ hits }) => hits > 0)
      .sort((a, b) => b.hits - a.hits)
      .slice(0, 5)
      .map(({ id: candidate }) => candidate);
  };

  /** ページ ID、公開 URL、サイトの中のパス、タイトル（「13-5」のような番号でも可）でページを引く。 */
  const findPage = (reference) => {
    let text = String(reference ?? '').trim();
    if (/^https?:\/\//.test(text)) text = new URL(text).pathname;
    const base = new URL(data.site).pathname.replace(/\/$/, '');
    if (text.startsWith(`${base}/`) || text === base) text = text.slice(base.length);
    const id = text.split('#')[0].replace(/^\/+|\/+$/g, '');
    if (pagesById.has(id)) return { page: pagesById.get(id) };
    const wanted = normalize(reference);
    const byTitle = data.pages.filter((page) => normalize(page.title) === wanted);
    if (byTitle.length === 1) return { page: byTitle[0] };
    const candidates = data.pages.filter(
      (page) => normalize(page.title).startsWith(wanted) || normalize(page.title).includes(wanted) || page.id.includes(wanted),
    );
    if (candidates.length === 1) return { page: candidates[0] };
    return { candidates: candidates.slice(0, 10) };
  };

  return {
    version: data.version,
    generatedAt: data.generatedAt,
    site: data.site,
    outline: data.outline,
    rules: data.rules,
    pages: data.pages,
    chapterOf,
    searchRules,
    getRule,
    similarRuleIds,
    findPage,
  };
};

/** ページの `##` 見出しの一覧。 */
export const headingsOf = (markdown) => [...markdown.matchAll(/^## (.+)$/gm)].map(([, heading]) => heading);

/** ページの本文から、`##` 見出し1つ分を切り出す。 */
export const sectionOf = (markdown, heading) => {
  const wanted = normalize(heading).replace(/^#+\s*/, '');
  const sections = markdown.split(/^(?=## )/m).filter((section) => section.startsWith('## '));
  return sections.find((section) => normalize(section.split('\n')[0]).includes(wanted));
};
