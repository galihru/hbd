import fs from 'fs';
import path from 'path';

// Fungsi untuk generate hash sederhana
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

// Fungsi untuk generate nonce sederhana tanpa crypto
function generateNonce() {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

function generateHtml() {
  // Generate nonce untuk setiap elemen
  const styleNonce = generateNonce();
  const scriptNonce1 = generateNonce();
  const scriptNonce2 = generateNonce();
  const scriptNonce3 = generateNonce();
  const scriptNonce4 = generateNonce();

  // CSP yang lebih sederhana
  const cspContent = [
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "object-src 'none'",
    "base-uri 'self'",
    "img-src 'self' https://4211421036.github.io"
  ].join('; ');

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="description" content="Selamat Ulang Tahun!">
        <meta name="keywords" content="Selamat Ulang Tahun!">
        <meta name="author" content="GALIH RIDHO UTOMO">
        <meta name="robots" content="index, follow">
        <meta property="og:title" content="Selamat Ulang Tahun!">
        <meta property="og:description" content="Selamat Ulang Tahun!">
        <meta property="og:type" content="website">
        <meta property="og:url" content="https://4211421036.github.io/hbd">
        <meta property="og:image" content="https://4211421036.github.io/hbd/hbd.jpg">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="Selamat Ulang Tahun!">
        <meta name="twitter:description" content="Selamat Ulang Tahun!">
        <meta name="twitter:image" content="https://4211421036.github.io/hbd/hbd.jpg">
        <meta http-equiv="Content-Security-Policy" content="${cspContent}">
        <title>Selamat Ulang Tahun!</title>
        
        <style>
          body {
            margin: 0;
            overflow: hidden;
          }
        </style>
      </head>
      <body>
        <script>
          console.log('Script berjalan dengan hash: ' + '${simpleHash("Script berjalan")}');
        </script>
        
        <script src="p5.js"></script>
        <script src="main.js"></script>
        <script src="firework.js"></script>

        <script>
          function generateSimpleNonce() {
            return Math.random().toString(36).substring(2, 15) + 
                   Math.random().toString(36).substring(2, 15);
          }

          function updateNonces() {
            const newNonce = generateSimpleNonce();
            
            // Update semua script dan style tags
            document.querySelectorAll('script, style').forEach(function(el) {
              el.setAttribute('nonce', newNonce);
            });

            // Update CSP meta tag
            const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
            if (cspMeta) {
              let content = cspMeta.getAttribute('content');
              content = content.replace(/(nonce-[a-zA-Z0-9+/=]+)/g, 'nonce-' + newNonce);
              cspMeta.setAttribute('content', content);
            }
          }

          // Update nonces setiap 5 detik
          setInterval(updateNonces, 5000);
        </script>
      </body>
    </html>
  `;

  const outputPath = path.join(process.cwd(), 'index.html');
  fs.writeFileSync(outputPath, htmlContent);
  console.log('File HTML telah dibuat di:', outputPath);
}

// Generate HTML
generateHtml();
