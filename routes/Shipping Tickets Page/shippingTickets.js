const express = require("express");
const router = express.Router();
const moment = require("moment");

//Route: /api/shippingTickets/shippingTickets
router.post("/", async (req, res) => {
  let dateStart = moment(req.body.dateStart, "MM-DD-YYYY").toDate();
  let dateEnd = moment(req.body.dateEnd, "MM-DD-YYYY").toDate();
  let school = req.body.school;

  let selectedSchools = [];
  school.forEach((school) => {
    selectedSchools.push(school.value);
  });
  if (school.length === 0) {
    school = {
      $exists: true,
    };
  }

  //pulls the database object from server.js
  var db = req.app.get("database");
  let statuses = db.db("APSB").collection("statuses");
  try {
    let documents = await statuses
      .find({
        // "workHistory.workDate": dateReceived,
      })
      .toArray();

    let validResults = [];
    documents.forEach((doc) => {
      let lastItem = doc.workHistory.length - 1;
      if (school.$exists === true) {
        if (doc.workHistory[lastItem].deviceStatus === "Ready For Shipment") {
          //validResults.push(doc);
          if (
            moment(
              doc.workHistory[lastItem].workDate.slice(0, 10),
              "MM-DD-YYYY"
            ).toDate() >= dateStart &&
            moment(
              doc.workHistory[lastItem].workDate.slice(0, 10),
              "MM-DD-YYYY"
            ).toDate() <= dateEnd
          ) {
            validResults.push(doc);
          }
        }
      } else {
        //https://stackoverflow.com/questions/7378228/check-if-an-element-is-present-in-an-array
        //Credit: Alister for the .incldes() method
        if (
          doc.workHistory[lastItem].deviceStatus === "Ready For Shipment" &&
          selectedSchools.includes(doc.school)
        ) {
          //validResults.push(doc);
          if (
            moment(
              doc.workHistory[lastItem].workDate.slice(0, 10),
              "MM-DD-YYYY"
            ).toDate() >= dateStart &&
            moment(
              doc.workHistory[lastItem].workDate.slice(0, 10),
              "MM-DD-YYYY"
            ).toDate() <= dateEnd
          ) {
            validResults.push(doc);
          }
        }
      }
    });
    res.json(validResults);
  } catch (error) {
    console.log("Error: " + error);
    res.json({
      status: error,
    });
  }
});

//Route: /api/shippingTickets/shippingTickets/setStatus
router.post("/setStatus", (req, res) => {
  let statuses = req.app.get("database").db("APSB").collection("statuses");
  let allGood = true;
  try {
    req.body.assets.every(async (asset) => {
      let documents = await statuses
        .find({
          asset: asset,
        })
        .toArray();

      //Convert dates to JS Date objects using moment
      let mostRecentDoc = documents[0];
      documents.forEach((document) => {
        if (
          moment(document.dateReceived.slice(0,10), "MM-DD-YYYY").toDate() >
          moment(mostRecentDoc.dateReceived.slice(0,10), "MM-DD-YYYY").toDate()
        ) {
          mostRecentDoc = document;
        }
      });

      //Adds a status
      let response1 = await statuses.updateOne(
        {
          _id: mostRecentDoc._id,
        },
        {
          $push: {
            workHistory: {
              workDate: req.body.date,
              deviceStatus: "Shipped - Completed",
              technician: req.body.technician,
              trackingNumber: "",
              workOrderNumber: "",
              checkInNotes: "",
            },
          },
        }
      );

      //Updates device location
      let response2 = await statuses.updateOne(
        {
          _id: mostRecentDoc._id,
        },
        [
          {
            $set: {
              deviceLocation: "School",
            },
          },
        ]
      );

      //Make sure the change went through
      if (
        response1.result.nModified !== 1 ||
        response2.result.nModified !== 1
      ) {
        //If not, break the loop and throw an error
        allGood = false;
        return false;
      }
      //Continue on
      return true;
    });

    //Return error if not all good
    if (allGood !== true) {
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

//this line is responsible for about 15 minutes of my headache
module.exports = router;
