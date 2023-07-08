import { parse as parseYAML } from 'https://esm.sh/yaml@2.3.1';
import { POSTS_PATH } from './config.ts';
import { renderTemplate } from './render-template.ts';

// Get the global metadata
const globalMeta = await Deno.readTextFile(`./index.yaml`)
  .then((yml) => {
    return parseYAML(yml);
  })
  .catch(() => ({}));

export async function getPost(path: string) {
  // Get the post metadata
  const meta = await Deno.readTextFile(path + 'meta.yaml').then((yml) => {
    return parseYAML(yml);
  });

  // If the post is a draft, skip it
  if (!meta.published) {
    return null;
  }

  // Add the post to the index
  const slug = path.replace(POSTS_PATH, '');

  // Cache static HTML of the post
  const html = await renderTemplate(
    'post',
    {
      meta: { ...globalMeta, ...meta },
    },
    await Deno.readTextFile(path + 'content.md')
  );

  return { slug, meta, html };
}
