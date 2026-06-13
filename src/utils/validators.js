export const isValidEmail = (value) => {
  if (!value || typeof value !== 'string') return false;
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value);
};

export const isValidRole = (role, validRoles) => {
  return typeof role === 'string' && validRoles.includes(role);
};

export const requireFields = (obj, fields) => {
  const missing = fields.filter((field) => obj[field] === undefined || obj[field] === null || obj[field] === '');
  if (missing.length > 0) {
    const error = new Error(`Missing required fields: ${missing.join(', ')}`);
    error.statusCode = 400;
    throw error;
  }
};
