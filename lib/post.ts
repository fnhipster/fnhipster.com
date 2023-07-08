import { POSTS_PATH } from './config.ts';
import { renderTemplate } from './render-template.ts';

export async function getPost(path: string) {
  // Get the post metadata
  const model = await import(path + 'model.ts');

  const data =
    typeof model?.default === 'function' ? model.default() : model.default;

  // If the post is a draft, skip it
  if (!data.meta?.published) return null;

  // Add the post to the index
  const slug = path.replace(POSTS_PATH, '');

  const props = { slug, ...data };

  // Cache static HTML of the post
  const html = await renderTemplate(
    'post',
    props,
    await Deno.readTextFile(path + 'content.md')
  );

  return { html, ...props };
}
