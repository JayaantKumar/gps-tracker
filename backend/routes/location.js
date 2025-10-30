import express from 'express';
const router = express.Router();
import { pingLocation } from '../controllers/locationController.js';
import { protect } from '../middleware/authMiddleware.js';

router.post('/ping', protect, pingLocation);

export default router;