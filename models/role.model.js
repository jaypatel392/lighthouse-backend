const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    required: true
  },
  scopes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    }
  ],
  permissions : {
    type: Array
  }
}, { timestamps: true });

module.exports = mongoose.model('Role', roleSchema);