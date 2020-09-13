const mongoose = require('mongoose');

const permissonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  scope: {
    type: String,
    required: true
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true
  },
  status: {
    type: String,
    required: true
  },
  
}, { timestamps: true });

module.exports = mongoose.model('Permission', permissonSchema);