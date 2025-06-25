// models/ChangeLog.js
import mongoose from 'mongoose';

const changeLogSchema = new mongoose.Schema({
  model: { type: String, required: true }, // e.g., 'User', 'Project'
  documentId: { type: mongoose.Schema.Types.ObjectId, required: true },
  operation: { type: String, enum: ['create', 'update', 'delete'], required: true },
  updatedBy: { type: String }, // userId
  updatedAt: { type: Date, default: Date.now },

  // For 'create'
  createdData: { type: Object },

  // For 'update'
  before: { type: Object },
  after: { type: Object },

  // For 'delete'
  deletedData: { type: Object }
});

export default mongoose.model('ChangeLog', changeLogSchema);
