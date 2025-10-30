import mongoose from 'mongoose';

const attendanceRecordSchema = new mongoose.Schema({
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true,
  },
  method: {
    type: String,
    enum: ['biometric', 'face', 'manual'], // 'biometric' is the mock
    required: true,
  },
  timestamp: { type: Date, default: Date.now },
  verifiedOnPremises: { type: Boolean, default: false },
  // Links to the presence event that triggered the buffer
  presenceEventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PresenceEvent',
  },
});

const AttendanceRecord = mongoose.model(
  'AttendanceRecord',
  attendanceRecordSchema
);
export default AttendanceRecord;