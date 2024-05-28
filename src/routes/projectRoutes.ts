import { Router } from 'express';
import prisma from '../prisma';

const router = Router();

// GET /projects - Retrieve all projects that are not soft-deleted
router.get('/', async (req, res) => {
  const projects = await prisma.project.findMany({
    where: {
      deletedAt: null // Only include projects that have not been soft-deleted
    },
    include: {
      tasks: true, // Include tasks related to each project
    },
  });
  res.json(projects); // Return the list of projects as a JSON response
});

// POST /projects - Create a new project
router.post('/', async (req, res) => {
  const { name } = req.body; // Extract the project name from the request body
  const newProject = await prisma.project.create({
    data: {
      name, // Use the extracted name to create a new project
    },
  });
  res.json(newProject); // Return the newly created project as a JSON response
});

// DELETE /projects/:id - Soft delete a project by setting its deletedAt field
router.delete('/:id', async (req, res) => {
  const { id } = req.params; // Extract the project ID from the route parameters
  const deletedProject = await prisma.project.update({
    where: { id: parseInt(id) }, // Convert the ID to an integer and find the project
    data: { deletedAt: new Date() } // Set the deletedAt field to the current date
  });
  res.json(deletedProject); // Return the updated (soft-deleted) project as a JSON response
});

// POST /projects/:id/rollback - Mark all tasks of a project as not completed
router.post('/:id/rollback', async (req, res) => {
  const { id } = req.params; // Extract the project ID from the route parameters
  await prisma.task.updateMany({
    where: { projectId: parseInt(id) }, // Find all tasks related to the project ID
    data: { isCompleted: false } // Mark all tasks as not completed
  });
  res.json({ message: 'Project rolled back' }); // Return a success message
});

export default router;
