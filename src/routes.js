import express from 'express';
import { showHomePage } from './controllers/index.js';
import { showOrganizationsPage, showOrganizationDetailsPage } from './controllers/organizations.js';
import { showProjectsPage, showProjectDetailsPage } from './controllers/projects.js';
import { showCategoriesPage, showCategoryDetailsPage } from './controllers/categories.js';
import { testErrorPage } from './controllers/errors.js';
import { showNewOrganizationForm } from './controllers/organizations.js';
import { processNewOrganizationForm } from './controllers/organizations.js';
import { organizationValidation } from './controllers/organizations.js';
import { showEditOrganizationForm } from './controllers/organizations.js';
import { processEditOrganizationForm } from './controllers/organizations.js';

const router = express.Router();

// Core landing routes
router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/categories', showCategoriesPage);

// New Category details route
router.get('/category/:id', showCategoryDetailsPage);

// Service Projects routes
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);

// Organization details route
router.get('/organization/:id', showOrganizationDetailsPage);

// Route for new organization page
router.get('/new-organization', showNewOrganizationForm);

// Error-handling routes
router.get('/test-error', testErrorPage);

// Route to handle new organization form submission
router.post('/new-organization', organizationValidation, processNewOrganizationForm);

// Route to display the edit organization form
router.get('/edit-organization/:id', showEditOrganizationForm);

// Route to handle the edit organization form submission
router.post('/edit-organization/:id', organizationValidation, processEditOrganizationForm);


export default router;