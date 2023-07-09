import { PAGES_PATH } from './config.ts';
import { renderLayout } from './layout.ts';
import { flattenObject } from './utils.ts';

export async function getPage(path: string) {
  // Check if the folder exists
  const exists = await Deno.stat(path)
    .then(() => true)
    .catch(() => false);

  if (exists === false) return null;

  // Get model
  const model = await import(path + 'model.ts').catch(() => ({}));

  const data =
    (typeof model?.default === 'function'
      ? await model.default()
      : model.default) || {};

  // Get script
  const __script = await Deno.readTextFile(path + 'script.js').catch(
    () => null
  );

  // Get styles
  const __style = await Deno.readTextFile(path + 'style.css').catch(() => null);

  // Get content
  let markdown = await Deno.readTextFile(path + 'content.md').catch(() => null);

  // Replace variables in markdown
  Object.entries(flattenObject(data)).forEach(([key, value]) => {
    if (markdown) {
      markdown = markdown.replace(new RegExp(`@{${key}}`, 'g'), value as any);
    }
  });

  // Get layout
  const layout = await Deno.readTextFile(path + 'layout.ejs').catch(() => null);

  // Add the page to the index
  const slug = path.replace(PAGES_PATH, '');

  const props = { ...data, meta: { slug, ...data?.meta } };

  const html = await renderLayout(
    layout,
    { __script, __style, ...props },
    markdown ?? ''
  );

  return { html, ...props };
}
