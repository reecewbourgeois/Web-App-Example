const express = require("express");
const router = express.Router();

//Route: /api/bulkSearch/bulkSearch
router.post("/", async (req, res) => {
  let partsSelected = req.body.partsSelected;
  let model = req.body.model;
  let school = req.body.school;
  let asset = req.body.asset;
  let service = req.body.service;
  let kbox = req.body.kbox;
  let teacher = req.body.teacher;

  //The following if statements handle blank entry fields on the search page
  //----------------------------------------------------------------------------------//

  //asset field
  if (asset === "") {
    asset = {
      $exists: true,
    };
  }

  //devicePartsList field
  if (partsSelected.length === 0) {
    partsSelected = {
      $exists: true,
    };
  } else {
    partsSelected = {
      $in: partsSelected,
    };
  }

  //school field
  if (school === "" || school === "Please Select A School") {
    school = {
      $exists: true,
    };
  }

  //service field
  if (service === "") {
    service = {
      $exists: true,
    };
  }

  //kbox field
  if (kbox === "") {
    kbox = {
      $exists: true,
    };
  }

  //model field
  if (model === "" || model === "Please Select A Device Model") {
    model = {
      $exists: true,
    };
  }

  //----------------------------------------------------------------------------------//

  let db = req.app.get("database");
  let statuses = db.db("APSB").collection("statuses");

  try {
    let documents = await statuses.aggregate([{
        $match: {
            asset: asset,
            devicePartsList: partsSelected,
            school: school,
            service: service,
            kbox: kbox,
            model: model,
            teacher: teacher
        }
    }]).toArray();
    res.json(documents);
  } catch (error) {
    console.log("ERROR: " + error);
    res.json({
      status: error
    });
  }
});

//this line is responsible for about 15 minutes of my headache
module.exports = router;
