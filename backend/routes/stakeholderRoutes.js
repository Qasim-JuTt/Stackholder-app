// routes/stakeholderRoutes.js
import express from 'express';
import {
  getAllStakeholders,
  getStakeholderById,
  createStakeholder,
  updateStakeholder,
  deleteStakeholder,
} from '../controllers/stakeholderController.js';

const router = express.Router();
router.get('/', getAllStakeholders);
router.get('/:id', getStakeholderById);
router.post('/', createStakeholder);
router.put('/:id', updateStakeholder);
router.delete('/:id', deleteStakeholder);


export default router;
