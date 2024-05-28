import { Router, Request, Response } from 'express';
import prisma from '../prisma';
import {check, validationResult} from 'express-validator';

const router = Router();

// GET /projects - Retrieve all projects
router.get('/', async (req, res) => {
    try{
        const projects = await prisma.project.findMany({
            where: {deletedAt: null},
            include: {tasks: true}
        });
        res.json(projects);
    }
    catch (err){
        res.status(500).json({message: 'Error retrieving projects'});
    }
});

// POST /projects - Create a new project
router.post('/',[check('name').notEmpty().withMessage('Name is required')], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const {name} = req.body;

    try{
        const newProject = await prisma.project.create({
            data: {name}
        });
        res.json(newProject);
    } catch (err){
        res.status(500).json({message: 'Error creating project'});
    }
});
// DELETE /projects/:id - Soft delete a project by setting its deletedAt field
router.delete('/:id', async (req, res) => {
    const {id} = req.params;
    try{
        const deletedProject = await prisma.project.update({
            where: {id: parseInt(id)},
            data: {deletedAt: new Date()}
        });
        res.json(deletedProject);
    }
    catch(err){
        res.status(500).json({message: 'Error deleting project'});
    }
});


// POST /projects/:id/rollback - Mark all tasks of a project as not completed
router.post('/:id/rollback', async (req, res) => {
    const {id} = req.params;
    try{
        await prisma.task.updateMany({
            where: {projectId: parseInt(id)},
            data: {isCompleted: false}
        });
        res.json({message: 'Tasks have been marked as not completed'});
    }
    catch(err){
        res.status(500).json({message: 'Error rolling back tasks'});
    }
});

export default router;
