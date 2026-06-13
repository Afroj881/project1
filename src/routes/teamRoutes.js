import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import {
  getTeamMembers,
  inviteMember,
  acceptInvite,
  changeRole,
  changeStatus,
  getMemberTasks,
  getWorkload
} from '../controllers/teamController.js';

const router = express.Router();

router.get('/', authenticate, authorize(['Admin', 'Manager']), getTeamMembers);
router.post('/invite', authenticate, authorize(['Admin', 'Manager']), inviteMember);
router.post('/accept-invite', acceptInvite);
router.put('/:id/role', authenticate, authorize(['Admin']), changeRole);
router.put('/:id/status', authenticate, authorize(['Admin']), changeStatus);
router.get('/:id/tasks', authenticate, authorize(['Admin', 'Manager', 'Developer', 'Designer', 'Intern', 'Client']), getMemberTasks);
router.get('/workload', authenticate, authorize(['Admin', 'Manager']), getWorkload);

export default router;
