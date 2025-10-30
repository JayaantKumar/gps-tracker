import asyncHandler from 'express-async-handler';
import Teacher from '../models/Teacher.js';
import mongoose from 'mongoose';

// @desc    Register a new teacher
// @route   POST /api/admin/register
// @access  Private (Admin)
const registerTeacher = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const teacherExists = await Teacher.findOne({ email });
  if (teacherExists) {
    res.status(400);
    throw new Error('Teacher already exists');
  }

  const teacher = await Teacher.create({
    name,
    email,
    password,
    role: role || 'teacher', // Default to 'teacher' if not specified
  });

  if (teacher) {
    res.status(201).json({
      _id: teacher._id,
      name: teacher.name,
      email: teacher.email,
      role: teacher.role,
    });
  } else {
    res.status(400);
    throw new Error('Invalid teacher data');
  }
});

// @desc    Get admin dashboard data (all teachers + last location)
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
const getDashboardData = asyncHandler(async (req, res) => {
  // Use aggregation to get all teachers and attach their *latest* presence event
  const teachersWithLastLocation = await Teacher.aggregate([
    {
      $match: { role: 'teacher' }, // Only get teachers
    },
    {
      $lookup: {
        from: 'presenceevents', // The name of the PresenceEvent collection
        localField: '_id',
        foreignField: 'teacherId',
        as: 'presenceHistory',
        pipeline: [
          { $sort: { timestamp: -1 } }, // Get the latest event first
          { $limit: 1 },
        ],
      },
    },
    {
      // $unwind to deconstruct the presenceHistory array
      $unwind: {
        path: '$presenceHistory',
        preserveNullAndEmptyArrays: true, // Keep teachers with no presence history
      },
    },
    {
      $project: {
        password: 0, // Exclude password from the result
      },
    },
    {
      $sort: {
        name: 1, // Sort by name
      },
    },
  ]);

  res.json(teachersWithLastLocation);
});

export { registerTeacher, getDashboardData };