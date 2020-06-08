import React from "react";
import { injectIntl } from "react-intl";
import { withDefault } from "lib/TranslatedMessage";
import { withNatriconData } from "lib/NatriconContext";

import "./SettingsChooser.css";

class SettingsChooser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuOpen: false
    };
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
    const { natricon } = this.props;

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
              <span>{formatMessage(withDefault({ id: "natricon" }))}</span>
              <span className="ml-3">
                <label className="switch my-auto">
                  <input type="checkbox"
                    defaultChecked={natricon.natriconOn()}
                    onChange={this.natriconChanged.bind(this)}></input>
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
