import React from "react";
import { injectIntl } from "react-intl";
import { withRouter } from "react-router-dom";
import { withDefault } from "lib/TranslatedMessage";

import ValidatedSearch from "./ValidatedSearch";

class GlobalSearch extends React.PureComponent {
  state = {
    search: "",
    type: null,
    valid: false
  };

  onSubmit(e) {
    if (e) e.preventDefault();

    console.log("Submit!");

    const { search, valid, type } = this.state;
    const { history } = this.props;

    if (!valid) return;

    history.push(`/explorer/${type}/${search}`);
    this.setState({ search: "", valid: false });
  }

  render() {
    const { formatMessage } = this.props.intl;
    return (
      <form onSubmit={this.onSubmit.bind(this)}>
        <ValidatedSearch
          placeholder={formatMessage(withDefault({ id: "search" }))}
          onChange={({ search, type, valid }) =>
            this.setState({ search, type, valid })
          }
          onSubmit={this.onSubmit.bind(this)}
        />
      </form>
    );
  }
}

export default withRouter(injectIntl(GlobalSearch));
