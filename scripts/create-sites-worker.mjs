import { cp, mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const worker = `const ASSET_EXTENSIONS = /\\.[a-zA-Z0-9]{2,8}$/;
const INDEX_CANDIDATES = ['/index.html', '/public/index.html', '/client/index.html'];

async function fetchAsset(env, request) {
  return env.ASSETS.fetch(request);
}

async function fetchFirstAvailable(env, request, paths) {
  const originalUrl = new URL(request.url);
  let latestResponse = null;

  for (const path of paths) {
    const candidateUrl = new URL(path, originalUrl);
    latestResponse = await fetchAsset(env, new Request(candidateUrl, request));
    if (latestResponse.status !== 404) {
      return latestResponse;
    }
  }

  return latestResponse ?? new Response('Not found', { status: 404 });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const wantsAsset = ASSET_EXTENSIONS.test(url.pathname);

    if (wantsAsset) {
      return fetchFirstAvailable(env, request, [
        url.pathname,
        \`/public\${url.pathname}\`,
        \`/client\${url.pathname}\`,
      ]);
    }

    return fetchFirstAvailable(env, request, INDEX_CANDIDATES);
  },
};
`

await mkdir('dist/server', { recursive: true })
await writeFile('dist/server/index.js', worker)

for (const staticRoot of ['public', 'client']) {
  const target = join('dist', staticRoot)
  await mkdir(target, { recursive: true })

  await Promise.all([
    cp('dist/index.html', join(target, 'index.html')),
    cp('dist/assets', join(target, 'assets'), { recursive: true }),
    cp('dist/favicon.svg', join(target, 'favicon.svg')).catch(() => undefined),
    cp('dist/icons.svg', join(target, 'icons.svg')).catch(() => undefined),
  ])
}
