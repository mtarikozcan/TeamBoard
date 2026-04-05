export function errorHandler(err, req, res, next) {
  console.error('Hata:', err);

  res.status(500).json({ error: 'Sunucu hatası oluştu.' });
}
