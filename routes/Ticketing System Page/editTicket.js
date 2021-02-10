const express = require("express");
const router = express.Router();

//Route: /api/ticketingSystem/editTicket
router.post("/", async (req, res) => {
  let tickets = req.app.get("database").db("APSB").collection("tickets");

  try {
    let response = await tickets.updateOne(
      {
        ticketNumber: req.body.ticketNumber,
      },
      {
        $set: {
          assignees: req.body.assignees,
        },
      }
    );
    //Error handling and making sure a response is returned
    if (response.result.nModified !== 1) {
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
