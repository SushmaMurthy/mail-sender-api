const mockery = require("mockery");
const fs = require("fs");
const chai = require("chai");
const expect = chai.expect;

describe("SendgridProvider", () => {
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
    const SendgridProvider = require("../../src/models/sendgrid-provider");
    const provider = new SendgridProvider();
    const input = {
      recipient: "test@email.com",
      subject: "hello",
      text: "unit tests"
    };
    expect(provider.getRequestOptions(input)).to.eql({
      method: "POST",
      uri: "https://api.sendgrid.net",
      body: {
        personalizations: [
          {
            to: [
              {
                email: "test@email.com"
              }
            ]
          }
        ],
        from: {
          email: "user@samples.sendgrid.org"
        },
        subject: "hello",
        content: [
          {
            type: "text/plain",
            value: "unit tests"
          }
        ]
      },
      headers: {
        Authorization: "Bearer test-apiKey",
        "Content-Type": "application/json"
      },
      json: true
    });
  });
});
