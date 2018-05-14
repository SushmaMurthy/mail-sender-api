const mailSender = require("./mail-sender");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  next();
});

app.get("/api/_health", (req, res) => {
  res.status(200).send("Mail service is healthy!");
});

app.post("/api/sendMail", (req, res) => mailSender.processRequest(req, res));

const server = app.listen(process.env.port || 3000, () => {
  console.log("Mail service started and listening on port 3000!");
});

module.exports = {
  server,
  app
};
