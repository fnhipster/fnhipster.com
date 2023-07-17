export const PORT = Number(Deno.env.get('PORT')) || 8080;

export interface Meta {
  slug: string;
  title: string;
  date: Date;
  description: string;
}
