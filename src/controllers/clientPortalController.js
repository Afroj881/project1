const service = require('../services/clientPortalService');

exports.getDashboard = async (req, res, next) => {
  try {
    const data = await service.getDashboard(req.user);
    res.json(data);
  } catch (err) { next(err); }
};

exports.getProjects = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const data = await service.getProjects(req.user, { page, limit });
    res.json(data);
  } catch (err) { next(err); }
};

exports.getProjectById = async (req, res, next) => {
  try {
    const data = await service.getProjectById(req.user, req.params.id);
    if (!data) return res.status(404).json({ message: 'Project not found' });
    res.json(data);
  } catch (err) { next(err); }
};

exports.getInvoices = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const data = await service.getInvoices(req.user, { page, limit });
    res.json(data);
  } catch (err) { next(err); }
};

exports.postFeedback = async (req, res, next) => {
  try {
    const payload = req.body;
    const created = await service.createFeedback(req.user, payload);
    res.status(201).json(created);
  } catch (err) { next(err); }
};
