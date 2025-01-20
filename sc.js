import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// Fungsi untuk menghasilkan nonce yang lebih aman menggunakan crypto
function generateNonce() {
  return crypto.randomBytes(16).toString('base64');
}

// Fungsi untuk membuat HTML dengan CSP yang ditingkatkan
function generateHtml() {
  const nonce = generateNonce();
  
  // Definisi CSP yang lebih ketat dan lengkap
  const cspDirectives = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'unsafe-inline'`, // Menambahkan unsafe-inline untuk kompatibilitas
    "object-src 'none'", // Mengatasi masalah object-src
    "base-uri 'self'", // Mengatasi masalah base-uri
    "img-src 'self' https://4211421036.github.io",
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self'",
    "frame-src 'none'",
    "media-src 'self'",
    "connect-src 'self'"
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
        <!-- CSP dipindahkan ke HTTP header, ini hanya sebagai fallback -->
        <meta id="csp-meta" http-equiv="Content-Security-Policy" content="${cspDirectives}">
        <title>Selamat Ulang Tahun!</title>
      </head>
      <body>
        <style nonce="${nonce}">
          body {
            margin: 0;
            overflow: hidden;
          }
        </style>
        
        <script id="dynamic-script" nonce="${nonce}">
          console.log('Script dijalankan dengan nonce:', '${nonce}');
        </script>
        
        <script src="p5.js" nonce="${nonce}"></script>
        <script src="main.js" nonce="${nonce}"></script>
        <script src="firework.js" nonce="${nonce}"></script>
        
        <!-- Script untuk update nonce -->
        <script nonce="${nonce}">
          function updateNonce() {
            const nonce = crypto.randomBytes(16).toString('base64');
            const scriptTags = document.querySelectorAll('script[nonce]');
            const styleTags = document.querySelectorAll('style[nonce]');
            const cspMetaTag = document.getElementById('csp-meta');
            
            // Update CSP
            const newCsp = ${JSON.stringify(cspDirectives)}.replace(/nonce-[a-zA-Z0-9+/=]+/, 'nonce-' + nonce);
            cspMetaTag.setAttribute('content', newCsp);
            
            // Update nonce pada semua script dan style tags
            [...scriptTags, ...styleTags].forEach(tag => {
              tag.setAttribute('nonce', nonce);
            });
          }
          
          // Update nonce setiap 5 detik untuk mengurangi beban server
          setInterval(updateNonce, 5000);
        </script>
      </body>
    </html>
  `;

  // Simpan HTML ke file
  const outputPath = path.join(process.cwd(), 'index.html');
  fs.writeFileSync(outputPath, htmlContent);
  console.log('Halaman HTML dengan CSP yang ditingkatkan telah dibuat di:', outputPath);
  
  // Tampilkan instruksi untuk konfigurasi server
  console.log('\nPenting: Untuk keamanan optimal, tambahkan header CSP berikut di server Anda:');
  console.log(`Content-Security-Policy: ${cspDirectives}`);
}

// Jalankan fungsi untuk menghasilkan HTML
generateHtml();
