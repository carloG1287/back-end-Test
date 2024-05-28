import express from 'express';
import projectRoutes from './routes/projectRoutes';
import taskRoutes from './routes/taskRoutes';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Routes for project-related endpoints
app.use('/projects', projectRoutes);

// Routes for task-related endpoints
app.use('/tasks', taskRoutes);

// Error handler middleware
app.use(errorHandler);

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
