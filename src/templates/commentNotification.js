// src/templates/commentNotification.js
module.exports = (data) => {
  const { recipientName, taskTitle, projectName, commentAuthor, commentText, taskUrl } = data;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Comment on Your Task</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { background: white; padding: 30px; border-radius: 0 0 8px 8px; }
        .comment-box { background: #f5f5f5; border-left: 4px solid #667eea; padding: 15px; border-radius: 4px; margin: 15px 0; }
        .comment-author { color: #667eea; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px; }
        .comment-text { color: #333; line-height: 1.6; }
        .task-info { background: #f0f4ff; padding: 12px; border-radius: 4px; margin: 15px 0; font-size: 14px; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 4px; margin-top: 20px; }
        .footer { text-align: center; font-size: 12px; color: #999; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>💬 New Comment on Your Task</h1>
        </div>
        <div class="content">
          <p>Hi <strong>${recipientName}</strong>,</p>
          <p><strong>${commentAuthor}</strong> added a comment to your task:</p>
          
          <div class="task-info">
            <strong>Task:</strong> ${taskTitle}<br>
            <strong>Project:</strong> ${projectName}
          </div>

          <div class="comment-box">
            <div class="comment-author">Comment by ${commentAuthor}</div>
            <div class="comment-text">${commentText}</div>
          </div>

          <p>Please review the comment and respond if necessary.</p>

          <a href="${taskUrl}" class="button">View Task & Reply</a>

          <p style="margin-top: 30px; font-size: 14px; color: #666;">
            This is an automated notification. Please do not reply to this email. Use the link above to view and respond to the comment.
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
