import mongoose from 'mongoose';

const geofenceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  center: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  radiusMeters: { type: Number, required: true },
});

const Geofence = mongoose.model('Geofence', geofenceSchema);
export default Geofence;