const express = require("express");
const router = express.Router();
const nodeoutlook = require("nodejs-nodemailer-outlook");

//Route: /api/emailErrorReport
router.post("/", (req, res) => {
  let devs = ["John@something.net", "Bob@something.net"];
  devs.forEach((dev) => {
    nodeoutlook.sendEmail({
      auth: {
        user: "ticketing@something.net",
        pass: "something",
      },
      from: "ticketing@something.net",
      to: dev,
      subject: "An error has occurred on the " + req.body.page + " page",
      text: req.body.message,
      replyTo: "ticketing@something.net",
      onError: () => res.json({ status: "ERROR" }),
      onSuccess: () => res.json({ status: 200 }),
    });
  });
});

module.exports = router;
