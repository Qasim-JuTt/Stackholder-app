import express from 'express';
import { logPageVisit, logLogin } from '../controllers/activityController.js';

const router = express.Router();

router.post('/log-page-visit', logPageVisit);
router.post('/log-login', logLogin);

export default router;
