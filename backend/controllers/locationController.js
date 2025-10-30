import asyncHandler from 'express-async-handler';
import Teacher from '../models/Teacher.js';
import Geofence from '../models/Geofence.js';
import PresenceEvent from '../models/PresenceEvent.js';
import { haversineDistanceMeters } from '../utils/geofenceHelpers.js';

// @desc    Receive location ping from teacher
// @route   POST /api/location/ping
// @access  Private (Teacher)
const pingLocation = asyncHandler(async (req, res) => {
  const { lat, lng } = req.body;
  const teacherId = req.user._id;

  if (!lat || !lng) {
    res.status(400);
    throw new Error('Latitude and Longitude are required');
  }

  // 1. Find the teacher
  const teacher = await Teacher.findById(teacherId);
  if (!teacher) {
    res.status(404);
    throw new Error('Teacher not found');
  }

  // 2. Find the (first) active geofence
  // In a real app, you might check against multiple geofences
  const geofence = await Geofence.findOne();
  if (!geofence) {
    res.status(500);
    throw new Error('No geofence configured in the system');
  }

  // 3. Check distance
  const distance = haversineDistanceMeters(
    lat,
    lng,
    geofence.center.lat,
    geofence.center.lng
  );
  const isInside = distance <= geofence.radiusMeters;

  // 4. Log the presence event
  await PresenceEvent.create({
    teacherId,
    location: { lat, lng },
    insideGeofence: isInside,
    geofenceId: geofence._id,
  });

  // 5. Update teacher status and buffer logic
  teacher.lastSeen = new Date();
  const wasOnPremises = teacher.onPremises;
  teacher.onPremises = isInside;

  // 6. CORE LOGIC: Check for transitions
  const BUFFER_DURATION_MS = 30 * 60 * 1000; // 30 minutes

  if (isInside && !wasOnPremises) {
    // Teacher JUST ENTERED the geofence
    teacher.bufferExpiresAt = new Date(Date.now() + BUFFER_DURATION_MS);
  } else if (!isInside && wasOnPremises) {
    // Teacher JUST LEFT the geofence
    // You might clear the buffer, or let it run.
    // Let's clear it to be strict.
    teacher.bufferExpiresAt = null;
  }
  // If they are inside and were already inside, buffer remains.
  // If they are outside and were already outside, buffer remains null.

  await teacher.save();

  res.status(200).json({
    onPremises: teacher.onPremises,
    bufferExpiresAt: teacher.bufferExpiresAt,
    distanceFromCenter: distance.toFixed(2),
  });
});

export { pingLocation };