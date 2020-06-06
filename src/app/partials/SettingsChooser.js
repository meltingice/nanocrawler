import React from "react";
import { injectIntl } from "react-intl";
import map from "lodash/map";

import config from "../../client-config.json";
import { withTranslations } from "lib/TranslationContext";

import "./SettingsChooser.css";

class SettingsChooser extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      menuOpen: false
    };
  }

  toggle() {
    this.setState(prevState => ({
      menuOpen: !prevState.menuOpen
    }));
  }

  languageToName(lang) {
    const { supportedLanguages } = config.features;
    const languageWithoutRegionCode = lang.toLowerCase().split(/[_-]+/)[0];

    return (
      supportedLanguages[lang] || supportedLanguages[languageWithoutRegionCode]
    );
  }

  setLanguage(code) {
    const { locale } = this.props;
    locale.setLanguage(code);
    this.setState({ menuOpen: false });
  }

  render() {
    const { locale } = this.props;
    const { menuOpen } = this.state;
    const { supportedLanguages } = config.features;

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
          <button className="dropdown-item" style={{ cursor: "pointer" }}>
            <div className="row flex-nowrap justify-content-between px-2">
              <span>Dark Mode</span>
              <span className="ml-3">
                <label className="switch my-auto">
                  <input type="checkbox"></input>
                  <span className="slider round"></span>
                </label>
              </span>
            </div>
          </button>
          <button className="dropdown-item" style={{ cursor: "pointer" }}>
            <div className="row flex-nowrap justify-content-between px-2">
              <span>Natricon</span>
              <span className="ml-3">
                <label className="switch my-auto">
                  <input type="checkbox"></input>
                  <span className="slider round"></span>
                </label>
              </span>
            </div>
          </button>
        </div>
      </div >
    );
  }
}

export default withTranslations(SettingsChooser);
