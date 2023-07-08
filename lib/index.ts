import { Meta, PAGES_PATH } from './config.ts';
import { getPage } from './page.ts';

export async function getPagesIndex(_path = PAGES_PATH) {
  const pages: { html: string; meta: Meta }[] = [];

  async function recursiveIndexPages(_path: string) {
    for await (const entry of Deno.readDir(_path)) {
      // If it's not a directory, skip it
      if (!entry.isDirectory) continue;

      const path = `${_path.replace(/\/?$/, '/')}${entry.name}/`;

      const page = await getPage(path);

      // If not page, skip it
      if (!page) continue;

      pages.push({ ...page });

      // Recursively get sub pages
      await recursiveIndexPages(path);
    }
  }

  await recursiveIndexPages(_path);

  return pages.sort((a, b) => {
    if (!a.meta.date || !b.meta.date) return 0;
    return new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime();
  });
}
