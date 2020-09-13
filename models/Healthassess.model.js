const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
  mentalHealthAssessment: String,
  completeAssessment: String,
  for: String,
  status: String
}, { timestamps: true });

module.exports = mongoose.model('HealthAssessment', assessmentSchema);