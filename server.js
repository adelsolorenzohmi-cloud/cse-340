import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import { testConnection } from './src/models/db.js';
import { getAllOrganizations } from './src/models/organizations.js';
import { getAllProjects } from './src/models/projects.js';


// Recreate __filename and __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the the application environment
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';

// Define the port number the server will listen on
const PORT = process.env.PORT || 3000;

const app = express();

/**
 * Configure Express middleware
 */
// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Tell Express where to find your templates
app.set('views', path.join(__dirname, 'src/views'));

// Routes
// Home route
app.get('/', async (req, res) => {
    const title = 'Home';
    res.render('home', { title });
});

// Organizations route
app.get('/organizations', async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Our Partner Organizations';
    res.render('organizations', { title, organizations });
});

// Projects route
app.get('/projects', async (req, res) => {
    try {
        const projects = await getAllProjects();
        const title = 'Service Projects';
        res.render('projects', { title, projects: projects || [] });
    } catch (error) {
        console.error("Route Error:", error);
        res.status(500).send("Error loading projects");
    }
});

// Categories route
app.get('/categories', async (req, res) => {
    const title = 'Categories';
    res.render('categories', { title });
});

//Start the server

app.listen(PORT, async () => {
    try {
        await testConnection();
        console.log(`Server is running at http://127.0.0.1:${PORT}`);
        console.log(`Environment: ${NODE_ENV}`);

        // Console log verification
        const projects = await getAllProjects();
        console.log("Projects loaded successfully for verification.");
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
});