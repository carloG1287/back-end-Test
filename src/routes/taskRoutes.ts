import { Router,Request, Response } from 'express';
import prisma from '../prisma';
import { check, validationResult } from 'express-validator';

const router = Router();

// Endpoint to create a new task
router.post(
    '/',
    [
      check('projectId').isInt().withMessage('Project ID must be an integer'),
      check('description').notEmpty().withMessage('Description is required')
    ],
    async (req: Request, res: Response) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { projectId, description } = req.body;
      try {
        const newTask = await prisma.task.create({
          data: { projectId, description }
        });
        res.json(newTask);
      } catch (error) {
        res.status(500).json({ error: 'Error creating task' });
      }
    }
  );

// Endpoint to mark a task as completed
router.post('/:id/complete', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const completedTask = await prisma.task.update({
        where: { id: parseInt(id) },
        data: { isCompleted: true }
      });
      res.json(completedTask);
    } catch (error) {
      res.status(500).json({ error: 'Error completing task' });
    }
  });

export default router;
