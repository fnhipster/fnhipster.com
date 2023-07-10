import {
  renderFile as renderEJSFile,
  render as renderEJS,
} from 'https://esm.sh/v128/ejs@3.1.9';

import { PAGES_PATH } from './config.ts';

// Check if app template exists
await Deno.open(`${PAGES_PATH}/template.ejs`).catch(() => {
  console.error(`😱 App template not found at "${PAGES_PATH}/template.ejs".`);
  Deno.exit(1);
});

export async function renderTemplate(
  template: string | null,
  data: Record<string, unknown>,
  markdown?: string
) {
  const __content = markdown
    ? await marked.parse(markdown, {
        headerIds: false,
        mangle: false,
      })
    : null;

  return renderEJSFile(`${PAGES_PATH}/template.ejs`, {
    ...data,
    __content: template
      ? await renderEJS(template, {
          ...data,
          __content,
        })
      : __content,
  });
}
