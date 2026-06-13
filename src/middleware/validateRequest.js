const validateRequest = (schema) => async (req, res, next) => {
  try {
    const validated = await schema.validateAsync(req.body, { abortEarly: false, stripUnknown: true });
    req.body = validated;
    next();
  } catch (error) {
    const details = error.details ? error.details.map((item) => item.message) : [error.message];
    res.status(400).json({ success: false, message: 'Validation error', errors: details });
  }
};

const validateQuery = (schema) => async (req, res, next) => {
  try {
    const validated = await schema.validateAsync(req.query, { abortEarly: false, stripUnknown: true });
    req.query = validated;
    next();
  } catch (error) {
    const details = error.details ? error.details.map((item) => item.message) : [error.message];
    res.status(400).json({ success: false, message: 'Validation error', errors: details });
  }
};

const validateParams = (schema) => async (req, res, next) => {
  try {
    const validated = await schema.validateAsync(req.params, { abortEarly: false, stripUnknown: true });
    req.params = validated;
    next();
  } catch (error) {
    const details = error.details ? error.details.map((item) => item.message) : [error.message];
    res.status(400).json({ success: false, message: 'Validation error', errors: details });
  }
};

module.exports = { validateRequest, validateQuery, validateParams };
