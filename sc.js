import fs from 'fs';
import path from 'path';
import { exec } from 'child_process'; // Import exec untuk menjalankan perintah git secara synchronous

// Fungsi untuk menghasilkan nonce acak
function generateNonce() {
  return Math.random().toString(36).substring(2, 15);
}

// Fungsi untuk menjalankan perintah git secara synchronous
function runGitCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(`Error executing command: ${stderr}`);
      } else {
        resolve(stdout);
      }
    });
  });
}

// Fungsi untuk membuat HTML dengan nonce
async function generateHtmlAndCommit() {
  const nonce = generateNonce();

  const htmlContent = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Selamat Ulang Tahun!</title>
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
        <meta http-equiv="Content-Security-Policy" content="script-src 'self' 'nonce-${nonce}';">
      </head>
      <body>
        <style>
          body {
            margin: 0;
            overflow: hidden;
          }
        </style>
        <script nonce="${nonce}">
          console.log('Skrip ini dijalankan dengan nonce:', '${nonce}');
        </script>
        <script src="p5.js" nonce="${nonce}"></script>
        <script src="main.js" nonce="${nonce}"></script>
        <script src="firework.js" nonce="${nonce}"></script>
      </body>
    </html>`;

  // Tentukan lokasi file yang akan dihasilkan
  const outputPath = path.join(process.cwd(), 'index.html');

  // Simpan HTML ke file
  fs.writeFileSync(outputPath, htmlContent);
  console.log('Halaman HTML dengan nonce dinamis telah dibuat di:', outputPath);

  // Menetapkan identitas pengguna Git sebelum melakukan commit
  try {
    await runGitCommand('git config --global user.name "GitHub Actions"');
    await runGitCommand('git config --global user.email "actions@github.com"');

    // Menambahkan semua file yang telah diubah ke staging
    await runGitCommand('git add .');

    // Jalankan perintah git untuk commit dan push
    await runGitCommand('git commit -m "Update HTML with new nonce at ' + new Date().toISOString() + '"');
    await runGitCommand('git push origin main');
    console.log('Perubahan telah di-commit dan dipush ke GitHub.');
  } catch (error) {
    console.error('Terjadi kesalahan saat menjalankan perintah git:', error);
  }
}

// Jalankan fungsi generateHtmlAndCommit sekali
generateHtmlAndCommit();
