import db from './db.js'

const getAllProjects = async () => {
  const query = `
    SELECT 
      p.project_id, 
      p.project_title, 
      p.project_description, 
      p.project_location, 
      p.project_date, 
      o.name
    FROM 
      public.service_project p
    JOIN 
      public.organization o ON p.organization_id = o.organization_id;
  `;

  const result = await db.query(query);
  return result.rows;
}

const getProjectsByOrganizationId = async (organizationId) => {
  const query = `
    SELECT
      project_id,
      organization_id,
      project_title,
      project_description,
      project_location,
      project_date
    FROM public.service_project
    WHERE organization_id = $1
    ORDER BY project_date;
  `;

  const queryParams = [organizationId];
  const result = await db.query(query, queryParams);

  return result.rows;
};

/**
 * Retrieves the next N upcoming service projects from the database.
 * Filters for projects happening today or in the future.
 * @param {number} numberOfProjects - The maximum number of projects to return.
 */
const getUpcomingProjects = async (numberOfProjects) => {
  const query = `
    SELECT 
      p.project_id, 
      p.project_title AS title, 
      p.project_description AS description, 
      p.project_date AS date, 
      p.project_location AS location, 
      p.organization_id, 
      o.name AS organization_name
    FROM 
      public.service_project p
    INNER JOIN 
      public.organization o ON p.organization_id = o.organization_id
    WHERE 
      p.project_date >= CURRENT_DATE
    ORDER BY 
      p.project_date ASC
    LIMIT $1;
  `;

  const queryParams = [numberOfProjects];
  const result = await db.query(query, queryParams);
  return result.rows;
};

/**
 * Retrieves details for a single service project by its ID.
 * @param {number|string} id - The unique ID of the service project.
 */
const getProjectDetails = async (id) => {
  const query = `
    SELECT 
      p.project_id, 
      p.project_title AS title, 
      p.project_description AS description, 
      p.project_date AS date, 
      p.project_location AS location, 
      p.organization_id, 
      o.name AS organization_name
    FROM 
      public.service_project p
    INNER JOIN 
      public.organization o ON p.organization_id = o.organization_id
    WHERE 
      p.project_id = $1;
  `;

  const queryParams = [id];
  const result = await db.query(query, queryParams);

  // Return the single object if found, or null if no project matches the ID
  return result.rows[0] || null;
};

/**
 * Retrieve all categories for a given service project.
 * @param {number|string} projectId - The unique ID of the service project.
 * @returns {Promise<Array>} Array of category objects linked to the project.
 */
const getCategoriesByProjectId = async (projectId) => {
  const query = `
    SELECT 
      c.category_id,
      c.category_name
    FROM public.categories c
    INNER JOIN public.project_categories pc ON c.category_id = pc.category_id
    WHERE pc.project_id = $1
    ORDER BY c.category_name ASC;
  `;

  const queryParams = [projectId];
  const result = await db.query(query, queryParams);
  return result.rows;
};

// Export all the model functions
export {
  getAllProjects,
  getProjectsByOrganizationId,
  getUpcomingProjects,
  getProjectDetails,
  getCategoriesByProjectId
};