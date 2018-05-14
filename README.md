# mail-sender-api

Mail Sender API is a REST service to send email notifications. 
Accepts the request with single/multiple recipient(s) and fails over to backup mail provider when default mail provider is unavailable.

* **URL**
/api/sendMail

* **Method**
POST

* **Data Params**
<br />Required:<br />
`recipient=[String, Mandatory special characters are '@' and '.']`<br />
`subject=[String]`<br />
`text=[String]`<br /><br />
Optional:<br />
`CC=[String, Mandatory special characters are '@' and '.']`<br />
`bcc=[String, Mandatory special characters are '@' and '.']`<br /><br />
Single recipient sample: <br />
`{
    "recipient": "example@mail.com",
    "cc": "ccexample@mail.com",
    "bcc": "bccexample@mail.com",
    "subject": "example subject",
	"text": "example text"
}`
<br /><br />Multiple recipient sample<br />
`{
    "recipient": "example1@mail.com,example2@mail.com",
    "cc": "ccexample@mail.com",
    "bcc": "bccexample@mail.com",
    "subject": "example subject",
	"text": "example text"
}`
<br /><br />NOTE: recipient, cc and bcc have email address format as `[A-Za-z0-9]@[A-Za-z0-9].[A-Za-z0-9]` and multiple email addresses are added as comma seperated values.

* **Success Response**
`{
    "code": 200,
    "message": "Yay! Email sent successfully!"
}`

* **Validation Error Response**
`{
    "code": 400,
    "message": "Aw, Snap! Invalid or missing parameters: <data params>"
}`

* **Error Response**
`{
    "code": 500,
    "message": "Aw, Snap! Internal error occurred, Please try again after sometime"
}`

## Installation
### Requirements
* Node.Js server
* Node Package Manager

Mail Sender API can be installed locally simply with NPM.
```bash
npm install
```

## Testing
Code Linting: ESLint is enabled to verify the code quality and align with ECMASript6/Node standards.
```bash
npm run lint
```

Unit Testing: Test cases are written using Mocha and Chai libraries along with 100% code coverage check.
```bash
npm run test
# view code coverage report at /coverage/lcov-report/index.html
```

Precommit Hook: git precommit hook is added to the repo using husky node library. This script ensures that Lint and Unit tests are run before each commit.
```bash
npm run precommit
# view code coverage report at /coverage/lcov-report/index.html
```

This repository is also linked to Sonarqube for continuous code quality analysis. Report captures code smells, bugs and vulnerabilities.
Report: https://sonarcloud.io/dashboard?id=SM%3Amail-sender

As Sonarqube needs login, Refer to sonar-report.png in repo for quick look.

## Configuration
To configure Mail Sender API, you will need to modify an existing config file default.json located in the config directory.
Mail provider credentials and auth details are encrypted using Crypto library for security reasons.

Use /scripts/encrypt.js to encrypt the keys.

## Future Enhancements & Notes
* Add environment specific configuration file support.
* Add integration test scripts between Api and Providers.
* Implement Build and Deployment specs for CI and CD.
* Tighten the input validations, especially Email address format.
* Fetch the encryption key from datastore before decrypting provider credentials/auth.
* Create Swagger specs or API docs for mail sender API
* Address TODOs in src files
