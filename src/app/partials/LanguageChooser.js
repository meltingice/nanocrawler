import React from "react";
import { injectIntl } from "react-intl";
import map from "lodash/map";

import config from "../../client-config.json";
import { withTranslations } from "lib/TranslationContext";

class LanguageChooser extends React.PureComponent {
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
          className="btn btn-secondary dropdown-toggle"
          type="button"
          aria-haspopup="true"
          aria-expanded="false"
          onClick={() => this.setState({ menuOpen: !this.state.menuOpen })}
        >
          <i className="fa fa-globe" /> {this.languageToName(locale.language)}
        </button>
        <div
          className={`dropdown-menu dropdown-menu-right ${
            menuOpen ? "d-block" : ""
          }`}
        >
          {map(supportedLanguages, (name, code) => (
            <button
              key={code}
              className="dropdown-item"
              onClick={() => this.setLanguage(code)}
              style={{ cursor: "pointer" }}
            >
              {name}
            </button>
          ))}
        </div>
      </div>
    );
  }
}

export default withTranslations(LanguageChooser);
