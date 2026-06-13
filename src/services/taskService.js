const mongoose = require('mongoose');
const Task = require('../models/Task');
const Project = require('../models/Project');
const Milestone = require('../models/Milestone');
const User = require('../models/User');
const Comment = require('../models/Comment');
const TimeLog = require('../models/TimeLog');
const ActivityLog = require('../models/ActivityLog');
const Attachment = require('../models/Attachment');

const ensureObjectId = (id) => {
  if (!id) return null;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error('Invalid identifier provided');
    error.statusCode = 400;
    throw error;
  }
  return new mongoose.Types.ObjectId(id);
};

const createActivityLog = ({
  task,
  user,
  event,
  details,
  previousStatus = '',
  newStatus = '',
  changes = {},
  ipAddress = '',
}) =>
  ActivityLog.create({
    task,
    user: user._id,
    event,
    details,
    previousStatus,
    newStatus,
    changes,
    ipAddress,
  });

const requireDocument = async (model, id, message) => {
  if (!id) return null;

  const document = await model.findById(id);
  if (!document) {
    const error = new Error(message);
    error.statusCode = 404;
    throw error;
  }

  return document;
};

const createTask = async (payload, user) => {
  const projectId = ensureObjectId(payload.project_id);
  const milestoneId = payload.milestone_id ? ensureObjectId(payload.milestone_id) : null;
  const assigneeId = payload.assignee_id ? ensureObjectId(payload.assignee_id) : null;

  const [project, milestone, assignee] = await Promise.all([
    Project.findById(projectId),
    milestoneId ? Milestone.findById(milestoneId) : Promise.resolve(null),
    assigneeId ? User.findById(assigneeId) : Promise.resolve(null),
  ]);

  if (!project) {
    const error = new Error('Project not found');
    error.statusCode = 404;
    throw error;
  }

  if (milestoneId && !milestone) {
    const error = new Error('Milestone not found');
    error.statusCode = 404;
    throw error;
  }

  if (milestone && milestone.project.toString() !== projectId.toString()) {
    const error = new Error('Milestone does not belong to the selected project');
    error.statusCode = 400;
    throw error;
  }

  if (assigneeId && !assignee) {
    const error = new Error('Assignee not found');
    error.statusCode = 404;
    throw error;
  }

  const task = await Task.create({
    title: payload.title,
    description: payload.description,
    project: projectId,
    milestone: milestoneId,
    assignee: assigneeId,
    priority: payload.priority,
    dueDate: payload.dueDate,
    estimatedHours: payload.estimatedHours,
    tags: payload.tags || [],
    createdBy: user._id,
    updatedBy: user._id,
  });

  await createActivityLog({
    task: task._id,
    user,
    event: 'task_created',
    details: `Task created by ${user.name}`,
    previousStatus: '',
    newStatus: task.status,
  });

  return task;
};

const buildTaskFilter = ({ project, assignee, status, priority, dueDate, dueDateFrom, dueDateTo }, user) => {
  const filter = {};

  if (project) {
    filter.project = ensureObjectId(project);
  }
  if (assignee) {
    filter.assignee = ensureObjectId(assignee);
  }
  if (status) {
    filter.status = status;
  }
  if (priority) {
    filter.priority = priority;
  }
  if (dueDate) {
    const start = new Date(dueDate);
    const end = new Date(dueDate);
    end.setDate(end.getDate() + 1);
    filter.dueDate = { $gte: start, $lt: end };
  } else if (dueDateFrom || dueDateTo) {
    filter.dueDate = {};
    if (dueDateFrom) filter.dueDate.$gte = new Date(dueDateFrom);
    if (dueDateTo) filter.dueDate.$lte = new Date(dueDateTo);
  }

  if (user.role === 'member') {
    filter.$or = [{ assignee: user._id }, { createdBy: user._id }];
  }

  return filter;
};

