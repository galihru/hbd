import fs from 'fs';
import path from 'path';

// Fungsi untuk menghasilkan nonce acak
function generateNonce() {
  return Math.random().toString(36).substring(2, 15);
}

// Fungsi untuk membuat HTML dengan nonce dinamis
function generateHtml() {
  const nonce = generateNonce(); // Menghasilkan nonce baru setiap kali fungsi ini dipanggil

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
        <meta id="csp-meta" http-equiv="Content-Security-Policy" content="script-src 'self' 'nonce-${nonce}';">
        <title>Selamat Ulang Tahun!</title>
      </head>
      <body>
        <style>
          body {
            margin: 0;
            overflow: hidden;
          }
        </style>

        <!-- Script Dinamis untuk Mengupdate Nonce -->
        <script id="dynamic-script" nonce="${nonce}">
          console.log('Skrip ini dijalankan dengan nonce:', '${nonce}');
        </script>

        <script src="p5.js" nonce="${nonce}"></script>
        <script src="main.js" nonce="${nonce}"></script>
        <script src="firework.js" nonce="${nonce}"></script>

        <!-- Mengupdate Nonce dan CSP setiap detik -->
        <script>
          function generateNonce() {
            return Math.random().toString(36).substring(2, 15);
          }

          function updateNonce() {
            const nonce = generateNonce();  // Membuat nonce baru setiap detik
            const scriptTag = document.getElementById('dynamic-script');
            const cspMetaTag = document.getElementById('csp-meta');

            // Mengubah atribut CSP dengan nonce baru
            cspMetaTag.setAttribute('content', \`script-src 'self' 'nonce-\${nonce}';\`);

            // Update tag <script> dengan nonce baru
            scriptTag.setAttribute('nonce', nonce);

            // Update isi script jika diperlukan
            scriptTag.innerHTML = \`
              console.log('Skrip ini dijalankan dengan nonce:', '\${nonce}');
            \`;
          }

          // Perbarui nonce setiap detik
          setInterval(updateNonce, 1000);
        </script>
      </body>
    </html>
  `;

  // Tentukan lokasi file yang akan dihasilkan
  const outputPath = path.join(process.cwd(), 'index.html');  // Menggunakan cwd untuk direktori saat ini

  // Simpan HTML ke file
  fs.writeFileSync(outputPath, htmlContent);
  console.log('Halaman HTML dengan nonce dinamis telah dibuat di:', outputPath);
}

// Jalankan fungsi untuk menghasilkan HTML pertama kali
generateHtml();

// Mengupdate halaman setiap detik
setInterval(generateHtml, 1000);
