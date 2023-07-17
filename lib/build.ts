import { ensureDir } from 'https://deno.land/std@0.78.0/fs/mod.ts';
import { getPagesIndex } from './index.ts';
import { getPageHTML } from './page.ts';
import { BUILD_PATH } from './config.ts';

await ensureDir(BUILD_PATH);

// Get all the pages
console.log('Building pages...');

const index = await getPagesIndex();

index.forEach(async (page) => {
  if (page.revalidate) {
    // create directory
    await ensureDir(`${BUILD_PATH}/${page.route}`);

    const html = await getPageHTML(page);

    if (html) {
      // Write HTML
      await Deno.writeTextFile(`${BUILD_PATH}/${page.route}index.html`, html, {
        create: true,
      });
    }
  }

  console.log(page.revalidate ? '🟢' : '⚪️', `${page.route}`);
});
