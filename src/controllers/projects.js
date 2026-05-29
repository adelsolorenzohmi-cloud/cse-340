// Import the needed model functions
import { getUpcomingProjects, getProjectDetails, getCategoriesByProjectId, createProject, updateProject } from '../models/projects.js';
import { getAllOrganizations } from '../models/organizations.js';

// Import express-validator functions
import { body, validationResult } from 'express-validator';

// Configuration constant for the number of upcoming projects to display
const NUMBER_OF_UPCOMING_PROJECTS = 5;

// Validation rules array for creating a project
const projectValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
    body('location')
        .trim()
        .notEmpty().withMessage('Location is required')
        .isLength({ max: 200 }).withMessage('Location must be less than 200 characters'),
    body('date')
        .notEmpty().withMessage('Date is required')
        .isISO8601().withMessage('Date must be a valid date format'),
    body('organizationId')
        .notEmpty().withMessage('Organization is required')
        .isInt().withMessage('Organization must be a valid integer')
];

// Handler to render the home/upcoming projects page
const showProjectsPage = async (req, res) => {
    try {
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
        const { id } = req.params;
        const project = await getProjectDetails(id);

        if (!project) {
            return res.status(404).send('Project Not Found');
        }

        const categories = await getCategoriesByProjectId(id);

        res.render('project', { title: project.title, project, categories });
    } catch (error) {
        console.error('Error fetching project details:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Show new project form
const showNewProjectForm = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Add New Service Project';

    res.render('new-project', { title, organizations });
};

// Process new project form with validation check loop
const processNewProjectForm = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Loop through validation errors and flash them
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // Redirect back to the new project form
        return res.redirect('/new-project');
    }

    // Extract form data from req.body if validation passes
    const { title, description, location, date, organizationId } = req.body;

    try {
        // Create the new project in the database
        const newProjectId = await createProject(title, description, location, date, organizationId);

        req.flash('success', 'New service project created successfully!');
        res.redirect(`/project/${newProjectId}`);
    } catch (error) {
        console.error('Error creating new project:', error);
        req.flash('error', 'There was an error creating the service project.');
        res.redirect('/new-project');
    }
};

// Show the edit project form pre-populated with data
const showEditProjectForm = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await getProjectDetails(id);

        if (!project) {
            req.flash('error', 'Project not found.');
            return res.redirect('/projects');
        }

        const organizations = await getAllOrganizations();
        const title = `Edit Project: ${project.title}`;

        // Added the messages object here to clear the ReferenceError in your EJS view
        res.render('update-project', {
            title,
            project,
            organizations,
            messages: {
                error: req.flash('error'),
                success: req.flash('success')
            }
        });
    } catch (error) {
        console.error('Error rendering edit project form:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Process the edit project form submission
const processEditProjectForm = async (req, res) => {
    const { id } = req.params;

    // Run the request through validation rules
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        return res.redirect(`/edit-project/${id}`);
    }

    // Destructure properties matching your database mapping architecture
    const { title, description, location, date, organizationId } = req.body;

    try {
        const projectData = {
            project_title: title,
            project_description: description,
            project_location: location,
            project_date: date,
            organization_id: organizationId
        };

        await updateProject(id, projectData);

        req.flash('success', 'Service project updated successfully!');
        res.redirect(`/project/${id}`);
    } catch (error) {
        console.error('Error updating project:', error);
        req.flash('error', 'There was an error updating the service project.');
        res.redirect(`/edit-project/${id}`);
    }
};

// Export the controller functions and the validation array for routing use
export {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    projectValidation,
    showEditProjectForm,
    processEditProjectForm
};