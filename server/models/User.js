import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true }, // ADD THIS LINE
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  preferences: {
    theme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' }
  }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);