// sc.js
import fetch from 'node-fetch';  // Menggunakan import alih-alih require

// Fungsi untuk memperbarui nonce di file HTML
async function updateNonce() {
  const nonce = Math.random().toString(36).substring(2, 15); // Membuat nonce acak
  const url = 'https://raw.githubusercontent.com/4211421036/hbd/main/index.html'; // URL file HTML yang akan diperbarui

  try {
    const response = await fetch(url);
    let htmlContent = await response.text();

    // Menambahkan nonce pada script tag
    htmlContent = htmlContent.replace(/<script src=".*"><\/script>/g, (match) => {
      return match.replace('></script>', ` nonce="${nonce}"></script>`);
    });

    console.log('File HTML telah diperbarui dengan nonce:', nonce);
    console.log(htmlContent); // Cetak HTML yang sudah diperbarui di konsol (untuk pengujian)

    // **Catatan:** Karena GitHub Pages tidak mendukung pengeditan file langsung dari server, kamu harus mengunduh dan mengubah file secara manual atau menggunakan API eksternal.

  } catch (error) {
    console.error('Terjadi kesalahan saat memperbarui HTML:', error);
  }
}

// Memanggil fungsi untuk memperbarui nonce
updateNonce();
