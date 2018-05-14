const ProviderFactory = require("../../src/models/provider-factory");
const MailgunProvider = require("../../src/models/mailgun-provider");
const SendgridProvider = require("../../src/models/sendgrid-provider");
const chai = require("chai");
const expect = chai.expect;

describe("ProviderFactory", () => {
  describe("createProvider", () => {
    const factoryObj = new ProviderFactory();
    it("mailgun provider", () => {
      expect(factoryObj.createProvider("mailgun")).to.be.an.instanceOf(
        MailgunProvider
      );
    });

    it("sendgrid provider", () => {
      expect(factoryObj.createProvider("sendgrid")).to.be.an.instanceOf(
        SendgridProvider
      );
    });

    it("default", () => {
      expect(factoryObj.createProvider("")).to.be.an.instanceOf(
        MailgunProvider
      );
    });
  });
});
