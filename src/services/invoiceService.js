import {
  createInvoiceRecord,
  findInvoiceById,
  listInvoices,
  updateInvoiceRecord,
  getOverdueInvoices,
  addAuditLog,
  getInvoiceById as fetchInvoice,
} from '../models/invoiceModel.js';
import { getClientById } from '../models/clientModel.js';
import { getProjectById } from '../models/projectModel.js';
import { generateInvoiceNumber, calculateInvoiceTotals } from '../utils/invoiceUtils.js';
import { generateInvoicePdf } from '../utils/pdfGenerator.js';
import { sendInvoiceEmail } from '../utils/emailService.js';

export async function createInvoice(payload) {
  const client = getClientById(payload.client_id);
  if (!client) {
    const error = new Error('Client not found');
    error.status = 404;
    throw error;
  }

  const project = getProjectById(payload.project_id);
  if (!project) {
    const error = new Error('Project not found');
    error.status = 404;
    throw error;
  }

  const existingInvoices = listInvoices({ page: 1, pageSize: 10000, status: null, client_id: null, project_id: null, fromDate: null, toDate: null, search: null }).invoices;
  const invoiceNumber = generateInvoiceNumber(existingInvoices);
  const totals = calculateInvoiceTotals(payload.items, payload.discount);

  const invoice = createInvoiceRecord({
    invoiceNumber,
    client_id: payload.client_id,
    project_id: payload.project_id,
    items: payload.items,
    discount: totals.discount,
    subtotal: totals.subtotal,
    gstAmount: totals.gstAmount,
    total: totals.total,
    status: 'draft',
    dueDate: payload.dueDate,
    paidAt: null,
    notes: payload.notes || '',
    audit: [{ timestamp: new Date(), action: 'created', user: payload.user.email }],
  });

  return invoice;
}

export async function getInvoices(queryParams) {
  const page = Math.max(1, Number(queryParams.page || 1));
  const pageSize = Math.min(100, Number(queryParams.pageSize || 20));
  const fromDate = queryParams.fromDate ? new Date(queryParams.fromDate) : null;
  const toDate = queryParams.toDate ? new Date(queryParams.toDate) : null;

  return listInvoices({
    status: queryParams.status || null,
    client_id: queryParams.client_id || null,
    project_id: queryParams.project_id || null,
    fromDate,
    toDate,
    search: queryParams.search || null,
    page,
    pageSize,
  });
}

export async function getInvoiceDetails(id) {
  const invoice = fetchInvoice(id);
  if (!invoice) {
    const error = new Error('Invoice not found');
    error.status = 404;
    throw error;
  }
  return {
    ...invoice,
    client: getClientById(invoice.client_id),
    project: getProjectById(invoice.project_id),
  };
}

export async function updateInvoice(id, payload) {
  const invoice = findInvoiceById(id);
  if (!invoice) {
    const error = new Error('Invoice not found');
    error.status = 404;
    throw error;
  }
  if (invoice.status !== 'draft') {
    const error = new Error('Invoice can only be updated when status is draft');
    error.status = 400;
    throw error;
  }

  const updates = {};
  if (payload.client_id) {
    const client = getClientById(payload.client_id);
    if (!client) {
      const error = new Error('Client not found');
      error.status = 404;
      throw error;
    }
    updates.client_id = payload.client_id;
  }
  if (payload.project_id) {
    const project = getProjectById(payload.project_id);
    if (!project) {
      const error = new Error('Project not found');
      error.status = 404;
      throw error;
    }
    updates.project_id = payload.project_id;
  }
  if (payload.items) updates.items = payload.items;
  if (payload.discount !== undefined) updates.discount = payload.discount;
  if (payload.dueDate) updates.dueDate = payload.dueDate;
  if (payload.notes !== undefined) updates.notes = payload.notes;

  if (payload.items || payload.discount !== undefined) {
    const items = payload.items || invoice.items;
    const discount = payload.discount !== undefined ? payload.discount : invoice.discount;
    const totals = calculateInvoiceTotals(items, discount);
    updates.subtotal = totals.subtotal;
    updates.gstAmount = totals.gstAmount;
    updates.total = totals.total;
    updates.discount = totals.discount;
  }

  const updated = updateInvoiceRecord(id, updates);
  addAuditLog({ invoiceId: id, action: 'updated', user: payload.user.email, changes: updates });
  return updated;
}

export async function sendInvoice(id, payload) {
  const invoice = findInvoiceById(id);
  if (!invoice) {
    const error = new Error('Invoice not found');
    error.status = 404;
    throw error;
  }
  if (invoice.status !== 'draft') {
    const error = new Error('Invoice can only be sent when status is draft');
    error.status = 400;
    throw error;
  }

  const client = getClientById(invoice.client_id);
  if (!client) {
    const error = new Error('Client not found');
    error.status = 404;
    throw error;
  }

  const pdfBuffer = await generateInvoicePdf(invoice, client, getProjectById(invoice.project_id));
  await sendInvoiceEmail(client.email, invoice, pdfBuffer);

  const updated = updateInvoiceRecord(id, { status: 'sent' });
  addAuditLog({ invoiceId: id, action: 'sent', user: payload.user.email });
  return updated;
}

export async function markPaid(id, payload) {
  const invoice = findInvoiceById(id);
  if (!invoice) {
    const error = new Error('Invoice not found');
    error.status = 404;
    throw error;
  }
  if (invoice.status === 'paid') {
    const error = new Error('Invoice is already marked as paid');
    error.status = 400;
    throw error;
  }

  const updated = updateInvoiceRecord(id, { status: 'paid', paidAt: new Date() });
  addAuditLog({ invoiceId: id, action: 'mark-paid', user: payload.user.email });
  return updated;
}

export async function getOverdue() {
  return getOverdueInvoices();
}
