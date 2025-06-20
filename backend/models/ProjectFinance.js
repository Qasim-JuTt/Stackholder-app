import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  amount: Number,
  date: Date,
  category: String,
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  description: String,
  type: {
    type: String,
    enum: ['expense']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

export default mongoose.model('Finance', transactionSchema);
