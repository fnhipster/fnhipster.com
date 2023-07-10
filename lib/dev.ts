import { serve } from 'https://deno.land/std@0.193.0/http/server.ts';
import { serveDir } from 'https://deno.land/std@0.193.0/http/file_server.ts';
import { getPagesIndex } from './index.ts';
import { PORT, PAGES_PATH } from './config.ts';
import { reset } from 'https://deno.land/std@0.193.0/fmt/colors.ts';

// Initial Index
let index = await getPagesIndex();

// Watch for changes in Pages
setTimeout(async () => {
  let timeout: number | undefined;

  function debounce(fn: () => void, delay: number) {
    clearTimeout(timeout);
    timeout = setTimeout(fn, delay);
  }

  const watcher = Deno.watchFs(PAGES_PATH, { recursive: true });

  for await (const _event of watcher) {
    debounce(async () => {
      // Re-index Pages
      index = await getPagesIndex();
      console.log('🔄 Pages re-indexed');
    }, 500);
  }
}, 0);

async function handler(request: Request): Promise<Response> {
  const url = new URL(request.url);

  // Redirect to trailing slash
  if (
    !/\.[a-zA-Z0-9]{1,4}$/.test(url.pathname) &&
    !url.pathname.endsWith('/')
  ) {
    url.pathname += '/';

    // redirect to trailing slash
    return new Response(null, {
      status: 301,
      headers: {
        location: url.toString(),
      },
    });
  }

  try {
    const { pathname } = url;

    const slug = pathname.replace(/\/$/, '');

    const page = index.find((page) => page.meta.slug === slug);

    // Return static assets
    if (/(.*\/assets\/.*)/.test(pathname)) {
      return await serveDir(request, { fsRoot: PAGES_PATH });
    }

    // Not found
    if (!page) {
      throw new Deno.errors.NotFound();
    }

    serverLog(request, 200);

    return new Response(page.html, {
      headers: { 'content-type': 'text/html; charset=utf-8' },
    });
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      serverLog(request, 404);

      return new Response('404', {
        status: 404,
      });
    }

    serverLog(request, 500);

    return new Response(error.message, {
      status: 500,
    });
  }
}

await serve(handler, { port: PORT });

function serverLog(req: Request, status: number) {
  const d = new Date().toISOString();
  const dateFmt = `[${d.slice(0, 10)} ${d.slice(11, 19)}]`;
  const url = new URL(req.url);
  const s = `${dateFmt} [${req.method}] ${url.pathname}${url.search} ${status}`;
  // using console.debug instead of console.log so chrome inspect users can hide request logs
  console.debug(s);
}
