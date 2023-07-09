import {
  renderFile as renderEJSFile,
  render as renderEJS,
} from 'https://esm.sh/ejs@3.1.9';
import { marked } from 'https://esm.sh/marked@5.1.1';
import { markedHighlight } from 'https://esm.sh/marked-highlight@2.0.1';
import hljs from 'https://esm.sh/highlight.js@11.8.0';
import { PAGES_PATH } from './config.ts';

// Check if app template exists
await Deno.open(`${PAGES_PATH}/template.ejs`).catch(() => {
  console.error(`😱 App template not found at "${PAGES_PATH}/template.ejs".`);
  Deno.exit(1);
});

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

export async function renderTemplate(
  template: string | null,
  data: Record<string, unknown>,
  markdown?: string
) {
  const __html = markdown
    ? await marked.parse(markdown, {
        headerIds: false,
        mangle: false,
      })
    : null;

  return renderEJSFile(`${PAGES_PATH}/template.ejs`, {
    ...data,
    __html: template
      ? await renderEJS(template, {
          ...data,
          __html,
        })
      : __html,
  });
}
