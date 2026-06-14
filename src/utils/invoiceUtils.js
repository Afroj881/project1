export function generateInvoiceNumber(existingInvoices) {
  const year = new Date().getFullYear();
  const yearInvoices = existingInvoices.filter((invoice) => invoice.invoiceNumber.startsWith(`INV-${year}-`));
  const nextSequence = String(yearInvoices.length + 1).padStart(3, '0');
  return `INV-${year}-${nextSequence}`;
}

export function calculateInvoiceTotals(items, discount = 0) {
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
  const gstAmount = items.reduce(
    (sum, item) => sum + item.quantity * item.rate * (item.gstPercentage / 100),
    0
  );
  const totalBeforeDiscount = subtotal + gstAmount;
  const discountAmount = Math.min(discount, totalBeforeDiscount);
  const total = Math.max(0, totalBeforeDiscount - discountAmount);
  return {
    subtotal: Number(subtotal.toFixed(2)),
    gstAmount: Number(gstAmount.toFixed(2)),
    discount: Number(discountAmount.toFixed(2)),
    total: Number(total.toFixed(2)),
  };
}
