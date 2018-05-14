const config = require("config");
const crypto = require("crypto-js");

class SendgridProvider {
  constructor() {
    this.config = config.sendgrid;
  }

  getRequestOptions(input) {
    const recipients = input.recipient.split(",");
    const personalizedToList = [];
    recipients.forEach(recipient => {
      personalizedToList.push({
        email: recipient
      });
    });
    const options = {
      method: "POST",
      uri: this.config.url,
      body: {
        personalizations: [
          {
            to: personalizedToList
          }
        ],
        from: {
          email: this.config.sender
        },
        subject: input.subject,
        content: [
          {
            type: "text/plain",
            value: input.text
          }
        ]
      },
      headers: {
        // TODO Fetch the encryption key from datastore instead of hardcoding
        Authorization:
          "Bearer " +
          crypto.AES.decrypt(this.config.auth.apiKey, "T3$TMail").toString(
            crypto.enc.Utf8
          ),
        "Content-Type": "application/json"
      },
      json: true
    };
    console.log(`Sendgrid request options: ${JSON.stringify(options)}`);
    return options;
  }
}

module.exports = SendgridProvider;
