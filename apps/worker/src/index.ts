export default {
  async fetch(request: Request, env: any): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === '/products' && request.method === 'GET') {
      const cache = caches.default;
      const cached = await cache.match(request);
      if (cached) return cached;

      const upstream = await fetch(`${env.API_BASE}/products`);
      const res = new Response(upstream.body, upstream);
      res.headers.set('Cache-Control', 'public, max-age=60');
      await cache.put(request, res.clone());
      return res;
    }
    return new Response('Not Found', { status: 404 });
  }
} satisfies ExportedHandler;