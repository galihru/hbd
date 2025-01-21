import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { minify } from 'html-minifier';

function generateNonce() {
  return crypto.randomBytes(16).toString('base64');
}

function generateHashedFileName(filePath) {
  const hash = crypto.createHash('sha256');
  const fileBuffer = fs.readFileSync(filePath);
  hash.update(fileBuffer);
  const fileHash = hash.digest('hex').slice(0, 8);
  const extname = path.extname(filePath); // Menyimpan ekstensi file (misalnya .js)
  const newFileName = `${fileHash}${extname}`;
  const newFilePath = path.join(process.cwd(), newFileName);

  // Salin file ke nama baru hanya jika belum ada
  if (!fs.existsSync(newFilePath)) {
    fs.copyFileSync(filePath, newFilePath);
  }

  return newFileName;
}

function generateIntegrityHash(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const hash = crypto.createHash('sha384');
  hash.update(fileBuffer);
  return hash.digest('base64');
}

async function generateHtml() {
  // Generate nonce untuk setiap elemen
  const nonce = generateNonce();

  // Daftar file JavaScript yang digunakan
  const jsFiles = ['p5.js', 'main.js', 'firework.js'];

  // Menghasilkan nama file hash untuk setiap file JS
  const hashedJsFiles = jsFiles.map(file => {
    const originalPath = path.join(process.cwd(), file);
    return generateHashedFileName(originalPath); // Nama hash file, tidak perlu membuat salinan
  });

  // CSP dengan strict-dynamic
  const cspContent = [
    `style-src 'self' 'nonce-${nonce}' https://4211421036.github.io`,
    "object-src 'none'",
    "base-uri 'self'",
    "img-src 'self' data: https://4211421036.github.io",
    "default-src 'self' https://4211421036.github.io",
    `script-src 'self' 'unsafe-inline' ( 'nonce-${nonce}' 'strict-dynamic' ${hashedJsFiles
      .map((file) => `'sha384-${generateIntegrityHash(path.join(process.cwd(), file))}'`)
      .join(' ')};`,
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
      <meta name="theme-color" media="(prefers-color-scheme: light)" content="#edf4f8">
      <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#1e1e1e">
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
      <link rel="manifest" href="manifest.json">
      <meta http-equiv="Content-Security-Policy" content="${cspContent}">
      <title>Selamat Ulang Tahun!</title>
  `;

  // Mengelola hashed JS files
  hashedJsFiles.forEach((file) => {
    const filePath = path.join(process.cwd(), file); // Lokasi file asli
    const hashedFileName = generateHashedFileName(filePath);
  
    // Verifikasi hash integritas
    const integrityHash = generateIntegrityHash(filePath);
    htmlContent += `
      <script src="${hashedFileName}" nonce="${nonce}" integrity="sha384-${integrityHash}" crossorigin="anonymous" defer></script>
    `;
  });
  
  // Verifikasi file asli
  jsFiles.forEach(file => {
    const originalPath = path.join(process.cwd(), file);
    if (!fs.existsSync(originalPath)) {
      throw new Error(`File ${file} tidak ditemukan di ${originalPath}`);
    }
  });

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
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.register('/hbd/sw.js').then(() => {
            console.log('Service Worker registered!');
          }).catch(err => {
            console.error('Service Worker registration failed:', err);
          });
        }
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

function generateServiceWorker() {
  const hashedJsFiles = ['p5.js', 'main.js', 'firework.js'].map(file => {
    const originalPath = path.join(process.cwd(), file);
    return generateHashedFileName(originalPath); // Get hashed file names
  });
  const swContent = `
    const cacheName = 'offline-cache-v1';
    const filesToCache = [
      '/',
      '/index.html',
      '/manifest.json',
      '/sw.js',
      // Dynamically add each hashed JS file to the cache list
      ${hashedJsFiles.map(file => `'/${file}'`).join(',\n')}
    ];

    self.addEventListener('install', (event) => {
      event.waitUntil(
        caches.open(cacheName).then((cache) => {
          return cache.addAll(filesToCache);
        })
      );
    });

    self.addEventListener('fetch', (event) => {
      event.respondWith(
        caches.match(event.request).then((response) => {
          return response || fetch(event.request);
        })
      );
    });

    self.addEventListener('activate', (event) => {
      event.waitUntil(
        caches.keys().then((keyList) => {
          return Promise.all(
            keyList.map((key) => {
              if (key !== cacheName) {
                return caches.delete(key);
              }
            })
          );
        })
      );
    });
  `;

  const outputPath = path.join(process.cwd(), 'sw.js');
  fs.writeFileSync(outputPath, swContent.trim());
  console.log('Service Worker file sw.js telah dibuat di:', outputPath);
}

function generateManifest() {
  const manifestContent = {
    name: "Selamat Ulang Tahun",
    short_name: "Ulang Tahun",
    description: "Website offline untuk ucapan ulang tahun.",
    icons: [
      {
        src: "192x192.png",
        type: "image/png",
        sizes: "192x192"
      },
      {
        src: "512x512.png",
        type: "image/png",
        sizes: "512x512"
      }
    ],
    start_url: "/",
    display: "standalone",
     "screenshots": [
        {
            "src": "/345677.png",
            "sizes": "637x436",
            "form_factor": "wide",
            "label": "Splash Screen view displaying App"
        },
        {
            "src": "/345677.png",
            "sizes": "637x436",
            "platform": "android",
            "label": "Splash Screen view displaying App"
        }
    ],
    "version": "1.0.0",
    "author": "GALIH RIDHO UTOMO",
    "editor": "GALIH RIDHO UTOMO",
    "scope": "/",
    "orientation": "portrait"
  };

  const outputPath = path.join(process.cwd(), 'manifest.json');
  fs.writeFileSync(outputPath, JSON.stringify(manifestContent, null, 2));
  console.log('Manifest file manifest.json telah dibuat di:', outputPath);
}

generateHtml();
generateServiceWorker();
generateManifest();
