import {
  createInvoice as createInvoiceService,
  getInvoices,
  getInvoiceDetails,
  updateInvoice as updateInvoiceService,
  sendInvoice as sendInvoiceService,
  markPaid,
  getOverdue,
} from '../services/invoiceService.js';

export async function createInvoice(req, res, next) {
  try {
    const invoice = await createInvoiceService({ ...req.body, user: req.user });
    res.status(201).json(invoice);
  } catch (err) {
    next(err);
  }
}

export async function listInvoices(req, res, next) {
  try {
    const result = await getInvoices(req.query);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getInvoiceById(req, res, next) {
  try {
    const invoice = await getInvoiceDetails(req.params.id);
    res.json(invoice);
  } catch (err) {
    next(err);
  }
}

export async function updateInvoice(req, res, next) {
  try {
    const invoice = await updateInvoiceService(req.params.id, { ...req.body, user: req.user });
    res.json(invoice);
  } catch (err) {
    next(err);
  }
}

export async function sendInvoice(req, res, next) {
  try {
    const invoice = await sendInvoiceService(req.params.id, { user: req.user });
    res.json(invoice);
  } catch (err) {
    next(err);
  }
}

export async function markInvoicePaid(req, res, next) {
  try {
    const invoice = await markPaid(req.params.id, { user: req.user });
    res.json(invoice);
  } catch (err) {
    next(err);
  }
}

export async function getOverdueInvoices(req, res, next) {
  try {
    const invoices = await getOverdue();
    res.json({ invoices });
  } catch (err) {
    next(err);
  }
}
