const fetch = require('node-fetch');  // Kita bisa menggunakan node-fetch untuk mengambil isi HTML
const fs = require('fs');             // Jika ada perubahan file menggunakan fs, tetap butuh node fs

async function updateNonceInHTML() {
  // Ambil isi file index.html dari repository yang telah di-checkout
  const htmlPath = 'index.html';  // Atur sesuai dengan lokasi file HTML di dalam repo

  // Baca file HTML yang sudah ada
  const data = fs.readFileSync(htmlPath, 'utf8');

  // Fungsi untuk membuat nonce
  function generateNonce() {
    const array = new Uint32Array(10);
    window.crypto.getRandomValues(array);
    return array.join('');
  }

  const nonce = generateNonce();  // Generate nonce baru

  // Mengganti tag script dengan nonce baru
  const updatedData = data.replace(/<script.*?src="(.*?)".*?>/g, (match, src) => {
    return match.replace('<script', `<script nonce="${nonce}"`);
  });

  // Tulis file dengan nonce baru
  fs.writeFileSync(htmlPath, updatedData, 'utf8');
  console.log("Nonce updated successfully in index.html!");
}

updateNonceInHTML();
