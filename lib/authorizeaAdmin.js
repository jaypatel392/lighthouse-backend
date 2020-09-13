const Session = require('../models/session.model');

const authorizeUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const user = await Session.getUserByToken(token);
    
    if (!user) {
      throw new Error('Unauthorized');
    }
    if (user.admin = "true") {
      req.user = user;
      next();
    } else {
      throw new Error('Unauthorized');
    }
    
  } catch (err) {
    return res.status(401).send(err.message || err);
  }
};

module.exports = authorizeUser;
