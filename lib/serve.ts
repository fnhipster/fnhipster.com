import { serve } from 'https://deno.land/std@0.193.0/http/server.ts';
import { serveDir } from 'https://deno.land/std@0.193.0/http/file_server.ts';
import { getPost } from './post.ts';
import { PORT, BUILD_PATH, PUBLIC_PATH, POSTS_PATH } from './config.ts';

async function handler(request: Request): Promise<Response> {
  const pathname = new URL(request.url).pathname;

  try {
    // Serve build folder if in production
    if (Deno.env.get('PRODUCTION')) {
      return serveDir(request, {
        fsRoot: BUILD_PATH + '/public',
      });
    }

    // Serve from source  if in development

    try {
      await Deno.stat(PUBLIC_PATH + pathname);

      return serveDir(request, {
        fsRoot: PUBLIC_PATH,
      });
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        const post = await getPost(POSTS_PATH + pathname.replace(/\/?$/, '/')); // add trailing slash

        // Return 404 if post is not found
        if (!post) {
          throw new Deno.errors.NotFound();
        }

        // Return the post
        const { html } = post;

        return new Response(html, {
          headers: { 'content-type': 'text/html; charset=utf-8' },
        });
      }

      throw error;
    }
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      return new Response('404', {
        status: 404,
      });
    }

    return new Response('500', {
      status: 500,
    });
  }
}

await serve(handler, { port: PORT });
