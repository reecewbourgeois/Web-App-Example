const express = require("express");
const router = express.Router();

//NOTE:
//For all post requests, they must send a response back to keep the front-end from
//throwing request timeout errors. Those lead to issues.

//POST a status
//Route: /api/checkInNormal/checkInDevice/status/
router.post("/status/:kbox", async (req, res) => {
  const statuses = req.app.get("database").db("APSB").collection("statuses");

  //Check in the device
  try {
    let response = await statuses.insertOne({
      asset: req.body.asset,
      service: req.body.service,
      model: req.body.model,
      deviceLocation: req.body.deviceLocation,
      dateReceived: req.body.dateReceived,
      kbox: req.params.kbox,
      school: req.body.school,
      teacher: req.body.teacher,
      workHistory: [
        {
          workDate: req.body.dateReceived,
          deviceStatus: req.body.deviceStatus,
          technician: req.body.checkInTechName,
          trackingNumber: "",
          workOrderNumber: "",
          checkInNotes: req.body.checkInNotes,
        },
      ],
      devicePartsList: [""],
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

//POST a device into the devices database
//Requires a JSON object to be posted to the url so it can be read properly (axios)
//Route: /api/checkInNormal/checkInDevice/device
router.post("/device", async (req, res) => {
  //pulls the database object from server.js
  const db = req.app.get("database");
  const devices = db.db("APSB").collection("devices");

  try {
    let response = await devices.replaceOne(
      {
        asset: req.body.asset,
      },
      {
        model: req.body.model,
        asset: req.body.asset,
        service: req.body.service,
        tagColor: req.body.tagColor,
      },
      {
        upsert: true,
      }
    );
    //A device will not always be added or modified so error handling is not needed
    res.json(response);
  } catch (error) {
    console.log("Error: " + error);
    res.json({
      status: error,
    });
  }
});

module.exports = router;
