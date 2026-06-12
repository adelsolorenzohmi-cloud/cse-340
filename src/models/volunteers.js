import pool from './db.js';

export const addVolunteer = async (userId, projectId) => {
    const sql = 'INSERT INTO project_volunteers (user_id, project_id) VALUES ($1, $2)';
    await pool.query(sql, [userId, projectId]);
};

export const removeVolunteer = async (userId, projectId) => {
    const sql = 'DELETE FROM project_volunteers WHERE user_id = $1 AND project_id = $2';
    await pool.query(sql, [userId, projectId]);
};

export const getVolunteeredProjectsByUserId = async (userId) => {
    const sql = `
        SELECT p.* FROM service_project p
        JOIN project_volunteers pv ON p.project_id = pv.project_id
        WHERE pv.user_id = $1`;
    const result = await pool.query(sql, [userId]);
    return result.rows;
};

export const isUserVolunteering = async (userId, projectId) => {
    const sql = 'SELECT 1 FROM project_volunteers WHERE user_id = $1 AND project_id = $2';
    const result = await pool.query(sql, [userId, projectId]);
    return result.rowCount > 0;
};