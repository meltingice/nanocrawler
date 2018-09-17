import React from "react";
import { injectIntl } from "react-intl";
import _ from "lodash";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";
import injectClient from "lib/ClientComponent";

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
    const { config } = this.props;
    const { supportedLanguages } = config.features;
    const languageWithoutRegionCode = lang.toLowerCase().split(/[_-]+/)[0];

    return (
      supportedLanguages[lang] || supportedLanguages[languageWithoutRegionCode]
    );
  }

  render() {
    const { locale, config } = this.props;
    const { supportedLanguages } = config.features;

    return (
      <Dropdown isOpen={this.state.menuOpen} toggle={this.toggle.bind(this)}>
        <DropdownToggle caret>
          <i className="fa fa-globe" /> {this.languageToName(locale.language)}
        </DropdownToggle>
        <DropdownMenu>
          {_.map(supportedLanguages, (name, code) => (
            <DropdownItem key={code} onClick={() => locale.setLanguage(code)}>
              {name}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    );
  }
}

export default injectClient(LanguageChooser);
