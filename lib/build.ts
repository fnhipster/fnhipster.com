import { copy } from 'https://deno.land/std@0.193.0/fs/copy.ts';
import { BUILD_PATH, PUBLIC_PATH } from './config.ts';
import { getPagesIndex } from './index.ts';

// Remove old build if exists
try {
  await Deno.remove(BUILD_PATH, { recursive: true });
} catch {
  //
}

// create the directory
await Deno.mkdir(`${BUILD_PATH}`, { recursive: true });

// Get all the pages
console.group('📝 Building pages');

const index = await getPagesIndex();

index.forEach(async ({ html, meta }) => {
  console.log(`+ ${meta.slug}`);

  // create the directory
  await Deno.mkdir(`${BUILD_PATH}/public${meta.slug}`, { recursive: true });

  await Deno.writeTextFile(
    `${BUILD_PATH}/public${meta.slug}/index.html`,
    html,
    {
      create: true,
    }
  );
});

console.groupEnd();

// Copy static files
console.group('📁 Copying static files');

await copy(PUBLIC_PATH, BUILD_PATH + '/public', { overwrite: true });

console.groupEnd();

console.log('✅ Build complete!');
