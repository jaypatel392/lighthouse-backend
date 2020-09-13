const mongoose = require('mongoose');

const servicesSchema = new mongoose.Schema({
  serviceCode: {
    type: String,
    required: true
  },
  description: {
    type: String,
  },
  duration: {
    type: Number,
    required: true,
  },
  rate: {
    type: Number
  },
  user: {
    type: mongoose.Schema.Types.ObjectId
  },
  type: String,
  status: String
}, { timestamps: true });

module.exports = mongoose.model('Services', servicesSchema);