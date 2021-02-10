const express = require("express");
const router = express.Router();

//POST a device into the devices database
//Requires a JSON object to be posted to the url so it can be read properly (axios)
//Route: /api/ticketingSystem/addNewTicket
router.post("/", async (req, res) => {
  //pulls the database object from server.js
  let tickets = req.app.get("database").db("APSB").collection("tickets");

  try {
    let response = await tickets.insertOne({
      ticketNumber: req.body.ticketNumber,
      priority: req.body.priority,
      title: req.body.title,
      dueDate: req.body.dueDate,
      creator: req.body.creator,
      assignees: req.body.assignees,
      description: req.body.description,
      comments: [
        {
          author: req.body.author,
          date: req.body.date,
          status: req.body.status,
          summary: req.body.summary,
        },
      ],
    });
    
    //Error handling and making sure a response is returned
    if (response.result.ok !== 1) {
      res.json({ status: "ERROR" });
    } else {
      res.json({
        status: 200,
      });
    }
  } catch (error) {
    console.log("Error: " + error);
    res.json({
      status: error,
    });
  }
});

module.exports = router;
