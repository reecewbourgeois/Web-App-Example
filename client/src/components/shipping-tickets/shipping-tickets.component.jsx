import React, { useState, useEffect } from "react";
import ShippingTicketResults from "./shipping-tickets-results.component";
import routeList from "./Shipping-Tickets-Data.json";
import schoolList from "../school-list.json";
import { CSVLink } from "react-csv";
import Axios from "axios";
import Moment from "moment";
import Select from "react-select";
import DatePicker from "react-date-picker";
import AlertModal from "../alert-modal/alert-modal.component";

export default function ShippingTickets(props) {
  const options = routeList.concat(schoolList);
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState(Moment().format("MM/DD/YYYY"));
  const [endDate, setEndDate] = useState(Moment().format("MM/DD/YYYY"));
  const [datePickerStart, setDatePickerStart] = useState(new Date());
  const [datePickerEnd, setDatePickerEnd] = useState(new Date());
  const [disabled, setDisabled] = useState(true);
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [count, setCount] = useState("");
  const [assets, setAssets] = useState([]);
  const [schoolsSelected, setSchoolsSelected] = useState([]);
  const [classDisabled, setClassDisabled] = useState("");
  const [show, setShow] = useState(false);
  const [alertIcon, setalertIcon] = useState("");
  const [alertTitle, setalertTitle] = useState("");
  const [alertText, setalertText] = useState("");
  const [alertColor, setalertColor] = useState("");
  const handleClose = () => setShow(false);

  //Change everyhing to default value
  function handleResetButton() {
    setData([]);
    setStartDate(Moment().format("MM/DD/YYYY"));
    setEndDate("");
    setDatePickerStart(new Date());
    setDatePickerEnd(new Date());
    setDisabled(true);
    setSubmitDisabled(true);
    setCount("");
    setAssets([]);
    setSchoolsSelected([]);
  }

  useEffect(() => {
    setClassDisabled(disabled ? "btn btn-warning disabled" : "btn btn-warning");
  }, [disabled]);

  //Handles the start date changing
  function handleDateStartChange(event) {
    var date = Moment(event).format("MM/DD/YYYY");
    setDatePickerStart(event);
    setStartDate(date);
  }

  //Handles the end date changing
  function handleDateEndChange(event) {
    var date = Moment(event).format("MM/DD/YYYY");
    setDatePickerEnd(event);
    setEndDate(date);
  }

  //Change value of school selection
  function handleMultiChange(option) {
    if (option === null || option === []) {
      option = [];
      setSchoolsSelected([]);
    } else {
      setSchoolsSelected(option);
    }
  }

  //Check for routes in the schoolSelected list
  function handleRouteCheck() {
    if (schoolsSelected !== null || schoolsSelected.length !== 0) {
      schoolsSelected.forEach((item) => {
        if (item.value === "Monday Route") {
          const schools = Array.from(schoolsSelected);
          const index = schools.findIndex((x) => x.value === item.value);
          schools.splice(index, 1);
          setSchoolsSelected([
            ...schools,
            { value: "DVP", label: "DVP" },
            { value: "SBO", label: "SBO" },
            { value: "AHS", label: "AHS" },
            { value: "DHS", label: "DHS" },
            { value: "LOM", label: "LOM" },
            { value: "LOE", label: "LOE" },
            { value: "APL", label: "APL" },
            { value: "ADA", label: "ADA" }
          ]);
        } else if (item.value === "Tuesday Route") {
          const schools = Array.from(schoolsSelected);
          const index = schools.findIndex((x) => x.value === item.value);
          schools.splice(index, 1);
          setSchoolsSelected([
            ...schools,
            { value: "ECO", label: "ECO" },
            { value: "GOM", label: "GOM" },
            { value: "RVT", label: "RVT" },
            { value: "PGP", label: "PGP" },
            { value: "EAH", label: "EAH" },
            { value: "LSS", label: "LSS" },
            { value: "GOP", label: "GOP" },
            { value: "GWC", label: "GWC" },
            { value: "CEP", label: "CEP" },
            { value: "CEM", label: "CEM" },
          ]);
        } else if (item.value === "Wednesday Route") {
          const schools = Array.from(schoolsSelected);
          const index = schools.findIndex((x) => x.value === item.value);
          schools.splice(index, 1);
          setSchoolsSelected([
            ...schools,
            { value: "SLP", label: "SLP" },
            { value: "BLM", label: "BLM" },
            { value: "DTH", label: "DTH" },
            { value: "DTP", label: "DTP" },
            { value: "DTM", label: "DTM" },
            { value: "DUP", label: "DUP" },
            { value: "BRP", label: "BRP" },
            { value: "BUP", label: "BUP" },
            { value: "OGP", label: "OGP" },
          ]);
        } else if (item.value === "Thursday Route") {
          const schools = Array.from(schoolsSelected);
          const index = schools.findIndex((x) => x.value === item.value);
          schools.splice(index, 1);
          setSchoolsSelected([
            ...schools,
            { value: "PVM", label: "PVM" },
            { value: "PVP", label: "PVP" },
            { value: "GAM", label: "GAM" },
            { value: "GAP", label: "GAP" },
            { value: "LSP", label: "LSP" },
            { value: "LES", label: "LES" },
            { value: "SAH", label: "SAH" },
            { value: "SAM", label: "SAM" },
            { value: "SAP", label: "SAP" },
            { value: "SOP", label: "SOP" },
          ]);
        }
      });
    }
  }

  //Makes sure the start and end date are formatted as "mm/dd/yyyy" and just numbers
  function validateSTForm() {
    let valid = true;
    let dateFormat = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;
    if (startDate === "" || !startDate.match(dateFormat)) {
      valid = false;
      setShow(true);
      setalertTitle("Warning");
      setalertText("Make sure the start and end date are formatted as 'mm/dd/yyyy' and just numbers");
      setalertIcon("fas fa-exclamation-circle mr-3");
      setalertColor("bg-alert-warning");
      return valid;
    }
    if (endDate === "" || !endDate.match(dateFormat)) {
      valid = false;
      setShow(true);
      setalertTitle("Warning");
      setalertText("Make sure the start and end date are formatted as 'mm/dd/yyyy' and just numbers");
      setalertIcon("fas fa-exclamation-circle mr-3");
      setalertColor("bg-alert-warning");
      return valid;
    }
    return valid;
  }

  //Searches for values given the parameters
  function handleSearchButton() {
    handleRouteCheck();
    Axios.post("/api/shippingTickets/shippingTickets", {
      dateStart: startDate,
      dateEnd: endDate,
      school: schoolsSelected,
    }).then((result) => {
      if (validateSTForm() === true) {
        let assetArray = [];
        result.data.forEach((doc) => {
          if (assetArray.includes(doc.asset) !== true) {
            assetArray = [...assetArray, doc.asset];
          }
        });
        setAssets(assetArray);
        setData(result.data);
        setCount("Total Results: " + result.data.length);
        setDisabled(false);
      }
    });
  }

  //Enables the submit button
  function handlesubmitButtonCheck() {
    setSubmitDisabled(false);
    return false;
  }

  //Will submit the updated statuses for Ready For Shipment devices in given parameters
  function handleSubmitButton() {
    console.log(assets);
    if (validateSTForm() === true) {
      Axios.post("/api/shippingTickets/shippingTickets/setStatus", {
        assets: assets,
        date: Moment().format("MM/DD/YYYY, HH:mm"),
        technician: props.account,
      }).then((response) => {
        if (response.data.status === 200) {
          setShow(true);
          setalertTitle("Success");
          setalertText("Devices have been marked 'Shipped - Completed'");
          setalertIcon("fas fa-check mr-3");
          setalertColor("bg-alert-success");
          window.location.reload();
        } else {
          setShow(true);
          setalertTitle("Error");
          setalertText(
            "An error has occurred. Some documents may not have been marked. Please notify a dev."
          );
          setalertIcon("fas fa-exclamation-triangle mr-3");
          setalertColor("bg-alert-error");
          //Email the devs about the error
          Axios.post("/api/emailErrorReport", {
            page: "Shipping Tickets",
            message:
              "The error occurred at the shippingTickets/setStatus route.\n\nThe information:" +
              "\n  assets: " +
              assets +
              "\n  date: " +
              Moment().format("MM/DD/YYYY, HH:mm") +
              "\n  technician: " +
              props.account,
          });
        }
      });
    }
  }

  return (
    <div>
      {/* Breadcrumb Header */}
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb bg-secondary">
          <li className="breadcrumb-item text-primary">Company</li>
          <li className="breadcrumb-item text-light active" aria-current="page">
            Shipping Tickets
          </li>
        </ol>
      </nav>
      {/* Bulk Search Parameters */}
      <div className="card bg-secondary mb-3 border-dark text-white mx-4">
        <div className="card-header bg-dark-title border-bottom border-dark">
          Parameters
        </div>
        <div className="card-body">
          <form>
            <div className="row">
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
                      onChange={handleDateStartChange}
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
                      onChange={handleDateEndChange}
                      value={datePickerEnd}
                      className="form-control bg-form-box border-dark text-form-color"
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label>School / Site</label>
                  <div className="input-group input-group-md">
                    <div className="input-group-prepend">
                      <span className="input-group-text bg-dark-title border-dark text-light">
                        <i className="fas fa-school"></i>
                      </span>
                    </div>
                    <Select
                      className="react-select-container"
                      classNamePrefix="react-select"
                      name="schoolsSelected"
                      placeholder="Filters"
                      value={schoolsSelected}
                      options={options}
                      onChange={handleMultiChange}
                      isMulti
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleSearchButton}
              type="button"
              className="btn btn-primary mr-2"
            >
              Search
            </button>
            <button
              onClick={handleResetButton}
              type="button"
              className="btn btn-danger mr-2"
            >
              Reset
            </button>
            <button
              onClick={handleSubmitButton}
              disabled={submitDisabled}
              type="button"
              className="btn btn-success mr-2"
            >
              Submit
            </button>
            <CSVLink
              data={data}
              onClick={() => {
                handlesubmitButtonCheck();
              }}
              disabled={disabled}
              filename={"ShippingTickets_" + startDate + "-" + endDate + ".csv"}
              className={classDisabled}
              target="_blank"
            >
              Export To CSV
            </CSVLink>
          </form>
        </div>
      </div>
      <ShippingTicketResults data={data} count={count} />
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
