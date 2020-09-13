const mongoose = require('mongoose');
const Billing = require('./billing.model');

const appointmentSchema = new mongoose.Schema({
  type: {
    type: String,
    required: false
  },
  clientId: {
    type: Array,
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
  },
  location: {
    type: String,
    required: false
  },
  duration: {
    type: String,
    required: true
  },
  services: {
    type: Array,
    required: false
  },
  billingId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  status: {
    type: String,
    default: 'active'
  },
  individual: {
    type: Boolean,
  },
  coupleId: {
    type: mongoose.Schema.Types.ObjectId
  },
  clinicianId: {
    type: mongoose.Schema.Types.ObjectId
  },
  amount: {
    type: Number,
    required: true
  },
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId
  }
}, { timestamps: true });

appointmentSchema.post('save', async function(doc, next) {
  try {
    const data = {
      appointmentId: doc._id,
      amount: doc.amount,
      status: 'init',
      services: doc.services,
      clientId: doc.clientId,
      user: doc.user
    }
    const billing = new Billing(data);
    const result = await billing.save(); 
    
    
    next(); 
  } catch (err) {
    console.log(err);
  }
})
const AppointmentModal = mongoose.model('Appointment', appointmentSchema);
module.exports = AppointmentModal

exports.updateBillingId = async function (appointmentId, billingId) {
  const result = await AppointmentModal.findByIdAndUpdate(appointmentId, { billingId });
  return result
}
