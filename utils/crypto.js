const crypto = require('crypto');

const algorithm = process.env.ALGORITHM || 'aes-256-cbc';

const key = Buffer.from(
  process.env.PASSPHRASE
  || 'd8f0776c9945eff4b9a08929603df00aa137be0534547bdfb9b5a9fafecb2e54',
  'hex',
);

const iv = Buffer.from(
  process.env.INTIALIZATION_VECTOR
  || '971423bc09c80237eaff3101ff99359a',
  'hex',
);

const encrypt = (text) => {
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return {
    iv: iv.toString('hex'),
    encryptedData: encrypted.toString('hex'),
  };
};

const decrypt = (text) => {
  const iv = Buffer.from(text.iv, 'hex');
  const encryptedText = Buffer.from(text.encryptedData, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

const generateSecuredToken = () => (
  crypto.randomBytes(64).toString('hex')
);

module.exports = {
  encrypt,
  decrypt,
  generateSecuredToken,
};
