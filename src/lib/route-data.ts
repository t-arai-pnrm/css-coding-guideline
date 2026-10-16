/**
 * Starlight のルートミドルウェア。サイドバーの節に、読み方の区別（frontmatter の `reading`）のバッジを付ける。
 * 基本の節にはバッジを付けず、応用と参照だけに付ける（区別の名前は src/lib/reading.mjs）。
 */
import { defineRouteMiddleware } from '@astrojs/starlight/route-data';
import type { StarlightRouteData } from '@astrojs/starlight/route-data';
import { getCollection } from 'astro:content';
import { READINGS } from './reading.mjs';

type SidebarEntry = StarlightRouteData['sidebar'][number];

const BADGED = new Set(['applied', 'reference']);

/** ページの URL のパス（`/recss-guideline/values/if-and-attr/`）から、区別を引く表。ビルド中に1回だけ作る */
let readingByPath: Map<string, keyof typeof READINGS> | undefined;
const loadReadings = async () => {
  if (readingByPath) return readingByPath;
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  readingByPath = new Map();
  for (const entry of await getCollection('docs')) {
    const reading = entry.data.reading;
    if (reading && BADGED.has(reading)) readingByPath.set(`${base}/${entry.id}/`, reading);
  }
  return readingByPath;
};

const addBadges = (entries: SidebarEntry[], readings: Map<string, keyof typeof READINGS>) => {
  for (const entry of entries) {
    if (entry.type === 'group') {
      addBadges(entry.entries, readings);
      continue;
    }
    const reading = readings.get(entry.href);
    if (reading && !entry.badge) entry.badge = { text: READINGS[reading].label, variant: reading === 'applied' ? 'note' : 'default' };
  }
};

export const onRequest = defineRouteMiddleware(async (context) => {
  addBadges(context.locals.starlightRoute.sidebar, await loadReadings());
});
