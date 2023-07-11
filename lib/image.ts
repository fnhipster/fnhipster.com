import { exists, ensureDir } from 'https://deno.land/std@0.78.0/fs/mod.ts';
import { resize } from 'https://deno.land/x/deno_image@0.0.4/mod.ts';
import { PAGES_PATH, BUILD_PATH } from './config.ts';

export function getResizedImageURL(
  path: string,
  options: {
    width?: number;
    height?: number;
  }
) {
  const { width, height } = options;

  // skip if width is not defined
  if (!width) return path;

  const filename = path.split('/').pop() as string;
  const extension = filename.split('.').pop() as string;

  return path.replace(
    extension,
    `${width}${height ? 'x' + height : ''}.${extension}`
  );
}

export async function processImage(
  filepath: string,
  options: {
    width?: number;
    height?: number;
  }
) {
  const { width, height } = options;

  const origin = `${PAGES_PATH}${filepath}`;

  const destination = `${BUILD_PATH}/public${getResizedImageURL(filepath, {
    width,
    height,
  })}`;

  // skip if origin doesn't exist
  if (!(await exists(origin))) return;

  // skip if destination already exists
  if (await exists(destination)) return;

  const filename = filepath.match(/\/([^\/]+)$/)?.[1];

  if (!filename) throw new Error('Filename not found');

  // ensure dist directory
  await ensureDir(destination.replace(/\/([^\/]+)$/, ''));

  // get the original image
  const image = await Deno.readFile(origin);

  // resize image
  const resized = await resize(image, { width, height, aspectRatio: !height });

  // write the processed images
  await Deno.writeFile(destination, resized);
}
