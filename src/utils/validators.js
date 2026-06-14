// src/utils/validators.js
const Joi = require('joi');

const validateEmail = (email) => {
  const schema = Joi.string().email().required();
  return schema.validate(email);
};

const validatePagination = (query) => {
  const schema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
  });
  return schema.validate(query);
};

const validateActivityFilter = (query) => {
  const schema = Joi.object({
    userId: Joi.string().optional(),
    action: Joi.string().optional(),
    entity: Joi.string().optional(),
    entityId: Joi.string().optional(),
    projectId: Joi.string().optional(),
    startDate: Joi.date().optional(),
    endDate: Joi.date().optional(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
  });
  return schema.validate(query);
};

const validateEmailData = (data) => {
  const schema = Joi.object({
    to: Joi.string().email().required(),
    cc: Joi.array().items(Joi.string().email()).optional(),
    bcc: Joi.array().items(Joi.string().email()).optional(),
    subject: Joi.string().required(),
    template: Joi.string().required(),
    data: Joi.object().required(),
  });
  return schema.validate(data);
};

module.exports = {
  validateEmail,
  validatePagination,
  validateActivityFilter,
  validateEmailData,
};
