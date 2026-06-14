// src/utils/pdfGenerator.js
const PDFDocument = require('pdfkit');

/**
 * Generate PDF invoice
 * @param {Object} invoiceData - Invoice data
 * @returns {Promise<Buffer>} - PDF buffer
 */
const generateInvoicePDF = (invoiceData) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50,
      });

      const chunks = [];

      doc.on('data', chunk => {
        chunks.push(chunk);
      });

      doc.on('end', () => {
        const buffer = Buffer.concat(chunks);
        resolve(buffer);
      });

      doc.on('error', reject);

      // Header
      doc.fontSize(20).text('INVOICE', 50, 50);
      doc.fontSize(10).text(`Invoice #: ${invoiceData.invoiceNumber}`, 50, 100);
      doc.text(`Date: ${new Date(invoiceData.issueDate).toLocaleDateString()}`, 50, 120);
      doc.text(`Due Date: ${new Date(invoiceData.dueDate).toLocaleDateString()}`, 50, 140);

      // Client info
      doc.fontSize(12).text('Bill To:', 50, 200);
      doc.fontSize(10).text(invoiceData.clientName, 50, 220);
      doc.text(invoiceData.clientEmail || '', 50, 240);

      // Table header
      const tableTop = 300;
      doc.fontSize(11).text('Description', 50, tableTop);
      doc.text('Quantity', 250, tableTop);
      doc.text('Rate', 350, tableTop);
      doc.text('Amount', 450, tableTop);

      // Table content
      let yPosition = tableTop + 25;
      if (invoiceData.items && invoiceData.items.length > 0) {
        invoiceData.items.forEach(item => {
          doc.fontSize(10)
            .text(item.description, 50, yPosition)
            .text(item.quantity, 250, yPosition)
            .text(`$${parseFloat(item.rate).toFixed(2)}`, 350, yPosition)
            .text(`$${parseFloat(item.amount).toFixed(2)}`, 450, yPosition);
          yPosition += 30;
        });
      }

      // Total
      yPosition += 10;
      doc.fontSize(12).text(`Total: ${invoiceData.currency} ${parseFloat(invoiceData.amount).toFixed(2)}`, 350, yPosition);

      // Notes
      if (invoiceData.notes) {
        yPosition += 50;
        doc.fontSize(10).text('Notes:', 50, yPosition);
        doc.fontSize(9).text(invoiceData.notes, 50, yPosition + 20, { width: 500 });
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  generateInvoicePDF,
};
