// Import any needed model functions
import {
    getAllCategories,
    getCategoryById,
    getProjectsByCategoryId,
    updateCategoryAssignments,
    createCategory,
    updateCategory
} from '../models/categories.js';

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

// Render Create Category Form
const showCreateCategoryForm = async (req, res) => {
    res.render('new-category', { title: 'Create New Category', errors: null, category_name: '' });
};

// Process Create Category Form
const processCreateCategoryForm = async (req, res) => {
    const { category_name } = req.body;
    const errors = [];

    // Server-side validation (min 3, max 100)
    if (!category_name) {
        errors.push({ msg: 'Category name is required.' });
    }
    if (category_name && category_name.length < 3) {
        errors.push({ msg: 'Category name must be at least 3 characters long.' });
    }
    if (category_name && category_name.length > 100) {
        errors.push({ msg: 'Category name cannot exceed 100 characters.' });
    }

    if (errors.length > 0) {
        return res.render('new-category', {
            title: 'Create New Category',
            errors,
            category_name
        });
    }

    try {
        await createCategory(category_name);
        res.redirect('/categories');
    } catch (error) {
        console.error("Error in processCreateCategoryForm:", error);
        errors.push({ msg: 'Server error saving the category.' });
        res.render('new-category', { title: 'Create New Category', errors, category_name });
    }
};

// Render Edit Category Form
const showEditCategoryForm = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await getCategoryById(categoryId);
        if (!category) {
            return res.status(404).render('errors/404', { title: 'Category Not Found' });
        }
        res.render('edit-category', { title: 'Edit Category', errors: null, category });
    } catch (error) {
        console.error("Error in showEditCategoryForm:", error);
        res.status(500).render('errors/500', { title: 'Server Error' });
    }
};

// Process Edit Category Form
const processEditCategoryForm = async (req, res) => {
    const categoryId = req.params.id;
    const { category_name } = req.body;
    const errors = [];

    // Server-side validation (min 3, max 100)
    if (!category_name) {
        errors.push({ msg: 'Category name is required.' });
    }
    if (category_name && category_name.length < 3) {
        errors.push({ msg: 'Category name must be at least 3 characters long.' });
    }
    if (category_name && category_name.length > 100) {
        errors.push({ msg: 'Category name cannot exceed 100 characters.' });
    }

    if (errors.length > 0) {
        return res.render('edit-category', {
            title: 'Edit Category',
            errors,
            category: { category_id: categoryId, category_name }
        });
    }

    try {
        await updateCategory(categoryId, category_name);
        res.redirect('/categories');
    } catch (error) {
        console.error("Error in processEditCategoryForm:", error);
        errors.push({ msg: 'Server error updating the category.' });
        res.render('edit-category', {
            title: 'Edit Category',
            errors,
            category: { category_id: categoryId, category_name }
        });
    }
};

// Export any controller functions
export {
    showCategoriesPage,
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    showCreateCategoryForm,
    processCreateCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm
};