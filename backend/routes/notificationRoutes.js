import express from 'express';
import {
  getNotifications,
  createNotification,
  deleteNotification,
  clearAllNotifications
} from '../controllers/notificationController.js';

const router = express.Router();

router.get('/', getNotifications);
router.post('/', createNotification);
router.delete('/:id', deleteNotification);
router.delete('/', clearAllNotifications);

export default router;
