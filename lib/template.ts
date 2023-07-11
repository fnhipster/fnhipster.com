import {
  renderFile as renderEJSFile,
  render as renderEJS,
} from 'https://esm.sh/v128/ejs@3.1.9';
import { marked } from 'https://cdn.jsdelivr.net/npm/marked@5.1.1/+esm';
import { markedHighlight } from 'https://cdn.jsdelivr.net/npm/marked-highlight@2.0.1/+esm';
import { markedXhtml } from 'https://cdn.jsdelivr.net/npm/marked-xhtml@1.0.1/+esm';
import hljs from 'https://cdn.jsdelivr.net/npm/highlight.js@11.8.0/+esm';
import { PAGES_PATH } from './config.ts';
import { getResizedImageURL, processImage } from './image.ts';

// Marked Extensions
marked.use(markedXhtml());

marked.use(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code: string, lang: string) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    },
  })
);

// Markdown Renderer Overrides
marked.use({
  renderer: {
    image(href: string, _title: string, _text: string) {
      const alt = _text || '';
      const title = _title || '';
      const url = new URL(href, import.meta.url);
      const width = Number(url.searchParams.get('width')) || undefined;
      const height = Number(url.searchParams.get('height')) || undefined;

      if (!href.startsWith('/') || !width) {
        return `<img src="${href}" alt="${alt}" title="${title}" />`;
      }

      const src = getResizedImageURL(url.pathname, {
        width: width,
        height: height,
      });

      processImage(url.pathname, {
        width: width,
        height: height,
      });

      return `<img src="${src}" alt="${alt}" title="${title}" width="${width}" height="${
        height || ''
      }" />`;
    },
  },
});

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
    ? await marked.parse(
        markdown,
        {
          headerIds: false,
          mangle: false,
        },
        undefined
      )
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
