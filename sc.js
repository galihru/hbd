const fs = require('fs');
const path = require('path');

// Fungsi untuk menghasilkan nonce acak
function generateNonce() {
  return Math.random().toString(36).substring(2, 15);
}

// Fungsi untuk membuat HTML dengan nonce
function generateHtml() {
  const nonce = generateNonce();

  // HTML dengan CSP dan nonce dinamis
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="Content-Security-Policy" content="script-src 'self' 'nonce-${nonce}';">
      <title>Selamat Ulang Tahun!</title>
      <meta name="description" content="Selamat Ulang Tahun!">
      <meta name="keywords" content="Selamat Ulang Tahun!">
      <meta name="author" content="GALIH RIDHO UTOMO">
      <meta name="robots" content="index, follow">
      <meta property="og:title" content="Selamat Ulang Tahun!">
      <meta property="og:description" content="Selamat Ulang Tahun!">
      <meta property="og:type" content="website">
      <meta property="og:url" content="https://4211421036.github.io/hbd/">
      <meta property="og:image" content="https://4211421036.github.io/hbd/hbd.jpg">
      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:title" content="Selamat Ulang Tahun!">
      <meta name="twitter:description" content="Selamat Ulang Tahun!">
      <meta name="twitter:image" content="https://4211421036.github.io/hbd/hbd.jpg">
      <link rel="icon" href="https://4211421036.github.io/g4lihru/987654567.png" type="image/x-icon">
    </head>
    <body>
      <style>
        body {
          margin: 0;
          overflow: hidden;
        }
      </style>
      <script nonce="${nonce}">
        // Skrip ini hanya dijalankan jika nonce sesuai dengan yang ada di CSP
        console.log('Skrip ini dijalankan dengan nonce:', '${nonce}');
      </script>
      <script src="p5.js" nonce="${nonce}"></script>
      <script src="main.js" nonce="${nonce}"></script>
      <script src="firework.js" nonce="${nonce}"></script>
    </body>
    </html>
  `;

  // Tentukan lokasi file yang akan dihasilkan
  const outputPath = path.join(__dirname, 'docs', 'index.html');

  // Pastikan folder docs ada
  if (!fs.existsSync(path.dirname(outputPath))) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  }

  // Simpan HTML ke file
  fs.writeFileSync(outputPath, htmlContent);
  console.log('Halaman HTML dengan nonce dinamis telah dibuat di:', outputPath);
}

// Jalankan fungsi untuk menghasilkan HTML
generateHtml();
