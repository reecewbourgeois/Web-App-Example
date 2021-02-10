const express = require("express");
const router = express.Router();

//Route: /api/ticketingSystem/ticketingSystem
router.get("/", async (req, res) => {
  //pulls the database object from server.js
  let tickets = req.app.get("database").db("APSB").collection("tickets");

  try {
    let documents = await tickets
      .find({})
      .sort({
        ticketNumber: -1,
      })
      .toArray();
    let ticketNumber = await tickets
      .find({}, { projection: { ticketNumber: 1 } })
      .sort({ ticketNumber: -1 })
      .toArray();

      if(ticketNumber.length === 0){
        ticketNumber = [{ticketNumber: 0}];
      }

    res.json({
      documents: documents,
      ticketNumber: ticketNumber[0].ticketNumber + 1,
    });
  } catch (error) {
    console.log("Error: " + error);
    res.json({
      error: error,
    });
  }
});

//Route: /api/ticketingSystem/ticketingSystem/getTicketNumber
router.get("/getTicketNumber", async (req, res) => {
  let ticketCount = req.app.get("database").db("APSB").collection("tickets");

  try {
    let ticketNumber = await ticketCount
      .find({}, { projection: { ticketNumber: 1 } })
      .sort({ ticketNumber: -1 })
      .toArray();
    
    if(ticketNumber.length === 0){
      ticketNumber = [{ticketNumber: 0}];
    }

    res.json({
      ticketNumber: ticketNumber[0].ticketNumber + 1,
    });
  } catch (error) {
    console.log("Error: " + error);
    res.json({
      error: error,
    });
  }
});

module.exports = router;
