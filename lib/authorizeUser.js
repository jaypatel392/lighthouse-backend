const Session = require('../models/session.model');
const Scope = require('../models/scope.model');;
const { getTemplateUrl } = require('../utils/url');

let scopes = [];

const getAllScopes = async () => {
  if (scopes.length) {
    return scopes;
  }
  
  scopes = await Scope.getScopeUrls();
  return scopes;
};

const authorizeUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization || req.query.token;
    const user = await Session.getUserByToken(token);
    
    if (!user) {
      throw new Error('Unauthorized');
    }
   /*  console.log('user========>', user); */
    
    req.user = user;

    /* const allScopes = await getAllScopes();
    const scopeUrl = `${req.method}:${getTemplateUrl(req.originalUrl)}`;
    let isPermitted = true;
    if (allScopes.includes(scopeUrl)) {
      isPermitted = user.role.scopes.find(scope => scope.url === scopeUrl)
    }

    if (!isPermitted) {
      throw new Error('Unauthorized: You are not authorized to use this request');
    } */
    
    next();
  } catch (err) {
    return res.status(401).send(err.message || err);
  }
};

module.exports = authorizeUser;
