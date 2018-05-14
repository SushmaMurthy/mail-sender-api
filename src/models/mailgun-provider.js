const config = require("config");
const crypto = require("crypto-js");

class MailgunProvider {
  constructor() {
    this.config = config.mailgun;
  }

  getRequestOptions(input) {
    // TODO Fetch the encryption key from datastore instead of hardcoding
    const auth = new Buffer(
      this.config.credentials.userName +
        ":" +
        crypto.AES.decrypt(
          this.config.credentials.password,
          "T3$TMail"
        ).toString(crypto.enc.Utf8)
    ).toString("base64");
    const options = {
      method: "POST",
      uri: this.config.url,
      formData: {
        from: this.config.sender,
        to: input.recipient,
        subject: input.subject,
        text: input.text
      },
      headers: {
        Authorization: "Basic " + auth
      },
      json: true
    };
    console.log(`Mailgun request options: ${JSON.stringify(options)}`);
    return options;
  }
}

module.exports = MailgunProvider;
