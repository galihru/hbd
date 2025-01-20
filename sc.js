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

// Fungsi untuk generate nonce
function generateNonce() {
  const timestamp = Date.now().toString();
  return simpleHash(timestamp + Math.random().toString());
}

function generateHtml() {
  // Generate nonce untuk setiap elemen
  const styleNonce = generateNonce();
  const scriptNonce1 = generateNonce();
  const scriptNonce2 = generateNonce();
  const scriptNonce3 = generateNonce();
  const scriptNonce4 = generateNonce();
  
  // Kumpulkan semua nonce untuk CSP
  const nonces = [styleNonce, scriptNonce1, scriptNonce2, scriptNonce3, scriptNonce4]
    .map(nonce => "'nonce-" + nonce + "'")
    .join(' ');

  // CSP yang lebih sederhana
  const cspContent = [
    "script-src 'self' " + nonces + " 'unsafe-inline'",
    "style-src 'self' 'nonce-" + styleNonce + "' 'unsafe-inline'",
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
        
        <style nonce="${styleNonce}">
          body {
            margin: 0;
            overflow: hidden;
          }
        </style>
      </head>
      <body>
        <script nonce="${scriptNonce1}">
          console.log('Script berjalan dengan hash: ' + '${simpleHash("Script berjalan")}');
        </script>
        
        <script src="p5.js" nonce="${scriptNonce2}"></script>
        <script src="main.js" nonce="${scriptNonce3}"></script>
        <script src="firework.js" nonce="${scriptNonce4}"></script>

        <script nonce="${scriptNonce1}">
          function updateNonces() {
            const timestamp = Date.now().toString();
            const newNonce = Math.abs(
              Array.from(timestamp + Math.random().toString())
                .reduce((hash, char) => {
                  return ((hash << 5) - hash) + char.charCodeAt(0);
                }, 0)
            ).toString(16);

            document.querySelectorAll('script[nonce], style[nonce]').forEach(function(el) {
              el.setAttribute('nonce', newNonce);
            });

            const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
            if (cspMeta) {
              const newCsp = cspMeta.getAttribute('content').replace(
                /nonce-[a-f0-9]+/g,
                'nonce-' + newNonce
              );
              cspMeta.setAttribute('content', newCsp);
            }
          }

          setInterval(updateNonces, 5000);
        </script>
      </body>
    </html>
  `;

  const outputPath = path.join(process.cwd(), 'index.html');
  fs.writeFileSync(outputPath, htmlContent);
  console.log('File HTML telah dibuat di:', outputPath);
  
  // Tampilkan hash untuk referensi
  console.log('\nHash yang digunakan:');
  console.log('Style hash:', simpleHash('body { margin: 0; overflow: hidden; }'));
  console.log('Script hash:', simpleHash('Script berjalan'));
}

// Generate HTML
generateHtml();
