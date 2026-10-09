#!/usr/bin/env node
/**
 * 「CSSコーディングガイドライン」の MCP サーバー（stdio）。
 * ルールの検索と参照、節の本文の取得、本書の Stylelint 設定での検査を提供する。
 */
import { readFileSync } from 'node:fs';
import { McpServer } from '@modelcontextprotocol/server';
import { serveStdio } from '@modelcontextprotocol/server/stdio';
import * as z from 'zod/v4';
import { headingsOf, LEVELS, loadGuideline, RULE_KINDS, sectionOf } from './guideline.mjs';
import { lintCss, mapStylelintRules } from './lint.mjs';

const { version } = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const guideline = loadGuideline();
const stylelintRules = mapStylelintRules(guideline.rules);
const lintedRuleCount = new Set([...stylelintRules.values()].flat()).size;

const READ_ONLY = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false };

const text = (body) => ({ content: [{ type: 'text', text: body }] });
const failure = (body) => ({ content: [{ type: 'text', text: body }], isError: true });

const headline = (rule) => `【${rule.level}・${RULE_KINDS[rule.kind]}】${rule.rule}（\`${rule.id}\`）`;
const ruleUrl = (rule) => `${guideline.pages.find((page) => page.id === rule.page)?.url ?? guideline.site}#rule-${rule.id}`;

const formatRule = (rule) => {
  const lines = [`- ${headline(rule)}`, `  - 理由: ${rule.reason}`];
  if (rule.note) lines.push(`  - 補足: ${rule.note}`);
  if (rule.lint) lines.push(`  - 自動チェック: ${rule.lint}`);
  if (rule.aiProne) lines.push('  - AIが誤りやすいルール');
  lines.push(`  - 掲載: ${rule.pageTitle}（${ruleUrl(rule)}）`, `  - 追加: ${rule.since}`);
  return lines.join('\n');
};

const INSTRUCTIONS = `「CSSコーディングガイドライン」（v${guideline.version}、${guideline.site}）のルールと本文を返し、CSSを本書のStylelint設定で検査するサーバーです。
- CSSを書く前に、search_rules の aiProne: true で「AIが誤りやすいルール」を確認し、書く内容に関係する節を get_page で読んでください。
- レビューでは、関係する章を通読してから指摘します。list_chapters の「読む条件」で章を選び（「常に読む」の章は必ず含める）、その章のすべての節を get_page で heading を付けずに全文で読みます。heading と search_rules は、読んだ節やルールに戻って確かめるときに使います。
- 指摘は、自分のものもサブエージェントのものも、get_rule でルールの補足（適用範囲と例外）まで照合し、「確認済み」「却下（理由）」「食い違い」に振り分けてから報告します。報告には、読んだ節の一覧を付けます。
- 書いた後とレビューでは lint_css で検査します。lint で検出できるのはルールの一部（${lintedRuleCount}件）なので、通ってもルールの確認は省けません。
- 判断の根拠には、ルールのID（例: query-range-syntax）を添えてください。強度は「必須」「推奨」「非推奨」「禁止」の4段階で、「必須」と「禁止」は、補足に書いた適用範囲と例外を除いて必ず守ります。
- プロジェクトに独自の規約があれば、そちらを優先し、本書のルールと違う点は「食い違い」として示します。
- スキル css-coding-guideline があれば、その「レビューするとき」の手順に従ってください。`;

const formatChars = (chars) => `約${chars.toLocaleString('ja-JP')}字`;

