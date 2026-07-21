import { mkdir, writeFile } from 'node:fs/promises'

const worker = `const ASSET_EXTENSIONS = /\\.[a-zA-Z0-9]{2,8}$/;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const wantsAsset = ASSET_EXTENSIONS.test(url.pathname);
    const assetRequest = wantsAsset ? request : new Request(new URL('/index.html', url), request);
    return env.ASSETS.fetch(assetRequest);
  },
};
`

await mkdir('dist/server', { recursive: true })
await writeFile('dist/server/index.js', worker)
