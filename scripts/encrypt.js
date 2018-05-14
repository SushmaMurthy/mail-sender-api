const crypto = require("crypto-js");

const encodeKeys = input => {
  // replace "<encryptionkey>" with actual value before calling this function
  return crypto.AES.encrypt(input, "<encryptionkey>").toString();
};

module.exports = { encodeKeys };
