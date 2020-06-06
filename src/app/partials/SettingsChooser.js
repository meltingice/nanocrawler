import React from "react";
import Cookies from "js-cookie";
import { injectIntl } from "react-intl";
import { withDefault } from "lib/TranslatedMessage";
import { withNatriconData } from "lib/NatriconContext";
import config from "client-config.json";

import "./SettingsChooser.css";

class SettingsChooser extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      menuOpen: false
    };
  }

  isDarkTheme() {
    let cookieVal = Cookies.get("nanocrawler.theme")
    let enabled = cookieVal === "dark"
    if (cookieVal === undefined) {
      enabled = config.features.defaultDarkTheme || false
    }
    return enabled
  }

  darkChanged(event) {
    if (event.target.checked) {
      Cookies.set("nanocrawler.theme", "dark")
      document.body.classList.add("theme-dark")
    } else {
      Cookies.set("nanocrawler.theme", "light")
      document.body.classList.remove("theme-dark")
    }
    setTimeout(() => {
      this.setState({ menuOpen: false });
    }, 150);
  }

  natriconOn() {
    const { natricon } = this.props
    return natricon.enabled;
  }

  natriconChanged(event) {
    const { natricon } = this.props
    natricon.setNatricon(event.target.checked)
    setTimeout(() => {
      this.setState({ menuOpen: false });

    }, 150);
  }

  toggle() {
    this.setState(prevState => ({
      menuOpen: !prevState.menuOpen
    }));
  }

  render() {
    const { menuOpen } = this.state;
    const { formatMessage } = this.props.intl;

    return (
      <div className="dropdown">
        <button
          className="btn btn-secondary"
          type="button"
          aria-haspopup="true"
          aria-expanded="false"
          onClick={() => this.setState({ menuOpen: !this.state.menuOpen })}
        >
          <i className="fa fa-cog" />
        </button>
        <div
          className={`dropdown-menu dropdown-menu-right ${
            menuOpen ? "d-block" : ""
            }`}
        >
          <label className="dropdown-item py-2" style={{ cursor: "pointer" }}>
            <div className="row flex-nowrap justify-content-between px-2">
              <span>{formatMessage(withDefault({ id: "theme.darkmode" }))}</span>
              <span className="ml-3">
                <label className="switch my-auto">
                  <input type="checkbox"
                    defaultChecked={this.isDarkTheme()}
                    onChange={e => this.darkChanged(e)}></input>
                  <span className="slider round"></span>
                </label>
              </span>
            </div>
          </label>
          <label className="dropdown-item py-2" style={{ cursor: "pointer" }}>
            <div className="row flex-nowrap justify-content-between px-2">
              <span>{formatMessage(withDefault({ id: "natricon" }))}</span>
              <span className="ml-3">
                <label className="switch my-auto">
                  <input type="checkbox"
                    defaultChecked={this.natriconOn()}
                    onChange={e => this.natriconChanged(e)}></input>
                  <span className="slider round"></span>
                </label>
              </span>
            </div>
          </label>
        </div>
      </div >
    );
  }
}

export default withNatriconData(injectIntl(SettingsChooser));
