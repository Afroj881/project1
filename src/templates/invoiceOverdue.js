// src/templates/invoiceOverdue.js
module.exports = (data) => {
  const { recipientName, invoiceNumber, clientName, amount, currency, dueDate, daysOverdue, invoiceUrl } = data;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice Overdue Reminder - ${invoiceNumber}</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; }
        .header { background: linear-gradient(135deg, #d32f2f 0%, #f57c00 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { background: white; padding: 30px; border-radius: 0 0 8px 8px; }
        .alert-box { background: #ffebee; border-left: 4px solid #d32f2f; padding: 15px; border-radius: 4px; margin: 15px 0; }
        .invoice-detail { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; }
        .label { color: #666; font-weight: 500; }
        .value { font-weight: 600; color: #333; }
        .amount { font-size: 20px; color: #d32f2f; font-weight: bold; }
        .button { display: inline-block; padding: 12px 30px; background: #d32f2f; color: white; text-decoration: none; border-radius: 4px; margin-top: 20px; }
        .footer { text-align: center; font-size: 12px; color: #999; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>⚠️ Invoice Payment Overdue</h1>
        </div>
        <div class="content">
          <p>Hi <strong>${recipientName}</strong>,</p>
          
          <div class="alert-box">
            <strong style="color: #d32f2f;">This invoice is now ${daysOverdue} day(s) overdue.</strong><br>
            Payment was due on ${new Date(dueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}.
          </div>

          <div class="invoice-detail">
            <span class="label">Invoice Number:</span>
            <span class="value">${invoiceNumber}</span>
          </div>
          <div class="invoice-detail">
            <span class="label">Client:</span>
            <span class="value">${clientName}</span>
          </div>
          <div class="invoice-detail">
            <span class="label">Outstanding Amount:</span>
            <span class="amount">${currency} ${parseFloat(amount).toFixed(2)}</span>
          </div>

          <p style="margin: 20px 0; color: #d32f2f; font-weight: 600;">
            Please arrange payment immediately to avoid any service interruption.
          </p>

          <a href="${invoiceUrl}" class="button">View Invoice & Make Payment</a>

          <p style="margin-top: 30px; font-size: 14px; color: #666;">
            If payment has already been made, please disregard this message and contact our accounting department to update the payment status.
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
