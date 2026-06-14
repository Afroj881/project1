function clientOnly(req, res, next) {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  if (req.user.role !== 'client') return res.status(403).json({ message: 'Forbidden: clients only' });
  next();
}

module.exports = clientOnly;
