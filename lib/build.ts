import {
  emptyDir,
  ensureDir,
  expandGlob,
  copy,
} from 'https://deno.land/std@0.78.0/fs/mod.ts';
import { BUILD_PATH, PAGES_PATH } from './config.ts';
import { getPagesIndex } from './index.ts';

// Remove existing build
await emptyDir(BUILD_PATH);

await ensureDir(`${BUILD_PATH}`);

// Copy assets
for await (const file of expandGlob(`${PAGES_PATH}/**/assets`)) {
  if (!file.isDirectory) continue;

  const dest = file.path.replace(PAGES_PATH, `${BUILD_PATH}/public`);

  await copy(file.path, dest);
}

// Get all the pages
console.group('📝 Building pages');

const index = await getPagesIndex();

index.forEach(async ({ html, meta }) => {
  console.log(`+ ${meta.slug}`);

  // create directory
  await ensureDir(`${BUILD_PATH}/public${meta.slug}`);

  // Write HTML
  await Deno.writeTextFile(
    `${BUILD_PATH}/public${meta.slug}/index.html`,
    html,
    {
      create: true,
    }
  );
});

console.groupEnd();
