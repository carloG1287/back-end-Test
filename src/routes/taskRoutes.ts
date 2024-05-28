import { Router } from 'express';
import prisma from '../prisma';

const router = Router();

// Endpoint to create a new task
router.post('/', async (req, res) => {
    // Extract projectId and description from the request body
    const { projectId, description } = req.body;

    // Create a new task in the database using Prisma
    const newTask = await prisma.task.create({
        data: {
            projectId,
            description,
        },
    });

    // Send the newly created task as a JSON response
    res.json(newTask);
});

// Endpoint to mark a task as completed
router.post('/:id/complete', async (req, res) => {
    // Extract task id from the request parameters
    const { id } = req.params;

    // Update the task to mark it as completed in the database using Prisma
    const completedTask = await prisma.task.update({
        where: { id: parseInt(id) }, // Convert id to an integer
        data: { isCompleted: true },
    });

    // Send the updated task as a JSON response
    res.json(completedTask);
});

export default router;
