// models/Stakeholder.js
import mongoose from 'mongoose';

const stakeholderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  share: { type: Number, required: true },
  responsibilities: { type: String },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  }
}, {
  timestamps: true
});

const Stakeholder = mongoose.model('Stakeholder', stakeholderSchema);
export default Stakeholder;
