const request = require("request-promise");
const config = require("config");
const ProviderFactory = require("./models/provider-factory");
const inputValidator = require("./helpers/input-validator");

/* istanbul ignore next */
// TODO - rewrite this logic to support multiple failover's and fix unit test
const sendMail = input => {
  let failover = false;
  let provider = new ProviderFactory().createProvider(config.providers.default);
  return request(provider.getRequestOptions(input))
    .then(ack => {
      console.log(`Mail sent: ${JSON.stringify(ack)}`);
      return Promise.resolve(ack);
    })
    .catch(error => {
      console.log(`Error occured while sending mail: ${JSON.stringify(error)}`);
      if (!failover) {
        console.log(
          `Failover in action, using provider: ${config.providers.failover}`
        );
        failover = true;
        provider = new ProviderFactory().createProvider(
          config.providers.failover
        );
        return request(provider.getRequestOptions(input))
          .then(failoverAck => {
            console.log(`Mail sent using failover provider`);
            return Promise.resolve(failoverAck);
          })
          .catch(failoverErr => {
            console.log(
              `Error occured while sending mail using failover provider as well: ${JSON.stringify(
                error
              )}`
            );
            return Promise.reject(failoverErr);
          });
      }
      return Promise.reject(error);
    });
};

const processRequest = (req, res) => {
  const reqBody = req.body;
  console.log(`Received request to send mail: ${JSON.stringify(reqBody)}`);
  // making input values as case agnostic
  let params = {};
  Object.keys(reqBody).forEach(key => {
    params[key.toLowerCase()] = reqBody[key];
  });
  const validationResults = inputValidator.validate(params);
  if (validationResults) {
    console.log(`Validation error on params: ${validationResults}`);

    return res.status(400).send({
      code: 400,
      message: `Aw, Snap! Invalid or missing parameters: ${validationResults}`
    });
  }
  sendMail(params)
    .then(ack => {
      return res.status(200).send({
        code: 200,
        message: `Yay! Email sent successfully!`
      });
    })
    .catch(err => {
      return res.status(500).send({
        code: 500,
        message: `Aw, Snap! Internal error occurred, Please try again after sometime`
      });
    });
};

module.exports = {
  processRequest
};
