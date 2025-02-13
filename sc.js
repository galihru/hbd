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
  const extname = path.extname(filePath);
  const newFileName = `${fileHash}${extname}`;
  const newFilePath = path.join(process.cwd(), newFileName);

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

function generateInlineScriptHash(scriptContent) {
  const hash = crypto.createHash('sha256');
  hash.update(scriptContent);
  return `'sha256-${hash.digest('base64')}'`;
}
const bfcacheScript = `
document.addEventListener("DOMContentLoaded", () => {
    // Ensure BFCache support for faster page restoration
    window.addEventListener("pageshow", (event) => {
        if (event.persisted) {
            console.log("Restored from BFCache");
            document.body.classList.remove("loading");
        }
    });

    // Auto-create skip link for accessibility
    if (!document.querySelector("#skip-link")) {
        const skipLink = document.createElement("a");
        skipLink.href = "#main-content";
        skipLink.id = "skip-link";
        skipLink.textContent = "Skip to main content";
        skipLink.style.position = "absolute";
        skipLink.style.top = "-40px";
        skipLink.style.left = "10px";
        skipLink.style.background = "#000";
        skipLink.style.color = "#fff";
        skipLink.style.padding = "5px";
        skipLink.style.zIndex = "1000";
        skipLink.style.transition = "top 0.3s";

        skipLink.addEventListener("focus", () => {
            skipLink.style.top = "10px";
        });
        skipLink.addEventListener("blur", () => {
            skipLink.style.top = "-40px";
        });
        document.body.prepend(skipLink);
    }

    // Page load progress indicator
    const progress = document.createElement("div");
    progress.id = "progress-bar";
    progress.style.position = "fixed";
    progress.style.top = "0";
    progress.style.left = "0";
    progress.style.width = "0%";
    progress.style.height = "3px";
    progress.style.background = "#29d";
    progress.style.zIndex = "9999";
    progress.style.transition = "width 0.2s ease-in-out";
    document.body.appendChild(progress);

    let progressWidth = 0;
    const interval = setInterval(() => {
        progressWidth += Math.random() * 10;
        if (progressWidth < 90) {
            progress.style.width = progressWidth + "%";
        }
    }, 200);

    window.addEventListener("load", () => {
        clearInterval(interval);
        progress.style.width = "100%";
        setTimeout(() => {
            progress.style.opacity = "0";
        }, 500);
    });
});

`;
async function generateHtml() {
  // Generate nonce untuk setiap elemen
  const nonce = generateNonce();

  // Daftar file JavaScript yang digunakan
  const jsFiles = ['p5.js', 'main.js', 'firework.js'];

  const hashedJsFiles = jsFiles.map(file => {
    const originalPath = path.join(process.cwd(), file);
    return generateHashedFileName(originalPath); // Nama hash file, tidak perlu membuat salinan
  });

  // CSP dengan strict-dynamic
  const cspContent = [
      `style-src 'self' 'nonce-${nonce}' 'unsafe-inline' https://4211421036.github.io http://4211421036.github.io`,
      "object-src 'none'",
      "base-uri 'self'",
      "img-src 'self' data: https://4211421036.github.io http://4211421036.github.io",
      "default-src 'self' https://4211421036.github.io http://4211421036.github.io",
      `script-src 'self' 'unsafe-inline' 'nonce-${nonce}' 'strict-dynamic' ${hashedJsFiles
        .map((file) => `'sha384-${generateIntegrityHash(path.join(process.cwd(), file))}'`)
        .join(' ')} https://4211421036.github.io http://4211421036.github.io;`,
      "font-src 'self' https://4211421036.github.io http://4211421036.github.io",
      "media-src 'self' https://4211421036.github.io http://4211421036.github.io",
      "connect-src 'self' https://4211421036.github.io http://4211421036.github.io",
      "form-action 'self'",
      "manifest-src 'self' https://4211421036.github.io http://4211421036.github.io",
      "worker-src 'self' blob: https://4211421036.github.io http://4211421036.github.io"
  ].join('; ');

 const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://4211421036.github.io/hbd/#website",
        "url": "https://4211421036.github.io/hbd/",
        "name": "Selamat Ulang Tahun!",
        "description": "Website offline untuk ucapan ulang tahun.",
        "publisher": {
          "@type": "Person",
          "name": "GALIH RIDHO UTOMO"
        },
        "inLanguage": "id-ID"
      },
      {
        "@type": "WebPage",
        "@id": "https://4211421036.github.io/hbd/#webpage",
        "url": "https://4211421036.github.io/hbd/",
        "name": "Selamat Ulang Tahun!",
        "isPartOf": {
          "@id": "https://4211421036.github.io/hbd/#website"
        },
        "about": {
          "@type": "Thing",
          "name": "Birthday Celebration",
          "description": "Interactive birthday celebration webpage with fireworks animation"
        },
        "datePublished": new Date().toISOString(),
        "dateModified": new Date().toISOString(),
        "author": {
          "@type": "Person",
          "name": "GALIH RIDHO UTOMO",
          "url": "https://4211421036.github.io"
        },
        "primaryImageOfPage": {
          "@type": "ImageObject",
          "url": "https://4211421036.github.io/hbd/hbd.jpg",
          "contentUrl": "https://4211421036.github.io/hbd/hbd.jpg",
          "contentSize": "1280x1280",
          "representativeOfPage": true
        },
        "audio": {
          "@type": "AudioObject",
          "contentUrl": "https://4211421036.github.io/hbd/hbd.mp3",
          "encodingFormat": "audio/mpeg",
          "description": "Birthday celebration music",
          "duration": "PT43S"
        },
        "potentialAction": {
          "@type": "ReadAction",
          "target": ["https://4211421036.github.io/hbd/"]
        },
        "mainEntity": {
          "@type": "CreativeWork",
          "name": "Birthday Animation",
          "description": "Interactive fireworks animation for birthday celebration",
          "creator": {
            "@type": "Person",
            "name": "GALIH RIDHO UTOMO"
          }
        },
        "speakable": {
          "@type": "SpeakableSpecification",
          "cssSelector": ["p", "meta[name='description']"]
        },
        "inLanguage": "id-ID"
      }
    ]
  };


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
      <meta prefix="og: http://ogp.me/ns#" property="og:type" content="website">
      <meta prefix="og: http://ogp.me/ns#" property="og:title" content="Selamat Ulang Tahun!">
      <meta prefix="og: http://ogp.me/ns#" property="og:description" content="Selamat Ulang Tahun!">
      <meta prefix="og: http://ogp.me/ns#" property="og:site_name" content="Birthday Celebration">
      <meta prefix="og: http://ogp.me/ns#" property="og:locale" content="id_ID">
      <meta prefix="og: http://ogp.me/ns#" property="og:url" content="https://4211421036.github.io/hbd/">
      <meta prefix="og: http://ogp.me/ns#" property="og:image" content="https://4211421036.github.io/hbd/hbd.jpg">
      <meta prefix="og: http://ogp.me/ns#" property="og:image:secure_url" content="https://4211421036.github.io/hbd/hbd.jpg">
      <meta prefix="og: http://ogp.me/ns#" property="og:image:type" content="image/jpeg">
      <meta prefix="og: http://ogp.me/ns#" property="og:image:width" content="1280">
      <meta prefix="og: http://ogp.me/ns#" property="og:image:height" content="1280">
      <meta prefix="og: http://ogp.me/ns#" property="og:image:alt" content="Selamat Ulang Tahun">
      <meta prefix="og: http://ogp.me/ns#" property="og:audio" content="https://4211421036.github.io/hbd/hbd.mp3">
      <meta prefix="og: http://ogp.me/ns#" property="og:audio:secure_url" content="https://4211421036.github.io/hbd/hbd.mp3">
      <meta prefix="og: http://ogp.me/ns#" property="og:audio:type" content="audio/mpeg">
      <meta name="google-site-verification" content="OYdjPwgIjGMAbQd3CGwM_l20jLNRRp84mEl3kw06DMg" />
      <meta name="twitter:card" content="summary_large_image">
      <meta name="browsermode" content="no-sensors">
      <meta name="renderer" content="webkit|ie-comp|ie-stand">
      <meta http-equiv="Cache-Control" content="no-transform">
      <meta name="twitter:title" content="Selamat Ulang Tahun">
      <meta name="twitter:description" content="Selamat Ulang Tahun">
      <meta name="twitter:image" content="https://4211421036.github.io/hbd/hbd.jpg">      
      <link rel="canonical" href="https://4211421036.github.io/hbd/">
      <link rel="manifest" href="manifest.webmanifest" crossorigin="use-credentials">
      <meta name="twitter:site" content="@ITBGRU">
      <meta name="twitter:creator" content="@ITBGRU">
      <meta name="twitter:domain" content="4211421036.github.io">
      <meta name="twitter:url" content="https://4211421036.github.io/MentalHealth">
      <meta name="twitter:image:src" content="https://4211421036.github.io/g4lihru/987654567.png">
      <meta name="twitter:image:alt" content="Mental Health">
      <link rel="preload" href="https://4211421036.github.io/g4lihru/987654567.png" as="image" type="image/x-icon">
      <link rel="shortcut icon" href="https://4211421036.github.io/g4lihru/987654567.png" type="image/x-icon">
      <link rel="icon" href="https://4211421036.github.io/g4lihru/987654567.png" type="image/x-icon">
      <link rel="preload" href="https://4211421036.github.io/MentalHealth/style.css" as="style">
      <link rel="apple-touch-icon" href="https://4211421036.github.io/g4lihru/987654567.png">
      <meta http-equiv="Content-Security-Policy" content="${cspContent}">
      <title>Selamat Ulang Tahun!</title>
      <script type="application/ld+json" nonce="${nonce}">
      {
        "@context": "https://schema.org",
        "@type": "Event",
        "name": "Selamat Ulang Tahun GALIH RIDHO UTOMO",
        "startDate": "2025-01-20T4:00-04:00",
        "endDate": "2027-01-20T4:00-04:00",
        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
        "eventStatus": "https://schema.org/EventScheduled",
        "location": {
          "@type": "Place",
          "name": "GALIH RIDHO UTOMO",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Jl. Kemakmuran No. 10",
            "addressLocality": "Kabupaten Tangerang",
            "postalCode": "15562",
            "addressRegion": "Kabupaten Tangerang",
            "addressCountry": "ID"
          }
        },
        "image":  "https://4211421036.github.io/hbd/hbd.jpg",
        "description": "Selamat Ulang Tahun GALIH RIDHO UTOMO",
        "offers": {
          "@type": "Offer",
          "url": "https://4211421036.github.io/hbd/",
          "price": 10,
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock",
          "validFrom": "2024-05-21T12:00"
        },
        "performer": {
          "@type": "PerformingGroup",
          "name": "GALIH RIDHO UTOMO"
        },
        "organizer": {
          "@type": "Organization",
          "name": "UKM Penelitian UNNES",
          "url": "https://ukmpenelitianunnes.com"
        }
      }
      </script>
      <script type="application/ld+json" nonce="${nonce}">
        ${JSON.stringify(structuredData, null, 2)}
      </script>
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
            background: adial-gradient(100% 193.51% at 100% 0%, rgb(237, 244, 248) 0%, rgb(239, 242, 250) 16.92%, rgb(250, 239, 246) 34.8%, rgb(250, 230, 242) 48.8%, rgb(250, 240, 247) 63.79%, rgb(241, 241, 251) 81.34%, rgb(240, 244, 248) 100%);;
            color: #000000;
        }
        
        @media (prefers-color-scheme: dark) {
            body {
                background: rgb(30, 30, 30);
                color: rgb(255, 255, 255);
            }
        }
      </style>
    </head>
    <body>
      <script nonce="${nonce}">
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.register('/hbd/sw.js')
            .then(reg => console.log('Service worker registered'))
            .catch(err => console.log('Service worker not registered', err));
        }
        console.log('Generated automatic on: ${new Date().toLocaleString()}');
      </script>
      <script nonce="${nonce}">${bfcacheScript}</script>
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
  // Service Worker for offline functionality
  const CACHE_NAME = 'site-static-v1';
  const ASSETS = [
      '/',
      '/index.html',
      '/manifest.webmanifest',
      '/192x192.png',
      '/512x512.png',
      '/sw.js',
      // Dynamically add each hashed JS file to the cache list
      ${hashedJsFiles.map(file => `'/${file}'`).join(',\n')}
  ];

  // Install event
  self.addEventListener('install', evt => {
    evt.waitUntil(
      caches.open(CACHE_NAME)
        .then(cache => {
          console.log('Caching shell assets');
          return cache.addAll(ASSETS);
        })
        .catch(err => {
          console.error('Error caching assets:', err);
        })
    );
  });
  
  // Activate event
  self.addEventListener('activate', evt => {
    evt.waitUntil(
      caches.keys().then(keys => {
        return Promise.all(keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
        );
      })
    );
  });
  
  // Fetch event
  self.addEventListener('fetch', evt => {
    evt.respondWith(
      caches.match(evt.request)
        .then(cacheRes => {
          return cacheRes || fetch(evt.request)
            .then(fetchRes => {
              return caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(evt.request.url, fetchRes.clone());
                  return fetchRes;
                });
            });
        })
        .catch(() => {
          // Handle fetch errors or offline state
          if (evt.request.url.indexOf('.html') > -1) {
            return caches.match('/index.html');
          }
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
        },
        {
            "src": "/345677.png",
            "sizes": "637x436"
        }
    ],
    "scope": "/",
    "orientation": "portrait"
  };

  const outputPath = path.join(process.cwd(), 'manifest.webmanifest');
  fs.writeFileSync(outputPath, JSON.stringify(manifestContent, null, 2));
  console.log('Manifest file manifest.webmanifest telah dibuat di:', outputPath);
}

generateHtml();
generateServiceWorker();
generateManifest();
