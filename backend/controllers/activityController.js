import PageVisit from '../models/PageVisit.js';
import LoginLog from '../models/LoginLog.js';

export const logPageVisit = async (req, res) => {
  try {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];

    await PageVisit.create({
      userId: req.body.userId || null,
      page: req.body.page,
      ipAddress: ip,
      userAgent,
      sessionId: req.body.sessionId,
    });

    res.status(201).json({ message: 'Page visit logged' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const logLogin = async (req, res) => {
  try {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];

    await LoginLog.create({
      userId: req.body.userId || null,
      ipAddress: ip,
      userAgent,
    });

    res.status(201).json({ message: 'Login logged' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
