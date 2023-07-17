export const PORT = Number(Deno.env.get('PORT')) || 8080;
export const PAGES_PATH = Deno.cwd() + '/pages';
export const BUILD_PATH = Deno.cwd() + '/cache';

for await (const post of Deno.readDir('.')) {
  console.log('📁', post.name);
}

export interface Meta {
  slug: string;
  title: string;
  date: Date;
  description: string;
}
