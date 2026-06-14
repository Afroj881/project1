// src/templates/deadlineReminder.js
module.exports = (data) => {
  const { recipientName, projectName, projectUrl, tasksOverdue, tasksDueSoon, deadline } = data;

  const tasksHtml = (tasks = []) => {
    return tasks.map(task => `
      <li style="margin-bottom: 8px; padding: 8px; background: #f9f9f9; border-radius: 4px;">
        <strong>${task.title}</strong><br>
        <small style="color: #666;">Assigned to: ${task.assignedTo}</small>
      </li>
    `).join('');
  };

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Project Deadline Reminder</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; }
        .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { background: white; padding: 30px; border-radius: 0 0 8px 8px; }
        .warning-box { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 4px; margin: 15px 0; }
        .task-list { list-style: none; padding: 0; }
        .button { display: inline-block; padding: 12px 30px; background: #f5576c; color: white; text-decoration: none; border-radius: 4px; margin-top: 20px; }
        .footer { text-align: center; font-size: 12px; color: #999; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>⏰ Project Deadline Reminder</h1>
        </div>
        <div class="content">
          <p>Hi <strong>${recipientName}</strong>,</p>
          
          <div class="warning-box">
            <strong>Project:</strong> ${projectName}<br>
            <strong>Deadline:</strong> ${new Date(deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} (in 2 days)
          </div>

          ${tasksOverdue && tasksOverdue.length > 0 ? `
            <h3 style="color: #d32f2f;">Overdue Tasks (${tasksOverdue.length})</h3>
            <ul class="task-list">
              ${tasksHtml(tasksOverdue)}
            </ul>
          ` : ''}

          ${tasksDueSoon && tasksDueSoon.length > 0 ? `
            <h3 style="color: #f57c00;">Tasks Due Soon (${tasksDueSoon.length})</h3>
            <ul class="task-list">
              ${tasksHtml(tasksDueSoon)}
            </ul>
          ` : ''}

          <p>Please ensure all tasks are on track to meet the project deadline.</p>

          <a href="${projectUrl}" class="button">View Project</a>

          <p style="margin-top: 30px; font-size: 14px; color: #666;">
            This is an automated reminder. Please contact your project manager if you need support.
          </p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Project Management System. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
