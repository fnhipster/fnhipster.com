export const PORT = Number(Deno.env.get('PORT')) || 8080;
export const PAGES_PATH = Deno.cwd().replace('/src', '') + '/pages';
export const BUILD_PATH = Deno.cwd().replace('/src', '') + '/cache';

export interface Meta {
  slug: string;
  title: string;
  date: Date;
  description: string;
}
