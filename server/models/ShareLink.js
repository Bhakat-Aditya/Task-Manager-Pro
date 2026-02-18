import mongoose from 'mongoose';

const ShareLinkSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['snapshot', 'live'], required: true },
  permission: { type: String, enum: ['view', 'edit'], default: 'view' },
  active: { type: Boolean, default: true },
  expiresAt: Date
}, { timestamps: true });

export default mongoose.models.ShareLink || mongoose.model('ShareLink', ShareLinkSchema);