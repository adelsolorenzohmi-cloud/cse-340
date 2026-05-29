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

/**
 * Insert a brand new category into the database.
 * @param {string} category_name
 * @returns {Promise<Object>} The created category object
 */
export async function createCategory(category_name) {
    try {
        const sql = `
            INSERT INTO public.categories (category_name) 
            VALUES ($1) 
            RETURNING category_id, category_name;
        `;
        const data = await pool.query(sql, [category_name]);
        return data.rows[0];
    } catch (error) {
        console.error("Error in createCategory model:", error);
        throw error;
    }
}

/**
 * Update an existing category name by its ID.
 * @param {number|string} categoryId
 * @param {string} category_name
 * @returns {Promise<Object>} The updated category object
 */
export async function updateCategory(categoryId, category_name) {
    try {
        const sql = `
            UPDATE public.categories 
            SET category_name = $1 
            WHERE category_id = $2 
            RETURNING category_id, category_name;
        `;
        const data = await pool.query(sql, [category_name, categoryId]);
        return data.rows[0];
    } catch (error) {
        console.error("Error in updateCategory model:", error);
        throw error;
    }
}

const assignCategoryToProject = async (projectId, categoryId) => {
    const sql = `
        INSERT INTO public.project_categories (project_id, category_id)
        VALUES ($1, $2);
    `;
    await pool.query(sql, [projectId, categoryId]);
};

/**
 * Clear existing assignments and write fresh associations
 * Matches table: public.project_categories
 */
export async function updateCategoryAssignments(projectId, categoryIds) {
    try {
        // 1. Clear out the old combinations for this project
        const deleteSql = `
            DELETE FROM public.project_categories
            WHERE project_id = $1;
        `;
        await pool.query(deleteSql, [projectId]);

        // If the user unchecked everything, we are done
        if (!categoryIds || categoryIds.length === 0) {
            return;
        }

        // Express submits a single checkbox as a string, multiple as an Array.
        // This converts strings to arrays so the 'for...of' loop never crashes.
        const normalizedIds = Array.isArray(categoryIds) ? categoryIds : [categoryIds];

        // 2. Loop and run our helper function for each checked item
        for (const categoryId of normalizedIds) {
            await assignCategoryToProject(projectId, categoryId);
        }
    } catch (error) {
        console.error("Error in updateCategoryAssignments model:", error);
        throw error;
    }
}