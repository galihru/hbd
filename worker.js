export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const githubBaseUrl = 'https://4211421036.github.io/hbd/';

    // Validasi metode request
    if (!['GET', 'HEAD'].includes(request.method)) {
      return new Response('Method not allowed', { 
        status: 405,
        headers: {
          'Allow': 'GET, HEAD',
          'X-Content-Type-Options': 'nosniff'
        }
      });
    }

    // Arahkan permintaan ke GitHub Pages
    const githubUrl = new URL(url.pathname, githubBaseUrl);
    const nonce = crypto.randomUUID();

    try {
      // Fetch dari GitHub dengan timeout
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(githubUrl.toString(), {
        method: request.method,
        signal: controller.signal
      }).finally(() => clearTimeout(timeout));

      // Header keamanan untuk semua respons
      const securityHeaders = {
        'Content-Security-Policy': `
          default-src 'self';
          script-src 'self' 'nonce-${nonce}' https://cdnjs.cloudflare.com ${githubBaseUrl};
          style-src 'self' https://cdnjs.cloudflare.com ${githubBaseUrl};
          img-src 'self' data: ${githubBaseUrl};
          font-src 'self' https://cdnjs.cloudflare.com;
          connect-src 'self';
          frame-ancestors 'none';
          form-action 'self';
          base-uri 'self';
          upgrade-insecure-requests;
        `.replace(/\s+/g, ' ').trim(),
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'no-referrer',
        'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Embedder-Policy': 'require-corp',
        'Cross-Origin-Resource-Policy': 'same-origin',
        'X-Permitted-Cross-Domain-Policies': 'none'
      };

      // Jika respons adalah HTML, tambahkan keamanan tambahan
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('text/html')) {
        let html = await response.text();

        // Amankan HTML
        html = '<!DOCTYPE html>\n' + html
          .replace(/<head>/i, `<head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta name="description" content="Mental Health support and resources">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="robots" content="noindex, nofollow">`)
          .replace(/<script\b/g, `<script nonce="${nonce}"`)
          .replace(/<a\b/g, '<a rel="noopener noreferrer"')
          .replace(/on\w+="[^"]*"/g, ''); // Hapus event handler inline

        return new Response(html, {
          headers: new Headers(securityHeaders),
          status: response.status,
          statusText: response.statusText
        });
      }

      // Tangani respons non-HTML
      const headers = new Headers(securityHeaders);

      // Set cache header berdasarkan ekstensi file
      const fileExtension = url.pathname.split('.').pop()?.toLowerCase();
      if (/^(js|css|png|jpg|jpeg|gif|ico|svg|woff2?|ttf|eot)$/.test(fileExtension)) {
        headers.set('Cache-Control', 'public, max-age=31536000, immutable');
      } else {
        headers.set('Cache-Control', 'no-store, must-revalidate');
      }

      // Salin header respons asli yang aman
      ['content-type', 'content-length', 'last-modified', 'etag'].forEach(header => {
        if (response.headers.has(header)) {
          headers.set(header, response.headers.get(header));
        }
      });

      return new Response(response.body, {
        headers,
        status: response.status,
        statusText: response.statusText
      });

    } catch (err) {
      console.error('Worker error:', err);
      let errorMessage = 'Service temporarily unavailable';
      let statusCode = 503;

      if (err.name === 'AbortError') {
        errorMessage = 'Request timed out';
        statusCode = 504;
      } else if (err.name === 'TypeError') {
        errorMessage = 'Invalid request';
        statusCode = 400;
      }

      return new Response(errorMessage, { 
        status: statusCode,
        headers: {
          'Content-Type': 'text/plain',
          'X-Content-Type-Options': 'nosniff',
          'Retry-After': '300'
        }
      });
    }
  }
};
