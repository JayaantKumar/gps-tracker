import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Teacher from './models/Teacher.js';
import Geofence from './models/Geofence.js';
import AttendanceRecord from './models/AttendanceRecord.js';
import PresenceEvent from './models/PresenceEvent.js';
import connectDB from './config/db.js';

dotenv.config();
await connectDB();

const importData = async () => {
  try {
    // Clear existing data
    await Teacher.deleteMany();
    await Geofence.deleteMany();
    await AttendanceRecord.deleteMany();
    await PresenceEvent.deleteMany();

    // Create Admin User
    const adminUser = await Teacher.create({
      name: 'Admin User',
      email: 'admin@college.edu',
      password: 'password123', // Will be hashed by mongoose pre-save hook
      role: 'admin', // <-- This line is the most important
    });

    // Create Teacher Users
    const teacher1 = await Teacher.create({
      name: 'A. Sharma',
      email: 'asharma@college.edu',
      password: 'password123',
      role: 'teacher',
    });

    const teacher2 = await Teacher.create({
      name: 'B. Verma',
      email: 'bverma@college.edu',
      password: 'password123',
      role: 'teacher',
    });

    // Create Geofence
    await Geofence.create({
      name: 'RCET Main Campus',
      center: { lat: 21.2346, lng: 81.3444 }, // RCET, Bhilai
      radiusMeters: 200,
    });

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

importData();