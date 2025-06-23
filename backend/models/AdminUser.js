import mongoose from 'mongoose';

const adminUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'main', 'sub'], default: 'sub' },
  parentUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser', default: null },
  pin: { type: String, default: null },
  isApproved: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('AdminUser', adminUserSchema);
