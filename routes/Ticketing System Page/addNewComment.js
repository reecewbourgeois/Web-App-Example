const express = require("express");
const router = express.Router();

//Route: /api/ticketingSystem/addNewComment
router.post("/", async (req, res) => {
  const db = req.app.get("database");
  const tickets = db.db("APSB").collection("tickets");

  try {
    let documents = await tickets
      .find({
        ticketNumber: req.body.ticketNumber,
      })
      .project({
        _id: 1,
      })
      .toArray();

    let response = await tickets.updateOne(
      {
        _id: documents[documents.length - 1]._id,
      },
      {
        $push: {
          comments: {
            author: req.body.author,
            date: req.body.date,
            status: req.body.status,
            summary: req.body.summary,
          },
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
