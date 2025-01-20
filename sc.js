import fs from 'fs';
import path from 'path';

// Fungsi untuk generate nonce sederhana
function generateNonce() {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

function generateHtml() {
  // Generate nonce untuk setiap elemen
  const nonce = generateNonce();

  // CSP yang diperbaiki dengan strict-dynamic
  const cspContent = [
    `style-src 'self' 'unsafe-inline' 'nonce-${nonce}' https://4211421036.github.io`,
    "object-src 'none'",
    "base-uri 'self'",
    "img-src 'self' data: https://4211421036.github.io",
    "default-src 'self' https://4211421036.github.io",
    `script-src 'self' 'unsafe-inline' 'unsafe-eval' 'nonce-${nonce}' 'strict-dynamic' https://4211421036.github.io`,
    "font-src 'self' https://4211421036.github.io",
    "media-src 'self' https://4211421036.github.io",
    "connect-src 'self' https://4211421036.github.io",
    "form-action 'self'",
    "manifest-src 'self' https://4211421036.github.io",
    "worker-src 'self' blob: https://4211421036.github.io"
  ].join('; ');

  const htmlContent = `<!DOCTYPE html>
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
      <meta property="og:audio" content="https://4211421036.github.io/hbd/hbd.mp3" />
      <meta property="og:locale" content="id" />
      <meta name="twitter:image" content="https://4211421036.github.io/hbd/hbd.jpg">
      <meta property="og:image:alt" content="HBD" />
      <meta property="og:audio:secure_url" content="https://4211421036.github.io/hbd/hbd.mp3" />
      <meta property="og:type" content="website" />
      <meta property="og:audio:type" content="audio/mpeg" />
      <meta http-equiv="Content-Security-Policy" content="${cspContent}">
      <title>Selamat Ulang Tahun!</title>
      <style nonce="${nonce}">
        body {
          margin: 0;
          overflow: hidden;
        }
      </style>
    </head>
    <body>
      <script nonce="${nonce}">
        console.log('Script berjalan dengan nonce: ${nonce}');
      </script>
      
      <script nonce="${nonce}" src="p5.js"></script>
      <script nonce="${nonce}" src="main.js"></script>
      <script nonce="${nonce}" src="firework.js"></script>
    </body>
  </html>`;

  // Tentukan path untuk file HTML yang akan dihasilkan
  const outputPath = path.join(process.cwd(), 'index.html');

  // Simpan HTML ke file
  fs.writeFileSync(outputPath, htmlContent);
  console.log('File HTML telah dibuat di:', outputPath);
}

// Generate HTML
generateHtml();
