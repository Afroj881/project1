import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'supersecretjwtkey';

const users = [
  { id: 'u1', email: 'admin@example.com', role: 'admin' },
  { id: 'u2', email: 'accountant@example.com', role: 'accountant' },
  { id: 'u3', email: 'viewer@example.com', role: 'viewer' },
];

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, SECRET_KEY);
    const user = users.find((u) => u.id === payload.sub);
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid authentication token' });
  }
}

export function generateTestToken(userId) {
  return jwt.sign({ sub: userId }, SECRET_KEY, { expiresIn: '8h' });
}
