const techs = require("../../client/src/components/technician-list.json");
const express = require("express");
const router = express.Router();
const moment = require("moment");

//Runs when "Imaging" is selected
//Route: /api/statisticsPage/Imaging
router.post("/Imaging", async (req, res) => {
  let db = req.app.get("database");
  let statuses = db.db("APSB").collection("statuses");

  let dateStart = moment(req.body.dateStart, "MM-DD-YYYY").toDate();
  let dateEnd = moment(req.body.dateEnd, "MM-DD-YYYY").toDate();

  let techCounts = [];
  techs.forEach((tech) => {
    //Don't add a blank tech
    if (tech.value !== "") {
      //Add them to techCounts
      techCounts.push({
        technician: tech.value,
        stats: [
          {
            status: "Checked-In",
            count: 0,
          },
          {
            status: "Moved To Imaging",
            count: 0,
          },
          {
            status: "Imaged",
            count: 0,
          },
          {
            status: "Imaging QC",
            count: 0,
          },
          {
            status: "Stock - Completed",
            count: 0,
          },
          {
            status: "Ready For Shipment",
            count: 0,
          },
          {
            status: "Shipped - Completed",
            count: 0,
          },
          {
            status: "Repaired",
            count: 0,
          },
          {
            status: "Dispatched",
            count: 0,
          },
          {
            status: "Returned to Dispatcher",
            count: 0,
          },
          {
            status: "Depoted",
            count: 0,
          },
          {
            status: "Returned",
            count: 0,
          },
          {
            status: "Redispatch",
            count: 0,
          },
          {
            status: "Quality Tested",
            count: 0,
          },
          {
            status: "Decommissioned",
            count: 0,
          },
          {
            status: "Waiting for Parts",
            count: 0,
          },
        ],
      });
    }
  });

  try {
    //Returns all documents with at least 1 work history within the date range
    let documents = await statuses.find({}).toArray();

    //Arrays to return later
    let statusCounts = [
      {
        status: "Checked-In",
        count: 0,
      },
      {
        status: "Moved To Imaging",
        count: 0,
      },
      {
        status: "In Imaging Process",
        count: 0,
      },
      {
        status: "Imaged",
        count: 0,
      },
      {
        status: "Imaging QC",
        count: 0,
      },
      {
        status: "Stock - Completed",
        count: 0,
      },
      {
        status: "Ready For Shipment",
        count: 0,
      },
      {
        status: "Shipped - Completed",
        count: 0,
      },
      {
        status: "Decommissioned",
        count: 0,
      },
      {
        status: "Quality Tested",
        count: 0,
      },
    ];

    //count how many statuses are within the date range
    documents.forEach((document) => {
      //For each work history, check the status and update the statusCounts array
      //Need to only count each status once
      let statuses_checked = [];
      document.workHistory.forEach((history) => {
        let workDate = moment(
          history.workDate.slice(0, 10),
          "MM-DD-YYYY"
        ).toDate();

        //If the history object is within the date range
        if (workDate >= dateStart && workDate <= dateEnd) {
          //If the status is one of the imaging statuses
          statusCounts.forEach((item) => {
            if (
              item.status === history.deviceStatus &&
              !statuses_checked.includes(history.deviceStatus)
            ) {
              //Add 1 to the count property
              item.count += 1;
              //Add status to the statuses_checked array
              statuses_checked.push(item.status);
              //For each tech entry in techCounts
              techCounts.forEach((tech) => {
                //If the tech matches
                if (tech.technician === history.technician) {
                  //Add 1 to that status for the tech
                  tech.stats.forEach((stat) => {
                    if (stat.status === history.deviceStatus) {
                      stat.count += 1;
                    }
                  });
                }
              });
            }
          });
        }
      });
    });

    //"In Imaging Process" = "Stock Completed" - "Quality Tested"
    statusCounts[2].count = statusCounts[5].count - statusCounts[9].count;

    //Remove "Quality Tested"
    statusCounts.splice(9,1);

    //Return
    res.json({ statusCounts: statusCounts, techCounts: techCounts });
  } catch (error) {
    console.log("Error: " + error);
    res.json({
      status: error,
    });
  }
});

