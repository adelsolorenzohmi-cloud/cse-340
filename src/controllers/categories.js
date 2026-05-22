// Import any needed model functions
import { getAllCategories, getCategoryById, getProjectsByCategoryId } from '../models/categories.js';

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

// Export any controller functions
export { showCategoriesPage, showCategoryDetailsPage };