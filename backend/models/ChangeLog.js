// models/ChangeLog.js
import mongoose from 'mongoose';

const changeLogSchema = new mongoose.Schema({
  model: { type: String, required: true }, // e.g., 'User', 'Project'
  documentId: { type: mongoose.Schema.Types.ObjectId, required: true },
  operation: { type: String, enum: ['update', 'delete'], required: true },
  updatedBy: { type: String }, // userId
  updatedAt: { type: Date, default: Date.now },
  before: { type: Object },    // For update: old data
  after: { type: Object },     // For update: new data
  deletedData: { type: Object } // For delete
});

export default mongoose.model('ChangeLog', changeLogSchema);
