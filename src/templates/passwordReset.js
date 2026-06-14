// src/templates/passwordReset.js
module.exports = (data) => {
  const { recipientName, resetLink, expiresAt, otp } = data;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; }
        .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { background: white; padding: 30px; border-radius: 0 0 8px 8px; }
        .security-alert { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 4px; margin: 15px 0; }
        .otp-box { background: #f0f0f0; padding: 20px; border-radius: 4px; text-align: center; margin: 20px 0; }
        .otp-code { font-size: 32px; font-weight: bold; color: #f5576c; letter-spacing: 5px; font-family: 'Courier New', monospace; }
        .button { display: inline-block; padding: 12px 30px; background: #f5576c; color: white; text-decoration: none; border-radius: 4px; margin-top: 20px; }
        .footer { text-align: center; font-size: 12px; color: #999; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
        .warning { color: #d32f2f; font-weight: 600; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 Reset Your Password</h1>
        </div>
        <div class="content">
          <p>Hi <strong>${recipientName}</strong>,</p>
          
          <div class="security-alert">
            <strong>Security Notice:</strong> We received a request to reset your password. If you did not make this request, please ignore this email and your password will remain unchanged.
          </div>

          <p>Click the button below to reset your password:</p>

          <a href="${resetLink}" class="button">Reset Password</a>

          <p style="text-align: center; font-size: 12px; color: #999;">
            Or copy this link in your browser:<br>
            <code style="background: #f0f0f0; padding: 5px 10px; border-radius: 3px; display: inline-block; word-break: break-all; max-width: 100%; margin-top: 5px;">${resetLink}</code>
          </p>

          ${otp ? `
            <p style="text-align: center; margin-top: 20px;">
              <strong>Or use this One-Time Password (OTP):</strong>
            </p>
            <div class="otp-box">
              <div class="otp-code">${otp}</div>
            </div>
            <p style="text-align: center; font-size: 12px; color: #666;">
              This code is valid for 10 minutes.
            </p>
          ` : ''}

          <p class="warning">
            ⏰ This reset link expires on ${new Date(expiresAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} at ${new Date(expiresAt).toLocaleTimeString()}
          </p>

          <h3 style="margin-top: 25px;">Password Reset Instructions:</h3>
          <ol>
            <li>Click the reset button above</li>
            <li>Enter your new password</li>
            <li>Confirm your password</li>
            <li>Click submit</li>
          </ol>

          <p style="margin-top: 30px; font-size: 14px; color: #666;">
            For security reasons, do not share this email or reset link with anyone. We will never ask for your password via email.
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
