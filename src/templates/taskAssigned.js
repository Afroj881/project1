// src/templates/taskAssigned.js
module.exports = (data) => {
  const { recipientName, taskTitle, projectName, assignedBy, taskDescription, taskUrl, taskDeadline } = data;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Task Assigned - Project Management System</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { background: white; padding: 30px; border-radius: 0 0 8px 8px; }
        .task-detail { background: #f0f4ff; padding: 15px; border-left: 4px solid #667eea; margin: 15px 0; border-radius: 4px; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 4px; margin-top: 20px; }
        .footer { text-align: center; font-size: 12px; color: #999; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
        .label { color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 10px; }
        .value { font-weight: 600; color: #333; margin-bottom: 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✓ Task Assigned to You</h1>
        </div>
        <div class="content">
          <p>Hi <strong>${recipientName}</strong>,</p>
          <p><strong>${assignedBy}</strong> has assigned you a new task:</p>
          
          <div class="task-detail">
            <div class="label">Task</div>
            <div class="value">${taskTitle}</div>
            
            <div class="label">Project</div>
            <div class="value">${projectName}</div>
            
            <div class="label">Description</div>
            <div class="value">${taskDescription || 'No description provided'}</div>
            
            ${taskDeadline ? `<div class="label">Deadline</div>
            <div class="value">${new Date(taskDeadline).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>` : ''}
          </div>

          <p>Please review the task details and start working on it.</p>

          <a href="${taskUrl}" class="button">View Task Details</a>

          <p style="margin-top: 30px; font-size: 14px; color: #666;">
            If you have any questions about this task, please reach out to your team lead.
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
