const Project = require('../models/Project');
const Milestone = require('../models/Milestone');
const Deliverable = require('../models/Deliverable');
const Invoice = require('../models/Invoice');
const Feedback = require('../models/Feedback');
const ActivityLog = require('../models/ActivityLog');

const { paginate } = require('../utils/paginate');

async function getDashboard(user) {
  const clientId = user._id;
  const activeProjects = await Project.find({ client: clientId, status: 'active' }).select('title status').lean();
  const pendingInvoices = await Invoice.find({ client: clientId, status: 'pending' }).select('number dueDate total status').lean();
  const upcomingMilestones = await Milestone.find({ project: { $in: activeProjects.map(p=>p._id) }, dueDate: { $gte: new Date() } }).sort('dueDate').limit(5).lean();
  const recentActivity = await ActivityLog.find({ user: clientId }).sort('-createdAt').limit(10).lean();
  return { activeProjects, pendingInvoices, upcomingMilestones, recentActivity };
}

async function getProjects(user, opts = {}) {
  const clientId = user._id;
  const query = Project.find({ client: clientId }).populate('milestones').populate('assignedTeam', 'name email');
  return paginate(query, opts.page, opts.limit);
}

async function getProjectById(user, projectId) {
  const clientId = user._id;
  const project = await Project.findOne({ _id: projectId, client: clientId })
    .populate({ path: 'milestones', model: 'Milestone' })
    .populate({ path: 'deliverables', model: 'Deliverable' })
    .populate({ path: 'assignedTeam', model: 'User', select: 'name email phone role' })
    .lean();
  if (!project) return null;
  // attach milestone progress and statuses
  const milestones = await Milestone.find({ project: project._id }).lean();
  const deliverables = await Deliverable.find({ project: project._id }).lean();
  return { ...project, milestones, deliverables };
}

async function getInvoices(user, opts = {}) {
  const clientId = user._id;
  const query = Invoice.find({ client: clientId }).sort('-dueDate');
  return paginate(query, opts.page, opts.limit);
}

async function createFeedback(user, payload) {
  const doc = await Feedback.create({ client: user._id, ...payload });
  return doc.toObject();
}

module.exports = { getDashboard, getProjects, getProjectById, getInvoices, createFeedback };
