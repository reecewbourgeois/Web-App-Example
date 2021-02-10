var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var app = express();

//Set up client connection info
var MongoClient = require("mongodb").MongoClient;
var getSecret = require("./routes/secret");
var client = new MongoClient(getSecret("uri"), {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.set("port", process.env.PORT || 5000);

app.use(logger("dev"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(cookieParser());

//Test route
app.use("/api/test", require("./routes/test"));

//Backend Routes
app.use(
  "/api/searchPage/searchDevice",
  require("./routes/Search Page/searchDevice")
);
app.use(
  "/api/checkInNormal/checkForExistingDevice",
  require("./routes/Check In Page/checkForExistingDevice")
);
app.use(
  "/api/checkInNormal/checkInDevice",
  require("./routes/Check In Page/checkInDevice")
);
app.use(
  "/api/searchPage/updateDeviceDetails",
  require("./routes/Search Page/updateDeviceDetails")
);
app.use(
  "/api/searchPage/addDeviceWorkHistory",
  require("./routes/Search Page/addDeviceWorkHistory")
);
app.use(
  "/api/bulkSearch/bulkSearch",
  require("./routes/Bulk Search Page/bulkSearch")
);
app.use(
  "/api/batchStatusChange/batchStatusChange",
  require("./routes/Batch Status Change Page/batchStatusChange")
);
app.use(
  "/api/shippingTickets/shippingTickets",
  require("./routes/Shipping Tickets Page/shippingTickets")
);
app.use(
  "/api/ticketingSystem/ticketingSystem",
  require("./routes/Ticketing System Page/ticketingSystem")
);
app.use(
  "/api/ticketingSystem/addNewTicket",
  require("./routes/Ticketing System Page/addNewTicket")
);
app.use(
  "/api/ticketingSystem/addNewComment",
  require("./routes/Ticketing System Page/addNewComment")
);
app.use(
  "/api/ticketingSystem/email",
  require("./routes/Ticketing System Page/email")
);
app.use(
  "/api/ticketingSystem/editTicket",
  require("./routes/Ticketing System Page/editTicket")
);
app.use("/api/statisticsPage", require("./routes/Statistics Page/statistics"));
app.use("/api/appJSPage", require("./routes/App.js Pages/getTicketsForUser"));
app.use(
  "/api/emailErrorReport",
  require("./routes/App.js Pages/emailErrorReport")
);

//All are needed to prevent crashing on page refresh and serving the frontend
app.set("views", path.join(__dirname, "views"));
app.use(express.static("./client/build"));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

//Connect to database and start the app
client.connect((err, database) => {
  if (err) {
    console.log(err);
  }

  //Allows for database operation in other files without starting a whole new connection every time
  app.set("database", database);

  app.listen(app.get("port"), function () {
    console.log("Express server listening on port " + app.get("port"));
  });
});

module.exports = app;
