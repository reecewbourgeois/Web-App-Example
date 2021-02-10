import React, { useEffect, useState } from "react";
import Moment from "moment";
import AssetList from "./asset-list.component";
import Axios from "axios";
import schools from "../school-list.json";
import AlertModal from "../alert-modal/alert-modal.component";

export default function BatchChange(props) {
  //Initializing variables and setState functions
  const [assetGroup, setAssetGroup] = useState([]);
  const [assetCheck, setAssetCheck] = useState([]);
  const [itemList, setItemList] = useState({
    asset: "",
    key: "",
  });
  const [deviceStatus, setDeviceStatus] = useState("");
  const technician = props.account;
  const [workDate, setWorkDate] = useState(
    Moment().format("MM/DD/YYYY, HH:mm")
  );
  const [notes, setNotes] = useState("");
  const [school, setSchool] = useState("");
  const schoolList = schools;
  const [disabled, setDisabled] = useState(true);
  const [show, setShow] = useState(false);
  const [alertIcon, setalertIcon] = useState("");
  const [alertTitle, setalertTitle] = useState("");
  const [alertText, setalertText] = useState("");
  const [alertColor, setalertColor] = useState("");
  const handleClose = () => setShow(false);
  const [assetGroupEmail,setAssetGroupEmail] = useState([]);

  //Add a status to the given group of asset tags
  function batchStatusChange() {
    if (deviceStatus === "Select Status" || deviceStatus === "") {
      setShow(true);
      setalertTitle("Warning");
      setalertText("Please select a status");
      setalertIcon("fas fa-exclamation-circle mr-3");
      setalertColor("bg-alert-warning");
    } else {
      Axios.post("/api/batchStatusChange/batchStatusChange", {
        assetGroup: assetGroup,
        deviceStatus: deviceStatus,
        technician: technician,
        date: workDate,
        notes: notes,
        school: school,
      }).then((response) => {
        if (response.data.status === 200) {
          setShow(true);
          setalertTitle("Success");
          setalertText("Status Added to Asset Tag(s)");
          setalertIcon("fas fa-check mr-3");
          setalertColor("bg-alert-success");
          handleResetButton();
        } else {
          setShow(true);
          setalertTitle("Error");
          setalertText(
            "Some devices enountered an error: " + response.data.assets + "\nPlease make sure all of these devices are checked in and the asset tags are correct"
          );
          setalertIcon("fas fa-exclamation-triangle mr-3");
          setalertColor("bg-alert-error");
          /* //Email the devs about the error
          Axios.post("/api/emailErrorReport", {
            page: "Batch Status Change",
            message:
              "The error occurred at the batchStatusChange route.\n\nThe information:" +
              "\n  trouble devices: " +
              response.data.assets +
              "\n  technician: " +
              technician,
          }); */
          handleResetButton();
        }
      });
    }
  }

  //Allows for the enter key to be registered as a click for the 'Search' button
  function allowEnterKeyToBeUsed(event) {
    if (event.which === 13) {
      handleAdd(event);
    }
  }

  //Change everything default value
  function handleResetButton() {
    setAssetGroup([]);
    setAssetCheck([]);
    setItemList({
      asset: "",
      key: "",
    });
    setDeviceStatus("");
    setNotes("");
    setSchool("");
    setDisabled(true);
    setAssetGroupEmail([]);
  }

  //Adds the inputed asset to a itemList group and then adds the date as a key value
  function handleInput(event) {
    const input = event.target.value;
    const list = { asset: input, key: Date.now() };
    setItemList(list);
  }

  //Handles when the status is changed
  function handlestatusChange(event) {
    if (event.target.value === "Ready For Shipment") {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
    setDeviceStatus(event.target.value);
  }

  //Adds the asset tag to the list
  function handleAdd(event) {
    event.preventDefault();

    if (itemList.asset !== "" && assetCheck.includes(itemList.asset) !== true) {
      setAssetCheck([...assetCheck, itemList.asset]);
      setItemList({ asset: "", key: "" });
      setAssetGroup([...assetGroup, itemList]);
      setAssetGroupEmail([...assetGroupEmail, itemList.asset]);
    } else {
      setItemList({ asset: "", key: "" });
    }
  }

  //Deletes the asset from the list
  function handleDelete(key, asset) {
    const filteredItems = assetGroup.filter((item) => {
      return item.key !== key;
    });

    const filteredAsset = [...assetCheck];
    var index = filteredAsset.indexOf(asset);
    if (index !== -1) {
      filteredAsset.splice(index, 1);
      setAssetCheck(filteredAsset);
    }
    setAssetGroup(filteredItems);
  }

  //Update date and time constantly
  useEffect(() => {
    setInterval(() => {
      setWorkDate(Moment().format("MM/DD/YYYY, HH:mm"));
    }, 10000);
  });

  return (
    <div>
      {/* Breadcrumb Header  */}
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb bg-secondary">
          <li className="breadcrumb-item text-primary">Company</li>
          <li className="breadcrumb-item text-light active" aria-current="page">
            Batch Status Add
          </li>
        </ol>
      </nav>

      {/* Batch Status Parameters */}
      <div className="card bg-secondary mb-3 border-dark text-white mx-4">
        <div className="card-header bg-dark-title border-bottom border-dark">
          Batch Status Parameters
        </div>
        <div className="card-body">
          <form>
            <div className="row mb-2">
              <div className="col-md-3">
                <input
                  name="asset"
                  className="form-control text-uppercase"
                  type="text"
                  placeholder="Asset Tag"
                  maxLength={9}
                  value={itemList.asset.toUpperCase()}
                  onChange={handleInput}
                  onKeyPress={allowEnterKeyToBeUsed}
                />
              </div>
              <div className="col-md-2">
                <button
                  className="btn btn-primary px-5 my-2 my-sm-0"
                  type="button"
                  onClick={handleAdd}
                >
                  Add
                </button>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <div className="input-group input-group-md">
                    <div className="input-group-prepend">
                      <span className="input-group-text bg-dark-title border-dark text-light">
                        <i className="fas fa-user"></i>
                      </span>
                    </div>
                    <p className="form-control bg-form-box border-dark text-form-color">
                      {technician}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="row mb-2">
              <div className="col-md-12">
                <label>Asset Tag Group</label>
                <AssetList item={assetGroup} handleDelete={handleDelete} />
              </div>
            </div>
            <div className="row">
              <div className="col-md-4">
                <div className="form-group">
                  <label>Device Status</label>
                  <div className="input-group input-group-md">
                    <div className="input-group-prepend">
                      <span className="input-group-text bg-dark-title border-dark text-light">
                        <i className="fas fa-laptop"></i>
                      </span>
                    </div>
                    <select
                      name="deviceStatus"
                      value={deviceStatus}
                      onChange={handlestatusChange}
                      className="form-control bg-form-box border-dark text-form-color"
                    >
                      <option defaultValue="">Select Status</option>
                      <option value="Quality Tested">Quality Tested</option>
                      <option value="Moved To Imaging">Moved To Imaging</option>
                      <option value="Imaged">Imaged</option>
                      <option value="Imaging QC">Imaging QC</option>
                      <option value="Ready For Shipment">
                        Ready For Shipment
                      </option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
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
                    disabled={disabled}
                  >
                    <option defaultValue=""> Select a school if needed</option>
                    {schoolList.map((e) => (
                      <option value={e.value}>{e.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label>Work Date</label>
                  <div className="input-group input-group-md">
                    <div className="input-group-prepend">
                      <span className="input-group-text bg-dark-title border-dark text-light">
                        <i className="fas fa-calendar"></i>
                      </span>
                    </div>
                    <h1 className="form-control bg-form-box border-dark text-form-color">
                      <span id="datetime">{workDate}</span>
                    </h1>
                  </div>
                </div>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-12">
                <label>Check In Notes</label>
                <div className="input-group input-group-md">
                  <div className="input-group-prepend">
                    <span className="input-group-text bg-dark-title border-dark text-light">
                      <i className="fas fa-list"></i>
                    </span>
                  </div>
                  <textarea
                    name="notes"
                    className="form-control bg-form-box border-dark text-form-color"
                    rows="3"
                    value={notes}
                    onChange={(event) => {
                      setNotes(event.target.value);
                    }}
                  ></textarea>
                </div>
              </div>
            </div>

            <button
              onClick={batchStatusChange}
              type="button"
              className="btn btn-primary mr-2"
            >
              Submit
            </button>
            <button
              onClick={handleResetButton}
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

