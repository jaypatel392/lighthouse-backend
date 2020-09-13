const mongoose = require('mongoose');
const { encrypt, decrypt } = require('../utils/crypto');

const sessionSchema = new mongoose.Schema({
  token: {
    type: String,
    get: (value) => decrypt(JSON.parse(value)),
    set: (value) => JSON.stringify(encrypt(value)),
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
  email: String,
  validTill: Date,
}, { timestamps: true });

sessionSchema.statics.getUserByToken = async function (token) {
  const session = await this.findOne({ token }).populate({
    path: 'user',
    model: 'User',
    populate: {
      path: 'role',
      model: 'Role',
      populate: {
        path: 'scopes',
        model: 'Api'
      } 
    } 
  })
  .populate({
    path: 'client',
    model: 'Client',
  });

  // check validity here.

  if (!session) {
    return null;
  }
  
  if (session.user) {
    return session.user
  }

  if (session.client) {
    return session.client
  }

  return session
};

module.exports = mongoose.model('Session', sessionSchema);
