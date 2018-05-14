const crypto = require("crypto-js");

const encodeKeys = input => {
  // replace "<encryptionkey>" with actual value before calling this function
  return crypto.AES.encrypt(input, "T3$TMail").toString();
};

module.exports = { encodeKeys };
