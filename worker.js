export default {
  async fetch(request) {
    const url = new URL(request.url);
    const githubBaseUrl = 'https://4211421036.github.io/hbd/';

    // Redirect HTTP ke HTTPS
    if (url.protocol === 'http:') {
      return Response.redirect(`https://${url.host}${url.pathname}`, 301);
    }

    const nonce = crypto.randomUUID();
    const githubUrl = new URL(url.pathname, githubBaseUrl);

    try {
      const response = await fetch(githubUrl);
      const headers = new Headers(response.headers);

      // Header keamanan untuk semua respons
      const securityHeaders = {
        'Content-Security-Policy': `
          default-src 'self';
          script-src 'self' 'nonce-${nonce}' https://cdnjs.cloudflare.com;
          style-src 'self' https://cdnjs.cloudflare.com;
          img-src 'self' data:;
          font-src 'self' https://cdnjs.cloudflare.com;
          frame-ancestors 'none';
          form-action 'self';
          base-uri 'self';
        `.replace(/\n/g, ' '),
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'no-referrer',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
        'Cross-Origin-Opener-Policy': 'same-origin'
      };

      Object.entries(securityHeaders).forEach(([key, value]) => {
        headers.set(key, value);
      });

      // Atur cache header
      const fileExtension = url.pathname.split('.').pop()?.toLowerCase();
      if (/^(js|css|png|jpg|jpeg|gif|ico|svg|woff2?|ttf|eot)$/.test(fileExtension)) {
        headers.set('Cache-Control', 'public, max-age=31536000, immutable');
      } else {
        headers.set('Cache-Control', 'no-store, must-revalidate');
      }

      return new Response(response.body, {
        headers,
        status: response.status
      });

    } catch (error) {
      return new Response('Error', { status: 500 });
    }
  }
};
