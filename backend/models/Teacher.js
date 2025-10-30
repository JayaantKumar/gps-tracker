import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const teacherSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['teacher', 'admin'],
      default: 'teacher',
    },
    deviceId: { type: String }, // Can be used for UUID
    lastSeen: { type: Date },
    onPremises: { type: Boolean, default: false },
    bufferExpiresAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Encrypt password using bcrypt
teacherSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
teacherSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Teacher = mongoose.model('Teacher', teacherSchema);
export default Teacher;