// src/cron/deadlineReminder.js
const cron = require('node-cron');
const EmailService = require('../services/emailService');
const Task = require('../models/Task');
const Project = require('../models/Project');
const logger = require('../utils/logger');

/**
 * Schedule deadline reminder emails
 * Runs daily at 9 AM (configurable via CRON_DEADLINE_REMINDER_SCHEDULE)
 */
const scheduleDeadlineReminders = () => {
  const schedule = process.env.CRON_DEADLINE_REMINDER_SCHEDULE || '0 9 * * *';

  cron.schedule(schedule, async () => {
    logger.info('Starting deadline reminder cron job');
    try {
      await sendDeadlineReminders();
      logger.info('Deadline reminder cron job completed successfully');
    } catch (error) {
      logger.error('Error in deadline reminder cron job:', { error: error.message });
    }
  });

  logger.info(`Deadline reminder scheduler initialized with schedule: ${schedule}`);
};

/**
 * Send deadline reminders for projects ending in 2 days
 */
const sendDeadlineReminders = async () => {
  try {
    const today = new Date();
    const twoDaysFromNow = new Date(today);
    twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);
    twoDaysFromNow.setHours(23, 59, 59, 999);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 2);
    tomorrow.setHours(0, 0, 0, 0);

    // Find projects with deadline in 2 days
    const projectsWithDeadline = await Project.find({
      deadline: {
        $gte: tomorrow,
        $lte: twoDaysFromNow,
      },
      status: 'active',
    }).populate('ownerId teamMembers.userId');

    logger.info(`Found ${projectsWithDeadline.length} projects with deadline in 2 days`);

    for (const project of projectsWithDeadline) {
      try {
        // Get all tasks for this project
        const tasks = await Task.find({
          projectId: project._id,
        }).populate('assignedTo');

        // Separate overdue and due soon tasks
        const tasksOverdue = tasks.filter(t => {
          if (!t.deadline) return false;
          return new Date(t.deadline) < today && t.status !== 'completed';
        });

        const tasksDueSoon = tasks.filter(t => {
          if (!t.deadline) return false;
          const tDeadline = new Date(t.deadline);
          return tDeadline >= today && tDeadline <= twoDaysFromNow && t.status !== 'completed';
        });

        // Send reminder to project owner
        if (project.ownerId) {
          await EmailService.sendDeadlineReminderEmail({
            recipientName: project.ownerId.name,
            recipientEmail: project.ownerId.email,
            projectName: project.name,
            projectUrl: `${process.env.APP_URL}/projects/${project._id}`,
            deadline: project.deadline,
            tasksOverdue: tasksOverdue.map(t => ({
              title: t.title,
              assignedTo: t.assignedTo?.name || 'Unassigned',
            })),
            tasksDueSoon: tasksDueSoon.map(t => ({
              title: t.title,
              assignedTo: t.assignedTo?.name || 'Unassigned',
            })),
            userId: project.ownerId._id,
          });
        }

        // Send reminder to team members
        for (const member of project.teamMembers) {
          if (member.userId && member.userId._id !== project.ownerId?._id) {
            await EmailService.sendDeadlineReminderEmail({
              recipientName: member.userId.name,
              recipientEmail: member.userId.email,
              projectName: project.name,
              projectUrl: `${process.env.APP_URL}/projects/${project._id}`,
              deadline: project.deadline,
              tasksOverdue: tasksOverdue.map(t => ({
                title: t.title,
                assignedTo: t.assignedTo?.name || 'Unassigned',
              })),
              tasksDueSoon: tasksDueSoon.map(t => ({
                title: t.title,
                assignedTo: t.assignedTo?.name || 'Unassigned',
              })),
              userId: member.userId._id,
            });
          }
        }

        logger.info(`Deadline reminders sent for project: ${project.name}`);
      } catch (error) {
        logger.error(`Error sending reminders for project ${project._id}:`, { error: error.message });
      }
    }
  } catch (error) {
    logger.error('Error in sendDeadlineReminders:', { error: error.message });
    throw error;
  }
};

/**
 * Start scheduled cron jobs
 */
const startCronJobs = () => {
  if (process.env.ENABLE_CRON_JOBS !== 'false') {
    scheduleDeadlineReminders();
    logger.info('All cron jobs started successfully');
  } else {
    logger.info('Cron jobs are disabled');
  }
};

module.exports = {
  scheduleDeadlineReminders,
  sendDeadlineReminders,
  startCronJobs,
};
