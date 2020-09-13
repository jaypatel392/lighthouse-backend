const camelCase = require('lodash/camelCase');
const ObjectId = require('mongoose').Types.ObjectId;

const getTemplateUrl = (url) => {
  return url
    .split('/')
    .map((part, index, parts) => {
      if (!index) {
        return part;
      }

      if (part.length !== 12 && ObjectId.isValid(part)) {
        const resourceName = camelCase(parts[index - 1]);
        return `:${resourceName}Id`;
      }

      return part;
    })
    .join('/');
};

module.exports = {
  getTemplateUrl,
};
