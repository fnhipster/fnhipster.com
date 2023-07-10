import { exists } from 'https://deno.land/std@0.78.0/fs/mod.ts';
import { PAGES_PATH } from './config.ts';
import { renderTemplate } from './template.ts';
import { flattenObject } from './utils.ts';

export async function getPage(path: string) {
  // Check if the folder exists
  if ((await exists(path)) === false) return null;

  // Get model
  const model = await import(path + '/model.ts').catch(() => ({}));

  const data =
    (typeof model?.default === 'function'
      ? await model.default()
      : model.default) || {};

  // Get script
  const __script = await Deno.readTextFile(path + '/script.js').catch(
    () => null
  );

  const __clientjs = await Deno.readTextFile('./lib/client.js').catch(
    () => null
  );

  // Get styles
  const __style = await Deno.readTextFile(path + '/style.css').catch(
    () => null
  );

  // Get content
  const _markdown = await Deno.readTextFile(path + '/content.md').catch(
    () => null
  );

  // Replace variables in markdown
  const markdown = await Object.entries(flattenObject(data)).reduce(
    async (acc, [key, value]) => {
      const text = await acc;

      return text.replace(
        new RegExp(`@{${key}}`, 'g'),
        `<span data-binding="${key}">${
          typeof value === 'function' ? await value() : value
        }</span>`
      );
    },
    Promise.resolve(_markdown || '')
  );

  // Get template
  const template = await Deno.readTextFile(path + '/template.ejs').catch(
    () => null
  );

  // Prepare properties
  const slug = path.replace(PAGES_PATH, '');

  const props = {
    ...data,
    meta: {
      slug: slug === '/index' ? '/' : slug,
      ...data?.meta,
    },
  };

  const html = await renderTemplate(
    template,
    { __script, __clientjs, __style, ...props },
    markdown ? markdown : ''
  );

  return { html, ...props };
}
