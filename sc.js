function generateRandomNonce() {
  // Menghasilkan string acak dengan panjang 32 karakter (sesuai dengan rekomendasi)
  return crypto.getRandomValues(new Uint8Array(32)).toString('base64');
}

// Mendapatkan semua elemen script
const scripts = document.querySelectorAll('script');

// Iterasi melalui setiap elemen script dan tambahkan atribut nonce
scripts.forEach(script => {
  const nonce = generateRandomNonce();
  script.setAttribute('nonce', nonce);
});

// Mengatur CSP dengan nonce yang baru saja dihasilkan
const metaCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
metaCSP.content = `script-src 'nonce-${nonce}';`;
