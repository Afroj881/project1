const { body, validationResult } = require('express-validator');

const validateFeedback = [
  body('project').optional().isMongoId(),
  body('milestone').optional().isMongoId(),
  body('deliverable').optional().isMongoId(),
  body('type').isIn(['comment','approval','revision','suggestion']),
  body('message').isString().isLength({ min: 1 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  }
];

module.exports = { validateFeedback };
