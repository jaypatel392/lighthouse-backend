const mongoose = require('mongoose');

const assessmentAnsSchema = new mongoose.Schema({
  client : {
    type: String,
    required: true
  },
  ans : {
    type: Array,
  }
}, { timestamps: true });

module.exports = mongoose.model('AssessmentAns', assessmentAnsSchema);