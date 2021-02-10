const express = require("express");
const router = express.Router();

//GET a device based on asset tag in the URL and return all information
//Route: /api/checkInNormal/checkForExistingDevice/device/
router.get("/device/:asset_or_service", async (req, res) => {
  const devices = req.app.get("database").db("APSB").collection("devices");

  //if it's a service tag
  if (req.params.asset_or_service.length === 7) {
    try {
      let document = await devices.findOne(
        {
          service: req.params.asset_or_service,
        },
        {
          collation: {
            locale: "en",
            strength: 1,
          },
        }
      );
      res.json(document);
    } catch (error) {
      console.log("Error: " + error);
      res.json({
        error: error,
      });
    }
  }
  //if it's an asset tag
  else {
    if (req.params.asset_or_service === ("" || null)) {
      //if it's blank, do nothing
    } else {
      //if not
      try {
        let document = await devices.findOne(
          {
            asset: req.params.asset_or_service,
          },
          {
            collation: {
              locale: "en",
              strength: 1,
            },
          }
        );
        res.json(document);
      } catch (error) {
        console.log("Error: " + error);
        res.json({
          error: error,
        });
      }
    }
  }
});

//GET all statuses for device based on asset tag and only return deviceStatus field
//Route: /api/checkInNormal/checkForExistingDevice/statuses/
router.get("/statuses/:asset_or_service", async (req, res) => {
  const db = req.app.get("database");
  const statuses = db.db("APSB").collection("statuses");

  //if service tag
  if (req.params.asset_or_service.length === 7) {
    try {
      let documents = await statuses
        .find({
          service: req.params.asset_or_service,
        })
        .collation({
          locale: "en",
          strength: 1,
        })
        .project({
          "workHistory.deviceStatus": 1,
          _id: 0,
        })
        .toArray();

      //This will send back a count for a check on the front end
      let count = 0;
      documents.forEach((doc) => {
        let currentStatus = doc.workHistory.length - 1;
        if (
          doc.workHistory[currentStatus].deviceStatus === "Stock - Completed" ||
          doc.workHistory[currentStatus].deviceStatus ===
            "Ready For Shipment" ||
          doc.workHistory[currentStatus].deviceStatus ===
            "Shipped - Completed" ||
          doc.workHistory[currentStatus].deviceStatus === "Decommissioned"
        ) {
        } else {
          count++;
        }
      });
      res.json({
        count: count,
      });
    } catch (error) {
      console.log("Error: " + error);
      res.json({
        error: error,
      });
    }
  } else {
    //if asset tag
    if (req.params.asset_or_service === ("" || null)) {
      //if it's blank
      //do nothing
    } else {
      //if not
      try {
        let documents = await statuses
          .find({
            asset: req.params.asset_or_service,
          })
          .collation({
            locale: "en",
            strength: 1,
          })
          .project({
            "workHistory.deviceStatus": 1,
            _id: 0,
          })
          .toArray();

        //This will send back a count for a check on the front end
        let count = 0;
        documents.forEach((doc) => {
          let currentStatus = doc.workHistory.length - 1;
          if (
            doc.workHistory[currentStatus].deviceStatus ===
              "Stock - Completed" ||
            doc.workHistory[currentStatus].deviceStatus ===
              "Ready For Shipment" ||
            doc.workHistory[currentStatus].deviceStatus ===
              "Shipped - Completed" ||
            doc.workHistory[currentStatus].deviceStatus === "Decommissioned"
          ) {
          } else {
            count++;
          }
        });
        res.json({
          count: count,
        });
      } catch (error) {
        console.log("Error: " + error);
        res.json({
          error: error,
        });
      }
    }
  }
});

module.exports = router;
