// src/services/activityService.js
const ActivityLog = require('../models/ActivityLog');
const logger = require('../utils/logger');

class ActivityService {
  /**
   * Log an activity
   * @param {Object} data - Activity data
   * @returns {Promise<Object>} - Created activity log
   */
  static async logActivity(data) {
    try {
      const activityData = {
        userId: data.userId,
        action: data.action,
        entity: data.entity,
        entityId: data.entityId,
        description: data.description,
        projectId: data.projectId,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        changes: data.changes,
        metadata: data.metadata,
      };

      const log = await ActivityLog.logActivity(activityData);
      logger.info(`Activity logged: ${data.action}`, { entityId: data.entityId });
      return log;
    } catch (error) {
      logger.error('Error logging activity:', { error: error.message });
      throw error;
    }
  }

  /**
   * Get activity logs with filtering
   * @param {Object} filters - Filter criteria
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise<Object>} - Logs and pagination info
   */
  static async getActivityLogs(filters, page = 1, limit = 20) {
    try {
      const result = await ActivityLog.findByFilters(filters, page, limit);
      return result;
    } catch (error) {
      logger.error('Error fetching activity logs:', { error: error.message });
      throw error;
    }
  }

  /**
   * Get user activity
   * @param {string} userId - User ID
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise<Object>} - User's activity logs
   */
  static async getUserActivity(userId, page = 1, limit = 20) {
    try {
      return await this.getActivityLogs({ userId }, page, limit);
    } catch (error) {
      logger.error('Error fetching user activity:', { error: error.message });
      throw error;
    }
  }

  /**
   * Get project activity
   * @param {string} projectId - Project ID
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise<Object>} - Project's activity logs
   */
  static async getProjectActivity(projectId, page = 1, limit = 20) {
    try {
      return await this.getActivityLogs({ projectId }, page, limit);
    } catch (error) {
      logger.error('Error fetching project activity:', { error: error.message });
      throw error;
    }
  }

  /**
   * Get entity activity
   * @param {string} entity - Entity type
   * @param {string} entityId - Entity ID
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise<Object>} - Entity's activity logs
   */
  static async getEntityActivity(entity, entityId, page = 1, limit = 20) {
    try {
      return await this.getActivityLogs({ entity, entityId }, page, limit);
    } catch (error) {
      logger.error('Error fetching entity activity:', { error: error.message });
      throw error;
    }
  }

  /**
   * Activity log for project creation
   */
  static async logProjectCreated(userId, projectId, projectName, ipAddress, userAgent) {
    return this.logActivity({
      userId,
      action: 'PROJECT_CREATED',
      entity: 'PROJECT',
      entityId: projectId,
      description: `Project "${projectName}" created`,
      projectId,
      ipAddress,
      userAgent,
    });
  }

  /**
   * Activity log for project update
   */
  static async logProjectUpdated(userId, projectId, projectName, changes, ipAddress, userAgent) {
    return this.logActivity({
      userId,
      action: 'PROJECT_UPDATED',
      entity: 'PROJECT',
      entityId: projectId,
      description: `Project "${projectName}" updated`,
      projectId,
      changes,
      ipAddress,
      userAgent,
    });
  }

  /**
   * Activity log for task creation
   */
  static async logTaskCreated(userId, taskId, taskTitle, projectId, ipAddress, userAgent) {
    return this.logActivity({
      userId,
      action: 'TASK_CREATED',
      entity: 'TASK',
      entityId: taskId,
      description: `Task "${taskTitle}" created`,
      projectId,
      ipAddress,
      userAgent,
    });
  }

  /**
   * Activity log for task assignment
   */
  static async logTaskAssigned(userId, taskId, taskTitle, projectId, assignedTo, ipAddress, userAgent) {
    return this.logActivity({
      userId,
      action: 'TASK_ASSIGNED',
      entity: 'TASK',
      entityId: taskId,
      description: `Task "${taskTitle}" assigned`,
      projectId,
      metadata: { assignedTo },
      ipAddress,
      userAgent,
    });
  }

  /**
   * Activity log for task status change
   */
  static async logTaskStatusChanged(userId, taskId, taskTitle, projectId, oldStatus, newStatus, ipAddress, userAgent) {
    return this.logActivity({
      userId,
      action: 'TASK_STATUS_CHANGED',
      entity: 'TASK',
      entityId: taskId,
      description: `Task "${taskTitle}" status changed from ${oldStatus} to ${newStatus}`,
      projectId,
      changes: { before: { status: oldStatus }, after: { status: newStatus } },
      ipAddress,
      userAgent,
    });
  }

  /**
   * Activity log for comment added
   */
  static async logCommentAdded(userId, commentId, taskId, projectId, taskTitle, ipAddress, userAgent) {
    return this.logActivity({
      userId,
      action: 'COMMENT_ADDED',
      entity: 'COMMENT',
      entityId: commentId,
      description: `Comment added to task "${taskTitle}"`,
      projectId,
      metadata: { taskId },
      ipAddress,
      userAgent,
    });
  }

  /**
   * Activity log for invoice generation
   */
  static async logInvoiceGenerated(userId, invoiceId, invoiceNumber, projectId, ipAddress, userAgent) {
    return this.logActivity({
      userId,
      action: 'INVOICE_GENERATED',
      entity: 'INVOICE',
      entityId: invoiceId,
      description: `Invoice ${invoiceNumber} generated`,
      projectId,
      ipAddress,
      userAgent,
    });
  }

  /**
   * Activity log for invoice payment
   */
  static async logInvoicePaid(userId, invoiceId, invoiceNumber, projectId, amount, ipAddress, userAgent) {
    return this.logActivity({
      userId,
      action: 'INVOICE_PAID',
      entity: 'INVOICE',
      entityId: invoiceId,
      description: `Invoice ${invoiceNumber} paid (${amount})`,
      projectId,
      ipAddress,
      userAgent,
    });
  }

  /**
   * Activity log for team invitation
   */
  static async logTeamInvitationSent(userId, invitationId, projectId, invitedEmail, ipAddress, userAgent) {
    return this.logActivity({
      userId,
      action: 'TEAM_INVITATION_SENT',
      entity: 'TEAM',
      entityId: invitationId,
      description: `Team invitation sent to ${invitedEmail}`,
      projectId,
      metadata: { invitedEmail },
      ipAddress,
      userAgent,
    });
  }

  /**
   * Activity log for role update
   */
  static async logRoleUpdated(userId, targetUserId, projectId, oldRole, newRole, ipAddress, userAgent) {
    return this.logActivity({
      userId,
      action: 'ROLE_UPDATED',
      entity: 'USER',
      entityId: targetUserId,
      description: `User role updated from ${oldRole} to ${newRole}`,
      projectId,
      changes: { before: { role: oldRole }, after: { role: newRole } },
      ipAddress,
      userAgent,
    });
  }

  /**
   * Activity log for login
   */
  static async logUserLogin(userId, ipAddress, userAgent) {
    return this.logActivity({
      userId,
      action: 'LOGIN',
      entity: 'USER',
      entityId: userId,
      description: 'User logged in',
      ipAddress,
      userAgent,
    });
  }

  /**
   * Activity log for password reset
   */
  static async logPasswordReset(userId, ipAddress, userAgent) {
    return this.logActivity({
      userId,
      action: 'PASSWORD_RESET',
      entity: 'USER',
      entityId: userId,
      description: 'User password reset',
      ipAddress,
      userAgent,
    });
  }
}

module.exports = ActivityService;
