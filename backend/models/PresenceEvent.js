import mongoose from 'mongoose';

const presenceEventSchema = new mongoose.Schema({
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true,
  },
  timestamp: { type: Date, default: Date.now },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  insideGeofence: { type: Boolean, required: true },
  geofenceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Geofence',
    required: true,
  },
});

const PresenceEvent = mongoose.model('PresenceEvent', presenceEventSchema);
export default PresenceEvent;