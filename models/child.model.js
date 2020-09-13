const mongoose = require('mongoose');

const childSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String },
  dob: { type: Date },
  gender: { type: String },
  nationality: { type: Array },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  avatar: String,
}, { timestamps: true });

module.exports = mongoose.model('Child', childSchema);
