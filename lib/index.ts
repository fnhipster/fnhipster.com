import { walk } from 'https://deno.land/std@0.78.0/fs/walk.ts';
import { Meta, PAGES_PATH } from './config.ts';
import { getPage } from './page.ts';

export async function getPagesIndex() {
  const pages: { html: string; meta: Meta; assets: boolean }[] = [];

  for await (const entry of walk(PAGES_PATH, {
    includeFiles: false,
    includeDirs: true,
    skip: [/\/assets$/],
  })) {
    // Skip root
    if (entry.path === PAGES_PATH) continue;

    // Get page data
    const page = await getPage(entry.path);

    // If not page, skip it
    if (!page) continue;

    pages.push({ ...page });
  }

  return pages.sort((a, b) => {
    if (!a.meta.date || !b.meta.date) return 0;
    return new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime();
  });
}
