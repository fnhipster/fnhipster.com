export const PORT = Number(Deno.env.get('PORT')) || 8080;
export const PUBLIC_PATH = Deno.cwd() + '/public';
export const POSTS_PATH = Deno.cwd() + '/posts';
export const TEMPLATES_PATH = Deno.cwd() + '/templates';
export const BUILD_PATH = Deno.cwd() + '/.mdly';

export interface Meta {
  title: string;
  date: Date;
  published: boolean;
  description: string;
}
