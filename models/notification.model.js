const mongoose = require('mongoose');
const { stream } = require('winston');

const noteSchema = new mongoose.Schema({
  alert : {
    type: String,
    required: true
  },
  for: {
    type: mongoose.Schema.Types.ObjectId,
  },
  description : {
    type : String
  },
  url : {
    type: String
  },
  status: {
    type: String,
    default: 'unseen'
  }
}, { timestamps: true });

module.exports = mongoose.model('Notification', noteSchema);