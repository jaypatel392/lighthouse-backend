const mongoose = require('mongoose');

const rcadQSchema = new mongoose.Schema({
  title : {
    type: String,
    required: true,
  },
  status: {
    type: String,
  },
  ans : {
    type: String,
  }
}, { timestamps: true });

module.exports = mongoose.model('RcadQ', rcadQSchema);