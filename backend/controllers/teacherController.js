import asyncHandler from 'express-async-handler';
import Teacher from '../models/Teacher.js';
import AttendanceRecord from '../models/AttendanceRecord.js';

// @desc    Mark biometric attendance (mock)
// @route   POST /api/teachers/attendance/biometric
// @access  Private (Teacher)
const markBiometricAttendance = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findById(req.user._id);

  if (!teacher) {
    res.status(404);
    throw new Error('Teacher not found');
  }

  if (!teacher.onPremises) {
    res.status(400);
    throw new Error('You are not on college premises.');
  }

  if (!teacher.bufferExpiresAt) {
    res.status(400);
    throw new Error(
      'No active attendance buffer. You may have already clocked in.'
    );
  }

  if (new Date() > new Date(teacher.bufferExpiresAt)) {
    // Mark as "present but unverified" logic could go here
    // For now, we just error
    res.status(400);
    throw new Error(
      'Attendance buffer window (30 minutes) has expired. Contact admin.'
    );
  }

  // Success!
  const attendanceRecord = await AttendanceRecord.create({
    teacherId: teacher._id,
    method: 'biometric', // Mocking biometric
    verifiedOnPremises: true,
  });

  // Clear the buffer to prevent double-marking
  teacher.bufferExpiresAt = null;
  await teacher.save();

  res.status(201).json({
    message: 'Attendance marked successfully',
    record: attendanceRecord,
  });
});

// @desc    Get current teacher's status
// @route   GET /api/teachers/me
// @access  Private (Teacher)
const getMyStatus = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findById(req.user._id).select('-password');
  if (teacher) {
    res.json(teacher);
  } else {
    res.status(404);
    throw new Error('Teacher not found');
  }
});

export { markBiometricAttendance, getMyStatus };