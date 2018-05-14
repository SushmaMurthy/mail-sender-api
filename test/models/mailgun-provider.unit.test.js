const mockery = require("mockery");
const fs = require("fs");
const chai = require("chai");
const expect = chai.expect;

describe("MailgunProvider", () => {
  const stubConfig = () => {
    mockery.registerMock(
      "config",
      JSON.parse(fs.readFileSync("./test/test-config.json", "utf8"))
    );
  };

  before(() => {
    mockery.enable({
      warnOnUnregistered: false,
      useCleanCache: true
    });
  });

  beforeEach(() => {
    stubConfig();
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.resetCache();
  });

  after(() => {
    mockery.disable();
  });

  it("getRequestOptions", () => {
    const MailgunProvider = require("../../src/models/mailgun-provider");
    const provider = new MailgunProvider();
    const input = {
      recipient: "test@email.com",
      subject: "hello",
      text: "unit tests"
    };
    expect(provider.getRequestOptions(input)).to.eql({
      method: "POST",
      uri: "https://api.mailgun.net",
      formData: {
        from: "user@samples.mailgun.org",
        to: "test@email.com",
        subject: "hello",
        text: "unit tests"
      },
      headers: {
        Authorization: "Basic YXBpOnRlc3QtcGFzc3dvcmQ="
      },
      json: true
    });
  });
});
