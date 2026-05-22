// Import the needed model functions
import { getUpcomingProjects, getProjectDetails, getCategoriesByProjectId } from '../models/projects.js';

// Configuration constant for the number of upcoming projects to display
const NUMBER_OF_UPCOMING_PROJECTS = 5;

// Handler to render the home/upcoming projects page
const showProjectsPage = async (req, res) => {
    try {
        // Fetch only the limited number of upcoming projects instead of all projects
        const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
        const title = 'Upcoming Service Projects';

        res.render('projects', { title, projects });
    } catch (error) {
        console.error('Error fetching upcoming projects:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Handler to render a single service project's detail page
const showProjectDetailsPage = async (req, res) => {
    try {
        // Extract the service project ID from the URL parameters
        const { id } = req.params;

        // Retrieve the specific project details from the database
        const project = await getProjectDetails(id);

        // If no project matches the given ID, return a 404 Not Found error
        if (!project) {
            return res.status(404).send('Project Not Found');
        }

        // Fetch categories/tags for this specific project
        const categories = await getCategoriesByProjectId(id);

        // Render the project.ejs view, passing the individual project data and categories
        res.render('project', { title: project.title, project, categories });
    } catch (error) {
        console.error('Error fetching project details:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Export the controller functions for routing use
export { showProjectsPage, showProjectDetailsPage };