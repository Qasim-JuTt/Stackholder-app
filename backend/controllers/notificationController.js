import Notification from '../models/Notification.js';

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ _id: -1 }).limit(100);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
};

export const createNotification = async (req, res) => {
  try {
    const { message } = req.body;
    const newNotification = new Notification({
      message,
      timestamp: new Date().toLocaleString(),
    });
    const saved = await newNotification.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add notification' });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Notification deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete notification' });
  }
};

export const clearAllNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({});
    res.status(200).json({ message: 'All notifications cleared' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to clear notifications' });
  }
};
