import express from 'express';
const router = express.Router();
import {
  markBiometricAttendance,
  getMyStatus,
} from '../controllers/teacherController.js';
import { protect } from '../middleware/authMiddleware.js';

// All routes here are protected
router.use(protect);

router.post('/attendance/biometric', markBiometricAttendance);
router.get('/me', getMyStatus);

export default router;