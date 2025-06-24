import jwt from 'jsonwebtoken';

export const protectAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Not authorized' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== 'main') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Not authorized' });
  }
};
