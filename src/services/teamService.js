import { User, roles } from '../models/User.js';
import { Task } from '../models/Task.js';
import { generateInviteToken } from '../utils/token.js';
import sendEmail from '../utils/email.js';
import { isValidEmail, isValidRole, requireFields } from '../utils/validators.js';

const inviteTokenExpiry = () => {
  const expiresIn = process.env.INVITE_TOKEN_EXPIRES_IN || '2d';
  const amount = parseInt(expiresIn, 10);
  return new Date(Date.now() + (isNaN(amount) ? 2 * 24 * 60 * 60 * 1000 : amount * 24 * 60 * 60 * 1000));
};

export const listTeamMembers = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  const query = {};
  const total = await User.countDocuments(query);
  const members = await User.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select('-password -invitationToken')
    .lean();
  return { total, page, limit, members };
};

export const inviteTeamMember = async ({ email, role, invitedBy }) => {
  requireFields({ email, role }, ['email', 'role']);
  if (!isValidEmail(email)) {
    throw Object.assign(new Error('Invalid email address'), { statusCode: 400 });
  }
  if (!isValidRole(role, roles)) {
    throw Object.assign(new Error('Invalid role'), { statusCode: 400 });
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw Object.assign(new Error('User already exists or has already been invited'), { statusCode: 409 });
  }

  const invitationToken = generateInviteToken();
  const invitationTokenExpiresAt = inviteTokenExpiry();

  const newUser = await User.create({
    email: email.toLowerCase(),
    role,
    invitedBy,
    invitationToken,
    invitationTokenExpiresAt,
    status: 'Inactive'
  });

  const inviteUrl = `${process.env.APP_BASE_URL}/api/team/accept-invite?token=${invitationToken}`;
  await sendEmail({
    to: newUser.email,
    subject: 'You are invited to join the team',
    text: `You have been invited to join the team. Use this link to accept the invitation: ${inviteUrl}`,
    html: `<p>You have been invited to join the team.</p><p><a href="${inviteUrl}">Accept invitation</a></p>`
  });

  return { email: newUser.email, role, invitationTokenExpiresAt };
};

export const acceptInvitation = async ({ token, password, name, profile }) => {
  requireFields({ token, password }, ['token', 'password']);
  const user = await User.findOne({ invitationToken: token });
  if (!user) {
    throw Object.assign(new Error('Invitation token is invalid'), { statusCode: 400 });
  }
  if (user.invitationTokenExpiresAt < new Date()) {
    throw Object.assign(new Error('Invitation token has expired'), { statusCode: 400 });
  }
  if (!password) {
    throw Object.assign(new Error('Password is required'), { statusCode: 400 });
  }

  user.password = password;
  if (name) user.name = name;
  if (profile) user.profile = { ...user.profile, ...profile };
  user.status = 'Active';
  user.invitationToken = undefined;
  user.invitationTokenExpiresAt = undefined;
  await user.save();

  return { id: user._id, email: user.email, role: user.role, name: user.name, status: user.status };
};

export const updateTeamMemberRole = async ({ id, role }) => {
  requireFields({ id, role }, ['id', 'role']);
  if (!isValidRole(role, roles)) {
    throw Object.assign(new Error('Invalid role'), { statusCode: 400 });
  }
  const user = await User.findById(id);
  if (!user) {
    throw Object.assign(new Error('Team member not found'), { statusCode: 404 });
  }
  user.role = role;
  await user.save();
  return user;
};

export const updateTeamMemberStatus = async ({ id, status }) => {
  const user = await User.findById(id);
  if (!user) {
    throw Object.assign(new Error('Team member not found'), { statusCode: 404 });
  }
  if (!['Active', 'Inactive'].includes(status)) {
    throw Object.assign(new Error('Invalid status value'), { statusCode: 400 });
  }
  user.status = status;
  await user.save();
  return user;
};

export const getTasksForMember = async ({ id, page = 1, limit = 20 }) => {
  const skip = (page - 1) * limit;
  const member = await User.findById(id);
  if (!member) {
    throw Object.assign(new Error('Team member not found'), { statusCode: 404 });
  }
  const tasks = await Task.find({ assignee: member._id, isActive: true })
    .sort({ deadline: 1 })
    .skip(skip)
    .limit(limit)
    .select('title status priority deadline project createdAt updatedAt')
    .lean();

  const total = await Task.countDocuments({ assignee: member._id, isActive: true });
  return { total, page, limit, member: { id: member._id, email: member.email, name: member.name }, tasks };
};

export const getWorkloadOverview = async () => {
  const members = await User.find({ status: 'Active' }).select('name email role').lean();
  const workloads = await Promise.all(
    members.map(async (member) => {
      const assignedTasks = await Task.find({ assignee: member._id, isActive: true }).lean();
      const pendingTasks = assignedTasks.filter((task) => task.status !== 'Completed').length;
      const overdueTasks = assignedTasks.filter((task) => task.deadline && task.deadline < new Date() && task.status !== 'Completed').length;
      const activeAssignments = assignedTasks.length;
      const priorityCounts = assignedTasks.reduce((acc, task) => {
        acc[task.priority] = (acc[task.priority] || 0) + 1;
        return acc;
      }, {});
      return {
        member: { id: member._id, name: member.name, email: member.email, role: member.role },
        activeAssignments,
        pendingTasks,
        overdueTasks,
        workloadDistribution: {
          low: priorityCounts.Low || 0,
          medium: priorityCounts.Medium || 0,
          high: priorityCounts.High || 0,
          critical: priorityCounts.Critical || 0
        }
      };
    })
  );

  const totalMembers = workloads.length;
  const totalPending = workloads.reduce((sum, w) => sum + w.pendingTasks, 0);
  const totalOverdue = workloads.reduce((sum, w) => sum + w.overdueTasks, 0);
  const totalAssignments = workloads.reduce((sum, w) => sum + w.activeAssignments, 0);
  return {
    summary: { totalMembers, totalAssignments, totalPending, totalOverdue },
    workloads
  };
};
