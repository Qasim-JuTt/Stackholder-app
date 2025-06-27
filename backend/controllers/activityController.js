import PageVisit from '../models/PageVisit.js';
import LoginLog from '../models/LoginLog.js';
import AdminUser from '../models/AdminUser.js';


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


export const getPageVisitsAndChangeLogs = async (req, res) => {
  try {
    const pageVisits = await PageVisit.find()
      .populate('userId', 'name') // ✅ Populate userId with name only
      .sort({ timestamp: -1 });

    const changeLogs = await ChangeLog.find()
      .populate('updatedBy', 'name') // ✅ updatedBy must be a ref, or convert it below
      .sort({ updatedAt: -1 });

    res.json({ pageVisits, changeLogs });
  } catch (error) {
    console.error('Error fetching activity data:', error);
    res.status(500).json({ error: 'Failed to fetch activity summary' });
  }
};