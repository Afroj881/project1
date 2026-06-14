// src/templates/invoiceDelivery.js
module.exports = (data) => {
  const { recipientName, invoiceNumber, clientName, amount, currency, dueDate, invoiceUrl, projectName } = data;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice - ${invoiceNumber}</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; }
        .header { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { background: white; padding: 30px; border-radius: 0 0 8px 8px; }
        .invoice-box { background: #f0f4ff; padding: 20px; border-radius: 4px; margin: 20px 0; }
        .invoice-detail { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
        .label { color: #666; font-weight: 500; }
        .value { font-weight: 600; color: #333; }
        .amount { font-size: 24px; color: #11998e; font-weight: bold; }
        .button { display: inline-block; padding: 12px 30px; background: #11998e; color: white; text-decoration: none; border-radius: 4px; margin-top: 20px; }
        .footer { text-align: center; font-size: 12px; color: #999; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
        .attachment-note { background: #e3f2fd; padding: 10px; border-radius: 4px; margin-top: 15px; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📄 Invoice ${invoiceNumber}</h1>
        </div>
        <div class="content">
          <p>Hi <strong>${recipientName}</strong>,</p>
          <p>Please find attached or below the invoice details:</p>
          
          <div class="invoice-box">
            <div class="invoice-detail">
              <span class="label">Invoice Number:</span>
              <span class="value">${invoiceNumber}</span>
            </div>
            <div class="invoice-detail">
              <span class="label">Client:</span>
              <span class="value">${clientName}</span>
            </div>
            ${projectName ? `<div class="invoice-detail">
              <span class="label">Project:</span>
              <span class="value">${projectName}</span>
            </div>` : ''}
            <div class="invoice-detail">
              <span class="label">Due Date:</span>
              <span class="value">${new Date(dueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div class="invoice-detail" style="border: none; font-size: 18px; margin-top: 20px;">
              <span class="label">Total Amount:</span>
              <span class="amount">${currency} ${parseFloat(amount).toFixed(2)}</span>
            </div>
          </div>

          <div class="attachment-note">
            <strong>PDF Invoice Attached:</strong> The detailed invoice in PDF format is attached to this email for your records.
          </div>

          <a href="${invoiceUrl}" class="button">View Invoice Online</a>

          <p style="margin-top: 30px; font-size: 14px; color: #666;">
            Please process the payment by the due date. If you have any questions about this invoice, please contact our accounting department.
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
