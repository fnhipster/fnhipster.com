import { walk } from 'https://deno.land/std@0.78.0/fs/walk.ts';
import { PAGES_PATH } from './config.ts';

export async function getPagesIndex() {
  const templates: Record<string, string> = {};
  const models: Record<string, string> = {};
  const contents: Record<string, string> = {};
  const scripts: Record<string, string> = {};
  const styles: Record<string, string> = {};
  const routes: string[] = [];

  for await (const entry of walk(PAGES_PATH, {
    includeFiles: true,
    includeDirs: true,
    skip: [/\/assets$/],
  })) {
    const key = entry.path
      .replace(PAGES_PATH, '')
      .replace(entry.isFile ? entry.name : '', '');

    if (entry.isFile && entry.name === 'template.ejs') {
      templates[key] = entry.path;
      continue;
    }

    if (entry.isFile && entry.name === 'script.js') {
      scripts[key] = entry.path;
      continue;
    }

    if (entry.isFile && entry.name === 'style.css') {
      styles[key] = entry.path;
      continue;
    }

    if (entry.isFile && entry.name === 'model.ts') {
      models[key] = entry.path;
      continue;
    }

    if (entry.isFile && entry.name === 'content.md') {
      contents[key] = entry.path;
      continue;
    }

    if (entry.isDirectory && key !== '') {
      routes.push(key + '/');
      continue;
    }

    continue;
  }

  return routes.map((route) => {
    // get model
    const model = models[route];

    // get content
    const content = contents[route];

    // get templates
    const _templates: string[] = [];
    const _scripts: string[] = [];
    const _styles: string[] = [];

    const _routes: string[] = [];

    route.split('/').forEach((r) => {
      _routes.push(r);

      const t = templates[_routes.join('/') + '/' || '/'];
      const s = scripts[_routes.join('/') + '/' || '/'];
      const c = styles[_routes.join('/') + '/' || '/'];

      if (t) _templates.push(t);
      if (s) _scripts.push(s);
      if (c) _styles.push(c);
    });

    return {
      route: route === '/index/' ? '/' : route,
      model,
      content,
      templates: _templates,
      scripts: _scripts,
      styles: _styles,
    };
  });
  // .sort((a, b) => {
  //   if (!a.meta.date || !b.meta.date) return 0;
  //   return new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime();
  // });
}
