import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { docsLoader, i18nLoader } from '@astrojs/starlight/loaders';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { parse } from 'yaml';

const RULES_DIR = 'src/content/rules';

/**
 * ルールの定義。本書のルールはここだけで管理し、各ページの `<Guideline />`、
 * 付録のルール一覧、AI 向けルール集（scripts/gen-ai.mjs）をすべてここから作る。
 */
export const ruleSchema = z.object({
  /** 章の構成に依存しない英語のスラッグ。一度公開したら変えない。 */
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  level: z.enum(['必須', '推奨', '非推奨', '禁止']),
  /** ルール本文。1文で書く。 */
  rule: z.string(),
  /** そのルールを守る理由。 */
  reason: z.string(),
  /** 例外や補足。 */
  note: z.string().optional(),
  /** 自動チェックの手段（例: `Stylelint: unit-disallowed-list`）。 */
  lint: z.string().optional(),
  /** AI が生成するコードで誤りやすいもの。AI 向けルール集で先頭に並べる。 */
  aiProne: z.boolean().default(false),
  /** 掲載するページの ID（例: `responsive/escalation`）。 */
  page: z.string(),
  /** ルールを追加したバージョン。 */
  since: z.string(),
  /** 読み込み順（ファイル名順、ファイル内の記述順）。ローダーが付ける。 */
  order: z.number(),
});

export type Rule = z.infer<typeof ruleSchema>;

/** `src/content/rules/*.yaml`（ルールの配列）をすべて読み込む。 */
const rulesLoader = async () => {
  const files = (await readdir(RULES_DIR)).filter((file) => file.endsWith('.yaml')).sort();
  const entries: Record<string, unknown>[] = [];
  for (const file of files) {
    const data = parse(await readFile(join(RULES_DIR, file), 'utf8'));
    if (!Array.isArray(data)) {
      throw new Error(`${file}: ルールの配列を書いてください。`);
    }
    entries.push(...data);
  }
  const ids = new Set<string>();
  for (const entry of entries) {
    const id = String(entry.id);
    if (ids.has(id)) throw new Error(`ルール ID が重複しています: ${id}`);
    ids.add(id);
  }
  return entries.map((entry, index) => ({ ...entry, id: String(entry.id), order: index }));
};

export const collections = {
  docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
  i18n: defineCollection({ loader: i18nLoader(), schema: i18nSchema() }),
  rules: defineCollection({ loader: rulesLoader, schema: ruleSchema }),
};
