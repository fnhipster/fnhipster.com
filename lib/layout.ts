import {
  renderFile as renderEJSFile,
  render as renderEJS,
} from 'https://esm.sh/ejs@3.1.9';
import { marked } from 'https://esm.sh/marked@5.1.1';
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

export async function renderLayout(
  layout: string | null,
  data: Record<string, unknown>,
  markdown?: string
) {
  const __html = markdown
    ? await marked.parse(markdown, {
        headerIds: false,
        mangle: false,
      })
    : null;

  return renderEJSFile(`${PAGES_PATH}/layout.ejs`, {
    ...data,
    __html: layout
      ? await renderEJS(layout, {
          ...data,
          __html,
        })
      : __html,
  });
}

// TODO: recursive layouts
