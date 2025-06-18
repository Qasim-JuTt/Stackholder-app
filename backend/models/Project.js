// models/Project.js
import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  value: { type: Number, required: true },
  completion: { type: Number, default: 0 },
}, { timestamps: true });

// ✅ Virtual populate
projectSchema.virtual('stakeholders', {
  ref: 'Stakeholder',
  localField: '_id',
  foreignField: 'project'
});

// ✅ To include virtuals in JSON output
projectSchema.set('toObject', { virtuals: true });
projectSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Project', projectSchema);
