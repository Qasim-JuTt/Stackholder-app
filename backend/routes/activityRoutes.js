import express from 'express';
import { logPageVisit, logLogin,getPageVisitsAndChangeLogs } from '../controllers/activityController.js';

const router = express.Router();

router.post('/log-page-visit', logPageVisit);
router.post('/log-login', logLogin);
router.get('/summary', getPageVisitsAndChangeLogs);

export default router;
