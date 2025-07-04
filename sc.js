import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { minify } from 'html-minifier';
import { minify as minifyJs } from 'terser';

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

function generateHashedId(originalId) {
  const hash = crypto.createHash('sha256').update(originalId).digest('hex');
  return `id-${hash.substring(0, 8)}`;
}

// Automatically find and hash IDs from JavaScript files
function extractAndHashIds(jsContent) {
  // Regex pattern to find potential ID usages in JavaScript
  const idPatterns = [
    /\.getElementById\(['"]([^'"]+)['"]\)/g,
    /\.querySelector\(['"]#([^'"]+)['"]\)/g,
    /id=['"]([^'"]+)['"]/g,
    /\.id\s*=\s*['"]([^'"]+)['"]/g
  ];

  let foundIds = new Set();
  
  // Find all potential IDs
  idPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(jsContent)) !== null) {
      foundIds.add(match[1]);
    }
  });

  // Create ID mapping
  const idMap = {};
  foundIds.forEach(id => {
    idMap[id] = generateHashedId(id);
  });

  return idMap;
}

// Function to update JavaScript content with hashed IDs
function updateJsContent(jsContent, idMap) {
  let updatedContent = jsContent;
  
  for (const [originalId, hashedId] of Object.entries(idMap)) {
    // Replace various forms of ID usage
    const patterns = [
      new RegExp(`getElementById\\(['"]${originalId}['"]\\)`, 'g'),
      new RegExp(`querySelector\\(['"]#${originalId}['"]\\)`, 'g'),
      new RegExp(`id=['"]${originalId}['"]`, 'g'),
      new RegExp(`\\.id\\s*=\\s*['"]${originalId}['"]`, 'g')
    ];

    patterns.forEach(pattern => {
      updatedContent = updatedContent.replace(pattern, (match) => {
        if (match.includes('getElementById')) {
          return `getElementById('${hashedId}')`;
        } else if (match.includes('querySelector')) {
          return `querySelector('#${hashedId}')`;
        } else if (match.includes('id=')) {
          return `id="${hashedId}"`;
        } else if (match.includes('.id')) {
          return `.id = "${hashedId}"`;
        }
        return match;
      });
    });
  }

  return updatedContent;
}
const idMap = {
  'modal': generateHashedId('modal'),
  'skip-link': generateHashedId('skip-link'),
  'progress-bar': generateHashedId('progress-bar'),
  'progress': generateHashedId('progress')
};
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

