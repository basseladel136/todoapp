import { Router } from 'express';
import { taskController } from '../controllers/task.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import { catchAsync } from '../utils/catchAsync.js';
import {
  createTaskSchema,
  updateTaskSchema,
  taskIdParamSchema,
  listTasksSchema,
} from '../validators/task.validator.js';

const router = Router();

// Every task route requires authentication.
router.use(authenticate);

router.get('/', validate(listTasksSchema), catchAsync(taskController.list));
router.post('/', validate(createTaskSchema), catchAsync(taskController.create));
router.get('/:id', validate(taskIdParamSchema), catchAsync(taskController.getOne));
router.put('/:id', validate(updateTaskSchema), catchAsync(taskController.update));
router.patch('/:id', validate(updateTaskSchema), catchAsync(taskController.update));
router.delete('/:id', validate(taskIdParamSchema), catchAsync(taskController.remove));

export default router;
