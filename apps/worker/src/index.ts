interface Env {
  API_BASE: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    
    // Only handle GET requests for products
    if (url.pathname === '/products' && request.method === 'GET') {
      return handleProductsRequest(request, env);
    }
    
    // Health check endpoint
    if (url.pathname === '/health' && request.method === 'GET') {
      return new Response(JSON.stringify({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        worker: 'microsaas-products-cache'
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response('Not Found', { status: 404 });
  }
} satisfies ExportedHandler;

async function handleProductsRequest(request: Request, env: Env): Promise<Response> {
  const cache = caches.default;
  const cacheKey = new Request(request.url, request);
  
  // Try to get from cache first
  const cached = await cache.match(cacheKey);
  if (cached) {
    // Add cache hit header
    const response = new Response(cached.body, cached);
    response.headers.set('X-Cache', 'HIT');
    response.headers.set('X-Cache-Timestamp', cached.headers.get('X-Cache-Timestamp') || '');
    return response;
  }

  try {
    // Fetch from upstream API
    const upstreamResponse = await fetch(`${env.API_BASE}/products`, {
      headers: {
        'User-Agent': 'MicroSaaS-Worker/1.0',
        'Accept': 'application/json',
      }
    });

    if (!upstreamResponse.ok) {
      return new Response('Upstream Error', { 
        status: upstreamResponse.status,
        headers: { 'X-Cache': 'MISS' }
      });
    }

    // Clone the response to cache it
    const responseToCache = upstreamResponse.clone();
    
    // Add cache headers
    const response = new Response(upstreamResponse.body, {
      status: upstreamResponse.status,
      statusText: upstreamResponse.statusText,
      headers: {
        ...Object.fromEntries(upstreamResponse.headers.entries()),
        'Cache-Control': 'public, max-age=300, s-maxage=600', // 5 min browser, 10 min CDN
        'X-Cache': 'MISS',
        'X-Cache-Timestamp': new Date().toISOString(),
        'X-Worker': 'microsaas-products-cache',
      }
    });

    // Cache the response (don't await to avoid blocking)
    cache.put(cacheKey, responseToCache).catch(error => {
      console.error('Cache put error:', error);
    });

    return response;
  } catch (error) {
    console.error('Upstream fetch error:', error);
    return new Response('Internal Server Error', { 
      status: 500,
      headers: { 'X-Cache': 'MISS' }
    });
  }
}