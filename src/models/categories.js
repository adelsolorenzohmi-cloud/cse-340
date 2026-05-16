import pool from './db.js'; // Adjust if your pool import is named differently in projects.js

/**
 * Fetch all categories from the database ordered alphabetically
 * @returns {Promise<Array>} Array of category objects
 */
export async function getAllCategories() {
    try {
        const sql = "SELECT category_id, category_name FROM public.categories ORDER BY category_name ASC";
        const data = await pool.query(sql);
        return data.rows;
    } catch (error) {
        console.error("Error in getAllCategories model:", error);
        throw error;
    }
}