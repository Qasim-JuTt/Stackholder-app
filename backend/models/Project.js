import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  value: { type: Number, required: true },
  completion: { type: Number, default: 0 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // 👈 Add this line
}, { timestamps: true });

projectSchema.virtual('stakeholders', {
  ref: 'Stakeholder',
  localField: '_id',
  foreignField: 'project'
});

projectSchema.set('toObject', { virtuals: true });
projectSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Project', projectSchema);
