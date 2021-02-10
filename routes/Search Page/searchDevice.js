const express = require("express");
const router = express.Router();
const moment = require("moment");

//Look up the device entry
//Route: /api/searchPage/searchDevice/device/
router.get("/device/:searchString", async (req, res) => {
  //Determines if service tag or not
  let x = req.params.searchString.length;
  if (x === 7) {
    //Search by service tag
    //pulls the database object from server.js
    var db = req.app.get("database");
    let devices = db.db("APSB").collection("devices");
    try {
      let document = await devices.findOne(
        {
          service: req.params.searchString.toUpperCase(),
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
  } else {
    //Search by asset tag
    //pulls the database object from server.js
    var db = req.app.get("database");
    let devices = db.db("APSB").collection("devices");

    //Add GFA if the first character is not 2 or G
    let asset_tag = req.params.searchString;
    if (asset_tag.length === 6) {
      //if length is 6, it does not have GFA
      if (
        asset_tag.substring(0, 1) !== "2" &&
        asset_tag.substring(0, 1) !== "3"
      ) {
        //if the first digit is not 2, it needs GFA
        asset_tag = "GFA" + asset_tag;
      }
    }

    try {
      let document = await devices.findOne(
        {
          asset: asset_tag.toUpperCase(),
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
});

//Look up the status entry
//Route: /api/searchPage/searchDevice/status/
router.get("/status/:searchString", async (req, res) => {
  //Determines if service tag or not
  let x = req.params.searchString.length;
  if (x === 7) {
    //Search by service tag
    //pulls the database object from server.js
    var db = req.app.get("database");
    let statuses = db.db("APSB").collection("statuses");
    try {
      let documents = await statuses
        .find({
          service: req.params.searchString.toUpperCase(),
        })
        .toArray();

      //Convert dates to JS Date objects using moment
      let mostRecentDoc = documents[0];
      documents.forEach((document) => {
        if (
          moment(document.dateReceived.slice(0, 10), "MM-DD-YYYY").toDate() >
          moment(mostRecentDoc.dateReceived.slice(0, 10), "MM-DD-YYYY").toDate()
        ) {
          mostRecentDoc = document;
        }
      });

      res.json(mostRecentDoc);
    } catch (error) {
      console.log("Error: " + error);
      res.json({
        error: error,
      });
    }
  } else {
    //Search by asset tag
    //pulls the database object from server.js
    var db = req.app.get("database");
    let statuses = db.db("APSB").collection("statuses");

    //Add GFA if the first character is not 2 or G
    let asset_tag = req.params.searchString;
    if (asset_tag.length === 6) {
      //if length is 6, it does not have GFA
      if (
        asset_tag.substring(0, 1) !== "2" &&
        asset_tag.substring(0, 1) !== "3"
      ) {
        //if the first digit is not 2, it needs GFA
        asset_tag = "GFA" + asset_tag;
      }
    }

    try {
      let documents = await statuses
        .find({
          asset: asset_tag.toUpperCase(),
        })
        .toArray();

      //Convert dates to JS Date objects using moment
      let mostRecentDoc = documents[0];
      documents.forEach((document) => {
        if (
          moment(document.dateReceived.slice(0, 10), "MM-DD-YYYY").toDate() >
          moment(mostRecentDoc.dateReceived.slice(0, 10), "MM-DD-YYYY").toDate()
        ) {
          mostRecentDoc = document;
        }
      });

      res.json(mostRecentDoc);
    } catch (error) {
      console.log("Error: " + error);
      res.json({
        error: error,
      });
    }
  }
});

//If date is specified from bulk search
//Route: /api/searchPage/searchDevice
router.post("/", async (req, res) => {
  //pulls the database object from server.js
  var db = req.app.get("database");
  let statuses = db.db("APSB").collection("statuses");
  try {
    let documents = await statuses
      .find({
        asset: req.body.asset,
        dateReceived: req.body.dateReceived,
      })
      .toArray();

    //Convert dates to JS Date objects using moment
    let mostRecentDoc = documents[0];
    documents.forEach((document) => {
      if (
        moment(document.dateReceived.slice(0, 10), "MM-DD-YYYY").toDate() >
        moment(mostRecentDoc.dateReceived.slice(0, 10), "MM-DD-YYYY").toDate()
      ) {
        mostRecentDoc = document;
      }
    });

    res.json(mostRecentDoc);
  } catch (error) {
    console.log("Error: " + error);
    res.json({
      error: error,
    });
  }
});

//this line is responsible for about 15 minutes of my headache
module.exports = router;
