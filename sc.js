import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { minify } from 'html-minifier';

// Fungsi untuk menghasilkan nama file JS dengan hash baru dan menyalin file ke nama baru
function generateHashedFile(filePath) {
  const hash = crypto.createHash('sha256');
  const fileBuffer = fs.readFileSync(filePath);
  hash.update(fileBuffer);
  const fileHash = hash.digest('hex').slice(0, 8); // Ambil sebagian dari hash
  const extname = path.extname(filePath); // Menyimpan ekstensi file (misalnya .js)
  const hashedFileName = `${fileHash}${extname}`;
  
  // Tentukan path untuk file hasil hash
  const hashedFilePath = path.join(process.cwd(), hashedFileName);
  
  // Salin file asli ke nama file hash
  fs.copyFileSync(filePath, hashedFilePath);

  return hashedFileName;
}

// Perbarui fungsi generateHtml
async function generateHtml() {
  const nonce = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

  const jsFiles = ['p5.js', 'main.js', 'firework.js'];

  const hashedJsFiles = jsFiles.map(file => {
    const originalPath = path.join(process.cwd(), file);
    return generateHashedFile(originalPath);
  });

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

  hashedJsFiles.forEach((file, index) => {
    const filePath = path.join(process.cwd(), jsFiles[index]);
    const integrityHash = generateIntegrityHash(filePath);
    htmlContent += `
      <script src="${file}" nonce="${nonce}" integrity="sha384-${integrityHash}" crossorigin="anonymous" defer></script>
    `;
  });

  // Adding inline style
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
      console.log('Generated automatically on: ${new Date().toLocaleString()}');
    </script>
  </body>
  </html>`;

  try {
    // Minify HTML content
    const minifiedHtml = await minify(htmlContent, {
      collapseWhitespace: true,
      removeComments: true,
      removeRedundantAttributes: true,
      useShortDoctype: true,
      minifyJS: true,
      minifyCSS: true
    });

    const outputPath = path.join(process.cwd(), 'index.html');
    fs.writeFileSync(outputPath, minifiedHtml);
    console.log('HTML file has been generated and minified at:', outputPath);
  } catch (error) {
    console.error('Error during minification:', error);
  }
}

// Generate the HTML file
generateHtml();
