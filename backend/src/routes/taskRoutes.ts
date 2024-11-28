import express from 'express';
import { body } from 'express-validator';
import { auth } from '../middleware/auth';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskStats
} from '../controllers/taskController';
import { Request, Response, NextFunction, RequestHandler } from 'express';

const router = express.Router();

router.use(auth as RequestHandler);

const taskValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('startTime').isISO8601().withMessage('Valid start time is required'),
  body('endTime').isISO8601().withMessage('Valid end time is required'),
  body('priority')
    .isInt({ min: 1, max: 5 })
    .withMessage('Priority must be between 1 and 5'),
  body('status')
    .optional()
    .isIn(['pending', 'finished'])
    .withMessage('Status must be either pending or finished')
];

// const validateRequest: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
//   // ... existing validation logic ...
//   next();
// };

router.post('/', taskValidation, createTask);
router.get('/', getTasks);
router.get('/stats', getTaskStats);
router.get('/:id', getTaskById);
router.put('/:id', taskValidation, updateTask);
router.delete('/:id', deleteTask);

export default router;