const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  note : {
    type: String,
    required: true
  },
  time: {
    type: Date,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Note', noteSchema);