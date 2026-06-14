import express from 'express';
import {
  createInvoice,
  listInvoices,
  getInvoiceById,
  updateInvoice,
  sendInvoice,
  markInvoicePaid,
  getOverdueInvoices,
} from '../controllers/invoiceController.js';
import { authorize } from '../middleware/authorization.js';
import { validateInvoiceCreation, validateInvoiceUpdate } from '../middleware/validation.js';

const router = express.Router();

router.post('/', authorize(['admin', 'accountant']), validateInvoiceCreation, createInvoice);
router.get('/', authorize(['admin', 'accountant', 'viewer']), listInvoices);
router.get('/overdue', authorize(['admin', 'accountant', 'viewer']), getOverdueInvoices);
router.get('/:id', authorize(['admin', 'accountant', 'viewer']), getInvoiceById);
router.put('/:id', authorize(['admin', 'accountant']), validateInvoiceUpdate, updateInvoice);
router.put('/:id/send', authorize(['admin', 'accountant']), sendInvoice);
router.put('/:id/mark-paid', authorize(['admin', 'accountant']), markInvoicePaid);

export default router;
