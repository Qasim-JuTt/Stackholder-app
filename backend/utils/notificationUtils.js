// utils/notificationUtils.js
import Notification from '../models/Notification.js';

export const createNotification = async (message, name = '') => {
  try {
    const notification = new Notification({
      message: message.replace('{name}', name),
      timestamp: new Date().toLocaleString(),
    });

    await notification.save();
  } catch (error) {
    console.error('❌ Failed to save notification:', error.message);
  }
};
