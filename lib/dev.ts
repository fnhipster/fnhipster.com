import { serve } from 'https://deno.land/std@0.193.0/http/server.ts';
import { serveDir } from 'https://deno.land/std@0.193.0/http/file_server.ts';
import { getPagesIndex } from './index.ts';
import { PORT, PUBLIC_PATH } from './config.ts';

async function handler(request: Request): Promise<Response> {
  try {
    const index = await getPagesIndex();

    const pathname = new URL(request.url).pathname
      // add trailing slash
      .replace(/\/?$/, '/');

    const page = index.find((page) => page.meta.slug === pathname);

    if (!page) {
      return serveDir(request, {
        fsRoot: PUBLIC_PATH,
      });
    }

    return new Response(page.html, {
      headers: { 'content-type': 'text/html; charset=utf-8' },
    });
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      return new Response('404', {
        status: 404,
      });
    }

    return new Response(error.message, {
      status: 500,
    });
  }
}

await serve(handler, { port: PORT });