const listTasks = async (query, pagination, user) => {
  const filter = buildTaskFilter(query, user);

  const [tasks, total] = await Promise.all([
    Task.find(filter)
      .sort({ createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit)
      .populate('project', 'name status')
      .populate('assignee', 'name email role')
      .populate('milestone', 'title dueDate status'),
    Task.countDocuments(filter),
  ]);

  return {
    data: tasks,
    meta: {
      total,
      page: pagination.page,
      limit: pagination.limit,
      pages: Math.ceil(total / pagination.limit),
    },
  };
};

const getTaskDetails = async (taskId) => {
  ensureObjectId(taskId);

  const task = await Task.findById(taskId)
    .populate('project', 'name description status owner')
    .populate('milestone', 'title description dueDate status')
    .populate('assignee', 'name email role')
    .populate('createdBy', 'name email')
    .populate('updatedBy', 'name email')
    .populate({ path: 'subtasks', populate: { path: 'assignee', select: 'name email role' } })
    .populate({ path: 'comments', populate: { path: 'author', select: 'name email role' } })
    .populate({ path: 'attachments', populate: { path: 'uploadedBy', select: 'name email' } })
    .populate({ path: 'activityLogs', populate: { path: 'user', select: 'name email role' } })
    .populate({ path: 'timeLogs', populate: { path: 'user', select: 'name email role' } });

  if (!task) {
    const error = new Error('Task not found');
    error.statusCode = 404;
    throw error;
  }

  const comments = await Comment.find({ task: task._id }).populate('author', 'name email role').sort({ createdAt: 1 });
  const subtasks = await Task.find({ parentTask: task._id }).populate('assignee', 'name email role').sort({ createdAt: 1 });
  const attachments = await Attachment.find({ task: task._id }).populate('uploadedBy', 'name email').sort({ createdAt: -1 });
  const activityLogs = await ActivityLog.find({ task: task._id }).populate('user', 'name email role').sort({ createdAt: -1 });
  const timeLogs = await TimeLog.find({ task: task._id }).populate('user', 'name email role').sort({ entryDate: -1 });

  return {
    task,
    comments,
    subtasks,
    attachments,
    activityLogs,
    timeLogs,
  };
};

const updateTask = async (taskId, payload, user, ipAddress = '') => {
  ensureObjectId(taskId);

  const task = await Task.findById(taskId);
  if (!task) {
    const error = new Error('Task not found');
    error.statusCode = 404;
    throw error;
  }

  const original = task.toObject();

  if (payload.project_id) {
    const projectId = ensureObjectId(payload.project_id);
    await requireDocument(Project, projectId, 'Project not found');
    task.project = projectId;
  }
  if (payload.milestone_id !== undefined) {
    const milestoneId = payload.milestone_id ? ensureObjectId(payload.milestone_id) : null;
    const milestone = await requireDocument(Milestone, milestoneId, 'Milestone not found');
    if (milestone && task.project && milestone.project.toString() !== task.project.toString()) {
      const error = new Error('Milestone does not belong to the selected project');
      error.statusCode = 400;
      throw error;
    }
    task.milestone = milestoneId || undefined;
  }
  if (payload.assignee_id !== undefined) {
    const assigneeId = payload.assignee_id ? ensureObjectId(payload.assignee_id) : null;
    await requireDocument(User, assigneeId, 'Assignee not found');
    task.assignee = assigneeId || undefined;
  }

  if (task.milestone) {
    const milestone = await requireDocument(Milestone, task.milestone, 'Milestone not found');
    if (milestone.project.toString() !== task.project.toString()) {
      const error = new Error('Milestone does not belong to the selected project');
      error.statusCode = 400;
      throw error;
    }
  }
  if (payload.title !== undefined) task.title = payload.title;
  if (payload.description !== undefined) task.description = payload.description;
  if (payload.priority !== undefined) task.priority = payload.priority;
  if (payload.status !== undefined) task.status = payload.status;
  if (payload.dueDate !== undefined) task.dueDate = payload.dueDate;
  if (payload.estimatedHours !== undefined) task.estimatedHours = payload.estimatedHours;
  if (payload.tags !== undefined) task.tags = payload.tags;
  task.updatedBy = user._id;

  await task.save();

  const changes = {};
  [
    'title',
    'description',
    'project',
    'milestone',
    'assignee',
    'priority',
    'status',
    'dueDate',
    'estimatedHours',
    'tags',
  ].forEach((field) => {
    const before = original[field] === undefined || original[field] === null ? null : original[field].toString();
    const after = task[field] === undefined || task[field] === null ? null : task[field].toString();
    if (before !== after) {
      changes[field] = { from: original[field] || null, to: task[field] || null };
    }
  });

  await createActivityLog({
    task: task._id,
    user,
    event: original.status !== task.status ? 'status_changed' : 'task_updated',
    details:
      original.status !== task.status
        ? `${user.name} changed status from ${original.status} to ${task.status}`
        : `Task updated by ${user.name}`,
    previousStatus: original.status,
    newStatus: task.status,
    changes,
    ipAddress,
  });

  return task;
};

const changeTaskStatus = async (taskId, status, user, ipAddress = '') => {
  ensureObjectId(taskId);

  const task = await Task.findById(taskId);
  if (!task) {
    const error = new Error('Task not found');
    error.statusCode = 404;
    throw error;
  }

  const previousStatus = task.status;
  task.status = status;
  task.updatedBy = user._id;
  await task.save();

  await createActivityLog({
    task: task._id,
    user,
    event: 'status_changed',
    details: `${user.name} changed status from ${previousStatus} to ${status}`,
    previousStatus,
    newStatus: status,
    changes: { status: { from: previousStatus, to: status } },
    ipAddress,
  });

  return task;
};

const addComment = async (taskId, payload, user, ipAddress = '') => {
  const taskObjectId = ensureObjectId(taskId);
  await requireDocument(Task, taskObjectId, 'Task not found');

  if (payload.parentComment) {
    ensureObjectId(payload.parentComment);
    const parentComment = await Comment.findOne({ _id: payload.parentComment, task: taskObjectId });
    if (!parentComment) {
      const error = new Error('Parent comment not found for this task');
      error.statusCode = 404;
      throw error;
    }
  }

  const comment = await Comment.create({
    task: taskObjectId,
    author: user._id,
    body: payload.body,
    parentComment: payload.parentComment || null,
    attachments: payload.attachments || [],
  });

  if (payload.attachments && payload.attachments.length > 0) {
    await Attachment.insertMany(
      payload.attachments.map((attachment) => ({
        task: taskObjectId,
        fileName: attachment.filename,
        url: attachment.url,
        uploadedBy: user._id,
      }))
    );
  }

  await createActivityLog({
    task: taskObjectId,
    user,
    event: 'comment_added',
    details: `${user.name} added a comment`,
    previousStatus: '',
    newStatus: '',
    changes: { comment: { to: comment._id } },
    ipAddress,
  });

  return comment;
};

const createSubtask = async (taskId, payload, user, ipAddress = '') => {
  ensureObjectId(taskId);

  const parentTask = await Task.findById(taskId);
  if (!parentTask) {
    const error = new Error('Parent task not found');
    error.statusCode = 404;
    throw error;
  }

  const assigneeId = payload.assignee_id ? ensureObjectId(payload.assignee_id) : null;
  await requireDocument(User, assigneeId, 'Assignee not found');

  const subtask = await Task.create({
    title: payload.title,
    description: payload.description,
    project: parentTask.project,
    milestone: parentTask.milestone,
    assignee: assigneeId,
    priority: payload.priority,
    dueDate: payload.dueDate,
    estimatedHours: payload.estimatedHours,
    parentTask: parentTask._id,
    tags: payload.tags || [],
    createdBy: user._id,
    updatedBy: user._id,
  });

  await createActivityLog({
    task: taskId,
    user,
    event: 'subtask_created',
    details: `${user.name} created subtask ${subtask.title}`,
    previousStatus: '',
    newStatus: subtask.status,
    changes: { subtask: { to: subtask._id } },
    ipAddress,
  });

  return subtask;
};

const recordTimeLog = async (taskId, payload, user, ipAddress = '') => {
  ensureObjectId(taskId);

  const task = await Task.findById(taskId);
  if (!task) {
    const error = new Error('Task not found');
    error.statusCode = 404;
    throw error;
  }

  const timeLog = await TimeLog.create({
    task: task._id,
    user: user._id,
    hours: payload.hours,
    note: payload.note || '',
    entryDate: payload.entryDate || new Date(),
  });

  const previousActualHours = task.actualHours;
  task.actualHours += payload.hours;
  task.updatedBy = user._id;
  await task.save();

  await createActivityLog({
    task: task._id,
    user,
    event: 'time_logged',
    details: `${user.name} recorded ${payload.hours} hours`,
    previousStatus: task.status,
    newStatus: task.status,
    changes: {
      timeLog: { to: timeLog._id },
      actualHours: { from: previousActualHours, to: task.actualHours },
    },
    ipAddress,
  });

  return timeLog;
};

module.exports = {
  createTask,
  listTasks,
  getTaskDetails,
  updateTask,
  changeTaskStatus,
  addComment,
  createSubtask,
  recordTimeLog,
};
