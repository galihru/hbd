import express from 'express';  // Menggunakan import untuk Express
import fetch from 'node-fetch'; // Menggunakan node-fetch untuk mengambil HTML

const app = express();
const port = 3000;

app.get('/', async (req, res) => {
  const nonce = Math.random().toString(36).substring(2, 15); // Membuat nonce acak
  const url = 'https://raw.githubusercontent.com/4211421036/hbd/main/index.html'; // URL file HTML

  try {
    const response = await fetch(url);
    let htmlContent = await response.text();

    // Menambahkan nonce pada script tag
    htmlContent = htmlContent.replace(/<script src=".*"><\/script>/g, (match) => {
      return match.replace('></script>', ` nonce="${nonce}"></script>`);
    });

    // Mengatur CSP dengan nonce yang baru saja dihasilkan
    htmlContent = htmlContent.replace(
      /<meta http-equiv="Content-Security-Policy"[^>]*>/,
      `<meta http-equiv="Content-Security-Policy" content="script-src 'nonce-${nonce}';">`
    );

    res.send(htmlContent); // Kirim HTML yang sudah diperbarui ke pengguna
  } catch (error) {
    res.status(500).send('Terjadi kesalahan saat memperbarui HTML');
  }
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
