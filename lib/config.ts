export const PORT = Number(Deno.env.get('PORT')) || 8080;
export const PAGES_PATH = '/pages';
export const BUILD_PATH = '/cache';

export interface Meta {
  slug: string;
  title: string;
  date: Date;
  description: string;
}
