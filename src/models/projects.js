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

// Export the model functions
export { getAllProjects, getProjectsByOrganizationId };