import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; // <--- Make sure this is imported
import connectDB from './config/db.js';

// Route imports
import authRoutes from './routes/auth.js';
import teacherRoutes from './routes/teachers.js';
import adminRoutes from './routes/admin.js';
import geofenceRoutes from './routes/geofences.js';
import locationRoutes from './routes/location.js';

dotenv.config();
connectDB();

const app = express();

// --- CORS CONFIGURATION (THE FIX) ---
// We allow both your Localhost (for testing) and your Vercel App (for production)
const allowedOrigins = [
  "http://localhost:5173",
  "https://gps-tracker-seven.vercel.app" 
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true, // Allow cookies/headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
// ------------------------------------

app.use(express.json());

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/geofences', geofenceRoutes);
app.use('/api/location', locationRoutes);

app.get('/', (req, res) => {
  res.send('GPS Attendance API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});