import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  jsonTransport: true,
});

export async function sendInvoiceEmail(recipientEmail, invoice, pdfBuffer) {
  const mailOptions = {
    from: 'billing@example.com',
    to: recipientEmail,
    subject: `Invoice ${invoice.invoiceNumber}`,
    text: `Please find attached invoice ${invoice.invoiceNumber}.`,
    attachments: [
      { filename: `${invoice.invoiceNumber}.pdf`, content: pdfBuffer, contentType: 'application/pdf' },
    ],
  };

  const info = await transporter.sendMail(mailOptions);
  console.log('Email sent:', info);
  return info;
}
