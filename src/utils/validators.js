const Joi = require('joi');

const authRegisterSchema = Joi.object({
  name: Joi.string().trim().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('admin', 'project_manager', 'member').default('member'),
});

const authLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const objectId = Joi.string().hex().length(24);

const createTaskSchema = Joi.object({
  title: Joi.string().trim().required(),
  description: Joi.string().allow('').optional(),
  project_id: objectId.required(),
  milestone_id: objectId.optional().allow(null, ''),
  assignee_id: objectId.optional().allow(null, ''),
  priority: Joi.string().valid('low', 'medium', 'high', 'critical').default('medium'),
  dueDate: Joi.date().optional().allow(null),
  estimatedHours: Joi.number().min(0).optional().default(0),
  tags: Joi.array().items(Joi.string().trim()).optional(),
});

const taskIdParamSchema = Joi.object({
  id: objectId.required(),
});

const listTasksQuerySchema = Joi.object({
  project: objectId.optional(),
  assignee: objectId.optional(),
  status: Joi.string().valid('backlog', 'in_progress', 'review', 'blocked', 'completed', 'cancelled').optional(),
  priority: Joi.string().valid('low', 'medium', 'high', 'critical').optional(),
  dueDate: Joi.date().optional(),
  dueDateFrom: Joi.date().optional(),
  dueDateTo: Joi.date().optional(),
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
});

const updateTaskSchema = Joi.object({
  title: Joi.string().trim().optional(),
  description: Joi.string().allow('').optional(),
  project_id: objectId.optional(),
  milestone_id: objectId.optional().allow(null, ''),
  assignee_id: objectId.optional().allow(null, ''),
  priority: Joi.string().valid('low', 'medium', 'high', 'critical').optional(),
  status: Joi.string().valid('backlog', 'in_progress', 'review', 'blocked', 'completed', 'cancelled').optional(),
  dueDate: Joi.date().optional().allow(null),
  estimatedHours: Joi.number().min(0).optional(),
  tags: Joi.array().items(Joi.string().trim()).optional(),
});

const statusSchema = Joi.object({
  status: Joi.string()
    .valid('backlog', 'in_progress', 'review', 'blocked', 'completed', 'cancelled')
    .required(),
});

const commentSchema = Joi.object({
  body: Joi.string().trim().required(),
  parentComment: objectId.optional().allow(null, ''),
  attachments: Joi.array()
    .items(
      Joi.object({
        filename: Joi.string().trim().required(),
        url: Joi.string().uri().required(),
      })
    )
    .optional(),
});

const subtaskSchema = Joi.object({
  title: Joi.string().trim().required(),
  description: Joi.string().allow('').optional(),
  assignee_id: objectId.optional().allow(null, ''),
  priority: Joi.string().valid('low', 'medium', 'high', 'critical').default('medium'),
  dueDate: Joi.date().optional().allow(null),
  estimatedHours: Joi.number().min(0).optional().default(0),
  tags: Joi.array().items(Joi.string().trim()).optional(),
});

const timeLogSchema = Joi.object({
  hours: Joi.number().greater(0).required(),
  note: Joi.string().allow('').optional(),
  entryDate: Joi.date().optional(),
});

module.exports = {
  authRegisterSchema,
  authLoginSchema,
  taskIdParamSchema,
  listTasksQuerySchema,
  createTaskSchema,
  updateTaskSchema,
  statusSchema,
  commentSchema,
  subtaskSchema,
  timeLogSchema,
};
