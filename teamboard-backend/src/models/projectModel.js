import pool from '../config/db.js';

export async function getProjectsByUser(userId) {
  const result = await pool.query(
    `SELECT
       p.id,
       p.name,
       p.description,
       p.owner_id,
       p.created_at,
       pm.role,
       COUNT(pm2.id)::int AS member_count
     FROM projects p
     INNER JOIN project_members pm
       ON pm.project_id = p.id AND pm.user_id = $1
     INNER JOIN project_members pm2
       ON pm2.project_id = p.id
     GROUP BY p.id, p.name, p.description, p.owner_id, p.created_at, pm.role
     ORDER BY p.created_at DESC`,
    [userId]
  );
  return result.rows;
}

export async function getProjectById(projectId) {
  const projectResult = await pool.query(
    `SELECT id, name, description, owner_id, created_at FROM projects WHERE id = $1`,
    [projectId]
  );

  if (projectResult.rows.length === 0) return null;

  const membersResult = await pool.query(
    `SELECT
       pm.id,
       u.id AS user_id,
       u.name,
       u.email,
       pm.role,
       pm.joined_at
     FROM project_members pm
     INNER JOIN users u ON u.id = pm.user_id
     WHERE pm.project_id = $1
     ORDER BY pm.joined_at ASC`,
    [projectId]
  );

  return {
    ...projectResult.rows[0],
    members: membersResult.rows,
  };
}

export async function createProject(name, description, ownerId) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const projectResult = await client.query(
      `INSERT INTO projects (name, description, owner_id)
       VALUES ($1, $2, $3)
       RETURNING id, name, description, owner_id, created_at`,
      [name, description || null, ownerId]
    );

    const project = projectResult.rows[0];

    await client.query(
      `INSERT INTO project_members (project_id, user_id, role)
       VALUES ($1, $2, 'admin')`,
      [project.id, ownerId]
    );

    await client.query('COMMIT');
    return project;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function updateProject(projectId, name, description) {
  const result = await pool.query(
    `UPDATE projects
     SET name = $1, description = $2
     WHERE id = $3
     RETURNING id, name, description, owner_id, created_at`,
    [name, description ?? null, projectId]
  );
  return result.rows[0] || null;
}

export async function deleteProject(projectId) {
  const result = await pool.query(
    `DELETE FROM projects WHERE id = $1 RETURNING id`,
    [projectId]
  );
  return result.rows[0] || null;
}

export async function addMember(projectId, userId, role = 'member') {
  const result = await pool.query(
    `INSERT INTO project_members (project_id, user_id, role)
     VALUES ($1, $2, $3)
     ON CONFLICT (project_id, user_id) DO NOTHING
     RETURNING id, project_id, user_id, role, joined_at`,
    [projectId, userId, role]
  );
  return result.rows[0] || null;
}

export async function removeMember(projectId, userId) {
  const result = await pool.query(
    `DELETE FROM project_members
     WHERE project_id = $1 AND user_id = $2
     RETURNING id`,
    [projectId, userId]
  );
  return result.rows[0] || null;
}

export async function getMemberRole(projectId, userId) {
  const result = await pool.query(
    `SELECT role FROM project_members
     WHERE project_id = $1 AND user_id = $2`,
    [projectId, userId]
  );
  return result.rows[0]?.role || null;
}

export async function findUserByEmail(email) {
  const result = await pool.query(
    `SELECT id, name, email FROM users WHERE email = $1`,
    [email]
  );
  return result.rows[0] || null;
}
