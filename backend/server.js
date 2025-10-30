import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

// Route imports
import authRoutes from './routes/auth.js';
import teacherRoutes from './routes/teachers.js';
import adminRoutes from './routes/admin.js';
import geofenceRoutes from './routes/geofences.js';
import locationRoutes from './routes/location.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/geofences', geofenceRoutes);
app.use('/api/location', locationRoutes);

// Simple root route
app.get('/', (req, res) => {
  res.send('GPS Attendance API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});