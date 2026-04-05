import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

pool.on('connect', () => {
  console.log('PostgreSQL bağlantısı kuruldu.');
});

pool.on('error', (err) => {
  console.error('PostgreSQL bağlantı hatası:', err);
});

export default pool;
