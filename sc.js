import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { minify } from 'html-minifier';

function generateHashedFile(filePath) {
  const hash = crypto.createHash('sha256');
  
  // Verifikasi apakah file ada sebelum dibaca
  if (!fs.existsSync(filePath)) {
    console.error(`File tidak ditemukan: ${filePath}`);
    return null; // Atau tangani error sesuai kebutuhan
  }

  const fileBuffer = fs.readFileSync(filePath);
  hash.update(fileBuffer);
  const fileHash = hash.digest('hex').slice(0, 8); // Ambil sebagian dari hash
  const extname = path.extname(filePath); // Mendapatkan ekstensi file (misalnya .js)
  const hashedFileName = `${fileHash}${extname}`;

  // Mengganti nama file asli dengan nama hash
  const hashedFilePath = path.join(path.dirname(filePath), hashedFileName);

  // Ganti nama file asli dengan nama hash
  fs.renameSync(filePath, hashedFilePath);

  return hashedFileName;
}

// Fungsi untuk menghasilkan integritas hash (sha384) dari file
function generateIntegrityHash(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const hash = crypto.createHash('sha384');
  hash.update(fileBuffer);
  return hash.digest('base64');
}


// Perbarui fungsi generateHtml
async function generateHtml() {
  // Generate nonce untuk setiap elemen
  const nonce = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

  // Daftar file JavaScript yang digunakan
  const jsFiles = ['p5.js', 'main.js', 'firework.js'];

  // Menghasilkan nama file hash untuk setiap file JS dan menyalinnya
  const hashedJsFiles = jsFiles.map(file => {
    const originalPath = path.join(process.cwd(), file);
    return generateHashedFile(originalPath); // Nama hash file, sekarang sudah dibuat salinan
  });

  // CSP dengan strict-dynamic
  const cspContent = [
    `style-src 'self' 'nonce-${nonce}' https://4211421036.github.io`,
    "object-src 'none'",
    "base-uri 'self'",
    "img-src 'self' data: https://4211421036.github.io",
    "default-src 'self' https://4211421036.github.io",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-inline' ${hashedJsFiles.map(file => `'sha384-${generateIntegrityHash(path.join(process.cwd(), file))}'`).join(' ')} https://4211421036.github.io`,
    "font-src 'self' https://4211421036.github.io",
    "media-src 'self' https://4211421036.github.io",
    "connect-src 'self' https://4211421036.github.io",
    "form-action 'self'",
    "manifest-src 'self' https://4211421036.github.io",
    "worker-src 'self' blob: https://4211421036.github.io"
  ].join('; ');

  let htmlContent = `<!DOCTYPE html>
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
  `;

  htmlContent += `
  <script src="${hashedFileName}" nonce="${nonce}" integrity="sha384-${integrityHash}" crossorigin="anonymous" defer></script>
  `;
  // Menambahkan style inline dengan nonce
  htmlContent += `
      <style nonce="${nonce}">
        body {
          margin: 0;
          overflow: hidden;
        }
      </style>
    </head>
    <body>
      <script nonce="${nonce}">
        console.log('Generated automatic on: ${new Date().toLocaleString()}');
      </script>
      <!-- page generated automatic: ${new Date().toLocaleString()} -->
    </body>
  </html>`;

  try {
    // Minify HTML yang dihasilkan
    const minifiedHtml = await minify(htmlContent, {
      collapseWhitespace: true,  // Menghapus spasi dan baris kosong
      removeComments: true,      // Menghapus komentar
      removeRedundantAttributes: true, // Menghapus atribut yang tidak perlu
      useShortDoctype: true,     // Menggunakan doctype singkat
      minifyJS: true,            // Minify JS
      minifyCSS: true            // Minify CSS
    });

    // Tentukan path untuk file HTML yang akan dihasilkan
    const outputPath = path.join(process.cwd(), 'index.html');

    // Simpan HTML yang telah di-minify ke file
    fs.writeFileSync(outputPath, minifiedHtml);
    console.log('File HTML telah dibuat dan di-minify di:', outputPath);
  } catch (error) {
    console.error('Error during minification:', error);
  }
}

// Generate HTML
generateHtml();
