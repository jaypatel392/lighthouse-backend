const mongoose = require('mongoose');
const Appoiment = require('./appoiment.model');

const billingSchema = new mongoose.Schema({
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  refundAmount: {
    type: Number,
    default: 0
  },
  status: {
    type: String
  },
  paymentRef: {
    type: String
  },
  services: {
    type: Array,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId
  }
}, { timestamps: true });

billingSchema.post('save', async function (doc, next) {
  try {
    const result = await Appoiment.updateBillingId(doc.appointmentId, doc._id)
    next();
  } catch (err) {
    console.log(err);
  }
})

module.exports = mongoose.model('Billing', billingSchema);