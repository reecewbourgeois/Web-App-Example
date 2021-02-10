import React, { useEffect, useState } from "react";
import BulkSearchResults from "./search-results-component";
import AlertModal from "../alert-modal/alert-modal.component";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import partData from "./bulk-parts-list";
import Axios from "axios";
import statuses from "../status-list.json";
import schools from "../school-list.json";
import techs from "../technician-list.json";
import models from "../model-list.json";
import DatePicker from "react-date-picker";
import Moment from "moment";
import { CSVLink } from "react-csv";

export default function BulkSearch() {
  //Initializing variables and setState functions
  const [classDisabled, setClassDisabled] = useState("");
  const [data, setData] = useState([]);
  const [searchType, setSearchType] = useState("");
  const [deviceStatus, setDeviceStatus] = useState("");
  const [model, setModel] = useState("");
  const [school, setSchool] = useState("");
  const [technician, setTechnician] = useState("");
  const [asset, setAsset] = useState("");
  const [service, setService] = useState("");
  const [kbox, setKbox] = useState("");
  const [count, setCount] = useState("");
  const [dateStart, setDateStart] = useState(Moment().format("MM/DD/YYYY"));
  const [dateEnd, setDateEnd] = useState(Moment().format("MM/DD/YYYY"));
  const [datePickerStart, setDatePickerStart] = useState(new Date());
  const [datePickerEnd, setDatePickerEnd] = useState(new Date());
  const [partsSelected, setPartsSelected] = useState([]);
  const [techSelected, setTechSelected] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [teacher, setTeacher] = useState("No");
  const [show, setShow] = useState(false);
  const [alertIcon, setalertIcon] = useState("");
  const [alertTitle, setalertTitle] = useState("");
  const [alertText, setalertText] = useState("");
  const [alertColor, setalertColor] = useState("");
  const handleClose = () => setShow(false);
  const statusList = statuses;
  const schoolList = schools;
  const modelList = models;

  //Resets all fields to their initial states
  function resetTextFields() {
    setData([]);
    setSearchType("");
    setDeviceStatus("");
    setModel("");
    setSchool("");
    setTechnician("");
    setTechSelected("");
    setAsset("");
    setService("");
    setPartsSelected([]);
    setKbox("");
    setDateStart(Moment().format("MM/DD/YYYY"));
    setDateEnd(Moment().format("MM/DD/YYYY"));
    setDatePickerStart(new Date());
    setDatePickerEnd(new Date());
    setCount("");
    setDisabled(true);
    setTeacher("No");
  }

  //Search for devices based on the criteria
  function search() {
    if (validateBSForm() === true) {
      setData([]);

      let parts = [];
      partsSelected.forEach((doc) => {
        parts.push(doc.value);
      });
      Axios.post("/api/bulkSearch/bulkSearch", {
        partsSelected: parts,
        model: model,
        school: school,
        asset: asset.toUpperCase(),
        service: service.toUpperCase(),
        kbox: kbox,
        teacher: teacher,
      }).then((result) => {
        if (result.status === 200) {
          sortThroughData(result);
        } else {
          //Email the devs about the error
          Axios.post("/api/emailErrorReport", {
            page: "Bulk Search",
            message:
              "The error occurred at the bulkSearch route.\n\nThe information:" +
              "\n  partsSelected: " +
              parts +
              "\n  model: " +
              model +
              "\n  school: " +
              school +
              "\n  asset: " +
              asset.toUpperCase() +
              "\n  service: " +
              service.toUpperCase() +
              "\n  kbox: " +
              kbox +
              "\n  teacher: " +
              teacher,
          });
        }
      });
    }
  }

  function sortThroughData(result) {
    //Workaround for stupid date issues
    let momentDateStart = Moment(dateStart, "MM-DD-YYYY").toDate();
    let momentDateEnd = Moment(dateEnd, "MM-DD-YYYY").toDate();

    //A variable for all the correct data to display
    let validResults = [];
    //If search is for current statuses
    if (searchType === "Current Status") {
      result.data.forEach((document) => {
        //We only need to look at the last work history for current status
        let lastItem = document.workHistory.length - 1;
        //Converts the date from the database to somthing comparable
        let workDate = Moment(document.workHistory[lastItem].workDate.slice(0,10), "MM-DD-YYYY").toDate();
        
        //If the work date is within the given date range
        if (workDate >= momentDateStart && workDate <= momentDateEnd) {
          //If both a status and tech are given
          if (deviceStatus !== "" && techSelected !== "") {
            //If both fields match the last work history
            if (
              deviceStatus === document.workHistory[lastItem].deviceStatus &&
              techSelected === document.workHistory[lastItem].technician
            ) {
              validResults.push(document);
            }
          }
          //If only a status is given
          else if (deviceStatus !== "" && techSelected === "") {
            //If the status matches the last work history
            if (deviceStatus === document.workHistory[lastItem].deviceStatus) {
              validResults.push(document);
            }
          }
          //If only a tech is given
          else {
            //If the tech matches the last work history
            if (techSelected === document.workHistory[lastItem].technician) {
              validResults.push(document);
            }
          }
        }
      });
      //Set the valid results as the data to be displayed
      setData(validResults);
      setCount("Total Results: " + validResults.length);
    }
    //If search is for all statuses, this is the default option
    else {
      result.data.forEach((document) => {
        //For every history
        document.workHistory.every((history) => {
          let workDate = Moment(history.workDate.slice(0,10), "MM-DD-YYYY").toDate();

          //If within the date range
          if (workDate >= momentDateStart && workDate <= momentDateEnd) {
            //If both a status and tech are given
            if (deviceStatus !== "" && techSelected !== "") {
              //If both fields match the last work history
              if (
                deviceStatus === history.deviceStatus &&
                techSelected === history.technician
              ) {
                validResults.push(document);
                return false; //To prevent duplicate documents being returned
              }
            }
            //If only a status is given
            else if (deviceStatus !== "" && techSelected === "") {
              //If the status matches the last work history
              if (deviceStatus === history.deviceStatus) {
                validResults.push(document);
                return false; //To prevent duplicate documents being returned
              }
            }
            //If only a tech is given
            else {
              //If the tech matches the last work history
              if (techSelected === history.technician) {
                validResults.push(document);
                return false; //To prevent duplicate documents being returned
              }
            }
          }
          return true;
        });
      });
      //Set the valid results as the data to be displayed
      setData(validResults);
      setCount("Total Results: " + validResults.length);
    }
  }

  useEffect(() => {
    if (data !== null && data.length > 0) {
      setDisabled(false);
    }
  }, [data]);

  //Makes sure the start and end date are formatted as "mm/dd/yyyy" and just numbers
  function validateBSForm() {
    let valid = true;
    let startDate = dateStart;
    let endDate = dateEnd;
    let tech = techSelected;
    let status = deviceStatus;
    let dateFormat = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;
    if (startDate === "" || !startDate.match(dateFormat)) {
      valid = false;
      setShow(true);
      setalertTitle("Warning");
      setalertText(
        "Makes sure the start and end date are formatted as 'mm/dd/yyyy' and just numbers"
      );
      setalertIcon("fas fa-exclamation-circle mr-3");
      setalertColor("bg-alert-warning");
      return valid;
    }
    if (endDate === "" || !endDate.match(dateFormat)) {
      valid = false;
      setShow(true);
      setalertTitle("Warning");
      setalertText(
        "Makes sure the start and end date are formatted as 'mm/dd/yyyy' and just numbers"
      );
      setalertIcon("fas fa-exclamation-circle mr-3");
      setalertColor("bg-alert-warning");
      return valid;
    }
    if (tech === "" && status === "") {
      valid = false;
      setShow(true);
      setalertTitle("Warning");
      setalertText("Need to specify a tech or status");
      setalertIcon("fas fa-exclamation-circle mr-3");
      setalertColor("bg-alert-warning");
      return valid;
    }
    return valid;
  }

  useEffect(() => {
    setClassDisabled(disabled ? "btn btn-warning disabled" : "btn btn-warning");
  }, [disabled]);

  /* function handleCSVData () {
    var results = csvData;
    results.forEach((entry) => (
      entry.workHistory = entry.workHistory[entry.workHistory.length - 1].deviceStatus
    ))
    setCSVData(results);
    console.log(results);
  } */

  //var classDisabled =  this.state.disabled ? 'btn btn-warning disabled' : 'btn btn-warning';
  return (
    <div>
      {/* Breadcrumb Header */}
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb bg-secondary">
          <li className="breadcrumb-item text-primary">Company</li>
          <li className="breadcrumb-item text-light active" aria-current="page">
            History Search
          </li>
        </ol>
      </nav>
      {/* Bulk Search Parameters */}
      <div className="card bg-secondary mb-3 border-dark text-white mx-4">
        <div className="card-header bg-dark-title border-bottom border-dark">
          Bulk Search Parameters
        </div>
        <div className="card-body">
          <form>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label>Search Type</label>
                  <div className="input-group input-group-md">
                    <div className="input-group-prepend">
                      <span className="input-group-text bg-dark-title border-dark text-light">
                        <i className="fas fa-search"></i>
                      </span>
                    </div>
                    <select
                      name="searchType"
                      value={searchType}
                      onChange={(event) => {
                        setSearchType(event.target.value);
                      }}
                      className="form-control bg-form-box border-dark text-form-color"
                    >
                      <option>Please Select A Search Type</option>
                      <option>Current Status</option>
                      <option>All Statuses</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <label>Date Start</label>
                  <div className="input-group input-group-md">
                    <div className="input-group-prepend">
                      <span className="input-group-text bg-dark-title border-dark text-light">
                        <i className="fas fa-calendar"></i>
                      </span>
                    </div>
                    <DatePicker
                      name="dateStart"
                      onChange={(event) => {
                        console.log(event);
                        var date = Moment(event).format("MM/DD/YYYY");
                        setDatePickerStart(event);
                        setDateStart(date);
                      }}
                      value={datePickerStart}
                      className="form-control bg-form-box border-dark text-form-color"
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <label>Date End</label>
                  <div className="input-group input-group-md">
                    <div className="input-group-prepend">
                      <span className="input-group-text bg-dark-title border-dark text-light">
                        <i className="fas fa-calendar"></i>
                      </span>
                    </div>
                    <DatePicker
                      name="dateEnd"
                      onChange={(event) => {
                        var date = Moment(event).format("MM/DD/YYYY");
                        setDatePickerEnd(event);
                        setDateEnd(date);
                      }}
                      value={datePickerEnd}
                      className="form-control bg-form-box border-dark text-form-color"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label>Parts Selected</label>
                  <div className="input-group input-group-md">
                    <div className="input-group-prepend">
                      <span className="input-group-text bg-dark-title border-dark text-light">
                        <i className="fas fa-laptop-medical"></i>
                      </span>
                    </div>
                    <Select
                      className="react-select-container"
                      classNamePrefix="react-select"
                      name="partsSelected"
                      placeholder="Filters"
                      value={partsSelected}
                      options={partData}
                      onChange={(option) => {
                        setPartsSelected(option);
                      }}
                      isMulti
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Device Status</label>
                  <div className="input-group input-group-md">
                    <div className="input-group-prepend">
                      <span className="input-group-text bg-dark-title border-dark text-light">
                        <i className="fas fa-laptop-code"></i>
                      </span>
                    </div>
                    <select
                      name="deviceStatus"
                      value={deviceStatus}
                      onChange={(event) => {
                        setDeviceStatus(event.target.value);
                      }}
                      className="form-control bg-form-box border-dark text-form-color"
                    >
                      <option value="">Please Select A Device Status</option>
                      <option value="Checked-In">Checked-In</option>
                      {statusList.map((e) => (
                        <option value={e.value}>{e.label}</option>
                      ))}
                      <option value="Moved To Imaging">Moved To Imaging</option>
                      <option value="Imaged">Imaged</option>
                      <option value="Imaging QC">Imaging QC</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-4">
                <div className="form-group">
                  <label>Model</label>
                  <div className="input-group input-group-md">
                    <div className="input-group-prepend">
                      <span className="input-group-text bg-dark-title border-dark text-light">
                        <i className="fas fa-laptop"></i>
                      </span>
                    </div>
                    <select
                      name="model"
                      value={model}
                      onChange={(event) => {
                        setModel(event.target.value);
                      }}
                      className="form-control bg-form-box border-dark text-form-color"
                    >
                      <option>Please Select A Device Model</option>
                      {modelList.map((e) => (
                        <option value={e.value}>{e.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="col-md-2">
                <div className="form-group">
                  <label>School / Site</label>
                  <div className="input-group input-group-md">
                    <div className="input-group-prepend">
                      <span className="input-group-text bg-dark-title border-dark text-light">
                        <i className="fas fa-school"></i>
                      </span>
                    </div>
                    <select
                      name="school"
                      value={school}
                      onChange={(event) => {
                        setSchool(event.target.value);
                      }}
                      className="form-control bg-form-box border-dark text-form-color"
                    >
                      <option>Please Select A School</option>
                      {schoolList.map((e) => (
                        <option value={e.value}>{e.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label>Technician</label>
                  <div className="input-group input-group-md">
                    <div className="input-group-prepend">
                      <span className="input-group-text bg-dark-title border-dark text-light">
                        <i className="fas fa-user"></i>
                      </span>
                    </div>
                    <CreatableSelect
                      className="react-select-container"
                      classNamePrefix="react-select"
                      name="technician"
                      placeholder="Name@something.net"
                      value={technician}
                      options={techs}
                      onChange={(option) => {
                        setTechnician(option);
                        setTechSelected(option.value);
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-2">
                <div className="form-group">
                  <label>Teacher</label>
                  <div className="input-group input-group-md">
                    <div className="input-group-prepend">
                      <span className="input-group-text bg-dark-title border-dark text-light">
                        <i className="fas fa-user"></i>
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
                      <option value="">Please Select a value</option>
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-4">
                <div className="form-group">
                  <label>Asset Tag</label>
                  <div className="input-group input-group-md">
                    <div className="input-group-prepend">
                      <span className="input-group-text bg-dark-title border-dark text-light">
                        <i className="fas fa-tag "></i>
                      </span>
                    </div>
                    <input
                      name="asset"
                      value={asset}
                      onChange={(event) => {
                        setAsset(event.target.value);
                      }}
                      type="text"
                      className="form-control bg-form-box border-dark text-form-color"
                      placeholder="Asset Tag Number"
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label>Service Tag</label>
                  <div className="input-group input-group-md">
                    <div className="input-group-prepend">
                      <span className="input-group-text bg-dark-title border-dark text-light">
                        <i className="fas fa-tags fa-flip-horizontal"></i>
                      </span>
                    </div>
                    <input
                      name="service"
                      value={service}
                      onChange={(event) => {
                        setService(event.target.value);
                      }}
                      type="text"
                      className="form-control bg-form-box border-dark text-form-color"
                      placeholder="Service Tag Number"
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-4">
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
                      value={kbox}
                      onChange={(event) => {
                        setKbox(event.target.value);
                      }}
                      type="text"
                      className="form-control bg-form-box border-dark text-form-color"
                      placeholder="K-box Ticket Number"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={search}
              type="button"
              className="btn btn-primary mr-2"
            >
              Search
            </button>
            <button
              onClick={resetTextFields}
              type="button"
              className="btn btn-danger mr-2"
            >
              Reset
            </button>
            <CSVLink
              data={data}
              disabled={disabled}
              filename={"HistorySearch_" + dateStart + "-" + dateEnd + ".csv"}
              className={classDisabled}
              target="_blank"
            >
              Export To CSV
            </CSVLink>
          </form>
        </div>
      </div>
      <BulkSearchResults data={data} count={count} />
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
