import fs from 'fs';
import path from 'path';

// Fungsi untuk menghasilkan nonce acak
function generateNonce() {
  return Math.random().toString(36).substring(2, 15);
}

// Fungsi untuk membuat HTML dengan nonce
function generateHtml() {
  const nonce = generateNonce();

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="Content-Security-Policy" content="script-src 'self' 'nonce-${nonce}';">
      <title>Selamat Ulang Tahun!</title>
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
  const outputPath = path.join(process.cwd(), 'index.html');  // Menggunakan cwd untuk direktori saat ini

  // Simpan HTML ke file
  fs.writeFileSync(outputPath, htmlContent);
  console.log('Halaman HTML dengan nonce dinamis telah dibuat di:', outputPath);
}

// Jalankan fungsi untuk menghasilkan HTML
generateHtml();
