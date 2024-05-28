import { Router, Request, Response } from 'express';
import prisma from '../prisma';
import { check, validationResult } from 'express-validator';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { deletedAt: null }
    });
    res.json(tasks);
  } catch (error) {
    console.error('Error retrieving tasks:', error);
    res.status(500).json({ error: 'Error retrieving tasks', details: error });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const task = await prisma.task.findUnique({
      where: { id: parseInt(id) }
    });
    if (task) {
      res.json(task);
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    console.error('Error retrieving task:', error);
    res.status(500).json({ error: 'Error retrieving task', details: error });
  }
});

router.post(
  '/',
  [
    check('projectId').isInt().withMessage('Project ID must be an integer'),
    check('description').notEmpty().withMessage('Description is required'),
    check('name').notEmpty().withMessage('Name is required')
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { projectId, description, name } = req.body;
    try {
      const newTask = await prisma.task.create({
        data: { projectId, description, name}
      });
      res.json(newTask);
    } catch (error) {
      console.error('Error creating task:', error); 
      res.status(500).json({ error: 'Error creating task', details: error });
    }
  }
);

router.post('/:id/complete', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const completedTask = await prisma.task.update({
      where: { id: parseInt(id) },
      data: { isCompleted: true }
    });
    res.json(completedTask);
  } catch (error) {
    console.error('Error completing task:', error);
    res.status(500).json({ error: 'Error completing task', details: error });
  }
});

router.post('/:id/delete', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedTask = await prisma.task.update({
      where: { id: parseInt(id) },
      data: { deletedAt: new Date() }
    });
    res.json(deletedTask);
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Error deleting task', details: error });
  }
});

export default router;
