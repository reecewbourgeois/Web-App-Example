import React, { useEffect, useState } from "react";
import AlertModal from "../alert-modal/alert-modal.component";
import { Pie } from "react-chartjs-2";
import initialChart from "./initialchart.json";
import techList from "../technician-list.json";
import Axios from "axios";
import DatePicker from "react-date-picker";
import Moment from "moment";

//This needs to be on two lines for some odd reason.
const techlist = techList;
techlist.splice(0, 1);

export default function Statistics() {
  const [listItems, setListItems] = useState("");
  const [dateStart, setDateStart] = useState(Moment().format("MM/DD/YYYY"));
  const [dateEnd, setDateEnd] = useState(Moment().format("MM/DD/YYYY"));
  const [datePickerStart, setDatePickerStart] = useState(new Date());
  const [datePickerEnd, setDatePickerEnd] = useState(new Date());
  const [filterType, setFilterType] = useState("");
  const [title, setTitle] = useState("");
  const [chartData, setChartData] = useState(initialChart[0]);
  const [techCounts, setTechCounts] = useState([]);
  const [selectedTechData, setSelectedTechData] = useState([]);
  const [selectedTech, setSelectedTech] = useState("");
  const [technicianList, setTechnicianList] = useState([]);
  const [show, setShow] = useState(false);
  const [alertIcon, setalertIcon] = useState("");
  const [alertTitle, setalertTitle] = useState("");
  const [alertText, setalertText] = useState("");
  const [alertColor, setalertColor] = useState("");
  const handleClose = () => setShow(false);

  //Changes the start date
  function handleDateStartChange(event) {
    var date = Moment(event).format("MM/DD/YYYY");
    setDatePickerStart(event);
    setDateStart(date);
  }

  //Changes the end date
  function handleDateEndChange(event) {
    var date = Moment(event).format("MM/DD/YYYY");
    setDatePickerEnd(event);
    setDateEnd(date);
  }

  //Makes sure the start and end date are formatted as "mm/dd/yyyy" and just numbers
  function validateDate() {
    let valid = true;
    let dateFormat = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;
    if (dateStart === "" || !dateStart.match(dateFormat)) {
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
    if (dateEnd === "" || !dateEnd.match(dateFormat)) {
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
    return valid;
  }

  //Searches data
  async function handleSearch() {
    if (
      filterType !== "" &&
      filterType === "Imaging" &&
      validateDate() === true
    ) {
      //This is the Axios call that grabs the info
      let data = await Axios.post("/api/statisticsPage/Imaging", {
        dateStart: dateStart,
        dateEnd: dateEnd,
      });

      // Get data from the axios call
      var statusType = [];
      var statusCount = [];
      if (data.data !== null) {
        data.data.statusCounts.forEach((element) => {
          statusType.push(element.status);
          statusCount.push(element.count);
        });
        var statusData = [
          {
            labels: statusType,
            datasets: [
              {
                label: "Imaging",
                backgroundColor: [
                  "#dc3545",
                  "#fd7e14",
                  "#ffc107",
                  "#28a745",
                  "#20c997",
                  "#007bff",
                  "#6610f2",
                ],
                hoverBackgroundColor: [
                  "#981b27",
                  "#b15102",
                  "#b38600",
                  "#19672b",
                  "#158463",
                  "#004a99",
                  "#4709aa",
                ],
                borderColor: "#3a4149",
                data: statusCount,
              },
            ],
          },
        ];
      }

      setTitle(filterType);
      setChartData(statusData[0]);
      setTechCounts(data.data.techCounts);
      setSelectedTechData(data.data.techCounts[0].stats);
      setTechnicianList(techlist);
    } else if (
      filterType !== "" &&
      filterType === "Dell Repair" &&
      validateDate() === true
    ) {
      //This is the Axios call that grabs the info
      let data = await Axios.post("/api/statisticsPage/Dell", {
        dateStart: dateStart,
        dateEnd: dateEnd,
      });

      //Insert parts list into database
      statusType = [];
      statusCount = [];
      if (data.data !== null) {
        data.data.statusCounts.forEach((element) => {
          statusType.push(element.status);
          statusCount.push(element.count);
        });

        statusData = [
          {
            labels: statusType,
            datasets: [
              {
                label: "DellRepair",
                backgroundColor: [
                  "#dc3545",
                  "#fd7e14",
                  "#ffc107",
                  "#28a745",
                  "#20c997",
                  "#007bff",
                  "#6610f2",
                ],
                hoverBackgroundColor: [
                  "#981b27",
                  "#b15102",
                  "#b38600",
                  "#19672b",
                  "#158463",
                  "#004a99",
                  "#4709aa",
                ],
                borderColor: "#3a4149",
                data: statusCount,
              },
            ],
          },
        ];
      }

      setTitle(filterType);
      setChartData(statusData[0]);
      setTechCounts(data.data.techCounts);
      setSelectedTechData(data.data.techCounts[0].stats);
      setTechnicianList(techlist);
    }
  }

  //Resets data to default values
  function handleReset() {
    setDateStart(Moment().format("MM/DD/YYYY"));
    setDateEnd(Moment().format("MM/DD/YYYY"));
    setFilterType("");
    setTitle("");
    setDatePickerStart(new Date());
    setDatePickerEnd(new Date());
    setChartData(initialChart[0]);
    setTechCounts([]);
    setListItems("");
    setTechnicianList([]);
  }

  //Lets you select a tech
  function handleSelectedTech(index) {
    setSelectedTechData(techCounts[index].stats);
    setSelectedTech(techCounts[index].technician);
    setTechnicianList(techlist);
  }

  //Defines the color of the status
  function handleCountBadge(count) {
    const prefix = "text-white float-right badge badge-pill badge-";

    if (count > 0) {
      return prefix + "primary";
    } else {
      return prefix + "danger";
    }
  }

  useEffect(() => {
    if (chartData.datasets[0].data.length !== 0) {
      setListItems(
        chartData.labels.map((value, index) => (
          <li className="list-group-item d-flex justify-content-between align-items-center bg-transparent">
            {value}
            <span className="badge badge-primary badge-pill">
              {chartData.datasets[0].data[index]}
            </span>
          </li>
        ))
      );
    }
  }, [chartData.datasets, chartData.labels]);

  return (
    <div>
      {/* Breadcrumb Header */}
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb bg-secondary">
          <li className="breadcrumb-item text-primary">Company</li>
          <li className="breadcrumb-item text-light active" aria-current="page">
            Statistics
          </li>
        </ol>
      </nav>
      {/* Statistics Search Parameters */}
      <div className="card bg-secondary mb-3 border-dark text-white mx-4">
        <div className="card-header bg-dark-title border-bottom border-dark">
          Statistics Search Parameters
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
                      value={filterType}
                      onChange={(event) => {
                        setFilterType(event.target.value);
                      }}
                      name="filterType"
                      className="form-control bg-form-box border-dark text-form-color"
                    >
                      <option value="">Please Select A Search Type</option>
                      <option value="Imaging">Imaging</option>
                      <option value="Dell Repair">Dell Repair</option>
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
            </div>

            <button
              type="button"
              className="btn btn-primary mr-2"
              onClick={handleSearch}
            >
              Search
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleReset}
            >
              Reset
            </button>
          </form>
        </div>
      </div>
      <div className="card bg-secondary mb-3 border-dark text-white mx-4">
        <div className="card-header bg-dark-title border-bottom border-dark">
          Results
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <Pie
                data={chartData}
                options={{
                  title: {
                    display: true,
                    text: title,
                    fontSize: 20,
                    fontColor: "#ffffff",
                  },
                  legend: {
                    display: true,
                    position: "bottom",
                    labels: {
                      fontColor: "#ffffff",
                    },
                  },
                }}
              />
            </div>

            <div className="col-md-6">
              <ul className="list-group list-group-flush">{listItems}</ul>
            </div>
          </div>
        </div>
      </div>
      <div className="card bg-secondary mb-3 border-dark text-white mx-4">
        <div className="card-header bg-dark-title border-bottom border-dark">
          Results By Person
        </div>
        <div className="card-body float-none">
          <div className="card-group">
            <div className="card w-25 bg-dark float-left border-left-0 border-right-0 border-bottom-0">
              <div className="card-header bg-dark h6">Technician List</div>
              <div className="card-body bg-secondary">
                <h5 class="card-title">Please Select A Technician</h5>
                <ul className="bg-form-box text-white list-group list-group-tech">
                  {technicianList.map((tech, index) => (
                    <li
                      key={index}
                      className="list-group-item bg-dark-title list-hover"
                      onClick={() => handleSelectedTech(index)}
                    >
                      {tech.label}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="card w-75 bg-dark float-right border-left-0 border-right-0 border-bottom-0">
              <div className="card-header bg-dark h6">Results</div>
              <div className="card-body bg-secondary">
                <h5 class="card-title">{selectedTech}</h5>
                <ul className="text-white list-group list-group-flush">
                  {selectedTechData.map((tech, index) => (
                    <li className="list-group-item bg-transparent text-left">
                      {tech.status}
                      <span class={handleCountBadge(tech.count)}>
                        {tech.count}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
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
