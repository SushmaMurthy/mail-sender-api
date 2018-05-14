const chai = require("chai");
const expect = chai.expect;
const inputValidator = require("../../src/helpers/input-validator");

describe("inputValidator", () => {
  describe("validate", () => {
    it("recipient", () => {
      const input = {
        recipient: "test.com",
        text: "test-text",
        subject: "test-subject"
      };
      expect(inputValidator.validate(input)).to.eql(["recipient"]);
    });

    it("multiple recipients", () => {
      const input = {
        recipient: "test1.com,test2@sample.com",
        text: "test-text",
        subject: "test-subject"
      };
      expect(inputValidator.validate(input)).to.eql(["recipient"]);
    });

    it("optional entries", () => {
      const input = {
        recipient: "test1.com,test2@sample.com",
        text: "test-text",
        subject: "test-subject",
        cc: "testCC.com,testCC@sample.com",
        bcc: "testBCC@sample.com"
      };
      expect(inputValidator.validate(input)).to.eql(["recipient", "cc"]);
    });

    it("unexpected entries", () => {
      const input = {
        recipient: "test@sample.com",
        text: "test-text",
        subject: "test-subject",
        someKey: "someValue"
      };
      expect(inputValidator.validate(input)).to.eql(["someKey"]);
    });
  });

  describe("correct input", () => {
    it("validates unexpected entries", () => {
      const input = {
        recipient: "test@sample.com",
        text: "test-text",
        subject: "test-subject"
      };
      expect(inputValidator.validate(input)).to.eql(undefined);
    });
  });
});
