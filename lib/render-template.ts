import { renderFile as renderEJSFile } from 'https://esm.sh/ejs@3.1.9';
import { parse as parseMarkdown } from 'https://esm.sh/marked@5.1.1';
import { TEMPLATES_PATH } from './config.ts';

export async function renderTemplate(
  path: string,
  data: Record<string, unknown>,
  markdown?: string
) {
  return renderEJSFile(`${TEMPLATES_PATH}/app.ejs`, {
    ...data,
    __html: await renderEJSFile(`${TEMPLATES_PATH}/${path}.ejs`, {
      ...data,
      __html: markdown
        ? await parseMarkdown(markdown, {
            headerIds: false,
            mangle: false,
          })
        : null,
    }),
  });
}
