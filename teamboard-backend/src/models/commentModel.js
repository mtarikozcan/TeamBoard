import pool from '../config/db.js';

export async function getCommentsByTask(taskId) {
  const result = await pool.query(
    `SELECT
       c.id,
       c.task_id,
       c.user_id,
       c.content,
       c.created_at,
       u.name AS user_name,
       u.email AS user_email
     FROM comments c
     INNER JOIN users u ON u.id = c.user_id
     WHERE c.task_id = $1
     ORDER BY c.created_at ASC`,
    [taskId]
  );

  return result.rows;
}

export async function createComment(taskId, userId, content) {
  const result = await pool.query(
    `INSERT INTO comments (task_id, user_id, content)
     VALUES ($1, $2, $3)
     RETURNING id, task_id, user_id, content, created_at`,
    [taskId, userId, content]
  );

  return result.rows[0];
}

export async function deleteComment(commentId) {
  const result = await pool.query(
    `DELETE FROM comments WHERE id = $1 RETURNING id`,
    [commentId]
  );

  return result.rows[0] || null;
}

export async function getCommentOwner(commentId) {
  const result = await pool.query(
    `SELECT user_id, task_id FROM comments WHERE id = $1`,
    [commentId]
  );

  return result.rows[0] || null;
}
