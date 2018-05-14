const nodeValidator = require("node-validator");
const _ = require("lodash");

function validate(input) {
  // TODO - Add more robust regex on email address validation
  const validatorConfig = nodeValidator
    .isObject()
    .withRequired(
      "recipient",
      nodeValidator.isString({
        regex: /^(\s?[^\s,]+@[^\s,]+\.[^\s,]+\s?,)*(\s?[^\s,]+@[^\s,]+\.[^\s,]+)$/,
        message: "recipient(s) provided is in an invalid format"
      })
    )
    .withRequired(
      "subject",
      nodeValidator.isString({
        message: "subject to send in mail should be string"
      })
    )
    .withRequired(
      "text",
      nodeValidator.isString({
        message: "text to send in mail should be string"
      })
    )
    .withOptional(
      "cc",
      nodeValidator.isString({
        regex: /^(\s?[^\s,]+@[^\s,]+\.[^\s,]+\s?,)*(\s?[^\s,]+@[^\s,]+\.[^\s,]+)$/,
        message: "cc recipient(s) provided is in an invalid format"
      })
    )
    .withOptional(
      "bcc",
      nodeValidator.isString({
        regex: /^(\s?[^\s,]+@[^\s,]+\.[^\s,]+\s?,)*(\s?[^\s,]+@[^\s,]+\.[^\s,]+)$/,
        message: "bcc recipient(s) provided is in an invalid format"
      })
    );

  let errors = undefined;
  nodeValidator.run(validatorConfig, input, (count, validationError) => {
    if (validationError && validationError.length > 0) {
      errors = _.map(validationError, "parameter");
    }
  });
  return errors;
}

module.exports = {
  validate
};
