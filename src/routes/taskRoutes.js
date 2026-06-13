const express = require('express');
const {
  createTask,
  listTasks,
  getTaskById,
  updateTask,
  changeTaskStatus,
  addComment,
  createSubtask,
  recordTimeLog,
} = require('../controllers/taskController');
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');
const { validateParams, validateQuery, validateRequest } = require('../middleware/validateRequest');
const {
  taskIdParamSchema,
  listTasksQuerySchema,
  createTaskSchema,
  updateTaskSchema,
  commentSchema,
  subtaskSchema,
  statusSchema,
  timeLogSchema,
} = require('../utils/validators');

const router = express.Router();

router.use(authenticate);

router.post('/', authorizeRoles('admin', 'project_manager'), validateRequest(createTaskSchema), createTask);
router.get('/', validateQuery(listTasksQuerySchema), listTasks);
router.get('/:id', validateParams(taskIdParamSchema), getTaskById);
router.put('/:id', validateParams(taskIdParamSchema), validateRequest(updateTaskSchema), updateTask);
router.put(
  '/:id/status',
  authorizeRoles('admin', 'project_manager', 'member'),
  validateParams(taskIdParamSchema),
  validateRequest(statusSchema),
  changeTaskStatus
);
router.post('/:id/comments', validateParams(taskIdParamSchema), validateRequest(commentSchema), addComment);
router.post(
  '/:id/subtasks',
  authorizeRoles('admin', 'project_manager'),
  validateParams(taskIdParamSchema),
  validateRequest(subtaskSchema),
  createSubtask
);
router.put(
  '/:id/time-log',
  authorizeRoles('admin', 'project_manager', 'member'),
  validateParams(taskIdParamSchema),
  validateRequest(timeLogSchema),
  recordTimeLog
);

module.exports = router;
