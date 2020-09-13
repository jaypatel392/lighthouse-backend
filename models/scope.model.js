const mongoose = require('mongoose');

const apiSchema = new mongoose.Schema({
  resource: {
    type: String,
    require: true
  },
  url: {
    type: String,
    require: true
  },
  description: String,
}, { timestamps: true });


apiSchema.statics.getScopeUrls = async function () {
  const scopes = await this.find({})
  return scopes.map(({ url }) => url)
};

module.exports = mongoose.model('Api', apiSchema);