const mongoose = require('mongoose');
const Billing = require('./billing.model');

const paymentSchema = new mongoose.Schema({
  billingId : {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  amount: {
    type: Number
  },
  status: {
    type: String,
  },
  txnId: {
    type: String,
  },
  metaData: Object,
  p_id: String,
  mode : String
}, { timestamps: true });

paymentSchema.post('update', async function(doc, next) {
  try {
    console.log('payment middle ware update===========>', doc);
    const result = await Billing.findByIdAndUpdate(doc._id, { status : 'paid'});
    console.log('result update', result);
    
  } catch (err) {
    console.log(err);
  }
})

module.exports = mongoose.model('Payment', paymentSchema);