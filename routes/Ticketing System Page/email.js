const express = require("express");
const router = express.Router();
const nodeoutlook = require("nodejs-nodemailer-outlook");

//Route: /api/ticketingSystem/email
router.post("/", (req, res) => {
  //Convert assignees array to a comma separated string for the "to:" field
  let assigneesAsString = "";
  req.body.assignees.forEach((assignee) => {
    //If last person in the assignee list
    if (
      req.body.assignees.indexOf(assignee) ===
      req.body.assignees.length - 1
    ) {
      assigneesAsString += assignee;
    } else {
      assigneesAsString += assignee + ", ";
    }
  });
  console.log(assigneesAsString);

  nodeoutlook.sendEmail({
    auth: {
      user: "ticketing@something.net",
      pass: "3WHhj92U36dCamu!EJUX",
    },
    from: "ticketing@something.net",
    to: assigneesAsString,
    subject: "A Ticket Has Been Assigned To You By: " + req.body.creator,
    text:
      "Title: " +
      req.body.title +
      "\n\n" +
      "Description: " +
      req.body.description +
      "\n\n" +
      "Due date: " +
      req.body.dueDate +
      "\n\n" +
      "Priority: " +
      req.body.priority,
    replyTo: req.body.creator,
    onError: () => res.json({ status: "ERROR" }),
    onSuccess: () => res.json({ status: 200 }),
  });
});

module.exports = router;
