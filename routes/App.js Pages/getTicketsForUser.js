const express = require("express");
const router = express.Router();

//Route: /api/appJSPage/
router.get("/:account", async (req, res) => {
  let tickets = req.app.get("database").db("APSB").collection("tickets");
  let documents = await tickets
    .find({})
    .toArray();

  let numberOfTicketsForTech = 0;
  //For every array returned
  documents.forEach((document) => {
    //If the status isn't "Completed"
    if (
      document.comments[document.comments.length - 1].status !== "Completed"
    ) {
      //For every assignee in the array
      document.assignees.forEach((assignee) => {
        //If the assignee is the user logged in
        if (assignee === req.params.account) {
          //Increase the tickets they have due notification
          numberOfTicketsForTech += 1;
        }
      });
    }
  });

  res.json({ numberOfTicketsForTech: numberOfTicketsForTech });
});

module.exports = router;