//Runs when "Dell Repair" is selected
//Route: /api/statisticsPage/Dell
router.post("/Dell", async (req, res) => {
  let db = req.app.get("database");
  let statuses = db.db("APSB").collection("statuses");

  let dateStart = moment(req.body.dateStart, "MM-DD-YYYY").toDate();
  let dateEnd = moment(req.body.dateEnd, "MM-DD-YYYY").toDate();

  let techCounts = [];
  techs.forEach((tech) => {
    //Don't add a blank tech
    if (tech.value !== "") {
      //Add them to techCounts
      techCounts.push({
        technician: tech.value,
        stats: [
          {
            status: "Checked-In",
            count: 0,
          },
          {
            status: "Moved To Imaging",
            count: 0,
          },
          {
            status: "Imaged",
            count: 0,
          },
          {
            status: "Imaging QC",
            count: 0,
          },
          {
            status: "Stock - Completed",
            count: 0,
          },
          {
            status: "Ready For Shipment",
            count: 0,
          },
          {
            status: "Shipped - Completed",
            count: 0,
          },
          {
            status: "Repaired",
            count: 0,
          },
          {
            status: "Dispatched",
            count: 0,
          },
          {
            status: "Returned to Dispatcher",
            count: 0,
          },
          {
            status: "Depoted",
            count: 0,
          },
          {
            status: "Returned",
            count: 0,
          },
          {
            status: "Redispatch",
            count: 0,
          },
          {
            status: "Quality Tested",
            count: 0,
          },
          {
            status: "Decommissioned",
            count: 0,
          },
          {
            status: "Waiting for Parts",
            count: 0,
          },
        ],
      });
    }
  });

  try {
    //Returns all documents with at least 1 work history within the date range
    let documents = await statuses
      .find({})
      .project({
        workHistory: 1,
      })
      .toArray();

    //Arrays to return later
    let statusCounts = [
      {
        status: "Repaired",
        count: 0,
      },
      {
        status: "In Repair Process",
        count: 0,
      },
      {
        status: "Dispatched",
        count: 0,
      },
      {
        status: "Returned to Dispatcher",
        count: 0,
      },
      {
        status: "Depoted",
        count: 0,
      },
      {
        status: "Sent to Depot",
        count: 0,
      },
      {
        status: "At Depot",
        count: 0,
      },
      {
        status: "Returned from Depot",
        count: 0,
      },
      {
        status: "Returned",
        count: 0,
      },
      {
        status: "Redispatch",
        count: 0,
      },
      {
        status: "Quality Tested",
        count: 0,
      },
      {
        status: "Waiting for Parts",
        count: 0,
      },
    ];

    //count how many statuses are within the date range
    documents.forEach((document) => {
      //For each work history, check the status and update the statusCounts array
      //Need to only count each status once
      let statuses_checked = [];
      document.workHistory.forEach((history) => {
        let workDate = moment(
          history.workDate.slice(0, 10),
          "MM-DD-YYYY"
        ).toDate();

        //If the history object is within the date range
        if (workDate >= dateStart && workDate <= dateEnd) {
          //If the status is one of the dell statuses
          statusCounts.forEach((item) => {
            if (
              item.status === history.deviceStatus &&
              !statuses_checked.includes(history.deviceStatus)
            ) {
              //Add 1 to the count property
              item.count += 1;
              //Add status to the statuses_checked array
              statuses_checked.push(item.status);

              //For each tech entry in techCounts
              techCounts.forEach((tech) => {
                //If the tech matches
                if (tech.technician === history.technician) {
                  //Add 1 to that status for the tech
                  tech.stats.forEach((stat) => {
                    if (stat.status === history.deviceStatus) {
                      stat.count += 1;
                    }
                  });
                }
              });
            }
          });
        }
      });
    });

    //Change "Depoted" to "Pending Depot"
    statusCounts[4].status = "Pending Depot";

    //"At Depot" = "Sent to Depot" - "Returned from Depot"
    statusCounts[6].count = statusCounts[5].count - statusCounts[7].count

    //"In Repair Process" = "Dispatched" - "Repaired"
    statusCounts[1].count = statusCounts[2].count - statusCounts[0].count

    //Return
    res.json({ statusCounts: statusCounts, techCounts: techCounts });
  } catch (error) {
    console.log("Error: " + error);
    res.json({
      status: error,
    });
  }
});

module.exports = router;
