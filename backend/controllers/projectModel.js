const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
    trim: true
  },
  value: {
    type: Number,
    required: [true, 'Project value is required'],
    min: [0, 'Project value cannot be negative']
  },
  completion: {
    type: Number,
    required: [true, 'Completion percentage is required'],
    min: [0, 'Completion cannot be less than 0%'],
    max: [100, 'Completion cannot exceed 100%']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
projectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;