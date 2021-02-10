const express = require("express");
const router = express.Router();

//Route: /api/searchPage/addDeviceWorkHistory
router.post("/", async (req, res) => {
  //pulls the database object from server.js
  var db = req.app.get("database");
  let statuses = db.db("APSB").collection("statuses");

  try {
    let documents = await statuses
      .find({
        asset: req.body.asset,
      })
      .sort({
        dateRecieved: -1,
      })
      .project({
        _id: 1,
      })
      .toArray();

    if (req.body.deviceStatus === "Repaired") {
      statuses.updateOne(
        {
          _id: documents[documents.length - 1]._id,
        },
        [
          {
            $set: {
              deviceLocation: "QC Shop",
            },
          },
        ]
      );
    } else if (req.body.deviceStatus === "Returned") {
      statuses.updateOne(
        {
          _id: documents[documents.length - 1]._id,
        },
        [
          {
            $set: {
              deviceLocation: "Repair Shop",
            },
          },
        ]
      );
    } else if (req.body.deviceStatus === "Return Repaired") {
      statuses.updateOne(
        {
          _id: documents[documents.length - 1]._id,
        },
        [
          {
            $set: {
              deviceLocation: "QC Shop",
            },
          },
        ]
      );
    } else if (req.body.deviceStatus === "Redispatch") {
      statuses.updateOne(
        {
          _id: documents[documents.length - 1]._id,
        },
        [
          {
            $set: {
              deviceLocation: "Repair Shop",
            },
          },
        ]
      );
    } else if (req.body.deviceStatus === "Stock - Completed") {
      statuses.updateOne(
        {
          _id: documents[documents.length - 1]._id,
        },
        [
          {
            $set: {
              deviceLocation: "Stock",
            },
          },
        ]
      );
    }

    let response = await statuses.updateOne(
      {
        _id: documents[documents.length - 1]._id,
      },
      {
        $push: {
          workHistory: {
            workDate: req.body.workDate,
            deviceStatus: req.body.deviceStatus,
            technician: req.body.technician,
            trackingNumber: req.body.trackingNumber,
            workOrderNumber: req.body.workOrderNumber,
            checkInNotes: req.body.checkInNotes,
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
