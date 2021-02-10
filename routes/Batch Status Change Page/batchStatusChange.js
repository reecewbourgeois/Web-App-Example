const express = require("express");
const router = express.Router();
const moment = require("moment");

//Route: /api/batchStatusChange/batchStatusChange
router.post("/", async (req, res) => {
  //pulls the database object from server.js and points to the statuses collection
  let statuses = req.app.get("database").db("APSB").collection("statuses");
  let problemDevices = [];

  let completeTheLoop = new Promise((resolve, reject) => {
    req.body.assetGroup.forEach(async (asset, index) => {
      try {
        let documents = await statuses
          .find({
            asset: asset.asset,
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

        //update them with the given information
        if (mostRecentDoc !== undefined) {
          var response1 = await statuses.updateOne(
            {
              _id: mostRecentDoc._id,
            },
            {
              $push: {
                workHistory: {
                  workDate: req.body.date,
                  deviceStatus: req.body.deviceStatus,
                  technician: req.body.technician,
                  trackingNumber: "",
                  workOderNumber: "",
                  checkInNotes: req.body.notes,
                },
              },
            }
          );

          //Update the location if needed
          var response2 = await statuses.updateOne(
            {
              _id: mostRecentDoc._id,
            },
            [
              {
                $set: {
                  deviceLocation: "Imaging Shop",
                },
              },
            ]
          );

          if (req.body.school !== "") {
            statuses.updateOne(
              {
                _id: mostRecentDoc._id,
              },
              {
                $set: {
                  school: req.body.school,
                },
              }
            );

            //Error handling
            if (
              response1.result.nModified !== 1 &&
              response2.result.nModified !== 1
            ) {
              //Add this asset to be displayed once finished
              problemDevices.push(asset.asset);
              //Make sure to resolve the promise so the code can continue when done with the last item
              if (index === req.body.assetGroup.length - 1) resolve();
            } else {
              //Make sure to resolve the promise so the code can continue when done with the last item
              if (index === req.body.assetGroup.length - 1) resolve();
            }
          } else {
            //Error handling
            if (
              response1.result.nModified !== 1 &&
              response2.result.nModified !== 1
            ) {
              //Add this asset to be displayed once finished
              problemDevices.push(asset.asset);
              //Make sure to resolve the promise so the code can continue when done with the last item
              if (index === req.body.assetGroup.length - 1) resolve();
            } else {
              //Make sure to resolve the promise so the code can continue when done with the last item
              if (index === req.body.assetGroup.length - 1) resolve();
            }
          }
        } else {
          //Add this asset to be displayed once finished
          problemDevices.push(asset.asset);
          //Make sure to resolve the promise so the code can continue when done with the last item
          if (index === req.body.assetGroup.length - 1) resolve();
        }
      } catch (error) {
        console.log("Error: " + error);
        //Add this asset to be displayed once finished
        problemDevices.push(asset.asset);
        //Make sure to resolve the promise so the code can continue when done with the last item
        if (index === req.body.req.body.assetGroup.length - 1) resolve();
      }
    });
  });

  completeTheLoop.then(() => {
    //If there were issues
    if (problemDevices.length !== 0) {
      res.json({
        status: "Error",
        assets: problemDevices,
      });
    }
    //If all is well
    else {
      res.json({ status: 200 });
    }
  });
});

//this line is responsible for about 15 minutes of my headache
module.exports = router;
