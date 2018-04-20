import React from "react";
import ReactSVG from "react-svg";
import { NavLink } from "react-router-dom";

import "./Navigation.css";
import Logo from "./images/logo.svg";
import PriceTicker from "./partials/PriceTicker";

export default () => {
  return (
    <div id="Navigation" className="row align-items-center">
      <div className="col-auto my-3">
        <div className="LogoWrap">
          <ReactSVG path={Logo} className="Logo" /> Node Dashboard
        </div>
      </div>

      <div className="col-md">
        <ul className="NavigationList nav">
          <li className="nav-item">
            <NavLink exact to="/" className="nav-link" activeClassName="active">
              Node Status
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              exact
              to="/network"
              className="nav-link"
              activeClassName="active"
            >
              Network Status
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/explorer"
              className="nav-link"
              activeClassName="active"
            >
              Explorer
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              exact
              to="/delegators"
              className="nav-link"
              activeClassName="active"
            >
              Delegators
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="col col-auto d-none d-lg-flex">
        <PriceTicker />
      </div>
    </div>
  );
};
