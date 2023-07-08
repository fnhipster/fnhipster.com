import { copy } from 'https://deno.land/std@0.193.0/fs/copy.ts';
import { POSTS_PATH, BUILD_PATH, PUBLIC_PATH, Post } from './config.ts';
import { getPost } from './post.ts';

// Remove old build if exists
try {
  await Deno.remove(BUILD_PATH, { recursive: true });
} catch {
  //
}

// Get all the posts
console.group('📝 Caching posts');

const posts: Post[] = [];

async function buildPosts(_path: string) {
  const postsFiles = Deno.readDir(_path);

  for await (const postFile of postsFiles) {
    // If it's not a directory, skip it
    if (!postFile.isDirectory) {
      continue;
    }

    // Get the post metadata
    const path = `${_path}/${postFile.name}/`;

    const post = await getPost(path);

    if (!post) {
      continue;
    }

    const { slug, meta, html } = post;

    posts.push({ slug, ...meta });

    console.log(`+ ${slug}`);

    // Cache static HTML of the post

    // create the directory
    await Deno.mkdir(`${BUILD_PATH}/public${slug}`, { recursive: true });

    await Deno.writeTextFile(`${BUILD_PATH}/public${slug}/index.html`, html, {
      create: true,
    });

    // Recursively get sub posts
    await buildPosts(path);
  }
}

// Get all the posts
await buildPosts(POSTS_PATH);

// Sort posts by date
const sortedPosts = posts.sort((a, b) => {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
});

// Write file with all the metadata
await Deno.writeTextFile(
  `${BUILD_PATH}/posts.json`,
  JSON.stringify(sortedPosts, null, 2),
  { create: true }
);

console.groupEnd();

// Copy static files
console.group('📁 Copying static files');

await copy(PUBLIC_PATH, BUILD_PATH + '/public', { overwrite: true });

console.groupEnd();
