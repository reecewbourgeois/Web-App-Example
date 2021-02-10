const express = require("express");
const router = express.Router();
const Moment = require("moment");

//KEEP THIS IN THE EVENT OF A DATABASE ERROR
//THIS IS A MASS CHANGE ROUTE

router.post("/", async (req, res) => {
  const db = req.app.get("database");
  const statuses = db.db("APSB").collection("statuses");

  //let dateStart = "11/23/2020";
  //let dateEnd = "12/02/2020";

  let uniqueAssetTags = [];
  let assetsToCheck = [];

  let count = 0;

  let docs = await statuses.find({}).toArray();

  //Find all unique asset tags
  docs.forEach((doc) => {
    //If for some asset tag object in uniqueAssetTags, the asset field value equals the document asset field value
    if (!uniqueAssetTags.some((asset) => asset.asset === doc.asset)) {
      uniqueAssetTags.push({ asset: doc.asset, count: 0 });
      count++;
    }
  });

  //Get the counts for each unique asset tag
  uniqueAssetTags.forEach((object) => {
    docs.forEach((doc) => {
      if (doc.asset === object.asset) {
        object.count++;
      }
    });
  });

  //Get the asset tags we need to check
  uniqueAssetTags.forEach((object) => {
    if (object.count > 1) {
      assetsToCheck.push(object);
    }
  });

  console.log(assetsToCheck);

  /* //Get duplicate check-ins
  assetsToCheck.forEach(async (object) => {
    let results = await statuses.find({asset: object.asset}).toArray();
    results.forEach(result=>{
      let checkInDate = result.workHistory[0].workDate;
      let duplicates = 0;
      results.forEach(item=>{
        if(item.workHistory[0].workDate === checkInDate){
          duplicates++;
        }
      });
      if(duplicates > 1){
        console.log("Check me: " + result.asset);
      }
    });
  }); */

  res.json({
    total: count,
  });
});

module.exports = router;
