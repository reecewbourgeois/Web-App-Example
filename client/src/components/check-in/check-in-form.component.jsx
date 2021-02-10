import React, { useEffect, useState } from "react";
import Axios from "axios";
import Moment from "moment";
import schoolList from "../school-list.json";
import modelList from "../model-list.json";
import AlertModal from "../alert-modal/alert-modal.component";

export default function CheckIn(props) {
  //Initializing all values
  const [assetTag, setAssetTag] = useState("");
  const [date, setDate] = useState(Moment().format("MM/DD/YYYY, HH:mm"));
  const [selectedSchool, setSelectedSchool] = useState("");
  const [serviceTag, setServiceTag] = useState("");
  const [kbox, setKbox] = useState("");
  const [teacher, setTeacher] = useState("No");
  const [tagColor, setTagColor] = useState("");
  const [notes, setNotes] = useState("");
  const [checkInTech, setCheckInTech] = useState(props.account);
  const [disabled, setDisabled] = useState(false);
  const [deviceModel, setDeviceModel] = useState("");
  const [deviceLocation, setDeviceLocation] = useState("Repair Shop");
  const [summerCheck, setSummerCheck] = useState(false);
  const schools = schoolList;
  const models = modelList;
  const [textFieldsDisabled, setTextFieldsDisabled] = useState(false);
  const [show, setShow] = useState(false);
  const [alertIcon, setalertIcon] = useState("");
  const [alertTitle, setalertTitle] = useState("");
  const [alertText, setalertText] = useState("");
  const [alertColor, setalertColor] = useState("");
  const handleClose = () => setShow(false);

  //Runs on page load
  //Update date and time constantly
  useEffect(() => {
    setInterval(() => {
      setDate(Moment().format("MM/DD/YYYY, HH:mm"));
    }, 10000);
  }, []);

  //Changes the boolean value of summerCheck
  function handleSummerCheck() {
    setSummerCheck(!summerCheck);
  }

  //This checks in a device and updates/adds info in the devices collection
  async function checkInDeviceandUpdateDeviceInfo() {
    let responseFromStatusesCollection = await Axios.post(
      "/api/checkInNormal/checkInDevice/status/" + kbox,
      {
        asset: assetTag.toUpperCase(),
        service: serviceTag.toUpperCase(),
        model: deviceModel,
        deviceStatus: "Checked-In",
        kbox: kbox,
        school: selectedSchool,
        dateReceived: date,
        checkInTechName: checkInTech,
        teacher: teacher,
        checkInNotes: notes,
        workOrderNumber: "",
        trackingNumber: "",
        deviceLocation: deviceLocation,
      }
    );

    let responseFromDevicesCollection = await Axios.post(
      "/api/checkInNormal/checkInDevice/device",
      {
        model: deviceModel,
        asset: assetTag,
        service: serviceTag,
        tagColor: tagColor,
      }
    );

    if (
      responseFromStatusesCollection.status === 200 &&
      responseFromDevicesCollection.status === 200
    ) {
      setShow(true);
      setalertTitle("Success");
      setalertText("Device was sucessfully checked in");
      setalertIcon("fas fa-check mr-3");
      setalertColor("bg-alert-success");

      //if summer check-in, reset asset, service, model, and tag color only
      if (summerCheck === true) {
        setAssetTag("");
        setServiceTag("");
        setDeviceModel("");
        setTagColor("");
        setTextFieldsDisabled(false);
      } else {
        //if normal check-in
        resetTextFields();
      }
    } else {
      setShow(true);
      setalertTitle("Error");
      setalertText(
        "Device may have been checked in but something went wrong. Please notify a dev."
      );
      setalertIcon("fas fa-exclamation-triangle mr-3");
      setalertColor("bg-alert-error");
      //Email the devs about the error
      Axios.post("/api/emailErrorReport", {
        page: "Check-In",
        message:
          "The error occurred at the checkInDevice route.\n\nThe information:" +
          "\n  asset: " +
          assetTag.toUpperCase() +
          "\n  service: " +
          serviceTag.toUpperCase() +
          "\n  model: " +
          deviceModel +
          "\n  tagColor: " +
          tagColor +
          "\n  deviceStatus: Checked-In" +
          "\n  kbox: " +
          kbox +
          "\n  school: " +
          selectedSchool +
          "\n  dateReceived: " +
          date +
          "\n  checkInTechName: " +
          checkInTech +
          "\n  teacher: " +
          teacher +
          "\n  checkInNotes: " +
          notes +
          "\n  workOrderNumber: " +
          "\n  trackingNumber: " +
          "\n  deviceLocation: " +
          deviceLocation,
      });
    }
  }

  //Resets all values to their default state
  //Runs when the "Reset" button is pressed
  function resetTextFields() {
    setNotes("");
    setTeacher("No");
    setTagColor("");
    setKbox("");
    setServiceTag("");
    setDeviceLocation("Repair Shop");
    setDeviceModel("");
    setAssetTag("");
    setSelectedSchool("");
    setCheckInTech(props.account);
    setDisabled(false);
    setTextFieldsDisabled(false);
  }

  //Checks if the device has already been checked in and if it already has information in the database
  async function checkForExistingEntries(event) {
    let device_result = await Axios.get(
      "/api/checkInNormal/checkForExistingDevice/device/" + event.target.value
    );
    let status_result = await Axios.get(
      "/api/checkInNormal/checkForExistingDevice/statuses/" + event.target.value
    );

    if (device_result.data !== null && device_result.data !== undefined) {
      setAssetTag(device_result.data.asset);
      setServiceTag(device_result.data.service);
      setTagColor(device_result.data.tagColor);
      setDeviceModel(device_result.data.model);
      setTextFieldsDisabled(true);

      //prevents users from having to hit the reset button if the field is left blank
      if (assetTag === undefined && serviceTag === undefined) {
        setTextFieldsDisabled(false);
      }
    }

    if (
      status_result.data.count !== 0 &&
      status_result.data.count !== undefined
    ) {
      setShow(true);
      setalertTitle("Warning");
      setalertText("DEVICE HAS AN ACTIVE STATUS");
      setalertIcon("fas fa-exclamation-circle mr-3");
      setalertColor("bg-alert-warning");

      //if summer check-in, reset asset, service, model, and tag color only
      if (summerCheck === true) {
        setAssetTag("");
        setServiceTag("");
        setDeviceModel("");
        setTagColor("");
        setTextFieldsDisabled(false);
      } else {
        //if normal check-in
        resetTextFields();
      }
    }
  }

  return (
    <div>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb bg-secondary">
          <li className="breadcrumb-item text-primary">Company</li>
          <li className="breadcrumb-item text-light active" aria-current="page">
            Check-in
          </li>
        </ol>
      </nav>
      <div className="card bg-secondary mb-3 border-dark text-white mx-4">
        <div className="card-header bg-dark-title border-bottom border-dark">
          Check In Form
          <label className="ml-4">Summer Mode</label>
          <input
            name="summerCheck"
            className="form-check-input ml-2 mt-2"
            type="checkbox"
            onChange={handleSummerCheck}
            value={summerCheck}
          />
        </div>
        <div className="card-body">
          <form>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label>Asset Tag</label>
                  <div className="input-group input-group-md">
                    <div className="input-group-prepend">
                      <span className="input-group-text bg-dark-title border-dark text-light">
                        <i className="fas fa-tag "></i>
                      </span>
                    </div>
                    <input
                      name="assetTag"
                      type="text"
                      required
                      className="form-control bg-form-box border-dark text-form-color"
                      placeholder="Asset Tag Number"
                      disabled={textFieldsDisabled}
                      onBlur={checkForExistingEntries}
                      value={assetTag}
                      onChange={(event) => {
                        setAssetTag(event.target.value);
                      }}
                      maxLength={9}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>School / Site</label>
                  <div className="input-group input-group-md">
                    <div className="input-group-prepend">
                      <span className="input-group-text bg-dark-title border-dark text-light">
                        <i className="fas fa-school"></i>
                      </span>
                    </div>
                    <select
                      name="selectedSchool"
                      value={selectedSchool}
                      onChange={(event) => {
                        setSelectedSchool(event.target.value);
                      }}
                      required
                      className="form-control bg-form-box border-dark text-form-color"
                    >
                      <option value="">Please Select A School</option>
                      {schools.map((e) => (
                        <option value={e.value}>{e.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label>Service Tag</label>
                  <div className="input-group input-group-md">
                    <div className="input-group-prepend">
                      <span className="input-group-text bg-dark-title border-dark text-light">
                        <i className="fas fa-tags fa-flip-horizontal"></i>
                      </span>
                    </div>
                    <input
                      name="serviceTag"
                      type="text"
                      disabled={textFieldsDisabled}
                      value={serviceTag}
                      onBlur={checkForExistingEntries}
                      onChange={(event) => {
                        setServiceTag(event.target.value);
                      }}
                      required
                      className="form-control bg-form-box border-dark text-form-color"
                      placeholder="Service Tag Number"
                      maxLength={7}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
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
                      value={kbox}
                      onChange={(event) => {
                        setKbox(event.target.value);
                      }}
                      required
                      className="form-control bg-form-box border-dark text-form-color"
                      placeholder="K-box Ticket Number"
                      maxLength={8}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label>Model</label>
                  <div className="input-group input-group-md">
                    <div className="input-group-prepend">
                      <span className="input-group-text bg-dark-title border-dark text-light">
                        <i className="fas fa-laptop"></i>
                      </span>
                    </div>
                    <select
                      name="deviceModel"
                      value={deviceModel}
                      onChange={(event) => {
                        setDeviceModel(event.target.value);
                      }}
                      required
                      className="form-control bg-form-box border-dark text-form-color"
                    >
                      <option value="">Please Select A Device Model</option>
                      {models.map((e) => (
                        <option value={e.value}>{e.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Teacher (Y/N)</label>
                  <div className="input-group input-group-md">
                    <div className="input-group-prepend">
                      <span className="input-group-text bg-dark-title border-dark text-light">
                        <i className="fas fa-chalkboard-teacher"></i>
                      </span>
                    </div>
                    <select
                      name="teacher"
                      value={teacher}
                      onChange={(event) => {
                        setTeacher(event.target.value);
                      }}
                      required
                      className="form-control bg-form-box border-dark text-form-color"
                    >
                      <option value="Yes">Yes</option>
                      <option defaultValue="No">No</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label>Device Tag Color</label>
                  <div className="input-group input-group-md">
                    <div className="input-group-prepend">
                      <span className="input-group-text bg-dark-title border-dark text-light">
                        <i className="fas fa-palette"></i>
                      </span>
                    </div>
                    <input
                      name="tagColor"
                      type="text"
                      value={tagColor}
                      onChange={(event) => {
                        setTagColor(event.target.value);
                      }}
                      required
                      className="form-control bg-form-box border-dark text-form-color"
                      placeholder="RGB"
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Check In Tech</label>
                  <div className="input-group input-group-md">
                    <div className="input-group-prepend">
                      <span className="input-group-text bg-dark-title border-dark text-light">
                        <i className="fas fa-user"></i>
                      </span>
                    </div>
                    <input
                      name="checkInTech"
                      type="email"
                      value={checkInTech}
                      onChange={(event) => {
                        setCheckInTech(event.target.value);
                      }}
                      required
                      className="form-control bg-form-box border-dark text-form-color"
                      placeholder="email"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
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
                      required
                      className="form-control bg-form-box border-dark text-form-color"
                    >
                      <option defaultValue="Repair Shop">Repair Shop</option>
                      <option value="QC Shop">QC Shop</option>
                      <option value="Imaging Shop">Imaging Shop</option>
                      <option value="Stock">Stock</option>
                      <option value="School">School</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Date</label>
                  <div className="input-group input-group-md">
                    <div className="input-group-prepend">
                      <span className="input-group-text bg-dark-title border-dark text-light">
                        <i className="fas fa-calendar"></i>
                      </span>
                    </div>
                    <h1 className="form-control bg-form-box border-dark text-form-color">
                      <span id="datetime">{date}</span>
                    </h1>
                  </div>
                </div>
              </div>
            </div>
            <div className="form-group">
              <label>Check In Notes</label>
              <div className="input-group input-group-md">
                <div className="input-group-prepend">
                  <span className="input-group-text bg-dark-title border-dark text-light">
                    <i className="fas fa-list"></i>
                  </span>
                </div>
                <textarea
                  name="notes"
                  value={notes}
                  onChange={(event) => {
                    setNotes(event.target.value);
                  }}
                  className="form-control bg-form-box border-dark text-form-color"
                  rows="3"
                ></textarea>
              </div>
            </div>

            <button
              onClick={checkInDeviceandUpdateDeviceInfo}
              disabled={
                disabled ||
                !assetTag ||
                !kbox ||
                !selectedSchool ||
                !deviceModel ||
                !serviceTag ||
                !tagColor
              }
              type="button"
              className="btn btn-primary mr-2"
            >
              Submit
            </button>
            <button
              onClick={resetTextFields}
              type="button"
              className="btn btn-danger"
            >
              Reset
            </button>
          </form>
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
