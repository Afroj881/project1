// src/templates/teamInvitation.js
module.exports = (data) => {
  const { recipientEmail, recipientName, projectName, invitedBy, role, inviteUrl, expiresAt } = data;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Team Invitation - ${projectName}</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { background: white; padding: 30px; border-radius: 0 0 8px 8px; }
        .info-box { background: #f0f4ff; padding: 15px; border-left: 4px solid #667eea; margin: 15px 0; border-radius: 4px; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
        .footer { text-align: center; font-size: 12px; color: #999; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
        .security-note { background: #e8f5e9; padding: 12px; border-radius: 4px; font-size: 12px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>👥 You're Invited to Join a Team</h1>
        </div>
        <div class="content">
          <p>Hi ${recipientName || 'there'},</p>
          <p><strong>${invitedBy}</strong> has invited you to join the project team:</p>
          
          <div class="info-box">
            <div style="margin-bottom: 10px;">
              <strong style="color: #667eea; display: block; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Project</strong>
              <strong>${projectName}</strong>
            </div>
            <div>
              <strong style="color: #667eea; display: block; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Role</strong>
              <strong>${role}</strong>
            </div>
          </div>

          <p>Click the button below to accept the invitation and join the team:</p>

          <a href="${inviteUrl}" class="button">Accept Invitation</a>

          <p style="font-size: 12px; color: #999;">
            This invitation link expires on ${new Date(expiresAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}.
          </p>

          <div class="security-note">
            <strong>Security Note:</strong> This invitation is personal to ${recipientEmail}. Do not share this link with others.
          </div>

          <p style="margin-top: 30px; font-size: 14px; color: #666;">
            If you did not expect this invitation or have any questions, please contact the project manager.
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
