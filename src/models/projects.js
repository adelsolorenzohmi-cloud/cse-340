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

export { getAllProjects }