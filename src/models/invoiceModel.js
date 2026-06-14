import { v4 as uuidv4 } from 'uuid';

const invoices = [];

export function createInvoiceRecord(invoice) {
  const record = { id: uuidv4(), createdAt: new Date(), updatedAt: new Date(), ...invoice };
  invoices.push(record);
  return record;
}

export function updateInvoiceRecord(id, updates) {
  const index = invoices.findIndex((invoice) => invoice.id === id);
  if (index === -1) return null;
  invoices[index] = { ...invoices[index], ...updates, updatedAt: new Date() };
  return invoices[index];
}

export function findInvoiceById(id) {
  return invoices.find((invoice) => invoice.id === id) || null;
}

export function listInvoices({ status, client_id, project_id, fromDate, toDate, search, page, pageSize }) {
  let result = [...invoices];
  if (status) result = result.filter((invoice) => invoice.status === status);
  if (client_id) result = result.filter((invoice) => invoice.client_id === client_id);
  if (project_id) result = result.filter((invoice) => invoice.project_id === project_id);
  if (fromDate) result = result.filter((invoice) => invoice.createdAt >= fromDate);
  if (toDate) result = result.filter((invoice) => invoice.createdAt <= toDate);
  if (search) result = result.filter((invoice) => invoice.invoiceNumber.includes(search));
  const total = result.length;
  const start = (page - 1) * pageSize;
  const paged = result.slice(start, start + pageSize);
  return { total, page, pageSize, invoices: paged };
}

export function getOverdueInvoices() {
  const now = new Date();
  return invoices.filter((invoice) => {
    const dueDate = new Date(invoice.dueDate);
    return invoice.status !== 'paid' && dueDate < now;
  });
}

export function addAuditLog(entry) {
  const invoice = invoices.find((i) => i.id === entry.invoiceId);
  if (!invoice) return;
  invoice.audit = invoice.audit || [];
  invoice.audit.push({ timestamp: new Date(), ...entry });
}

export function getInvoiceById(id) {
  return findInvoiceById(id);
}

export function resetData() {
  invoices.length = 0;
}