const server = () => {
  const mcp = new McpServer({ name: 'css-coding-guideline', version }, { instructions: INSTRUCTIONS });

  mcp.registerTool(
    'search_rules',
    {
      title: 'ルールを探す',
      description:
        'CSSコーディングガイドラインのルールを、語句、章、強度、性質、AIが誤りやすいかで絞り込みます。語句は空白で区切るとすべてを含むものに絞り、ルールのID、本文、理由、補足、掲載ページのタイトルから探します。結果はルールの1行の要約で、理由は get_rule で引きます。',
      inputSchema: z.object({
        query: z.string().optional().describe('探す語句（例: "コンテナ クエリ"、"vh"、"focus"）。空白区切りはAND。'),
        chapter: z
          .union([z.number().int(), z.string()])
          .optional()
          .describe('章の番号（13）かディレクトリ名（responsive）。list_chapters で確かめられる。'),
        level: z.enum(LEVELS).optional().describe('強度'),
        kind: z
          .enum(['spec', 'judgment', 'convention'])
          .optional()
          .describe('性質。spec は仕様上の制約、judgment は実装上の判断、convention は本書の規約。'),
        aiProne: z.boolean().optional().describe('true でAIが誤りやすいルールだけに絞る。'),
        limit: z.number().int().min(1).max(200).optional().describe('返す件数の上限（既定は30）'),
      }),
      annotations: { title: 'ルールを探す', ...READ_ONLY },
    },
    async (input) => {
      const result = guideline.searchRules(input);
      if (result.error) return failure(result.error);
      if (result.total === 0) {
        return text('当てはまるルールはありません。語句を減らすか、短い語句（例: 「コンテナ」）に変えてください。');
      }
      const lines = result.rules.map(
        (rule) => `- ${headline(rule)} — ${rule.pageTitle}${rule.aiProne ? '（AIが誤りやすい）' : ''}`,
      );
      const more = result.total > result.rules.length ? `\n\n残りの ${result.total - result.rules.length} 件は、limit を増やすか条件を足して絞ってください。` : '';
      return text(`${result.total} 件中 ${result.rules.length} 件\n\n${lines.join('\n')}${more}`);
    },
  );

  mcp.registerTool(
    'get_rule',
    {
      title: 'ルールを引く',
      description: 'ルールのIDから、強度、性質、本文、理由、補足、自動チェックの手段、掲載ページのURLを返します。IDは複数まとめて渡せます。',
      inputSchema: z.object({
        ids: z.array(z.string()).min(1).max(50).describe('ルールのID（例: ["query-range-syntax", "no-vw-vh"]）'),
      }),
      annotations: { title: 'ルールを引く', ...READ_ONLY },
    },
    async ({ ids }) => {
      const blocks = ids.map((id) => {
        const rule = guideline.getRule(id);
        if (rule) return formatRule(rule);
        const similar = guideline.similarRuleIds(id);
        return `- \`${id}\` というルールはありません。${similar.length > 0 ? `近いID: ${similar.map((candidate) => `\`${candidate}\``).join('、')}` : 'search_rules で探してください。'}`;
      });
      return text(blocks.join('\n'));
    },
  );

  mcp.registerTool(
    'get_page',
    {
      title: '節の本文を読む',
      description:
        '本書のページ（節）の本文をMarkdownで返します。デモはCSSとHTMLのコードに、図は代替テキストに置き換えています。ページはID（例: responsive/media-queries）、公開URL、タイトルや番号（例: 13-5）で指定します。節を読むとき（とくにレビューの前）は heading を付けずに全文を読みます。heading は、読んだ節の見出し1つに戻って確かめるときに使います。',
      inputSchema: z.object({
        page: z.string().describe('ページのID、公開URL、タイトルか番号'),
        heading: z.string().optional().describe('返す見出し（## の見出しの一部でよい）'),
      }),
      annotations: { title: '節の本文を読む', ...READ_ONLY },
    },
    async ({ page: reference, heading }) => {
      const { page, candidates } = guideline.findPage(reference);
      if (!page) {
        if (candidates.length === 0) return failure(`ページ「${reference}」が見つかりません。list_chapters でページのIDを確かめてください。`);
        return failure(
          `ページ「${reference}」を1つに絞れません。次のIDで指定してください。\n\n${candidates.map((candidate) => `- \`${candidate.id}\` ${candidate.title}`).join('\n')}`,
        );
      }
      const header = (scope) =>
        `# ${page.title}\n\n${page.url}\n\n（${scope}）\n\n${page.description ? `> ${page.description}\n\n` : ''}`;
      if (heading) {
        const section = sectionOf(page.markdown, heading);
        if (!section) {
          return failure(`見出し「${heading}」がありません。このページの見出し:\n\n${headingsOf(page.markdown).map((entry) => `- ${entry}`).join('\n')}`);
        }
        return text(
          `${header(`見出し「${section.split('\n')[0].replace(/^## /, '')}」の部分だけ。この節を通読するときは heading を付けずに呼ぶ`)}${section.trim()}`,
        );
      }
      return text(`${header(`この節の全文、${formatChars(page.markdown.length)}`)}${page.markdown}\n\n（この節の終わり）`);
    },
  );

  mcp.registerTool(
    'list_chapters',
    {
      title: '目次を見る',
      description:
        '本書の部、章、節（ページのID、タイトル、字数）と、章ごとのルールの数、レビューで読む条件を返します。レビューで読む章と節を決めるときに使います。',
      inputSchema: z.object({}),
      annotations: { title: '目次を見る', ...READ_ONLY },
    },
    async () => {
      const { introduction, parts, appendix } = guideline.outline;
      const pageLines = (pages) => pages.map((page) => `  - \`${page.id}\` ${page.title}（${formatChars(page.chars)}）`).join('\n');
      const total = (pages) => pages.reduce((sum, page) => sum + page.chars, 0);
      const chapterLine = (chapter) =>
        [
          `- ${chapter.label}（章: ${chapter.number} / ${chapter.dir}、ルール ${chapter.ruleCount} 件、本文 ${formatChars(total(chapter.pages))}）`,
          chapter.review ? `  - 読む条件: ${chapter.always ? '常に読む。' : ''}${chapter.review}` : '',
          pageLines(chapter.pages),
        ]
          .filter(Boolean)
          .join('\n');
      const body = [
        `CSSコーディングガイドライン v${guideline.version}（${guideline.generatedAt} 生成）\n${guideline.site}`,
        'レビューでは、「読む条件」に当たる章と「常に読む」の章を選び、その章のすべての節を get_page で全文読む。1回に読む量は、合計8万字ほどを目安にまとまりに分ける。',
        `## ${introduction.label}\n\n${pageLines(introduction.pages)}`,
        ...parts.map((part) => `## ${part.label}\n\n${part.chapters.map(chapterLine).join('\n')}`),
        `## ${appendix.label}\n\n${pageLines(appendix.pages)}`,
      ];
      return text(body.join('\n\n'));
    },
  );

  mcp.registerTool(
    'lint_css',
    {
      title: 'CSSを検査する',
      description: `CSSを本書のStylelint設定で検査し、違反を行と列、Stylelintのルール名、対応する本書のルールIDとともに返します。lintで検出できる本書のルールは${lintedRuleCount}件だけなので、通ってもルールを守っているとは限りません。`,
      inputSchema: z.object({
        code: z.string().min(1).describe('検査するCSS'),
        layers: z
          .array(z.string())
          .optional()
          .describe('プロジェクトで宣言したレイヤー名。渡すと、それ以外のレイヤー名を使っていないかも検査する。'),
      }),
      annotations: { title: 'CSSを検査する', ...READ_ONLY },
    },
    async ({ code, layers }) => {
      let result;
      try {
        result = await lintCss({ code, layers });
      } catch (error) {
        return failure(`検査できませんでした: ${error.message}`);
      }
      const lines = result.warnings.map(({ line, column, severity, rule, text: message }) => {
        const related = stylelintRules.get(rule);
        return `- ${line}:${column} [${severity}] ${message}${related ? `（本書のルール: ${related.map((id) => `\`${id}\``).join('、')}）` : ''}`;
      });
      const summary =
        result.warnings.length === 0
          ? '本書のStylelint設定で検出される違反はありません。'
          : `${result.warnings.length} 件の違反があります。`;
      const notes = [
        layers?.length ? '' : 'レイヤー名の制限（layer-name-pattern）は、layers を渡していないので検査していません。',
        `lintで検出できる本書のルールは${lintedRuleCount}件だけです。とくに search_rules の aiProne: true のルールは、レビューで確かめてください。`,
        ...result.invalidOptions.map((message) => `設定の警告: ${message}`),
      ].filter(Boolean);
      return text([summary, lines.join('\n'), notes.map((note) => `※ ${note}`).join('\n')].filter(Boolean).join('\n\n'));
    },
  );

  return mcp;
};

serveStdio(server);
console.error(`css-coding-guideline MCP サーバー v${version}（ガイドライン v${guideline.version}）を stdio で起動しました。`);
