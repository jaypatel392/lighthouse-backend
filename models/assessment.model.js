const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
  assessment : {
    type: String,
    required: true,
  },
  status: {
    type: String,
  }
}, { timestamps: true });

module.exports = mongoose.model('Assessment', assessmentSchema);