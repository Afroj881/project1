import {
  listTeamMembers,
  inviteTeamMember,
  acceptInvitation,
  updateTeamMemberRole,
  updateTeamMemberStatus,
  getTasksForMember,
  getWorkloadOverview
} from '../services/teamService.js';

export const getTeamMembers = async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 20);
  const data = await listTeamMembers(page, limit);
  res.json(data);
};

export const inviteMember = async (req, res) => {
  const { email, role } = req.body;
  const invitedBy = req.user._id;
  const data = await inviteTeamMember({ email, role, invitedBy });
  res.status(201).json({ message: 'Invitation sent', invitation: data });
};

export const acceptInvite = async (req, res) => {
  const { token, password, name, profile } = req.body;
  const data = await acceptInvitation({ token, password, name, profile });
  res.status(200).json({ message: 'Invitation accepted', user: data });
};

export const changeRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  const user = await updateTeamMemberRole({ id, role });
  res.json({ message: 'Role updated', user: { id: user._id, email: user.email, role: user.role } });
};

export const changeStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const user = await updateTeamMemberStatus({ id, status });
  res.json({ message: 'Status updated', user: { id: user._id, email: user.email, status: user.status } });
};

export const getMemberTasks = async (req, res) => {
  const { id } = req.params;
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 20);
  const data = await getTasksForMember({ id, page, limit });
  res.json(data);
};

export const getWorkload = async (req, res) => {
  const data = await getWorkloadOverview();
  res.json(data);
};
