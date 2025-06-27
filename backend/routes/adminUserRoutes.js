import express from 'express';
import {
  registerUser,
  fetchUnapprovedUsers,
  approveUser,
  loginUser,
  fetchAllUsers,
  deleteUser,
  updateUser

} from '../controllers/adminUserController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser); // public
router.post('/login', loginUser); // public         // ✅ this is required

router.get('/unapproved', protectAdmin, fetchUnapprovedUsers); // admin only
router.get('/all', protectAdmin, fetchAllUsers); // admin only
router.put('/approve/:id', protectAdmin, approveUser); // admin only
router.delete('/delete/:id', deleteUser);
router.put('/update/:id', updateUser);


export default router;
