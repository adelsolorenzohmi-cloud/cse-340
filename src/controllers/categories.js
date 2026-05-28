// Import any needed model functions
import { getAllCategories, getCategoryById, getProjectsByCategoryId, updateCategoryAssignments } from '../models/categories.js';

import { getProjectDetails, getCategoriesByProjectId as getCategoriesByServiceProjectId } from '../models/projects.js';


// Define any controller functions
const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Service Categories';

    res.render('categories', { title, categories });
};

const showCategoryDetailsPage = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await getCategoryById(categoryId);

        if (!category) {
            return res.status(404).render('errors/404', { title: 'Category Not Found' });
        }

        const projects = await getProjectsByCategoryId(categoryId);
        const title = `${category.category_name} Projects`;

        res.render('category', { title, category, projects });
    } catch (error) {
        console.error("Error in showCategoryDetailsPage controller:", error);
        res.status(500).render('errors/500', { title: 'Server Error' });
    }
};

const showAssignCategoriesForm = async (req, res) => {
    try {
        const projectId = req.params.projectId;

        const projectDetails = await getProjectDetails(projectId);
        const categories = await getAllCategories();
        const assignedCategories = await getCategoriesByServiceProjectId(projectId);

        const title = 'Assign Categories to Project';

        res.render('assign-categories', { title, projectId, projectDetails, categories, assignedCategories });
    } catch (error) {
        console.error("Error in showAssignCategoriesForm:", error);
        res.status(500).send("Internal Server Error");
    }
};

const processAssignCategoriesForm = async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const selectedCategoryIds = req.body.categoryIds || [];

        // Ensure selectedCategoryIds is an array
        const categoryIdsArray = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [selectedCategoryIds];

        await updateCategoryAssignments(projectId, categoryIdsArray);

        req.flash('success', 'Categories updated successfully.');
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error("Error in processAssignCategoriesForm:", error);
        req.flash('error', 'There was an error updating categories.');
        res.redirect(`/project/${req.params.projectId}/assign-categories`);
    }
};

// Export any controller functions
export {
    showCategoriesPage,
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm
};