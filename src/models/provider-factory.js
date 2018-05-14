const mailgunProvider = require("./mailgun-provider");
const sendgridProvider = require("./sendgrid-provider");

class ProviderFactory {
  createProvider(providerName) {
    const providerClasses = {
      mailgun: mailgunProvider,
      sendgrid: sendgridProvider,
      default: mailgunProvider
    };
    let ProviderClass = providerClasses[providerName.toLowerCase()];
    if (!ProviderClass) {
      ProviderClass = providerClasses.default;
    }
    return new ProviderClass();
  }
}

module.exports = ProviderFactory;
