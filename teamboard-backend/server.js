import app from './src/app.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`TeamBoard Backend sunucusu ${PORT} portunda çalışıyor...`);
});
