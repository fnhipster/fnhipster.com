import { serve } from 'https://deno.land/std@0.193.0/http/server.ts';
import { serveDir } from 'https://deno.land/std@0.193.0/http/file_server.ts';
import { BUILD_PATH, PORT } from './config.ts';

async function handler(request: Request): Promise<Response> {
  return await serveDir(request, {
    fsRoot: BUILD_PATH + '/public',
  });
}

await serve(handler, { port: PORT });
