import PDFDocument from 'pdfkit';

export function generateInvoicePdf(invoice, client, project) {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const buffers = [];

    doc.on('data', (chunk) => buffers.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(buffers)));

    doc.fontSize(20).text('Invoice', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text(`Invoice Number: ${invoice.invoiceNumber}`);
    doc.text(`Status: ${invoice.status}`);
    doc.text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`);
    doc.text(`Client: ${client.name}`);
    doc.text(`Project: ${project?.name || 'Unknown'}`);
    doc.moveDown();

    doc.text('Items:', { underline: true });
    invoice.items.forEach((item) => {
      doc.text(`- ${item.description}: ${item.quantity} x ${item.rate.toFixed(2)} @ ${item.gstPercentage}% GST`);
    });
    doc.moveDown();

    doc.text(`Subtotal: ${invoice.subtotal.toFixed(2)}`);
    doc.text(`GST: ${invoice.gstAmount.toFixed(2)}`);
    doc.text(`Discount: ${invoice.discount.toFixed(2)}`);
    doc.text(`Total: ${invoice.total.toFixed(2)}`);
    doc.moveDown();

    if (invoice.notes) {
      doc.text('Notes:', { underline: true });
      doc.text(invoice.notes);
    }

    doc.end();
  });
}
