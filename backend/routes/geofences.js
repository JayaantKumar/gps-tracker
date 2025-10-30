import express from 'express';
const router = express.Router();
import {
  createGeofence,
  listGeofences,
} from '../controllers/geofenceController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').post(protect, admin, createGeofence).get(protect, listGeofences);

export default router;