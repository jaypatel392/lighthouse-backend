const mongoose = require('mongoose');
const SendMail = require('../lib/sendMail');
const dayjs = require('dayjs');
const {
  encrypt,
  decrypt,
  generateSecuredToken,
} = require('../utils/crypto');
const Session = require('./session.model');

const userSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: true
	},
  lastName: String,
	userName: {
    type: String,
		required: false,
		unique: false,
		index: true
	},
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, 'can\'t be blank'],
    match: [/\S+@\S+\.\S+/, 'is invalid'],
    index: true,
  },
  password: {
    type: String,
    get: (value) => decrypt(JSON.parse(value)),
    set: (value) => JSON.stringify(encrypt(value)),
  },
  address: {
    type: Object,
  },
  otp: {type: Number},
  otpSentTime : { type : Date },
  phoneNumber: String,
  phoneType: String,
  gender: String,
  maritalStatus: String,
  avatar: String,
  uaeResident: String,
  role: mongoose.Schema.Types.ObjectId,
  dob: String,
  professionalLicense: String,
  nationality: String,
  serviceLocation: Array,
  clinicianSegment: Array,
  services: Array,
  status: String,
  patientAgeGroup: String,
  priorityLevel: String,
  calenderAcceptingNewPatient: String,
  calenderAvailabilityTimes: String,
  calenderAvailabilityPatientCap: String,
  appointments: String,
  appointmentSlotUnit: {
    type: Number,
    default: 30
  },
  costPerUnit: {
    type: Number,
    default: 150
  },
  verify: String,
}, { timestamps: true });

userSchema.methods.getNewSession = async function () {
  const { token, user } = await new Session({
    token: generateSecuredToken(),
    user: this._id,

  }).save();

  return { token, user };
};

userSchema.methods.tokenGen = async function (user) {
  const { token } = await new Session({
    token: generateSecuredToken(),
    user: user,
    validTill: dayjs(new Date()).add(2, "day")
  }).save();

  return token;
};

userSchema.methods.validatePassword = function (password) {
  return this.password === password;
};

/* userSchema.post('save', async function(doc) {
  const token = await this.tokenGen(doc._id)
  const data = {
    email: doc.email,
    subject: `Wel-come To The Light House Please Verify Self. ${doc.firstName +' '+ doc.lastName}`,
    body: `<p>Welcome to The Light House </p> <p>Please Verify Self Create Passoword </p>  <a href="http://localhost:3000/register?token=${token}">Click to Continue</a>`
  }
  const sendMail = await SendMail.user(data);
  console.log('user send mail============>', sendMail);
}) */


module.exports = mongoose.model('User', userSchema);


