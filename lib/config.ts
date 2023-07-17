import { resolve } from 'https://deno.land/std@0.194.0/path/mod.ts';

export const PORT = Number(Deno.env.get('PORT')) || 8080;
export const PAGES_PATH = resolve('./pages');
export const BUILD_PATH = resolve('./cache');

console.log({ PAGES_PATH });

export interface Meta {
  slug: string;
  title: string;
  date: Date;
  description: string;
}
