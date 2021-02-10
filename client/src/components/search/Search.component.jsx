import React, { useEffect, useState } from "react";
import Axios from "axios";
import DeviceDetails from "./device-details.component";
import WorkHistory from "./workhistory.component";
import AlertModal from "../alert-modal/alert-modal.component";
import Moment from "moment";
import Select from "react-select";
import partData from "./part-list-descriptions";
import schools from "../school-list.json";
import statuses from "../status-list.json";

export default function Search(props) {
  //Initializing variables and setState functions
  const [isDisabled, setIsDisabled] = useState(true);
  const [teacherAlert, setTeacherAlert] = useState(<p></p>);
  const [searchString, setSearchString] = useState("");
  const [results, setResults] = useState([]);
  const [asset, setAsset] = useState("");
  const [kbox, setKbox] = useState("");
  const [school, setSchool] = useState("");
  const [checkInTechName, setCheckInTechName] = useState("");
  const [teacher, setTeacher] = useState("");
  const [deviceLocation, setDeviceLocation] = useState("");
  const [checkInNotes, setCheckInNotes] = useState("");
  const [devicePartsList, setDevicePartsList] = useState([]);
  const [workHistory, setWorkHistory] = useState([]);
  const [date, setDate] = useState(
    Moment().format("MM/DD/YYYY), HH:mm")
  );
  const [multiValue, setMultiValue] = useState([]);
  const [technician, setTechnician] = useState(props.account);
  const [workOrderNumber, setWorkOrderNumber] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [modalDeviceStatus, setModalDeviceStatus] = useState("");
  const [description, setDescription] = useState("");
  const schoolList = schools;
  const statusList = statuses;
  const [show, setShow] = useState(false);
  const [alertIcon, setalertIcon] = useState("");
  const [alertTitle, setalertTitle] = useState("");
  const [alertText, setalertText] = useState("");
  const [alertColor, setalertColor] = useState("");
  const handleClose = () => setShow(false);

  //Form validation
  function validateWHForm() {
    let valid = true;
    let tech = technician;
    let status = modalDeviceStatus;
    let notes = description;
    let dellWO = workOrderNumber;
    let trackingFormat = /([A-Za-z0-9]){4,7}\s([A-Za-z0-9]){4,7}\s*([A-Za-z0-9]){0,8}/g;

    let techValid = tech !== "" ? true : false;
    if (techValid === false) {
      valid = false;
      setShow(true);
      setalertTitle("Warning");
      setalertText("Technician Email Is Required");
      setalertIcon("fas fa-exclamation-circle mr-3");
      setalertColor("bg-alert-warning");
      return valid;
    }

    let statusValid =
      status !== "" && status !== "Select Status" ? true : false;
    if (statusValid === false) {
      valid = false;
      setShow(true);
      setalertTitle("Warning");
      setalertText("Device Status Is Required");
      setalertIcon("fas fa-exclamation-circle mr-3");
      setalertColor("bg-alert-warning");
      return valid;
    }

    let notesRequired =
      (status === "Depoted" ||
        status === "Redispatch" ||
        status === "Returned" ||
        status === "Return Repaired" ||
        status === "Holding" ||
        status === "Dell Swap" ||
        status === "Returned to Dispatcher") &&
      notes === ""
        ? false
        : true;
    if (notesRequired === false) {
      valid = false;
      setShow(true);
      setalertTitle("Warning");
      setalertText("This Status Requires Notes");
      setalertIcon("fas fa-exclamation-circle mr-3");
      setalertColor("bg-alert-warning");
      return valid;
    }

    let trackingRequired =
      status === "Sent to Depot" && trackingNumber === "" ? false : true;
    if (trackingRequired === false) {
      valid = false;
      setShow(true);
      setalertTitle("Warning");
      setalertText("This Status Requires A Tracking Number");
      setalertIcon("fas fa-exclamation-circle mr-3");
      setalertColor("bg-alert-warning");
      return valid;
    }

    let workOrderNumberRequired =
      (status === "Dispatched" ||
        status === "Redispatch" ||
        status === "Depoted") &&
      dellWO === ""
        ? false
        : true;
    if (workOrderNumberRequired === false) {
      valid = false;
      setShow(true);
      setalertTitle("Warning");
      setalertText("This Status Requires A Dell Work Order Number");
      setalertIcon("fas fa-exclamation-circle mr-3");
      setalertColor("bg-alert-warning");
      return valid;
    }

    if (trackingNumber !== "" && !trackingNumber.match(trackingFormat)) {
      valid = false;
      setShow(true);
      setalertTitle("Warning");
      setalertText(
        "Tracking number should be formatted as one of the following:\n 9611918 2393077 12345678 \n 4295 4543 7394 \n 1ZW1A83 5909897 0391"
      );
      setalertIcon("fas fa-exclamation-circle mr-3");
      setalertColor("bg-alert-warning");
      return valid;
    }

    return valid;
  }

  //Run when adding a work history
  function addWorkHistory() {
    //Update date and time
    setDate(Moment().format("MM/DD/YYYY, HH:mm"));

    if (validateWHForm() === true) {
      Axios.post("/api/searchPage/addDeviceWorkHistory/", {
        asset: asset,
        workDate: date,
        technician: technician,
        workOrderNumber: workOrderNumber,
        trackingNumber: trackingNumber,
        deviceStatus: modalDeviceStatus,
        checkInNotes: description,
      }).then((response) => {
        if (response.status === 200) {
          getDeviceInfo();
          setShow(true);
          setalertTitle("Success");
          setalertText("Work history entry has been successfully added");
          setalertIcon("fas fa-check mr-3");
          setalertColor("bg-alert-success");
        } else {
          setShow(true);
          setalertTitle("Error");
          setalertText("There was an error adding the work history");
          setalertIcon("fas fa-exclamation-triangle mr-3");
          setalertColor("bg-alert-error");
          //Email the devs about the error
          Axios.post("/api/emailErrorReport", {
            page: "History Search",
            message:
              "The error occurred at the addDeviceWorkHistory route.\n\nThe information:" +
              "\n  asset: " +
              asset +
              "\n  workDate: " +
              date +
              "\n  technician: " +
              technician +
              "\n  workOrderNumber: " +
              workOrderNumber +
              "\n  trackingNumber: " +
              trackingNumber +
              "\n  deviceStatus: " +
              modalDeviceStatus +
              "\n  checkInNotes: " +
              description,
          });
        }
      });
    }
  }

  //Run when editing device information
  //This saves changes to the device information
  function saveDeviceInfo() {
    //Post values from device details modal using axios
    Axios.post("/api/searchPage/updateDeviceDetails/", {
      asset: asset,
      deviceLocation: deviceLocation,
      kbox: kbox,
      school: school,
      teacher: teacher,
      checkInNotes: checkInNotes,
    }).then((response) => {
      //Refresh device information
      if (response.status === 200) {
        getDeviceInfo();
        setShow(true);
        setalertTitle("Updated");
        setalertText("Device details has been updated");
        setalertIcon("fas fa-check mr-3");
        setalertColor("bg-alert-success");
      } else {
        setShow(true);
        setalertTitle("Error");
        setalertText("There was an error adding the work history");
        setalertIcon("fas fa-exclamation-triangle mr-3");
        setalertColor("bg-alert-error");
        //Email the devs about the error
        Axios.post("/api/emailErrorReport", {
          page: "History Search",
          message:
            "The error occurred at the updateDeviceDetails route.\n\nThe information:" +
            "\n  asset: " +
            asset +
            "\n  deviceLocation: " +
            deviceLocation +
            "\n  kbox: " +
            kbox +
            "\n  school: " +
            school +
            "\n  teacher: " +
            teacher +
            "\n  checkInNotes: " +
            checkInNotes,
        });
      }
    });
  }

  //This runs when the "Search" button is pressed, or when something is updated/added to the device
  //It pulls device info from the database and updates all state values
  function getDeviceInfo() {
    if (searchString !== "") {
      setIsDisabled(false);
      Axios.all([
        Axios.get("/api/searchPage/searchDevice/device/" + searchString),
        Axios.get("/api/searchPage/searchDevice/status/" + searchString),
      ]).then((res) => {
        //this will be executed only when all requests are complete
        if (
          res[0].data !== null &&
          res[1].data.length !== 0 &&
          res[1].data !== []
        ) {
          const deviceRes = res[0].data;
          const statusRes = res[1].data;
          const deviceDetails = { ...deviceRes, ...statusRes };

          setResults(deviceDetails);
          setAsset(deviceDetails.asset);
          setKbox(deviceDetails.kbox);
          setSchool(deviceDetails.school);
          setCheckInTechName(deviceDetails.workHistory[0].technician);
          setTeacher(deviceDetails.teacher);
          setDeviceLocation(deviceDetails.deviceLocation);
          setCheckInNotes(deviceDetails.workHistory[0].checkInNotes);
          setDevicePartsList(deviceDetails.devicePartsList);
          setWorkHistory(deviceDetails.workHistory);

          //set state of multivalue with existing device parts
          let parts = [];
          partData.forEach((element) => {
            deviceDetails.devicePartsList.forEach((part) => {
              if (element.value === part) {
                parts.push(element);
              }
            });
          });
          setMultiValue(parts);
          setWorkOrderNumber("");
          setTrackingNumber("");
          setDescription("");
          setModalDeviceStatus("");
          setDate(Moment().format("MM/DD/YYYY, HH:mm"));
          setTechnician(props.account);

          document.getElementById("parts-box").value = "";
          document.getElementById("part-descriptions").value = "";
        } else {
          setShow(true);
          setalertTitle("Error");
          setalertText("DEVICE DOES NOT EXIST");
          setalertIcon("fas fa-exclamation-triangle mr-3");
          setalertColor("bg-alert-error");
          //No email here for our sanity's sake
        }
      });
    }
  }

  //This runs when the "Save Parts List" button is pressed
  function savePartsList(event) {
    //Insert parts list into database
    var partsNeeded = [];
    if (multiValue !== null) {
      multiValue.forEach((element) => {
        partsNeeded.push(element.value);
      });
    }

    Axios.post("/api/searchPage/updateDeviceDetails/parts", {
      arrayValues: partsNeeded,
      asset: asset,
    }).then((response) => {
      if (response.data.status === 200) {
        var partBox = document.getElementById("parts-box");
        var partDescription = document.getElementById("part-descriptions");

        function getFields(input, field) {
          var output = [];

          if (input != null) {
            for (var i = 0; i < input.length; ++i) output.push(input[i][field]);
            return output;
          }
        }

        var result = getFields(multiValue, "value");
        partBox.value = result;
        var description = getFields(multiValue, "Description");
        partDescription.value = description;
        event.preventDefault();
        setShow(true);
        setalertTitle("Success");
        setalertText("Device parts list has been updated");
        setalertIcon("fas fa-check mr-3");
        setalertColor("bg-alert-success");
      } else {
        setShow(true);
        setalertTitle("Error");
        setalertText(
          "The parts list was not updated. Please notify a dev before retrying."
        );
        setalertIcon("fas fa-exclamation-triangle mr-3");
        setalertColor("bg-alert-error");
        //Email the devs about the error
        Axios.post("/api/emailErrorReport", {
          page: "History Search",
          message:
            "The error occurred at the updateDeviceDetails/parts route.\n\nThe information:" +
            "\n  asset: " +
            asset +
            "\n  arrayValues: " +
            partsNeeded,
        });
      }
    });
  }

  //Copy button clipboard copies the parts list
  function handlePartsListCopy() {
    var copyText = document.getElementById("parts-box");
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    document.execCommand("copy");
    setShow(true);
    setalertTitle("Copied");
    setalertText("Copied the text: " + copyText.value);
    setalertIcon("fas fa-copy mr-3");
    setalertColor("bg-alert-success");
  }

  //Copy button clipboard copies the parts descriptions
  function handleDescriptionCopy() {
    var copyText = document.getElementById("part-descriptions");
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    document.execCommand("copy");
    setShow(true);
    setalertTitle("Copied");
    setalertText("Copied the text: " + copyText.value);
    setalertIcon("fas fa-copy mr-3");
    setalertColor("bg-alert-success");
  }

  //Allows for the enter key to be registered as a click for the 'Search' button
  function allowEnterToBePressed(event) {
    if (event.which === 13) {
      event.preventDefault();
      getDeviceInfo();
      return false;
    }
  }

  //Runs once on page load
  //Runs each time devicePartsList is changed.
  //This will handle if the user was brought over via a link on the history search page
  useEffect(() => {
    // update date and time constantly
    setInterval(() => {
      setDate(Moment().format("MM/DD/YYYY, HH:mm"));
    }, 10000);

    let tableAsset = localStorage.getItem("bulkSearchAssetTag");
    let tableDateReceived = localStorage.getItem("bulkSearchDateReceived");
    if (tableAsset !== null && tableAsset !== undefined && tableAsset !== "") {
      setSearchString(tableAsset);

      Axios.all([
        Axios.get("/api/searchPage/searchDevice/device/" + tableAsset),
        Axios.post("/api/searchPage/searchDevice", {
          asset: tableAsset,
          dateReceived: tableDateReceived,
        }),
      ]).then((res) => {
        if (res[0].data !== null) {
          const deviceRes = res[0].data;
          const statusRes = res[1].data;
          const deviceDetails = {
            ...deviceRes,
            ...statusRes,
          };

          setResults(deviceDetails);
          setAsset(deviceDetails.asset);
          setKbox(deviceDetails.kbox);
          setSchool(deviceDetails.school);
          setCheckInTechName(deviceDetails.workHistory[0].technician);
          setTeacher(deviceDetails.teacher);
          setDeviceLocation(deviceDetails.deviceLocation);
          setCheckInNotes(deviceDetails.workHistory[0].checkInNotes);
          setDevicePartsList(deviceDetails.devicePartsList);
          setWorkHistory(deviceDetails.workHistory);

          //Set state of multivalue with existing device parts
          //The devicePartsList hook variable is not used because it will not update in time for the loop
          let parts = [];
          partData.forEach((element) => {
            deviceDetails.devicePartsList.forEach((part) => {
              if (element.value === part) {
                parts.push(element);
              }
            });
          });
          setMultiValue(parts);
        } else {
          setShow(true);
          setalertTitle("Error");
          setalertText(
            "IF YOU SEE ME, NOTIFY AN APP DEV IMMEDIATELY BECAUSE SOMETHING WENT HORRIBLY WRONG"
          );
          setalertIcon("fas fa-exclamation-triangle mr-3");
          setalertColor("bg-alert-error");
          //Email the devs about the error
          Axios.post("/api/emailErrorReport", {
            page: "History Search",
            message:
              "The error occurred at the searchDevice route in the useEffect(). This error only occurs if something happens between a user clicking a link on history search and redirecting to this page. You should never see this error.\n\nThe information:" +
              "\n  asset: " +
              tableAsset +
              "\n  dateReceived: " +
              tableDateReceived,
          });
        }
      });
      //Clear local storage so this doesn't run on every page load
      localStorage.removeItem("bulkSearchAssetTag");
      localStorage.removeItem("bulkSearchDateReceived");
    }
  }, [devicePartsList]);

  //Runs once on page load by default
  //Runs each time teacher or modalDeviceStatus is changed
  //Creates a text notification if a repaired status is being added to a teacher device
  useEffect(() => {
    if (teacher === "Yes" && modalDeviceStatus === "Repaired") {
      setTeacherAlert(
        <p classname="font-weight-bold">
          **** This is a teacher device mark it accordingly ****
        </p>
      );
    } else {
      setTeacherAlert(<p></p>);
    }
  }, [teacher, modalDeviceStatus]);

  //Bootstrap styling for if the device is for a teacher
  function styleForTeacherDevice(status) {
    const prefix = "form-control border-dark text-form-color bg-";
    if (status !== null && status !== undefined) {
      // eslint-disable-next-line default-case
      switch (status) {
        case "Yes":
          return prefix + "success";
        case "No":
          return prefix + "form-box";
        default:
          return prefix + "form-box";
      }
    } else {
      return prefix + "form-box";
    }
  }

  //Bootstrap styling for the tag color of the device
  function styleForTagColor(tagColor) {
    const prefix = "form-control bg-form-box text-form-color border-";
    if (tagColor !== null && tagColor !== undefined) {
      // eslint-disable-next-line default-case
      switch (tagColor) {
        case "white":
          return prefix + "white";
        case "White":
          return prefix + "white";
        case "purple":
          return prefix + "indigo";
        case "Purple":
          return prefix + "indigo";
        case "red":
          return prefix + "danger";
        case "Red":
          return prefix + "danger";
        case "blue":
          return prefix + "primary";
        case "Blue":
          return prefix + "primary";
        default:
          return prefix + "dark";
      }
    } else {
      return prefix + "dark";
    }
  }

  return (
    <div>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb bg-secondary">
          <li className="breadcrumb-item text-primary">Company</li>
          <li className="breadcrumb-item text-light active" aria-current="page">
            Active Search
          </li>
          <li className="breadcrumb-item text-light">{searchString}</li>
        </ol>
      </nav>

      <nav className="navbar navbar-expand-md navbar-dark bg-secondary border-bottom border-dark rounded mx-4 mb-3">
        <form className="form-inline my-2 my-lg-0">
          <input
            name="searchString"
            value={searchString}
            onChange={(event) => {
              setSearchString(event.target.value);
            }}
            onKeyPress={allowEnterToBePressed}
            className="form-control mr-sm-2"
            type="text"
            placeholder="Search"
          />
          <button
            onClick={getDeviceInfo}
            className="btn btn-primary my-2 my-sm-0 mr-2"
            type="button"
          >
            Search
          </button>
        </form>
      </nav>

      <DeviceDetails
        results={results}
        tech={checkInTechName}
        notes={checkInNotes}
        isDisabled={isDisabled}
        handleTeacherCheck={styleForTeacherDevice}
        handleTagColor={styleForTagColor}
      />

      <div className="card bg-secondary mb-3 border-dark text-white mx-4">
        {/* Device Parts List Card */}
        <div className="card-header bg-dark-title border-bottom border-dark">
          Device Parts List
        </div>
        <div className="card-body">
          <form>
            <div className="row">
              <div className="col-md-12">
                <div className="form-group">
                  <label>Parts Needed For Device</label>
                  <div className="input-group input-group-md">
                    <div className="input-group-prepend">
                      <span className="input-group-text bg-dark-title border-dark text-light">
                        <i className="fas fa-toolbox"></i>
                      </span>
                    </div>
                    <Select
                      className="react-select-container"
                      classNamePrefix="react-select"
                      name="filters"
                      placeholder="Filters"
                      value={multiValue}
                      options={partData}
                      onChange={(option) => {
                        setMultiValue(option);
                      }}
                      isMulti
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="row mb-2">
              <div className="col">
                <label>
                  Parts Selected{" "}
                  <button
                    type="button"
                    onClick={handlePartsListCopy}
                    className="btn btn-sm btn-success ml-3"
                    id="parts-list-button"
                  >
                    Copy
                  </button>
                </label>
                <div className="input-group input-group-md">
                  <div className="input-group-prepend">
                    <span className="input-group-text bg-dark-title border-dark text-light">
                      <i className="fas fa-tools"></i>
                    </span>
                  </div>
                  <textarea
                    className="form-control bg-form-box border-dark text-form-color"
                    id="parts-box"
                    rows="2"
                    readOnly
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="row mb-2">
              <div className="col">
                <label>
                  Part Descriptions{" "}
                  <button
                    type="button"
                    onClick={handleDescriptionCopy}
                    className="btn btn-sm btn-success"
                    id="parts-description-button"
                  >
                    Copy
                  </button>
                </label>
                <div className="input-group input-group-md">
                  <div className="input-group-prepend">
                    <span className="input-group-text bg-dark-title border-dark text-light">
                      <i className="fas fa-list"></i>
                    </span>
                  </div>
                  <textarea
                    className="form-control bg-form-box border-dark text-form-color"
                    id="part-descriptions"
                    rows="2"
                    readOnly
                  ></textarea>
                </div>
              </div>
            </div>
            <button
              disabled={isDisabled !== false}
              onClick={savePartsList}
              type="button"
              className="btn btn-primary"
            >
              Save Parts List
            </button>
          </form>
        </div>
      </div>
      {/* Device Work History Table */}
      <WorkHistory data={workHistory} date={date} isDisabled={isDisabled} />

      {/* Add Work History Modal */}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content border-0 shadow">
            <div className="modal-header bg-dark-title border-dark">
              <h5 className="modal-title text-white" id="exampleModalLabel">
                Add Work History
              </h5>
              <button
                type="button"
                className="close text-white"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body bg-secondary border-dark text-white">
              <div className="row mb-2">
                <div className="col-md-6">
                  <label>Date</label>
                  <div className="input-group input-group-md">
                    <div className="input-group-prepend">
                      <span className="input-group-text bg-dark-title border-dark text-light">
                        <i className="fas fa-calendar"></i>
                      </span>
                    </div>
                    <h1 className="form-control bg-form-box border-dark text-form-color">
                      <span id="datetime">
                        {Moment().format("MM/DD/YYYY, HH:mm")}
                      </span>
                    </h1>
                  </div>
                </div>
                <div className="col-md-6">
                  <label>Tech</label>
                  <div className="input-group input-group-md">
                    <div className="input-group-prepend">
                      <span className="input-group-text bg-dark-title border-dark text-light">
                        <i className="fas fa-user"></i>
                      </span>
                    </div>
                    <input
                      name="technician"
                      value={technician}
                      onChange={(event) => {
                        setTechnician(event.target.value);
                      }}
                      type="email"
                      className="form-control bg-form-box border-dark text-form-color"
                    />
                  </div>
                </div>
              </div>
              <div className="row mb-2">
                <div className="col-md-6">
                  <label>Work Order Number</label>
                  <div className="input-group input-group-md">
                    <div className="input-group-prepend">
                      <span className="input-group-text bg-dark-title border-dark text-light">
                        <i className="fas fa-hashtag"></i>
                      </span>
                    </div>
                    <input
                      name="workOrderNumber"
                      value={workOrderNumber}
                      onChange={(event) => {
                        setWorkOrderNumber(event.target.value);
                      }}
                      type="text"
                      className="form-control bg-form-box border-dark text-form-color"
                      placeholder="Dell WO Number"
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Device Status</label>
                    <div className="input-group input-group-md">
                      <div className="input-group-prepend">
                        <span className="input-group-text bg-dark-title border-dark text-light">
                          <i className="fas fa-laptop-medical"></i>
                        </span>
                      </div>
                      <select
                        name="modalDeviceStatus"
                        value={modalDeviceStatus}
                        onChange={(event) => {
                          setModalDeviceStatus(event.target.value);
                        }}
                        className="form-control bg-form-box border-dark text-form-color"
                      >
                        <option defaultValue="">Select Status</option>
                        {statusList.map((e) => (
                          <option value={e.value}>{e.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row mb-2">
                <div className="col-md-6">
                  <label>Tracking Number</label>
                  <div className="input-group input-group-md">
                    <div className="input-group-prepend">
                      <span className="input-group-text bg-dark-title border-dark text-light">
                        <i className="fas fa-tags fa-flip-horizontal"></i>
                      </span>
                    </div>
                    <input
                      name="trackingNumber"
                      value={trackingNumber}
                      onChange={(event) => {
                        setTrackingNumber(event.target.value);
                      }}
                      type="text"
                      className="form-control bg-form-box border-dark text-form-color"
                      placeholder="Tracking Number"
                    />
                  </div>
                </div>
                <div className="col-md-6">{teacherAlert}</div>
              </div>
              <div className="row mb-2">
                <div className="col-12">
                  <label>Notes</label>
                  <div className="input-group input-group-md">
                    <div className="input-group-prepend">
                      <span className="input-group-text bg-dark-title border-dark text-light">
                        <i className="fas fa-list"></i>
                      </span>
                    </div>
                    <textarea
                      name="description"
                      value={description}
                      onChange={(event) => {
                        setDescription(event.target.value);
                      }}
                      className="form-control bg-form-box border-dark text-form-color"
                      rows="5"
                      placeholder="This is a description"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer bg-secondary border-dark">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={addWorkHistory}
                data-dismiss="modal"
              >
                Add Work
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Device Details Modal */}
      <div
        className="modal fade"
        id="editDetails"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-md" role="document">
          <div className="modal-content border-0 shadow">
            <div className="modal-header bg-dark-title border-dark">
              <h5 className="modal-title text-white" id="exampleModalLabel">
                Edit Device Details
              </h5>
              <button
                type="button"
                className="close text-white"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body bg-secondary border-dark text-white">
              <div className="row mb-2">
                <div className="col-md-6">
                  <label>School/Site</label>
                  <div className="input-group input-group-md">
                    <div className="input-group-prepend">
                      <span className="input-group-text bg-dark-title border-dark text-light">
                        <i className="fas fa-school"></i>
                      </span>
                    </div>
                    <select
                      name="school"
                      className="form-control bg-form-box border-dark text-form-color"
                      value={school}
                      onChange={(event) => {
                        setSchool(event.target.value);
                      }}
                    >
                      <option value={school}>{school}</option>
                      {schoolList.map((e) => (
                        <option value={e.value}>{e.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-md-6">
                  <label>Location</label>
                  <div className="input-group input-group-md">
                    <div className="input-group-prepend">
                      <span className="input-group-text bg-dark-title border-dark text-light">
                        <i className="fas fa-compass"></i>
                      </span>
                    </div>
                    <select
                      name="deviceLocation"
                      value={deviceLocation}
                      onChange={(event) => {
                        setDeviceLocation(event.target.value);
                      }}
                      className="form-control bg-form-box border-dark text-form-color"
                    >
                      <option defaultValue="Repair Shop">Repair Shop</option>
                      <option value="QC shop">QC Shop</option>
                      <option value="Imaging Shop">Imaging Shop</option>
                      <option value="Stock">Stock</option>
                      <option value="School">School</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="row mb-2">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Teacher</label>
                    <div className="input-group input-group-md">
                      <div className="input-group-prepend">
                        <span className="input-group-text bg-dark-title border-dark text-light">
                          <i className="fas fa-chalkboard-teacher"></i>
                        </span>
                      </div>
                      <select
                        name="teacher"
                        className="form-control bg-form-box border-dark text-form-color"
                        value={teacher}
                        onChange={(event) => {
                          setTeacher(event.target.value);
                        }}
                      >
                        <option value={teacher}>{teacher}</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <label>KBox</label>
                  <div className="input-group input-group-md">
                    <div className="input-group-prepend">
                      <span className="input-group-text bg-dark-title border-dark text-light">
                        <i className="fas fa-hashtag"></i>
                      </span>
                    </div>
                    <input
                      name="kbox"
                      type="text"
                      className="form-control bg-form-box border-dark text-form-color"
                      value={kbox}
                      onChange={(event) => {
                        setKbox(event.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="row mb-2">
                <div className="col-12">
                  <label>Check In Notes</label>
                  <div className="input-group input-group-md">
                    <div className="input-group-prepend">
                      <span className="input-group-text bg-dark-title border-dark text-light">
                        <i className="fas fa-list"></i>
                      </span>
                    </div>
                    <textarea
                      name="checkInNotes"
                      className="form-control bg-form-box border-dark text-form-color"
                      rows="3"
                      value={checkInNotes}
                      onChange={(event) => {
                        setCheckInNotes(event.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer bg-secondary border-dark">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
              <button
                onClick={saveDeviceInfo}
                type="button"
                className="btn btn-danger"
                data-dismiss="modal"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
      <AlertModal
        show={show}
        alertTitle={alertTitle}
        alertText={alertText}
        alertColor={alertColor}
        alertIcon={alertIcon}
        handleClose={handleClose}
      />
    </div>
  );
}
