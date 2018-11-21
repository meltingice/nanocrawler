import React from "react";
import { injectIntl } from "react-intl";
import map from "lodash/map";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";

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

  render() {
    const { locale } = this.props;
    const { supportedLanguages } = config.features;

    return (
      <Dropdown
        isOpen={this.state.menuOpen}
        toggle={this.toggle.bind(this)}
        inNavbar
      >
        <DropdownToggle caret>
          <i className="fa fa-globe" /> {this.languageToName(locale.language)}
        </DropdownToggle>
        <DropdownMenu right>
          {map(supportedLanguages, (name, code) => (
            <DropdownItem key={code} onClick={() => locale.setLanguage(code)}>
              {name}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    );
  }
}

export default withTranslations(LanguageChooser);
