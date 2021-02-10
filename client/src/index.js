import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
/* import { AzureAD } from "react-aad-msal";
import { authProvider } from "./authProvider"; */

ReactDOM.render(
  <BrowserRouter>
    <App account={"user@something.net"} accountName={"user"} />
  </BrowserRouter>,
  document.getElementById("root")
);
