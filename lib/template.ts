import {
  renderFile as renderEJSFile,
  render as renderEJS,
} from 'https://esm.sh/v128/ejs@3.1.9';
import { marked } from 'https://deno.land/x/marked@1.0.1/mod.ts';
import { markedHighlight } from 'https://esm.sh/marked-highlight@2.0.1';
import hljs from 'https://esm.sh/highlight.js@11.8.0';
import { PAGES_PATH } from './config.ts';

// Marked Extensions
marked.use(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code: string, lang: string) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    },
  })
);

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
