const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const mockery = require("mockery");
const fs = require("fs");
chai.should();

describe("SendMail", () => {
  let mailSender;

  const req = {
    body: {
      recipient: "abc@xyz.com",
      text: "Sending from tech works",
      subject: "test"
    }
  };

  const res = {
    status: code => {
      expect(code).to.eql(200);
      return this;
    },
    send: () => {}
  };

  const validationRes = {
    status: code => {
      expect(code).to.eql(400);
      return {
        send: () => sinon.stub()
      };
    },
    send: () => {}
  };

  const errorRes = {
    status: code => {
      expect(code).to.eql(500);
      return this;
    },
    send: () => {}
  };

  const stubRequestPromise = () => {
    mockery.registerMock(
      "request-promise",
      sinon.stub().resolves({
        id: "test-mailId",
        message: "queued thanks!"
      })
    );
  };

  const stubFailoverRequestPromise = () => {
    mockery.registerMock(
      "request-promise",
      sinon
        .stub()
        .onFirstCall()
        .rejects({
          status: 500,
          message: "Gateway Timeout"
        })
        .onSecondCall()
        .resolves({
          message: "mail sent. thanks!"
        })
    );
  };

  const stubRequestPromiseWithErr = () => {
    mockery.registerMock(
      "request-promise",
      sinon.stub().rejects({
        status: 500,
        message: "Gateway Timeout"
      })
    );
  };

  const stubConfig = () => {
    mockery.registerMock(
      "config",
      JSON.parse(fs.readFileSync("./test/test-config.json", "utf8"))
    );
  };

  const stubValidationResponse = () => {
    const stubValidate = {
      validate: () => {
        return undefined;
      }
    };
    mockery.registerMock("./helpers/input-validator", stubValidate);
  };

  const stubValidationErrResponse = () => {
    const errors = ["property"];
    const stubValidate = {
      validate: () => {
        return errors;
      }
    };
    mockery.registerMock("./helpers/input-validator", stubValidate);
  };

  before(() => {
    mockery.enable({
      warnOnUnregistered: false,
      useCleanCache: true
    });
  });

  beforeEach(() => {
    stubRequestPromise();
    stubConfig();
    stubValidationResponse();
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.resetCache();
  });

  after(() => {
    mockery.disable();
  });

  it("processRequest", () => {
    stubRequestPromise();
    mailSender = require("../src/mail-sender");
    mailSender.processRequest(req, res);
  });

  it("processRequest with validation error", () => {
    stubValidationErrResponse();
    mailSender = require("../src/mail-sender");
    req.body[123] = "someValue";
    mailSender.processRequest(req, validationRes);
  });

  it("processRequest with provider error", () => {
    stubRequestPromiseWithErr();
    mailSender = require("../src/mail-sender");
    mailSender.processRequest(req, errorRes);
  });

  it("processRequest with failover", () => {
    stubFailoverRequestPromise();
    mailSender = require("../src/mail-sender");
    mailSender.processRequest(req, res);
  });
});
