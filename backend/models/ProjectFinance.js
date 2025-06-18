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
  }
} , { timestamps: true });

export default mongoose.model('Finance', transactionSchema);
