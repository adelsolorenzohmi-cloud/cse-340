import express from 'express';
import { showHomePage } from './controllers/index.js';
import { testErrorPage } from './controllers/errors.js';

// Categories Imports
import {
    showCategoriesPage,
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    showCreateCategoryForm,
    processCreateCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm
} from './controllers/categories.js';

// Organizations Imports
import {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    organizationValidation,
    showEditOrganizationForm,
    processEditOrganizationForm
} from './controllers/organizations.js';

// Projects Imports 
import {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    projectValidation,
    showEditProjectForm,
    processEditProjectForm
} from './controllers/projects.js';

// Users import. 
import {
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    showDashboard,
    requireRole
} from './controllers/users.js';

//Volunteers import.
import { processVolunteer, processRemoveVolunteer } from './controllers/volunteers.js';

const router = express.Router();

// Core landing routes
router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/categories', showCategoriesPage);

// New Category details route
router.get('/category/:id', showCategoryDetailsPage);

// Service Categories Management Routes
router.get('/new-category', requireRole('admin'), showCreateCategoryForm);
router.post('/new-category', requireRole('admin'), processCreateCategoryForm);
router.get('/edit-category/:id', requireRole('admin'), showEditCategoryForm);
router.post('/edit-category/:id', requireRole('admin'), processEditCategoryForm);

// Service Projects routes
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);

// Organization details route
router.get('/organization/:id', showOrganizationDetailsPage);

// Route for new organization page
router.get('/new-organization', requireRole('admin'), showNewOrganizationForm);

// Error-handling routes
router.get('/test-error', testErrorPage);

// Route to handle new organization form submission
router.post('/new-organization', requireRole('admin'), organizationValidation, processNewOrganizationForm);

// Route to display the edit organization form
router.get('/edit-organization/:id', requireRole('admin'), showEditOrganizationForm);

// Route to handle the edit organization form submission
router.post('/edit-organization/:id', requireRole('admin'), organizationValidation, processEditOrganizationForm);

// Route for new project page
router.get('/new-project', requireRole('admin'), showNewProjectForm);

// Route to handle new project form submission with validation middleware injected
router.post('/new-project', requireRole('admin'), projectValidation, processNewProjectForm);

// Routes to handle the assign categories to project form
router.get('/project/:projectId/assign-categories', requireRole('admin'), showAssignCategoriesForm);
router.post('/project/:projectId/assign-categories', requireRole('admin'), processAssignCategoriesForm);

//Routes to handle editing service projects ---
router.get('/edit-project/:id', requireRole('admin'), showEditProjectForm);
router.post('/edit-project/:id', requireRole('admin'), projectValidation, processEditProjectForm);

// User registration routes
router.get('/register', showUserRegistrationForm);
router.post('/register', processUserRegistrationForm);

// User login routes
router.get('/login', showLoginForm);
router.post('/login', processLoginForm);
router.get('/logout', processLogout);

// Protected dashboard route
router.get('/dashboard', requireLogin, showDashboard);

//Volunteer routes.
router.post('/project/:id/volunteer', requireLogin, processVolunteer);
router.post('/project/:id/unvolunteer', requireLogin, processRemoveVolunteer);

export default router;