async function generateHtml() {
  // Generate nonce untuk setiap elemen
  const nonce = generateNonce();
   // Proses main.js untuk ekstrak ID dan minify
  const mainJsPath = path.join(process.cwd(), 'main.js');
  const mainJsContent = fs.readFileSync(mainJsPath, 'utf8');
  const extractedIdMap = extractAndHashIds(mainJsContent);

  // Update konten JS dengan ID yang di-hash
  const updatedMainJsContent = updateJsContent(mainJsContent, extractedIdMap);

  // Minify JS yang telah di-update
  const minifiedMainJs = await minifyJs(updatedMainJsContent, {
    compress: true,
    mangle: true,
    format: { comments: false },
  });
  if (minifiedMainJs.error) throw new Error(`Gagal minify JS: ${minifiedMainJs.error}`);

  // Tulis ke main.min.js
  const mainMinJsPath = path.join(process.cwd(), 'main.min.js');
  fs.writeFileSync(mainMinJsPath, minifiedMainJs.code);

  // Proses p5.js untuk minify
  const p5JsPath = path.join(process.cwd(), 'p5.js');
  const p5JsContent = fs.readFileSync(p5JsPath, 'utf8');

  // Minify p5.js
  const minifiedP5Js = await minifyJs(p5JsContent, {
    compress: true,
    mangle: true,
    format: { comments: false },
  });
  if (minifiedP5Js.error) throw new Error(`Gagal minify p5.js: ${minifiedP5Js.error}`);

  // Tulis ke p5.min.js
  const p5MinJsPath = path.join(process.cwd(), 'p5.min.js');
  fs.writeFileSync(p5MinJsPath, minifiedP5Js.code);

  const ccJsPath = path.join(process.cwd(), ' 126693cc.js');
  const ccJsContent = fs.readFileSync(p5JsPath, 'utf8');

  // Minify p5.js 126693cc.js
  const minifiedccJs = await minifyJs(ccJsContent, {
    compress: true,
    mangle: true,
    format: { comments: false },
  });
  if (minifiedccJs.error) throw new Error(`Gagal minify p5.js: ${minifiedccJs.error}`);

  // Tulis ke p5.min.js
  const ccMinJsPath = path.join(process.cwd(), ' 126693cc.js');
  fs.writeFileSync(ccMinJsPath, minifiedccJs.code);


  // Daftar file JS yang sudah termasuk main.min.js
  const jsFiles = ['p5.min.js', 'main.min.js', 'firework.js'];

  // Update the JavaScript content with hashed IDs
  fs.writeFileSync(mainJsPath, updatedMainJsContent);

  // Create a script to inject the ID mapping
  const idMapScript = `
    const idMap = ${JSON.stringify(extractedIdMap, null, 2)};
    window.idMap = idMap; // Make available globally if needed
  `;

  const hashedJsFiles = jsFiles.map(file => {
    const originalPath = path.join(process.cwd(), file);
    return generateHashedFileName(originalPath);
  });

  // CSP dengan strict-dynamic
  const cspContent = [
      `style-src 'self' 'nonce-${nonce}' 'unsafe-inline' https://4211421036.github.io http://4211421036.github.io`,
      "object-src 'none'",
      "base-uri 'self'",
      "frame-ancestors 'self'",
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

  const bfcacheScript = `
  document.addEventListener("DOMContentLoaded", () => {
      if (!document.querySelector("#${idMap['modal']}")) {
          const skipLink = document.createElement("a");
          skipLink.href = "#defaultCanvas0";
          skipLink.id = "${idMap['skip-link']}";
          skipLink.textContent = "Skip to main content";
          skipLink.style.position = "absolute";
          skipLink.style.top = "-40px";
          skipLink.style.left = "10px";
          skipLink.style.background = "#fff";
          skipLink.style.color = "#000";
          skipLink.style.padding = "5px";
          skipLink.style.zIndex = "1004";
          skipLink.style.transition = "top 0.3s";
          skipLink.addEventListener("focus", () => {
              skipLink.style.top = "10px";
          });
          skipLink.addEventListener("blur", () => {
              skipLink.style.top = "-40px";
          });
          document.body.prepend(skipLink);
      }
  
      const progress = document.createElement("div");
      progress.id = "${idMap['progress-bar']}";
      progress.role= "progressbar";
      progress.title= "progressbar";
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


  let htmlContent = `<!DOCTYPE html>
  <html lang="id" xml-lang="id">
    <head>
      <meta charset="UTF-8">
      <title>Selamat Ulang Tahun!</title>
      <link rel="shortcut icon" href="https://4211421036.github.io/g4lihru/987654567.png" type="image/x-icon">
      <link rel="icon" href="https://4211421036.github.io/g4lihru/987654567.png" type="image/x-icon">
      <link rel="preload" as="audio" href="https://4211421036.github.io/hbd/hbd.mp3">
      <link rel="preload" as="image" href="https://4211421036.github.io/hbd/hbd.jpg" type="image/jpg">
      <link rel="preload" as="image" href="https://4211421036.github.io/g4lihru/987654567.png" type="image/x-icon">
      <link rel="apple-touch-icon" href="https://4211421036.github.io/g4lihru/987654567.png">
      <link rel="canonical" href="https://4211421036.github.io/hbd/">
      <link rel="manifest" href="manifest.webmanifest" crossorigin="use-credentials">
      <meta name="application-name" content="HBD">
      <meta name="description" content="Selamat Ulang Tahun!">
      <meta name="generator" content="HBD">
      <meta name="bingbot" content="noarchive">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="keywords" content="Selamat Ulang Tahun!">
      <meta name="robots" content="index, follow">
      <meta name="author" content="GALIH RIDHO UTOMO">
      <meta name="color-scheme" content="dark light">
      <meta name="theme-color" media="(prefers-color-scheme: light)" content="#edf4f8">
      <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#1e1e1e">
      <meta prefix="og: http://ogp.me/ns#" property="og:title" content="Selamat Ulang Tahun!">
      <meta prefix="og: http://ogp.me/ns#" property="og:type" content="website">
      <meta prefix="og: http://ogp.me/ns#" property="og:description" content="Selamat Ulang Tahun!">
      <meta prefix="og: http://ogp.me/ns#" property="og:site_name" content="Birthday Celebration">
      <meta prefix="og: http://ogp.me/ns#" property="og:locale" content="id_ID">
      <meta prefix="og: http://ogp.me/ns#" property="og:url" content="https://4211421036.github.io/hbd/">
      <meta prefix="og: http://ogp.me/ns#" property="og:image" content="https://4211421036.github.io/hbd/hbd.jpg">
      <meta prefix="og: http://ogp.me/ns#" property="og:image:secure_url" content="https://4211421036.github.io/hbd/hbd.jpg">
      <meta prefix="og: http://ogp.me/ns#" property="og:image:alt" content="Selamat Ulang Tahun">
      <meta prefix="og: http://ogp.me/ns#" property="og:image:type" content="image/jpeg">
      <meta prefix="og: http://ogp.me/ns#" property="og:image:width" content="1280">
      <meta prefix="og: http://ogp.me/ns#" property="og:image:height" content="1280">
      <meta prefix="og: http://ogp.me/ns#" property="og:audio:secure_url" content="https://4211421036.github.io/hbd/hbd.mp3">
      <meta prefix="og: http://ogp.me/ns#" property="og:audio" content="https://4211421036.github.io/hbd/hbd.mp3">
      <meta prefix="og: http://ogp.me/ns#" property="og:audio:type" content="audio/mpeg">
      <meta name="google-site-verification" content="OYdjPwgIjGMAbQd3CGwM_l20jLNRRp84mEl3kw06DMg" />
      <meta name="browsermode" content="no-sensors">
      <meta name="renderer" content="webkit|ie-comp|ie-stand">
      <meta name="apple-mobile-web-app-capable" content="yes">
      <meta name="mobile-web-app-capable" content="yes">
      <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
      <meta http-equiv="Pragma" content="no-cache">
      <meta http-equiv="Strict-Transport-Security" content="max-age=31536000; includeSubDomains; preload">
      <meta http-equiv="Cross-Origin-Opener-Policy" content="same-origin">
      <meta http-equiv="X-Content-Type-Options" content="nosniff">
      <meta http-equiv="Referrer-Policy" content="strict-origin">
      <meta http-equiv="Content-Security-Policy" content="${cspContent}">
      <meta http-equiv="Expires" content="0">
      <meta http-equiv="content-language" content="id">
      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:site" content="@ITBGRU">
      <meta name="twitter:creator" content="@ITBGRU">
      <meta name="twitter:title" content="Selamat Ulang Tahun">
      <meta name="twitter:description" content="Selamat Ulang Tahun">
      <meta name="twitter:image" content="https://4211421036.github.io/hbd/hbd.jpg">      
      <meta name="twitter:domain" content="4211421036.github.io">
      <meta name="twitter:url" content="https://4211421036.github.io/MentalHealth">
      <meta name="twitter:image:src" content="https://4211421036.github.io/g4lihru/987654567.png">
      <meta name="twitter:image:alt" content="Mental Health">
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
    const filePath = path.join(process.cwd(), file);
    const hashedFileName = generateHashedFileName(filePath);
  
    // Verifikasi hash integritas
    const integrityHash = generateIntegrityHash(filePath);
    htmlContent += `
      <script rel="preload" as="script" src="${hashedFileName}" nonce="${nonce}" integrity="sha384-${integrityHash}" crossorigin="anonymous" defer></script>
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
        :root {
            --background: radial-gradient(100% 193.51% at 100% 0%, rgb(237, 244, 248) 0%, rgb(239, 242, 250) 16.92%, rgb(250, 239, 246) 34.8%, rgb(250, 230, 242) 48.8%, rgb(250, 240, 247) 63.79%, rgb(241, 241, 251) 81.34%, rgb(240, 244, 248) 100%);
            --text-light: #333333;
            --input-border-light: #dddddd;
            --input-bg-light: #ffffff;
            --placeholder-light: rgba(255,255,255,0.5);
        
            --background-dark: #1e1e1e;
            --text-dark: #ffffff;
            --input-border-dark: #404040;
            --input-bg-dark: #2d2d2d;
            --placeholder-dark: rgba(0,0,0,0.5);
        
            /* Animation speeds */
            --transition-speed: 0.3s;
        }
        @media (prefers-color-scheme: dark) {
            :root {
                color-scheme: dark;
                --background: var(--background-dark);
                --text: var(--text-dark);
                --input-border: var(--input-border-dark);
                --input-bg: var(--input-bg-dark);
                --placeholder: var(--placeholder-dark);
            }
        }
        
        @media (prefers-color-scheme: light) {
            :root {
                color-scheme: light;
                --background: var(--background-light);
                --text: var(--text-light);
                --input-border: var(--input-border-light);
                --input-bg: var(--input-bg-light);
                --placeholder: var(--placeholder-light);
            }
        }
        body {
            margin: 0;
            overflow: hidden;
            background: var(--background);
            color: var(--text);
        }
        
        @media (prefers-color-scheme: dark) {
            body {
                background: var(--background);
                color: var(--text);
            }
        }
        @keyframes skeletonLoading {
            0% {
                opacity: 0.7;
            }
            50% {
                opacity: 0.5;
            }
            100% {
                opacity: 0.7;
            }
        }
    
        .skeleton-animation {
            animation: skeletonLoading 1.5s infinite;
        }
        
        // Di dalam bagian style
      input[type="text" i]::placeholder {
        color: var(--placeholder);
        opacity: 0.1;
        transition: opacity var(--transition-speed) ease;
        contain: style layout;
        content-visibility: auto;
        font-display: swap;
      }
      input#placeholder::-webkit-input-placeholder {
          display: none!important;
          color: transparent;
      }

      input[type="text" i]:focus::placeholder {
        opacity: 0.7;
      }
      
      input[type="text" i]:focus {
        outline: none;
        border-color: var(--button-bg);
        box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
      }
        /* Performance Optimizations */
        @media (prefers-reduced-motion: reduce) {
            * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
                scroll-behavior: auto !important;
            }
        }
        
      </style>
    </head>
    <body translate="no" data-new-gr-c-s-check-loaded="14.1147.0">
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
  const hashedJsFiles = ['p5.min.js', 'main.min.js', 'firework.js'].map(file => {
    const originalPath = path.join(process.cwd(), file);
    return generateHashedFileName(originalPath);
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
