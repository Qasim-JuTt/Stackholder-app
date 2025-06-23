import mongoose from 'mongoose';

const pageVisitSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  page: String,
  ipAddress: String,
  userAgent: String,
  timestamp: { type: Date, default: Date.now },
  sessionId: String,
});

const PageVisit = mongoose.model('PageVisit', pageVisitSchema);
export default PageVisit;
