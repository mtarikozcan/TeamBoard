import pool from '../config/db.js';

export async function getTasksByProject(projectId) {
  const result = await pool.query(
    `SELECT
       t.id,
       t.project_id,
       t.created_by,
       t.assigned_to,
       t.title,
       t.description,
       t.status,
       t.priority,
       t.due_date,
       t.created_at,
       u.name AS assigned_to_name,
       u.email AS assigned_to_email
     FROM tasks t
     LEFT JOIN users u ON u.id = t.assigned_to
     WHERE t.project_id = $1
     ORDER BY t.created_at DESC`,
    [projectId]
  );

  const tasks = result.rows;
  const grouped = {
    todo: tasks.filter(t => t.status === 'todo'),
    inprogress: tasks.filter(t => t.status === 'inprogress'),
    done: tasks.filter(t => t.status === 'done'),
  };

  return grouped;
}

export async function getTaskById(taskId) {
  const result = await pool.query(
    `SELECT
       t.id,
       t.project_id,
       t.created_by,
       t.assigned_to,
       t.title,
       t.description,
       t.status,
       t.priority,
       t.due_date,
       t.created_at,
       u.name AS assigned_to_name,
       u.email AS assigned_to_email
     FROM tasks t
     LEFT JOIN users u ON u.id = t.assigned_to
     WHERE t.id = $1`,
    [taskId]
  );

  return result.rows[0] || null;
}

export async function createTask(projectId, createdBy, { title, description, assignedTo, priority, dueDate }) {
  const result = await pool.query(
    `INSERT INTO tasks (project_id, created_by, assigned_to, title, description, priority, due_date)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, project_id, created_by, assigned_to, title, description, status, priority, due_date, created_at`,
    [projectId, createdBy, assignedTo || null, title, description || null, priority || 'medium', dueDate || null]
  );

  return result.rows[0];
}

export async function updateTask(taskId, fields) {
  const allowedFields = ['title', 'description', 'status', 'assigned_to', 'priority', 'due_date'];
  const updates = {};

  for (const [key, value] of Object.entries(fields)) {
    if (allowedFields.includes(key)) {
      updates[key] = value;
    }
  }

  if (Object.keys(updates).length === 0) {
    return null;
  }

  const setClauses = Object.keys(updates)
    .map((key, idx) => `${key} = $${idx + 1}`)
    .join(', ');

  const values = Object.values(updates);
  values.push(taskId);

  const result = await pool.query(
    `UPDATE tasks SET ${setClauses} WHERE id = $${values.length} RETURNING *`,
    values
  );

  return result.rows[0] || null;
}

export async function deleteTask(taskId) {
  const result = await pool.query(
    `DELETE FROM tasks WHERE id = $1 RETURNING id`,
    [taskId]
  );

  return result.rows[0] || null;
}

export async function getTaskOwner(taskId) {
  const result = await pool.query(
    `SELECT created_by, project_id FROM tasks WHERE id = $1`,
    [taskId]
  );

  return result.rows[0] || null;
}
