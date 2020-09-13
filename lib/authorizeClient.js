const admin = require('firebase-admin');
const Clinet = require('../models/client.model');

const authorizeClient = async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      admin.auth().verifyIdToken(req.headers.authorization)
        .then( async(response) => {
          const client = await Clinet.getClientByUid(response.uid)
          req.client = client
          next()
        }).catch(() => {
          res.status(403).send('Unauthorized')
        });
    } else {
      res.status(403).send('Unauthorized')
    }
  } catch (err) {
    return res.status(401).send(err.message || err);
  }
};

module.exports = authorizeClient;
