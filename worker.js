// Worker proxy: fundacao.brunotropolis.com.br -> GitHub Pages (brunotropolis.github.io/fundacao-davi)
const ORIGIN = "https://brunotropolis.github.io/fundacao-davi";
export default {
  async fetch(request) {
    const url = new URL(request.url);
    let path = url.pathname;
    if (path.endsWith("/")) path += "index.html";
    const res = await fetch(ORIGIN + path, { cf: { cacheTtl: 60, cacheEverything: true } });
    const out = new Response(res.body, res);
    out.headers.set("Cache-Control", "public, max-age=60");
    out.headers.set("X-Robots-Tag", "noindex");
    return out;
  }
};
