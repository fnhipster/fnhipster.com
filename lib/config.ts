export const PORT = Number(Deno.env.get('PORT')) || 8080;
export const PAGES_PATH = Deno.cwd() + '/pages';
export const BUILD_PATH = Deno.cwd() + '/cache';

console.log({ PAGES_PATH, BUILD_PATH });

export interface Meta {
  slug: string;
  title: string;
  date: Date;
  description: string;
}
