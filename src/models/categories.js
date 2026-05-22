import pool from './db.js';

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

/**
 * Retrieve a single category by its ID.
 * @param {number|string} categoryId
 * @returns {Promise<Object|null>}
 */
export async function getCategoryById(categoryId) {
    try {
        const sql = "SELECT category_id, category_name FROM public.categories WHERE category_id = $1";
        const data = await pool.query(sql, [categoryId]);
        return data.rows[0] || null;
    } catch (error) {
        console.error("Error in getCategoryById model:", error);
        throw error;
    }
}

/**
 * Retrieve all service projects for a given category.
 * @param {number|string} categoryId - The unique ID of the category.
 * @returns {Promise<Array>} Array of service project objects matching the category.
 */
export async function getProjectsByCategoryId(categoryId) {
    try {
        const sql = `
            SELECT 
                p.project_id,
                p.organization_id,
                p.project_title,
                p.project_description,
                p.project_location,
                p.project_date
            FROM public.service_project p
            INNER JOIN public.project_categories pc ON p.project_id = pc.project_id
            WHERE pc.category_id = $1
            ORDER BY p.project_date ASC;
        `;
        const data = await pool.query(sql, [categoryId]);
        return data.rows;
    } catch (error) {
        console.error("Error in getProjectsByCategoryId model:", error);
        throw error;
    }
}