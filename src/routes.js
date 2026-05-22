import express from 'express';
import { showHomePage } from './controllers/index.js';
import { showOrganizationsPage, showOrganizationDetailsPage } from './controllers/organizations.js';
import { showProjectsPage, showProjectDetailsPage } from './controllers/projects.js';
import { showCategoriesPage } from './controllers/categories.js';
import { testErrorPage } from './controllers/errors.js';

const router = express.Router();

// Core landing routes
router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/categories', showCategoriesPage);

// Service Projects routes
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage); // Added route for specific project details

// Organization details route
router.get('/organization/:id', showOrganizationDetailsPage);

// Error-handling routes
router.get('/test-error', testErrorPage);

export default router;