import pool from '../config/db.js';

export async function findByEmail(email) {
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('findByEmail hatası:', error);
    throw error;
  }
}

export async function createUser(name, email, passwordHash) {
  try {
    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
      [name, email, passwordHash]
    );
    return result.rows[0];
  } catch (error) {
    console.error('createUser hatası:', error);
    throw error;
  }
}

export async function findById(id) {
  try {
    const result = await pool.query('SELECT id, name, email, created_at FROM users WHERE id = $1', [id]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('findById hatası:', error);
    throw error;
  }
}
