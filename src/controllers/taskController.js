const { buildPagination } = require('../utils/pagination');
const {
  createTask,
  listTasks,
  getTaskDetails,
  updateTask,
  changeTaskStatus,
  addComment,
  createSubtask,
  recordTimeLog,
} = require('../services/taskService');
const Task = require('../models/Task');

const canAccessTask = (task, user) => {
  if (['admin', 'project_manager'].includes(user.role)) {
    return true;
  }

  const userId = user._id.toString();
  return (
    (task.assignee && task.assignee.toString() === userId) ||
    (task.createdBy && task.createdBy.toString() === userId)
  );
};

const loadAuthorizedTask = async (taskId, user, action) => {
  const task = await Task.findById(taskId);
  if (!task) {
    return { error: { status: 404, message: 'Task not found' } };
  }

  if (!canAccessTask(task, user)) {
    return { error: { status: 403, message: `Forbidden: cannot ${action} this task` } };
  }

  return { task };
};

const createTaskHandler = async (req, res) => {
  const task = await createTask(req.body, req.user);
  res.status(201).json({ success: true, data: task });
};

const listTasksHandler = async (req, res) => {
  const pagination = buildPagination(req.query);
  const result = await listTasks(req.query, pagination, req.user);
  res.json({ success: true, data: result.data, meta: result.meta });
};

const getTaskByIdHandler = async (req, res) => {
  const { error } = await loadAuthorizedTask(req.params.id, req.user, 'view');
  if (error) {
    return res.status(error.status).json({ success: false, message: error.message });
  }

  const details = await getTaskDetails(req.params.id);
  res.json({ success: true, data: details });
};

const updateTaskHandler = async (req, res) => {
  const { error } = await loadAuthorizedTask(req.params.id, req.user, 'update');
  if (error) {
    return res.status(error.status).json({ success: false, message: error.message });
  }

  const updated = await updateTask(req.params.id, req.body, req.user, req.ip);
  res.json({ success: true, data: updated });
};

const changeTaskStatusHandler = async (req, res) => {
  const { error } = await loadAuthorizedTask(req.params.id, req.user, 'change status for');
  if (error) {
    return res.status(error.status).json({ success: false, message: error.message });
  }

  const updated = await changeTaskStatus(req.params.id, req.body.status, req.user, req.ip);
  res.json({ success: true, data: updated });
};

const addCommentHandler = async (req, res) => {
  const { error } = await loadAuthorizedTask(req.params.id, req.user, 'comment on');
  if (error) {
    return res.status(error.status).json({ success: false, message: error.message });
  }

  const comment = await addComment(req.params.id, req.body, req.user, req.ip);
  res.status(201).json({ success: true, data: comment });
};

const createSubtaskHandler = async (req, res) => {
  const { error } = await loadAuthorizedTask(req.params.id, req.user, 'create subtasks for');
  if (error) {
    return res.status(error.status).json({ success: false, message: error.message });
  }

  const subtask = await createSubtask(req.params.id, req.body, req.user, req.ip);
  res.status(201).json({ success: true, data: subtask });
};

const recordTimeLogHandler = async (req, res) => {
  const { error } = await loadAuthorizedTask(req.params.id, req.user, 'add time log to');
  if (error) {
    return res.status(error.status).json({ success: false, message: error.message });
  }

  const timeLog = await recordTimeLog(req.params.id, req.body, req.user, req.ip);
  res.status(201).json({ success: true, data: timeLog });
};

module.exports = {
  createTask: createTaskHandler,
  listTasks: listTasksHandler,
  getTaskById: getTaskByIdHandler,
  updateTask: updateTaskHandler,
  changeTaskStatus: changeTaskStatusHandler,
  addComment: addCommentHandler,
  createSubtask: createSubtaskHandler,
  recordTimeLog: recordTimeLogHandler,
};
