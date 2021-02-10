import React, { useEffect, useState } from "react";
import Select from "react-select";
import Axios from "axios";
import Moment from "moment";
import DatePicker from "react-date-picker";
import "bootstrap/dist/css/bootstrap.min.css";
import TicketingTableEntry from "./ticketingTableEntry.component";
import CommentTableEntry from "./commentTableEntry.component";
import AlertModal from "../alert-modal/alert-modal.component";
import techList from "../technician-list.json";

export default function Tickets(props) {
  const [ticketData, setTicketData] = useState([]);
  const [ticketListType, setTicketListType] = useState("");
  const [ticketNumber, setTicketNumber] = useState(0);
  const [searchField, setSearchField] = useState("");
  const [techName, setTechName] = useState(props.account);
  const [selectedTicket, setSelectedTicket] = useState([]);
  const [selectedTicketNumber, setSelectedTicketNumber] = useState(0);
  const [selectedAssignees, setSelectedAssignees] = useState([]);
  const [ticketTitle, setTicketTitle] = useState("");
  const [ticketDescription, setTicketDescription] = useState("");
  const [ticketAssigned, setTicketAssigned] = useState([]);
  const [ticketPriority, setTicketPriority] = useState("Low");
  const [ticketDueDate, setTicketDueDate] = useState(new Date());
  const [dateDue, setDateDue] = useState(Moment().format("MM/DD/YYYY"));
  const [commentStatus, setCommentStatus] = useState("In Progress");
  const [comment, setComment] = useState("");
  const [commentDate, setCommentDate] = useState(
    Moment().format("MM/DD/YYYY, HH:mm")
  );
  const [ticketCount, setTicketCount] = useState("");
  const [filteredSearchList, setFilteredSearchList] = useState([]);
  const [ticketDetails, setTicketDetails] = useState("");
  const [commentSection, setCommentSection] = useState("");
  const [test, setTest] = useState("");
  const [show, setShow] = useState(false);
  const [alertIcon, setalertIcon] = useState("");
  const [alertTitle, setalertTitle] = useState("");
  const [alertText, setalertText] = useState("");
  const [alertColor, setalertColor] = useState("");
  const handleClose = () => setShow(false);

  // Adds new comment to selected ticket
  function addNewComment() {
    Axios.post("/api/ticketingSystem/addNewComment", {
      ticketNumber: selectedTicket.ticketNumber,
      author: techName,
      date: commentDate,
      status: commentStatus,
      summary: comment,
    }).then((response) => {
      if (response.data.status === 200) {
        setShow(true);
        setalertTitle("Success");
        setalertText("New comment has been successfully added");
        setalertIcon("fas fa-check mr-3");
        setalertColor("bg-alert-success");
        handleGetTickets();
        handleCommentModalReset();
      } else {
        setShow(true);
        setalertTitle("Error");
        setalertText(
          "Something went wrong. Your comment may not have gone through"
        );
        setalertIcon("fas fa-exclamation-triangle mr-3");
        setalertColor("bg-alert-error");
        //Email the devs about the error
        Axios.post("/api/emailErrorReport", {
          page: "Ticketing System",
          message:
            "The error occurred at the addNewComment route.\n\nThe information:\n  ticketNumber: " +
            selectedTicket.ticketNumber +
            "\n  author: " +
            techName +
            "\n  date: " +
            commentDate +
            "\n  status: " +
            commentStatus +
            "\n  summary: " +
            comment,
        });
        handleGetTickets();
        handleCommentModalReset();
      }
    });
  }

  //Change value of assigned people
  function handleMultiChange(option) {
    if (option === null) {
      setTicketAssigned([]);
    } else {
      setTicketAssigned(option);
    }
  }

  //Change value of assigned people
  function handleSelectedMultiChange(option) {
    if (option === null) {
      setSelectedAssignees([]);
    } else {
      setSelectedAssignees(option);
    }
  }

  //Edits a ticket
  function handleEditTicket() {
    let assignees = [];
    if (selectedAssignees !== null) {
      selectedAssignees.forEach((person) => {
        assignees.push(person.value);
      });
    }
    Axios.post("/api/ticketingSystem/editTicket", {
      ticketNumber: selectedTicket.ticketNumber,
      assignees: assignees,
    }).then((response) => {
      if (response.data.status === 200) {
        handleGetTickets();
        setShow(true);
        setalertTitle("Success");
        setalertText("Assignees have been successfully added/deleted");
        setalertIcon("fas fa-check mr-3");
        setalertColor("bg-alert-success");
      } else {
        setShow(true);
        setalertTitle("Error");
        setalertText(
          "Something went wrong. Your comment may not have gone through"
        );
        setalertIcon("fas fa-exclamation-triangle mr-3");
        setalertColor("bg-alert-error");
        //Email the devs about the error
        Axios.post("/api/emailErrorReport", {
          page: "Ticketing System",
          message:
            "The error occurred at the editTicket route.\n\nThe information:\n  ticketNumber: " +
            selectedTicket.ticketNumber +
            "\n  assignees: " +
            assignees,
        });
        handleGetTickets();
      }
    });
  }

  //Handles a click in the table for the state value
  function handleTableClick(ticket) {
    //set state of multivalue with existing device parts
    let techs = [];
    techList.forEach((element) => {
      ticket.assignees.forEach((tech) => {
        if (element.value === tech) {
          techs.push(element);
        }
      });
    });

    setSelectedTicket(ticket);
    setSelectedTicketNumber(ticket.ticketNumber);
    setSelectedAssignees(techs);
  }

  //Defines the color for the priority
  function handlePriorityLevel(priority) {
    const prefix = "fas fa-circle mr-2 text-";

    // eslint-disable-next-line default-case
    switch (priority) {
      case "Low":
        return prefix + "warning";
      case "Medium":
        return prefix + "orange";
      case "High":
        return prefix + "danger";
    }
  }

  //Defines the color of the status
  function handleStatusLevel(status) {
    const prefix = "bg-";

    // eslint-disable-next-line default-case
    switch (status) {
      case "Completed":
        return prefix + "success";
      case "In Progress":
        return prefix + "info";
      case "Not Started":
        return prefix + "dark";
    }
  }

  //Gets the list of tickets
  function handleGetTickets() {
    Axios.get("/api/ticketingSystem/ticketingSystem").then((result) => {
      if (result.status === 200) {
        setTicketData(result.data.documents);
        setTicketNumber(result.data.ticketNumber);
      } else {
        //Email the devs about the error
        Axios.post("/api/emailErrorReport", {
          page: "Ticketing System",
          message:
            "The error occurred at the ticketingSystem route. It didn't return any information so it is most likely an internet error.",
        });
      }
    });
  }

  //On initial load gets tickets and refreshes comment date and refreshes the last ticket number
  useEffect(() => {
    Axios.get("/api/ticketingSystem/ticketingSystem").then((result) => {
      if (result.status === 200) {
        setTicketData(result.data.documents);
        setTicketNumber(result.data.ticketNumber);
      } else {
        //Email the devs about the error
        Axios.post("/api/emailErrorReport", {
          page: "Ticketing System",
          message:
            "The error occurred at the ticketingSystem route. It didn't return any information so it is most likely an internet error.",
        });
      }
    });

    setInterval(() => {
      setCommentDate(Moment().format("MM/DD/YYYY, HH:mm"));
      Axios.get("/api/ticketingSystem/ticketingSystem/getTicketNumber").then(
        (result) => {
          setTicketNumber(result.data.ticketNumber);
        }
      );
    }, 5000);
  }, []);

  //Submits new ticket
  function handleSubmitTicket() {
    if (validateNewTicket() === true) {
      //Inserts assignees into the database
      var assignees = [];
      ticketAssigned.forEach((element) => {
        if (element.value !== "") {
          assignees.push(element.value);
        }
      });

      //Adds new ticket to the system
      //This gets a little messy due to error handling
      Axios.post("/api/ticketingSystem/addNewTicket", {
        ticketNumber: ticketNumber,
        priority: ticketPriority,
        title: ticketTitle,
        dueDate: dateDue,
        creator: techName,
        assignees: assignees,
        description: ticketDescription,
        author: techName,
        status: "Not Started",
        summary: ticketDescription,
        date: commentDate,
      }).then((response) => {
        if (response.data.status === 200) {
          //Per TJs request, the creator is also sent an email
          if (!assignees.includes(techName)) {
            assignees.push(techName);
          }

          //Send an email to assignees and the creator
          Axios.post("/api/ticketingSystem/email", {
            assignees: assignees,
            creator: techName,
            description: ticketDescription,
            dueDate: dateDue,
            priority: ticketPriority,
            title: ticketTitle,
          }).then((response) => {
            if (response.data.status === 200) {
              setShow(true);
              setalertTitle("Success");
              setalertText("New Ticket has been successfully added");
              setalertIcon("fas fa-check mr-3");
              setalertColor("bg-alert-success");
              handleTicketModalReset();
              handleGetTickets();
            } else {
              setShow(true);
              setalertTitle("Error");
              setalertText(
                "Something went wrong. Your email may not have been sent."
              );
              setalertIcon("fas fa-exclamation-triangle mr-3");
              setalertColor("bg-alert-error");
              //Email the devs about the error
              Axios.post("/api/emailErrorReport", {
                page: "Ticketing System",
                message:
                  "The error occurred at the email route.\n\nThe information:" +
                  "\n  assignees: " +
                  assignees +
                  "\n  creator: " +
                  techName +
                  "\n  description: " +
                  ticketDescription +
                  "\n  dueDate: " +
                  dateDue +
                  "\n  priority: " +
                  ticketPriority +
                  "\n  title: " +
                  ticketTitle,
              });
            }
          });
        } else {
          setShow(true);
          setalertTitle("Error");
          setalertText(
            "Something went wrong. The ticket may not have been posted.\nNotify Bob or John"
          );
          setalertIcon("fas fa-exclamation-triangle mr-3");
          setalertColor("bg-alert-error");
          //Email the devs about the error
          Axios.post("/api/emailErrorReport", {
            page: "Ticketing System",
            message:
              "The error occurred at the addNewTicket route.\n\nThe information:" +
              "\n  ticketNumber: " +
              ticketNumber +
              "\n  priority: " +
              ticketPriority +
              "\n  title: " +
              ticketTitle +
              "\n  dueDate: " +
              dateDue +
              "\n  creator: " +
              techName +
              "\n  assignees: " +
              assignees +
              "\n  description: " +
              ticketDescription +
              "\n  author: " +
              techName +
              "\n  status: " +
              "Not Started" +
              "\n  summary: " +
              ticketDescription +
              "\n  date: " +
              commentDate,
          });
        }
      });
    }
  }

  //Handles the date time between javascript date and our moment date
  function handleNewTicketDate(event) {
    var date = Moment(event).format("MM/DD/YYYY");
    setTicketDueDate(event);
    setDateDue(date);
  }

  //Reset ticket modal
  function handleTicketModalReset() {
    setTicketTitle("");
    setTechName(props.account);
    setTicketDescription("");
    setTicketAssigned([]);
    setTicketPriority("Low");
    setDateDue(Moment().format("MM/DD/YYYY"));
  }

  //Reset comment modal
  function handleCommentModalReset() {
    setTechName(props.account);
    setCommentStatus("In Progress");
    setComment("");
  }

  //Makes sure the start and end date are formatted as "mm/dd/yyyy" and just numbers
  function validateNewTicket() {
    let valid = true;
    let date = dateDue;
    let creator = techName;
    let emailFormat = /^[a-zA-Z]+@+[a-zA-Z]+.+[A-z]/;
    let dateFormat = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;

    if (date === "" || !date.match(dateFormat) || date === "Invalid date") {
      valid = false;
      setShow(true);
      setalertTitle("Warning");
      setalertText(
        "Make sure the start and end date are formatted as 'mm/dd/yyyy' and just numbers"
      );
      setalertIcon("fas fa-exclamation-circle mr-3");
      setalertColor("bg-alert-warning");
      return valid;
    }

    if (creator === "" || !creator.match(emailFormat)) {
      valid = false;
      setShow(true);
      setalertTitle("Warning");
      setalertText("Make sure the email format is xxxxx@something.net");
      setalertIcon("fas fa-exclamation-circle mr-3");
      setalertColor("bg-alert-warning");
      return valid;
    }

    if (ticketAssigned === undefined || ticketAssigned.length === 0) {
      valid = false;
      setShow(true);
      setalertTitle("Warning");
      setalertText(
        "Make sure you have selected at least one person for the ticket"
      );
      setalertIcon("fas fa-exclamation-circle mr-3");
      setalertColor("bg-alert-warning");
      return valid;
    } else {
      //Makes sure "Please select a person" isn't selected
      ticketAssigned.forEach((element) => {
        if (element.value === "") {
          valid = false;
          setShow(true);
          setalertTitle("Warning");
          setalertText('"Please select a person" is not a person');
          setalertIcon("fas fa-exclamation-circle mr-3");
          setalertColor("bg-alert-warning");
          return valid;
        } else {
          return valid;
        }
      });
    }

    return valid;
  }

  //Handles filtering of the ticket list
  useEffect(() => {
    var filteredListType = ticketData;

    // Filtering the ticket list from the dropdown menu
    if (ticketListType === "Completed") {
      filteredListType = ticketData.filter((data) =>
        data.comments[data.comments.length - 1].status.includes(ticketListType)
      );
    } else if (ticketListType === "In Progress") {
      filteredListType = ticketData.filter((data) =>
        data.comments[data.comments.length - 1].status.includes(ticketListType)
      );
    } else if (ticketListType === "Not Started") {
      filteredListType = ticketData.filter((data) =>
        data.comments[data.comments.length - 1].status.includes(ticketListType)
      );
    } else if (ticketListType === "My Tickets") {
      filteredListType = ticketData.filter((data) =>
        data.assignees.includes(techName)
      );
    } else {
      //Keeps completed tickets out by default
      filteredListType = ticketData.filter(
        (data) =>
          !data.comments[data.comments.length - 1].status.includes("Completed")
      );
    }

    // filters the table list further through the search bar
    setFilteredSearchList(
      filteredListType.filter((ticket) =>
        ticket.title.toLowerCase().includes(searchField.toLowerCase())
      )
    );

    // Gets the results of the table list count
    setTicketCount(filteredSearchList.length);

    //Get the selected ticket
    let selectedTicketTest;
    ticketData.forEach((ticket) => {
      if (ticket.ticketNumber === selectedTicketNumber) {
        selectedTicketTest = ticket;
      }
    });

    // assigns the index of the table click to ticketDetails
    setTicketDetails(selectedTicket);

    if (
      ticketDetails.length !== 0 &&
      ticketDetails !== null &&
      ticketDetails !== undefined
    ) {
      //Turns out the ticketDetails variable doesn't update fast enough, so you need a regular variable for the changes to actually show
      setCommentSection(
        <tbody className="text-white">
          {/* Comment Table Body change back to ticketDetails if no work */}
          {selectedTicketTest.comments.map((comment, index) => (
            <CommentTableEntry key={index} comment={comment} />
          ))}
        </tbody>
      );
      setTest(ticketDetails.comments[ticketDetails.comments.length - 1].status);
    }
  }, [
    filteredSearchList.length,
    searchField,
    selectedTicket,
    selectedTicketNumber,
    techName,
    ticketData,
    ticketDetails,
    ticketListType,
  ]);

  return (
    <div>
      {/* Breadcrumb navbar */}
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb bg-secondary">
          <li className="breadcrumb-item text-primary">Company</li>
          <li className="breadcrumb-item text-light active" aria-current="page">
            Ticketing System
          </li>
        </ol>
      </nav>
      {/* Ticket List */}
      <div className="card bg-secondary mb-3 border-dark text-white mx-4">
        <div className="card-header bg-dark-title border-bottom border-dark">
          Ticket List
        </div>
        <div className="card-body table-responsive">
          <p> Results: {ticketCount}</p>
          <div className="row">
            <div className="col-3">
              <select
                name="ticketListType"
                value={ticketListType}
                onChange={(event) => {
                  setTicketListType(event.target.value);
                }}
                className="form-control bg-form-box border-dark text-form-color"
              >
                <option value="">All Tickets</option>
                <option value="My Tickets">My Tickets</option>
                <option value="Not Started">Open Tickets</option>
                <option value="Completed">Completed Tickets</option>
                <option value="In Progress">In-progress Tickets</option>
              </select>
            </div>

            <div className="col-3">
              <input
                className="form-control mr-sm-2"
                type="search"
                placeholder="Search For Ticket Title"
                onChange={(event) => {
                  setSearchField(event.target.value);
                }}
              />
            </div>
            <div className="col-5 text-right">
              <button
                type="button"
                className="btn btn-primary"
                data-toggle="modal"
                data-target="#addTicket"
              >
                <i className="fas fa-plus mr-1"></i>
                Add New Ticket
              </button>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table ticketing-system table-fixed table-hover table-dark mt-3">
              <thead className="text-white font-weight-bold">
                <tr>
                  <th scope="col">Ticket #</th>
                  <th scope="col">Priority</th>
                  <th scope="col" className="w-20">
                    Title
                  </th>
                  <th scope="col">Status</th>
                  <th scope="col">Due Date</th>
                  <th scope="col" className="w-20">
                    Creator
                  </th>
                  <th scope="col" className="w-20">
                    Assignees
                  </th>
                </tr>
              </thead>
              <tbody className="text-white">
                {/* Ticket Table Body */}
                {filteredSearchList.map((ticket) => (
                  <TicketingTableEntry
                    key={ticket._id}
                    ticket={ticket}
                    handleTableClick={handleTableClick}
                    handlePriorityLevel={handlePriorityLevel}
                    handleStatusLevel={handleStatusLevel}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Ticket Details */}
      <div className="card bg-secondary mb-3 border-dark text-white mx-4">
        <div className="card-header bg-dark-title border-bottom border-dark">
          Ticket Details
        </div>
        <div className="card-body">
          <div className="row mb-2">
            <div className="col-md-2">
              <h4>Ticket # {ticketDetails.ticketNumber}</h4>
            </div>
            <div className="col-md-7">
              <h4>{ticketDetails.title}</h4>
            </div>
            <div className="col-md-2">
              <button
                disabled={selectedTicketNumber === 0 ? true : false}
                type="button"
                className="btn btn-danger float-right"
                data-toggle="modal"
                data-target="#addAssignee"
              >
                <i className="fas fa-plus mr-1"></i>
                Add New Assignees
              </button>
            </div>
          </div>

          <div className="row mb-2">
            <div className="col-md-8">
              <label>Description</label>
              <div className="input-group input-group-md">
                <div className="input-group-prepend">
                  <span className="input-group-text bg-dark-title border-dark text-light">
                    <i className="fas fa-list"></i>
                  </span>
                </div>
                <textarea
                  className="form-control bg-form-box border-dark text-form-color"
                  rows="4"
                  readOnly
                  value={ticketDetails.description}
                />
              </div>
            </div>
            <div className="col-md-4">
              <label>Assignees</label>
              <div className="input-group input-group-md">
                <div className="input-group-prepend">
                  <span className="input-group-text bg-dark-title border-dark text-light">
                    <i className="fas fa-users"></i>
                  </span>
                </div>
                <textarea
                  className="form-control bg-form-box border-dark text-form-color"
                  rows="4"
                  readOnly
                  value={ticketDetails.assignees}
                />
              </div>
            </div>
          </div>
          <div className="row mb-2">
            <div className="col-md-3">
              <label>Creator</label>
              <div className="input-group input-group-md">
                <div className="input-group-prepend">
                  <span className="input-group-text bg-dark-title border-dark text-light">
                    <i className="fas fa-user"></i>
                  </span>
                </div>
                <p className="form-control bg-form-box border-dark text-form-color">
                  {ticketDetails.creator}
                </p>
              </div>
            </div>
            <div className="col-md-3">
              <label>Status</label>
              <div className="input-group input-group-md">
                <div className="input-group-prepend">
                  <span className="input-group-text bg-dark-title border-dark text-light">
                    <i className="fas fa-spinner"></i>
                  </span>
                </div>
                <p className="form-control bg-form-box border-dark text-form-color">
                  {test}
                </p>
              </div>
            </div>
            <div className="col-md-3">
              <label>Priority</label>
              <div className="input-group input-group-md">
                <div className="input-group-prepend">
                  <span className="input-group-text bg-dark-title border-dark text-light">
                    <i className="fas fa-sort-amount-up"></i>
                  </span>
                </div>
                <p className="form-control bg-form-box border-dark text-form-color">
                  {ticketDetails.priority}
                </p>
              </div>
            </div>
            <div className="col-md-3">
              <label>Due Date</label>
              <div className="input-group input-group-md">
                <div className="input-group-prepend">
                  <span className="input-group-text bg-dark-title border-dark text-light">
                    <i className="fas fa-calendar"></i>
                  </span>
                </div>
                <p className="form-control bg-form-box border-dark text-form-color">
                  {ticketDetails.dueDate}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Ticket Comments */}
      <div className="card bg-secondary mb-3 border-dark text-white mx-4">
        <div className="card-header bg-dark-title border-bottom border-dark">
          Ticket Comments
        </div>
        <div className="card-body table-responsive">
          <div className="row">
            <div className="col">
              <button
                type="button"
                className="btn btn-primary"
                data-toggle="modal"
                data-target="#addComment"
              >
                <i className="fas fa-plus mr-1"></i>
                Add New Comment
              </button>
            </div>
          </div>
          <table className="table table-fixed table-hover table-dark">
            <thead className="text-white font-weight-bold">
              <tr>
                <th scope="col-2">Tech</th>
                <th scope="col-2">Date</th>
                <th scope="col-2">Status</th>
                <th scope="col" className="w-50">
                  Comment
                </th>
              </tr>
            </thead>
            {commentSection}
          </table>
        </div>
      </div>
      {/* Add Ticket Modal */}
      <div
        className="modal fade"
        id="addTicket"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content border-0 shadow">
            <div className="modal-header bg-dark-title border-dark">
              <h5 className="modal-title text-white" id="exampleModalLabel">
                Create New Ticket
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
                  <label>Title</label>
                  <div className="input-group input-group-md">
                    <div className="input-group-prepend">
                      <span className="input-group-text bg-dark-title border-dark text-light">
                        <i className="fas fa-ticket-alt"></i>
                      </span>
                    </div>
                    <input
                      name="ticketTitle"
                      type="email"
                      required
                      className="form-control bg-form-box border-dark text-form-color"
                      value={ticketTitle}
                      onChange={(event) => {
                        setTicketTitle(event.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <label>Creator</label>
                  <div className="input-group input-group-md">
                    <div className="input-group-prepend">
                      <span className="input-group-text bg-dark-title border-dark text-light">
                        <i className="fas fa-user"></i>
                      </span>
                    </div>
                    <input
                      name="techName"
                      type="email"
                      className="form-control bg-form-box border-dark text-form-color"
                      value={techName}
                      onChange={(event) => {
                        setTechName(event.target.value);
                      }}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="row mb-2">
                <div className="col-12">
                  <label>Description</label>
                  <div className="input-group input-group-md">
                    <div className="input-group-prepend">
                      <span className="input-group-text bg-dark-title border-dark text-light">
                        <i className="fas fa-list"></i>
                      </span>
                    </div>
                    <textarea
                      name="ticketDescription"
                      value={ticketDescription}
                      onChange={(event) => {
                        setTicketDescription(event.target.value);
                      }}
                      className="form-control bg-form-box border-dark text-form-color"
                      rows="3"
                      placeholder="Ticket description"
                      required
                      maxLength={500}
                    />
                  </div>
                </div>
              </div>
              <div className="row mb-2">
                <div className="col-12">
                  <label>Assignees</label>
                  <div className="input-group input-group-md">
                    <div className="input-group-prepend">
                      <span className="input-group-text bg-dark-title border-dark text-light">
                        <i className="fas fa-users"></i>
                      </span>
                    </div>
                    <Select
                      className="react-select-container"
                      classNamePrefix="react-select"
                      name="ticketAssigned"
                      placeholder="Filters"
                      value={ticketAssigned}
                      options={techList}
                      onChange={handleMultiChange}
                      isMulti
                    />
                  </div>
                </div>
              </div>
              <div className="row mb-2">
                <div className="col-md-6">
                  <label>Priority</label>
                  <div className="input-group input-group-md">
                    <div className="input-group-prepend">
                      <span className="input-group-text bg-dark-title border-dark text-light">
                        <i className="fas fa-sort-amount-up"></i>
                      </span>
                    </div>
                    <select
                      name="ticketPriority"
                      value={ticketPriority}
                      onChange={(event) => {
                        setTicketPriority(event.target.value);
                      }}
                      required
                      className="form-control bg-form-box border-dark text-form-color"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-6">
                  <label>Due Date</label>
                  <div className="input-group input-group-md">
                    <div className="input-group-prepend">
                      <span className="input-group-text bg-dark-title border-dark text-light">
                        <i className="fas fa-calendar"></i>
                      </span>
                    </div>
                    <DatePicker
                      name="dateStart"
                      onChange={handleNewTicketDate}
                      value={ticketDueDate}
                      className="form-control bg-form-box border-dark text-form-color"
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
                onClick={handleTicketModalReset}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                data-dismiss="modal"
                onClick={handleSubmitTicket}
                disabled={!ticketTitle || !ticketDescription || !techName}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Add Comment Modal */}
      <div
        className="modal fade"
        id="addComment"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content border-0 shadow">
            <div className="modal-header bg-dark-title border-dark">
              <h5 className="modal-title text-white" id="exampleModalLabel">
                Add Comment
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
                <div className="col-12">
                  <label>Tech</label>
                  <div className="input-group input-group-md">
                    <div className="input-group-prepend">
                      <span className="input-group-text bg-dark-title border-dark text-light">
                        <i className="fas fa-user"></i>
                      </span>
                    </div>
                    <p
                      name="techName"
                      className="form-control bg-form-box border-dark text-form-color"
                    >
                      {techName}
                    </p>
                  </div>
                </div>
              </div>
              <div className="row mb-2">
                <div className="col-12">
                  <label>Date</label>
                  <div className="input-group input-group-md">
                    <div className="input-group-prepend">
                      <span className="input-group-text bg-dark-title border-dark text-light">
                        <i className="fas fa-calendar"></i>
                      </span>
                    </div>
                    <h1 className="form-control bg-form-box border-dark text-form-color">
                      <span id="datetime">{commentDate}</span>
                    </h1>
                  </div>
                </div>
              </div>
              <div className="row mb-2">
                <div className="col-12">
                  <label>Status</label>
                  <div className="input-group input-group-md">
                    <div className="input-group-prepend">
                      <span className="input-group-text bg-dark-title border-dark text-light">
                        <i className="fas fa-spinner"></i>
                      </span>
                    </div>
                    <select
                      name="commentStatus"
                      value={commentStatus}
                      onChange={(event) => {
                        setCommentStatus(event.target.value);
                      }}
                      required
                      className="form-control bg-form-box border-dark text-form-color"
                    >
                      <option defaultValue="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="row mb-2">
                <div className="col-12">
                  <label>Comment</label>
                  <div className="input-group input-group-md">
                    <div className="input-group-prepend">
                      <span className="input-group-text bg-dark-title border-dark text-light">
                        <i className="fas fa-list"></i>
                      </span>
                    </div>
                    <textarea
                      name="comment"
                      className="form-control bg-form-box border-dark text-form-color"
                      rows="3"
                      placeholder="Comment For Status"
                      required
                      maxLength={250}
                      value={comment}
                      onChange={(event) => {
                        setComment(event.target.value);
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
                onClick={handleCommentModalReset}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                data-dismiss="modal"
                onClick={addNewComment}
                disabled={!techName || !comment}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Add Assignee Modal */}
      <div
        className="modal fade"
        id="addAssignee"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content border-0 shadow">
            <div className="modal-header bg-dark-title border-dark">
              <h5 className="modal-title text-white" id="exampleModalLabel">
                Add/Edit Assignees
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
            <div className="modal-body bg-secondary border-dark text-white pb-5">
              <div className="row mb-2">
                <div className="col-12">
                  <label>Assignees</label>
                  <div className="input-group input-group-md">
                    <div className="input-group-prepend">
                      <span className="input-group-text bg-dark-title border-dark text-light">
                        <i className="fas fa-users"></i>
                      </span>
                    </div>
                    <Select
                      className="react-select-container"
                      classNamePrefix="react-select"
                      name="ticketAssigned"
                      placeholder="Filters"
                      value={selectedAssignees}
                      options={techList}
                      onChange={handleSelectedMultiChange}
                      isMulti
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
                onClick={handleCommentModalReset}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                data-dismiss="modal"
                onClick={handleEditTicket}
                disabled={!selectedAssignees}
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

/* class Tickets extends React.Component {
  constructor(props) {
    super(props);

    //Initialize all the state values
    state = {
      ticketData: [],
      ticketListType: "",
      ticketNumber: 0,
      searchField: "",
      techName: props.account,
      selectedTicket: [],
      selectedTicketNumber: 0,
      selectedAssignees: [],
      ticketTitle: "",
      ticketDescription: "",
      ticketAssigned: [],
      ticketPriority: "Low",
      ticketDueDate: new Date(),
      dateDue: Moment().format("MM/DD/YYYY"),
      commentStatus: "In Progress",
      comment: "",
      commentDate: Moment().format("MM/DD/YYYY, HH:mm"),
    };

    //Allows for functions to be created for each *
    handleChange = handleChange.bind(this);
    handleSearch = handleSearch.bind(this);
    handleMultiChange = handleMultiChange.bind(this);
    handleSelectedMultiChange = handleSelectedMultiChange.bind(this);
    handleTableClick = handleTableClick.bind(this);
    handlePriorityLevel = handlePriorityLevel.bind(this);
    handleStatusLevel = handleStatusLevel.bind(this);
    handleSubmitTicket = handleSubmitTicket.bind(this);
    handleGetTickets = handleGetTickets.bind(this);
    handleSaveChanges = handleSaveChanges.bind(this);
    handleRefreshClick = handleRefreshClick.bind(this);
    handleNewTicketDate = handleNewTicketDate.bind(this);
    handleTicketModalReset = handleTicketModalReset.bind(this);
    handleCommentModalReset = handleCommentModalReset.bind(this);
    validateNewTicket = validateNewTicket.bind(this);
    handleEditTicket = handleEditTicket.bind(this);
  }

  //Universal change handler cause we are good coders who definetely didn't google this
  //Credit: Tom Kelly at https://medium.com/better-programming/handling-multiple-form-inputs-in-react-c5eb83755d15
  handleChange(event) {
    setState({ [event.target.name]: event.target.value });
  }

  handleRefreshClick() {
    ticketData.forEach((ticket) => {
      if (ticket.ticketNumber === selectedTicketNumber) {
        setState({
          selectedTicket: ticket,
        });
      }
    });
  }

  // Adds new comment to selected ticket
  handleSaveChanges() {
    Axios.post("/api/ticketingSystem/addNewComment", {
      ticketNumber: selectedTicket.ticketNumber,
      author: techName,
      date: commentDate,
      status: commentStatus,
      summary: comment,
    }).then(() => {
      handleGetTickets();
      handleCommentModalReset();
    });
  }

  // change value of Assigned people
  handleMultiChange(option) {
    if (option === null) {
      setState({
        ticketAssigned: [],
      });
    } else {
      setState({
        ticketAssigned: option,
      });
    }
  }

  // change value of Assigned people
  handleSelectedMultiChange(option) {
    if (option === null) {
      setState({
        selectedAssignees: [],
      });
    } else {
      setState({
        selectedAssignees: option,
      });
    }
  }

  handleEditTicket() {
    let assignees = [];
    if (selectedAssignees !== null) {
      selectedAssignees.forEach((person) => {
        assignees.push(person.value);
      });
    }
    Axios.post("/api/ticketingSystem/editTicket", {
      ticketNumber: selectedTicket.ticketNumber,
      assignees: assignees,
    }).then(() => {
      handleGetTickets();
    });
  }

  // Handles the search bar state value
  handleSearch = (e) => {
    setState({ searchField: e.target.value });
  };

  // Handles a click in the table for the state value
  handleTableClick(index) {
    //set state of multivalue with existing device parts
    let techs = [];
    techList.forEach((element) => {
      index.assignees.forEach((tech) => {
        if (element.value === tech) {
          techs.push(element);
        }
      });
    });

    setState(
      {
        selectedTicket: index,
        selectedTicketNumber: index.ticketNumber,
        selectedAssignees: techs,
      },
      () => {
        console.log(selectedAssignees);
        console.log(index.assignees);
      }
    );
  }

  // defines the color for the priority
  handlePriorityLevel(priority) {
    const prefix = "fas fa-circle mr-2 text-";

    // eslint-disable-next-line default-case
    switch (priority) {
      case "Low":
        return prefix + "warning";
      case "Medium":
        return prefix + "orange";
      case "High":
        return prefix + "danger";
    }
  }

  // defines the color of the status
  handleStatusLevel(status) {
    const prefix = "bg-";

    // eslint-disable-next-line default-case
    switch (status) {
      case "Completed":
        return prefix + "success";
      case "In Progress":
        return prefix + "info";
      case "Not Started":
        return prefix + "dark";
    }
  }

  // Gets the list of tickets
  handleGetTickets() {
    Axios.get("/api/ticketingSystem/ticketingSystem").then((result) => {
      if (result[0] !== null) {
        setState({
          ticketData: result.data.documents,
        });
      }
      if (selectedTicketNumber !== 0) {
        handleRefreshClick();
      }
      setState({
        ticketNumber: result.data.ticketNumber[0].lastTicketNumber + 1,
      });
    });
  }

  // on initial load gets ticket and refreshes comment date
  componentDidMount() {
    handleGetTickets();
    // update date and time constantly
    setInterval(() => {
      setState((state) => {
        return {
          commentDate: Moment().format("MM/DD/YYYY, HH:mm"),
        };
      });
    }, 10000);
  }

  // submits new ticket
  handleSubmitTicket() {
    if (validateNewTicket() === true) {
      //Inserts assignees into the database
      var assignees = [];
      ticketAssigned.forEach((element) => {
        if (element.value !== "") {
          assignees.push(element.value);
        }
      });
      //Per TJs request, the creator is also sent an email
      assignees.push(techName);

      // Adds new ticket to the system
      Axios.post("/api/ticketingSystem/addNewTicket", {
        ticketNumber: ticketNumber,
        priority: ticketPriority,
        title: ticketTitle,
        dueDate: dateDue,
        creator: techName,
        assignees: assignees,
        description: ticketDescription,
        author: techName,
        status: "Not Started",
        summary: ticketDescription,
        date: commentDate,
      }).then(() => {
        Axios.post("/api/ticketingSystem/email", {
          assignees: assignees,
          creator: techName,
          description: ticketDescription,
          dueDate: dateDue,
          priority: ticketPriority,
          title: ticketTitle,
        });
        Axios.post("/api/ticketingSystem/ticketingSystem/updateTicketNumber", {
          ticketNumber: ticketNumber,
        });

        handleTicketModalReset();
        handleGetTickets();
      });
    }
  }

  // Handles the date time between javascript date and our moment date
  handleNewTicketDate(event) {
    var date = event;
    date = Moment(date).format("MM/DD/YYYY");
    console.log(date);

    setState({
      ticketDueDate: event,
      dateDue: date,
    });
  }

  //Change value= everyhing to '' or default value
  handleTicketModalReset(event) {
    setState({
      ticketTitle: "",
      techName: props.account,
      ticketDescription: "",
      ticketAssigned: [],
      ticketPriority: "Low",
      dateDue: Moment().format("MM/DD/YYYY"),
    });
  }

  handleCommentModalReset(event) {
    setState({
      techName: props.account,
      commentStatus: "In Progress",
      comment: "",
    });
  }

  //Makes sure the start and end date are formatted as "mm/dd/yyyy" and just numbers
  validateNewTicket() {
    let valid = true;
    let date = dateDue;
    let creator = techName;
    let ticketAssigned = ticketAssigned;
    let emailFormat = /^[a-zA-Z]+@+[a-zA-Z]+.+[A-z]/;
    let dateFormat = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;

    if (date === "" || !date.match(dateFormat) || date === "Invalid date") {
      valid = false;
      alert(
        "Make sure the start and end date are formatted as 'mm/dd/yyyy' and just numbers"
      );
      return valid;
    }

    if (creator === "" || !creator.match(emailFormat)) {
      valid = false;
      alert("Make sure the email format is xxxxx@something.net");
      return valid;
    }

    if (ticketAssigned === undefined || ticketAssigned.length === 0) {
      valid = false;
      alert("Make sure you have selected at least one person for the ticket");
      return valid;
    } else {
      //Makes sure "Please select a person" isn't selected
      ticketAssigned.forEach((element) => {
        if (element.value === "") {
          valid = false;
          alert('"Please select a person is not a person"');
          return valid;
        } else {
          return valid;
        }
      });
    }

    return valid;
  }

  render() {
    // variables for state values for ease of use
    const {
      selectedTicket,
      ticketData,
      searchField,
      ticketListType,
      techName,
      selectedAssignees,
    } = state;
    var filteredListType = ticketData;
    var commentSection, test;

    // Filtering the ticket list from the dropdown menu
    if (ticketListType === "Completed") {
      filteredListType = ticketData.filter((data) =>
        data.comments[data.comments.length - 1].status.includes(ticketListType)
      );
    } else if (ticketListType === "In Progress") {
      filteredListType = ticketData.filter((data) =>
        data.comments[data.comments.length - 1].status.includes(ticketListType)
      );
    } else if (ticketListType === "Not Started") {
      filteredListType = ticketData.filter((data) =>
        data.comments[data.comments.length - 1].status.includes(ticketListType)
      );
    } else if (ticketListType === "My Tickets") {
      filteredListType = ticketData.filter((data) =>
        data.assignees.includes(techName)
      );
    } else {
      filteredListType = ticketData;
    }

    // filters the table list further through the search bar
    const filteredSearchList = filteredListType.filter((ticket) =>
      ticket.title.toLowerCase().includes(searchField.toLowerCase())
    );

    // Gets the results of the table list count
    const ticketCount = filteredSearchList.length;

    // assigns the index of the table click to ticketDetails
    const ticketDetails = selectedTicket;

    if (
      ticketDetails.length !== 0 &&
      ticketDetails !== null &&
      ticketDetails !== undefined
    ) {
      commentSection = (
        <tbody className="text-white">
          {/* Comment Table Body /}
          {ticketDetails.comments.map((comment, index) => (
            <CommentTableEntry key={index} comment={comment} />
          ))}
        </tbody>
      );
      test = ticketDetails.comments[ticketDetails.comments.length - 1].status;
    }

    return (
      <div>
        {/* Breadcrumb navbar /}
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb bg-secondary">
            <li className="breadcrumb-item text-primary">Company</li>
            <li
              className="breadcrumb-item text-light active"
              aria-current="page"
            >
              Ticketing System
            </li>
          </ol>
        </nav>
        {/* Ticket List /}
        <div className="card bg-secondary mb-3 border-dark text-white mx-4">
          <div className="card-header bg-dark-title border-bottom border-dark">
            Ticket List
          </div>
          <div className="card-body table-responsive">
            <p> Results: {ticketCount}</p>
            <div className="row">
              <div className="col-3">
                <select
                  name="ticketListType"
                  value={ticketListType}
                  onChange={handleChange}
                  className="form-control bg-form-box border-dark text-form-color"
                >
                  <option value="">All Tickets</option>
                  <option value="My Tickets">My Tickets</option>
                  <option value="Not Started">Open Tickets</option>
                  <option value="Completed">Closed Tickets</option>
                  <option value="In Progress">In-progress Tickets</option>
                </select>
              </div>

              <div className="col-3">
                <input
                  className="form-control mr-sm-2"
                  type="search"
                  placeholder="Search For Ticket Title"
                  onChange={handleSearch}
                />
              </div>
              <div className="col-5 text-right">
                <button
                  type="button"
                  className="btn btn-primary"
                  data-toggle="modal"
                  data-target="#addTicket"
                >
                  <i className="fas fa-plus mr-1"></i>
                  Add New Ticket
                </button>
              </div>
            </div>
            <div className="table-responsive">
              <table className="table ticketing-system table-fixed table-hover table-dark mt-3">
                <thead className="text-white font-weight-bold">
                  <tr>
                    <th scope="col">Ticket #</th>
                    <th scope="col">Priority</th>
                    <th scope="col" className="w-20">
                      Title
                    </th>
                    <th scope="col">Status</th>
                    <th scope="col">Due Date</th>
                    <th scope="col" className="w-20">
                      Creator
                    </th>
                    <th scope="col" className="w-20">
                      Assignees
                    </th>
                  </tr>
                </thead>
                <tbody className="text-white">
                  {/* Ticket Table Body /}
                  {filteredSearchList.map((ticket) => (
                    <TicketingTableEntry
                      key={ticket._id}
                      ticket={ticket}
                      handleTableClick={handleTableClick}
                      handlePriorityLevel={handlePriorityLevel}
                      handleStatusLevel={handleStatusLevel}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Ticket Details /}
        <div className="card bg-secondary mb-3 border-dark text-white mx-4">
          <div className="card-header bg-dark-title border-bottom border-dark">
            Ticket Details
          </div>
          <div className="card-body">
            <div className="row mb-2">
              <div className="col-md-2">
                <h4>Ticket # {ticketDetails.ticketNumber}</h4>
              </div>
              <div className="col-md-7">
                <h4>{ticketDetails.title}</h4>
              </div>
              <div className="col-md-2">
                <button
                  disabled={
                    selectedTicketNumber === 0 ? true : false
                  }
                  type="button"
                  className="btn btn-danger float-right"
                  data-toggle="modal"
                  data-target="#addAssignee"
                >
                  <i className="fas fa-plus mr-1"></i>
                  Add New Assignees
                </button>
              </div>
            </div>

            <div className="row mb-2">
              <div className="col-md-8">
                <label>Description</label>
                <div className="input-group input-group-md">
                  <div className="input-group-prepend">
                    <span className="input-group-text bg-dark-title border-dark text-light">
                      <i className="fas fa-list"></i>
                    </span>
                  </div>
                  <textarea
                    className="form-control bg-form-box border-dark text-form-color"
                    rows="4"
                    readOnly
                    value={ticketDetails.description}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <label>Assignees</label>
                <div className="input-group input-group-md">
                  <div className="input-group-prepend">
                    <span className="input-group-text bg-dark-title border-dark text-light">
                      <i className="fas fa-users"></i>
                    </span>
                  </div>
                  <textarea
                    className="form-control bg-form-box border-dark text-form-color"
                    rows="4"
                    readOnly
                    value={ticketDetails.assignees}
                  />
                </div>
              </div>
            </div>
            <div className="row mb-2">
              <div className="col-md-3">
                <label>Creator</label>
                <div className="input-group input-group-md">
                  <div className="input-group-prepend">
                    <span className="input-group-text bg-dark-title border-dark text-light">
                      <i className="fas fa-user"></i>
                    </span>
                  </div>
                  <p className="form-control bg-form-box border-dark text-form-color">
                    {ticketDetails.creator}
                  </p>
                </div>
              </div>
              <div className="col-md-3">
                <label>Status</label>
                <div className="input-group input-group-md">
                  <div className="input-group-prepend">
                    <span className="input-group-text bg-dark-title border-dark text-light">
                      <i className="fas fa-spinner"></i>
                    </span>
                  </div>
                  <p className="form-control bg-form-box border-dark text-form-color">
                    {test}
                  </p>
                </div>
              </div>
              <div className="col-md-3">
                <label>Priority</label>
                <div className="input-group input-group-md">
                  <div className="input-group-prepend">
                    <span className="input-group-text bg-dark-title border-dark text-light">
                      <i className="fas fa-sort-amount-up"></i>
                    </span>
                  </div>
                  <p className="form-control bg-form-box border-dark text-form-color">
                    {ticketDetails.priority}
                  </p>
                </div>
              </div>
              <div className="col-md-3">
                <label>Due Date</label>
                <div className="input-group input-group-md">
                  <div className="input-group-prepend">
                    <span className="input-group-text bg-dark-title border-dark text-light">
                      <i className="fas fa-calendar"></i>
                    </span>
                  </div>
                  <p className="form-control bg-form-box border-dark text-form-color">
                    {ticketDetails.dueDate}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Ticket Comments /}
        <div className="card bg-secondary mb-3 border-dark text-white mx-4">
          <div className="card-header bg-dark-title border-bottom border-dark">
            Ticket Comments
          </div>
          <div className="card-body table-responsive">
            <div className="row">
              <div className="col">
                <button
                  type="button"
                  className="btn btn-primary"
                  data-toggle="modal"
                  data-target="#addComment"
                >
                  <i className="fas fa-plus mr-1"></i>
                  Add New Comment
                </button>
              </div>
            </div>
            <table className="table table-fixed table-hover table-dark">
              <thead className="text-white font-weight-bold">
                <tr>
                  <th scope="col-2">Tech</th>
                  <th scope="col-2">Date</th>
                  <th scope="col-2">Status</th>
                  <th scope="col" className="w-50">
                    Comment
                  </th>
                </tr>
              </thead>
              {commentSection}
            </table>
          </div>
        </div>
        {/* Add Ticket Modal /}
        <div
          className="modal fade"
          id="addTicket"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg" role="document">
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
                    <label>Title</label>
                    <div className="input-group input-group-md">
                      <div className="input-group-prepend">
                        <span className="input-group-text bg-dark-title border-dark text-light">
                          <i className="fas fa-ticket-alt"></i>
                        </span>
                      </div>
                      <input
                        name="ticketTitle"
                        type="email"
                        required
                        className="form-control bg-form-box border-dark text-form-color"
                        value={ticketTitle}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label>Creator</label>
                    <div className="input-group input-group-md">
                      <div className="input-group-prepend">
                        <span className="input-group-text bg-dark-title border-dark text-light">
                          <i className="fas fa-user"></i>
                        </span>
                      </div>
                      <input
                        name="techName"
                        type="email"
                        className="form-control bg-form-box border-dark text-form-color"
                        value={techName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="row mb-2">
                  <div className="col-12">
                    <label>Description</label>
                    <div className="input-group input-group-md">
                      <div className="input-group-prepend">
                        <span className="input-group-text bg-dark-title border-dark text-light">
                          <i className="fas fa-list"></i>
                        </span>
                      </div>
                      <textarea
                        name="ticketDescription"
                        value={ticketDescription}
                        onChange={handleChange}
                        className="form-control bg-form-box border-dark text-form-color"
                        rows="3"
                        placeholder="Ticket description"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="row mb-2">
                  <div className="col-12">
                    <label>Assignees</label>
                    <div className="input-group input-group-md">
                      <div className="input-group-prepend">
                        <span className="input-group-text bg-dark-title border-dark text-light">
                          <i className="fas fa-users"></i>
                        </span>
                      </div>
                      <Select
                        className="react-select-container"
                        classNamePrefix="react-select"
                        name="ticketAssigned"
                        placeholder="Filters"
                        value={ticketAssigned}
                        options={techList}
                        onChange={handleMultiChange}
                        isMulti
                      />
                    </div>
                  </div>
                </div>
                <div className="row mb-2">
                  <div className="col-md-6">
                    <label>Priority</label>
                    <div className="input-group input-group-md">
                      <div className="input-group-prepend">
                        <span className="input-group-text bg-dark-title border-dark text-light">
                          <i className="fas fa-sort-amount-up"></i>
                        </span>
                      </div>
                      <select
                        name="ticketPriority"
                        value={ticketPriority}
                        onChange={handleChange}
                        required
                        className="form-control bg-form-box border-dark text-form-color"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label>Due Date</label>
                    <div className="input-group input-group-md">
                      <div className="input-group-prepend">
                        <span className="input-group-text bg-dark-title border-dark text-light">
                          <i className="fas fa-calendar"></i>
                        </span>
                      </div>
                      <DatePicker
                        name="dateStart"
                        onChange={handleNewTicketDate}
                        value={ticketDueDate}
                        className="form-control bg-form-box border-dark text-form-color"
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
                  onClick={handleTicketModalReset}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  data-dismiss="modal"
                  onClick={handleSubmitTicket}
                  disabled={
                    !ticketTitle ||
                    !ticketDescription ||
                    !techName
                  }
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Add Comment Modal /}
        <div
          className="modal fade"
          id="addComment"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content border-0 shadow">
              <div className="modal-header bg-dark-title border-dark">
                <h5 className="modal-title text-white" id="exampleModalLabel">
                  Add Comment
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
                  <div className="col-12">
                    <label>Tech</label>
                    <div className="input-group input-group-md">
                      <div className="input-group-prepend">
                        <span className="input-group-text bg-dark-title border-dark text-light">
                          <i className="fas fa-user"></i>
                        </span>
                      </div>
                      <p
                        name="techName"
                        className="form-control bg-form-box border-dark text-form-color"
                      >
                        {techName}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="row mb-2">
                  <div className="col-12">
                    <label>Date</label>
                    <div className="input-group input-group-md">
                      <div className="input-group-prepend">
                        <span className="input-group-text bg-dark-title border-dark text-light">
                          <i className="fas fa-calendar"></i>
                        </span>
                      </div>
                      <h1 className="form-control bg-form-box border-dark text-form-color">
                        <span id="datetime">{commentDate}</span>
                      </h1>
                    </div>
                  </div>
                </div>
                <div className="row mb-2">
                  <div className="col-12">
                    <label>Status</label>
                    <div className="input-group input-group-md">
                      <div className="input-group-prepend">
                        <span className="input-group-text bg-dark-title border-dark text-light">
                          <i className="fas fa-spinner"></i>
                        </span>
                      </div>
                      <select
                        name="commentStatus"
                        value={commentStatus}
                        onChange={handleChange}
                        required
                        className="form-control bg-form-box border-dark text-form-color"
                      >
                        <option defaultValue="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="row mb-2">
                  <div className="col-12">
                    <label>Comment</label>
                    <div className="input-group input-group-md">
                      <div className="input-group-prepend">
                        <span className="input-group-text bg-dark-title border-dark text-light">
                          <i className="fas fa-list"></i>
                        </span>
                      </div>
                      <textarea
                        name="comment"
                        className="form-control bg-form-box border-dark text-form-color"
                        rows="3"
                        placeholder="Comment For Status"
                        required
                        value={comment}
                        onChange={handleChange}
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
                  onClick={handleCommentModalReset}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  data-dismiss="modal"
                  onClick={handleSaveChanges}
                  disabled={!techName || !comment}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Add Assignee Modal /}
        <div
          className="modal fade"
          id="addAssignee"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content border-0 shadow">
              <div className="modal-header bg-dark-title border-dark">
                <h5 className="modal-title text-white" id="exampleModalLabel">
                  Add/Edit Assignees
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
              <div className="modal-body bg-secondary border-dark text-white pb-5">
                <div className="row mb-2">
                  <div className="col-12">
                    <label>Assignees</label>
                    <div className="input-group input-group-md">
                      <div className="input-group-prepend">
                        <span className="input-group-text bg-dark-title border-dark text-light">
                          <i className="fas fa-users"></i>
                        </span>
                      </div>
                      <Select
                        className="react-select-container"
                        classNamePrefix="react-select"
                        name="ticketAssigned"
                        placeholder="Filters"
                        value={selectedAssignees}
                        options={techList}
                        onChange={handleSelectedMultiChange}
                        isMulti
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
                  onClick={handleCommentModalReset}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  data-dismiss="modal"
                  onClick={handleEditTicket}
                  disabled={!selectedAssignees}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Tickets;
 */
