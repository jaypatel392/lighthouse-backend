const mongoose = require('mongoose');
const dayjs = require('dayjs');
const sendMail = require('../lib/sendMail');
const {
  encrypt,
  decrypt,
  generateSecuredToken,
} = require('../utils/crypto');
const Session = require('./session.model');


const clientSchema = new mongoose.Schema({
  clientType: {
    type: String,
    required: false
  },
  uid: {
    type: String,
    required: false
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, 'can\'t be blank'],
    match: [/\S+@\S+\.\S+/, 'is invalid'],
    index: true,
  },
  phoneNumber: {
    type: String,
    required: false
  },
  phoneType: String,
  dob: {
    type: Date,
  },
  gender: {
    type: String,
    required: false
  },
  nationality: {
    type: String
  },
  dob: {
    type: String,
    required: false
  },
  status: {
    type: String,
    required: true
  },
  maritalStatus: {
    type: String,
  },
  requestForPhysicalSupport: {
    type: String
  },
  riskactor: {
    type: String
  },
  uaeResident: {
    type: String
  },
  address: {
    type: Object,
  },
  emergencyContact: {
    type: Object
  },
  companyAssociationOrgId: {
    type: mongoose.Schema.Types.ObjectId
  },
  clinician: [
    {
      type: mongoose.Schema.Types.ObjectId
    }
  ],
  appointmentCount: {
    type: Number,
    default: 0
  },
  appointmentCancel: {
    type: Number,
    default: 0
  },
  referredBy: String,
  fee: String,
  cliniciansPreference: String,
  validPhotoIdentification: String,
  idCopy: String,
  haveInsurance: String,
  insurancePolicyNumber: String,
  invoiceSetting: String,
  locationPreference: String,
  appointment: String,
  appointmentDocument: String,
  appointmentScreening: String,
  privacySetting: String,
  relationshipAccount: Array,
  child: Array,
  firstLogin : Boolean,
  role: mongoose.Schema.Types.ObjectId,
  avatar: String,
  verify: Boolean,
  otp: Number,
  otpSentTime: Date
}, { timestamps: true });
clientSchema.methods.getNewSession = async function () {
  const { token } = await new Session({
    token: generateSecuredToken(),
    client: this._id,
    validTill: dayjs(new Date()).add(2, "day")
  }).save();
  console.log();

  return { token };
};

clientSchema.methods.tokenGen = async function (user) {
  const { token } = await new Session({
    token: generateSecuredToken(),
    user: user,
    validTill: dayjs(new Date()).add(2, "day")
  }).save();

  return token;
};

clientSchema.methods.validatePassword = function (password) {
  return this.password === password;
};

clientSchema.statics.getClientByUid = async function (uid) {
  const client = await this.findOne({ uid });
  return client
}

module.exports = mongoose.model('Client', clientSchema);
