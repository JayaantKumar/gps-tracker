import express from 'express';
const router = express.Router();
import {
  registerTeacher,
  getDashboardData,
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

// All routes here are protected and require admin role
router.use(protect, admin);

router.post('/register', registerTeacher);
router.get('/dashboard', getDashboardData);

export default router;