const express = require("express");
const router = express.Router();
const moment = require("moment");

//Edit details
//Route: /api/searchPage/updateDeviceDetails
router.post("/", async (req, res) => {
  //pulls the database object from server.js
  var db = req.app.get("database");
  let statuses = db.db("APSB").collection("statuses");

  //Searches all statuses for a device then
  //updates the most current one
  try {
    let documents = await statuses
      .find({
        asset: req.body.asset,
      })
      .toArray();

    //Convert dates to JS Date objects using moment
    let mostRecentDoc = documents[0];
    documents.forEach((document) => {
      if (
        moment(document.dateReceived).toDate() >
        moment(mostRecentDoc.dateReceived).toDate()
      ) {
        mostRecentDoc = document;
      }
    });

    let response = await statuses.updateOne(
      {
        _id: mostRecentDoc._id,
      },
      {
        $set: {
          deviceLocation: req.body.deviceLocation,
          kbox: req.body.kbox,
          school: req.body.school,
          teacher: req.body.teacher,
          "workHistory.0.checkInNotes": req.body.checkInNotes,
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

//Edit parts list
//Route: /api/searchPage/updateDeviceDetails/parts
router.post("/parts", async (req, res) => {
  //pulls the database object from server.js
  var db = req.app.get("database");
  let statuses = db.db("APSB").collection("statuses");

  //get most recent status
  try {
    let documents = await statuses
      .find({
        asset: req.body.asset,
      })
      .toArray();

    //Convert dates to JS Date objects using moment
    let mostRecentDoc = documents[0];
    documents.forEach((document) => {
      if (
        moment(document.dateReceived).toDate() >
        moment(mostRecentDoc.dateReceived).toDate()
      ) {
        mostRecentDoc = document;
      }
    });

    let response = await statuses.updateOne(
      {
        _id: mostRecentDoc._id,
      },
      {
        $set: {
          devicePartsList: req.body.arrayValues,
        },
      }
    );

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
