import React, { useEffect, useState } from "react";
import { Route, Switch, NavLink } from "react-router-dom";

import SideNav from "./components/side-nav/side-nav.component";
import Footer from "./components/footer/footer.component";
import Dashboard from "./components/dashboard/dashboard.component";
import CheckIn from "./components/check-in/check-in-form.component";
import Search from "./components/search/Search.component";
import BulkSearch from "./components/bulk-search/bulk-search-component";
import BatchChange from "./components/batch-status-change/batch-status-change.component";
import ShippingTickets from "./components/shipping-tickets/shipping-tickets.component";
import Statistics from "./components/statistics/statistics-component";
import Tickets from "./components/ticketing-system/ticketing.component";
import Axios from "axios";
/* import { AzureAD } from "react-aad-msal";
import { authProvider } from "./authProvider"; */

import logo from "./fake-logo.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

export default function App(props) {
  const [ticketDue, setTicketDue] = useState(0);
  const [sideNavWidth, setSideNavWidth] = useState(true);
  const [ticketIcon, setTicketIcon] = useState("");

  useEffect(() => {
    Axios.get("/api/appJSPage/" + props.account).then((response) => {
      setTicketDue(response.data.numberOfTicketsForTech);
    });

    if (ticketDue !== 0) {
      setTicketIcon(
        <span className="badge badge-danger badge-icon mr-3">{ticketDue}</span>
      );
    }
  }, [props.account, ticketDue]);

  function handleSideNavToggle() {
    setSideNavWidth(!sideNavWidth);
  }

  // defines width of the sidebar
  function handleSideNavWidth(widthToggle) {
    const prefix = "bg-secondary mt-1 rounded-right ";

    if (widthToggle === true) {
      return prefix;
    } else if (widthToggle === false) {
      return prefix + "sidebar-sm";
    }
  }

  return (
    <div className="App">
      {/* Top navigation bar */}
      <header>
        <nav className="navbar navbar-expand-md navbar-dark bg-secondary border-bottom border-dark">
          <button
            className="btn btn-link border-right ml-0 pl-0"
            type="button"
            onClick={handleSideNavToggle}
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <NavLink exact to="/" className="nav-brand ml-2">
            <img
              src={logo}
              alt="Company Logo"
              className="img-fluid"
              width="100"
              height="100"
            />
          </NavLink>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="."
                  id="navbarDropdown"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Quick Links
                </a>
                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <a
                    className="dropdown-item"
                    href="https://apsb.follettdestiny.com/common/welcome.jsp?context=saas93_1721740"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Destiny
                  </a>
                  <a
                    className="dropdown-item"
                    href="http://kbox.apsbschools.org/admin"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Kace Admin Portal
                  </a>
                  <div className="dropdown-divider"></div>
                  <a
                    className="dropdown-item"
                    href="https://prosourcellc.sharepoint.com/:x:/r/_layouts/15/Doc.aspx?sourcedoc=%7BF424C7A9-906B-4AF7-936A-0A0DF7D99501%7D&file=Spare%20Parts%20Inventory.xlsx&action=default&mobileredirect=true&cid=fa6e5c27-6275-4ec8-8ce9-a2f72265dbbc"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Spare Parts Inventory
                  </a>
                </div>
              </li>
            </ul>
                <ul className="navbar-nav mt-1">
                  <li className="nav-item mt-2 mr-2 text-white">
                    <NavLink to="/App/Tickets" className="notification">
                      <i className="fas fa-ticket-alt fa-lg text-light"></i>
                      {ticketIcon}
                    </NavLink>
                  </li>
                  <li className="nav-item mt-2 mr-2 ml-3 text-white">
                    <span>Welcome, {props.accountName}</span>
                  </li>
                  <li className="nav-item dropleft">
                    <a
                      className="nav-link dropdown-toggle"
                      href="."
                      id="navbarDropdown"
                      role="button"
                      data-toggle="dropdown"
                    >
                      <i className="fas fa-user mr-2"></i>
                    </a>
                    <div
                      className="dropdown-menu"
                      aria-labelledby="navbarDropdown"
                    >
                      <a
                        className="dropdown-item"
                        href="https://www.office.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Office 365
                      </a>
                      <a
                        className="dropdown-item"
                        href="https://outlook.office.com"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Mail
                      </a>
                      <div className="dropdown-divider"></div>
                      <button
                        className="btn btn-link dropdown-item"
                        onClick={console.log("Logout")}
                      >
                        Logout
                      </button>
                    </div>
                  </li>
                </ul>
          </div>
        </nav>
      </header>
      {/* Sidebar */}
      <div className="wrapper">
        <SideNav
          handleSideNavWidth={handleSideNavWidth}
          sideNavWidth={sideNavWidth}
        />
        {/* Main App Section */}
        <div id="content" className=" border-right-0  ml-1 mr-2 my-1">
          <main>
            <Switch>
              {/* Dashboard */}
              <Route path="/" component={Dashboard} exact />
              {/* Check-in */}
              <Route
                path="/App/CheckIn"
                component={() => <CheckIn account={props.account} />}
              />
              {/* Search */}
              <Route
                path="/App/Search"
                render={(props) => (
                  <Search {...props} account={props.account} />
                )}
              />
              {/*<Route path="/App/Search" component={Search} />*/}
              {/* Bulk Search */}
              <Route path="/App/BulkSearch" component={BulkSearch} />
              {/* Batch Change */}
              <Route
                path="/App/BatchChange"
                component={() => <BatchChange account={props.account} />}
              />
              {/* Bulk Search */}
              <Route
                path="/App/ShippingTickets"
                component={() => <ShippingTickets account={props.account} />}
              />
              {/* Statistics */}
              <Route path="/App/Statistics" component={Statistics} />
              {/* Ticketing System */}
              <Route
                path="/App/Tickets"
                component={() => <Tickets account={props.account} />}
              />
              {/* Everything Else */}
              <Route path="*" component={() => "Error 404 Not Found"} />
            </Switch>
          </main>
          {/* Footer  */}
          <Footer />
        </div>
      </div>
    </div>
  );
}
