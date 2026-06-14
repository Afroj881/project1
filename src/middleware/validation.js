import { body, param, query, validationResult } from 'express-validator';

const itemValidator = [
  body('items').isArray({ min: 1 }).withMessage('Invoice must contain at least one item'),
  body('items.*.description').isString().trim().notEmpty().withMessage('Each item needs a description'),
  body('items.*.quantity').isFloat({ gt: 0 }).withMessage('Each item quantity must be greater than zero'),
  body('items.*.rate').isFloat({ gt: 0 }).withMessage('Each item rate must be greater than zero'),
  body('items.*.gstPercentage').isFloat({ min: 0 }).withMessage('Each item GST percentage must be a positive number'),
];

export const validateInvoiceCreation = [
  body('client_id').isString().trim().notEmpty().withMessage('client_id is required'),
  body('project_id').isString().trim().notEmpty().withMessage('project_id is required'),
  ...itemValidator,
  body('discount').optional().isFloat({ min: 0 }).withMessage('discount must be non-negative'),
  body('dueDate').isISO8601().toDate().withMessage('dueDate must be a valid date'),
  body('notes').optional().isString().trim(),
  validateRequest,
];

export const validateInvoiceUpdate = [
  param('id').isUUID().withMessage('Invoice id must be a UUID'),
  body('client_id').optional().isString().trim().notEmpty(),
  body('project_id').optional().isString().trim().notEmpty(),
  body('items').optional().isArray({ min: 1 }),
  body('items.*.description').optional().isString().trim().notEmpty(),
  body('items.*.quantity').optional().isFloat({ gt: 0 }),
  body('items.*.rate').optional().isFloat({ gt: 0 }),
  body('items.*.gstPercentage').optional().isFloat({ min: 0 }),
  body('discount').optional().isFloat({ min: 0 }),
  body('dueDate').optional().isISO8601().toDate(),
  body('notes').optional().isString().trim(),
  validateRequest,
];

function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
}
