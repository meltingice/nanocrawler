import React from "react";
import { injectIntl } from "react-intl";
import { withRouter } from "react-router-dom";
import { withDefault } from "lib/TranslatedMessage";

import ValidatedSearch from "./ValidatedSearch";

class GlobalSearch extends React.PureComponent {
  state = {
    search: "",
    valid: false
  };

  onSubmit(e) {
    const { search, valid } = this.state;
    const { history } = this.props;

    if (!valid) return;

    e.preventDefault();
    history.push(`/explorer/auto/${search}`);
    this.setState({ search: "", valid: false });
  }

  render() {
    const { formatMessage } = this.props.intl;
    return (
      <form className="ml-2" onSubmit={this.onSubmit.bind(this)}>
        <ValidatedSearch
          className="form-control"
          placeholder={formatMessage(withDefault({ id: "search" }))}
          onChange={({ search, valid }) => this.setState({ search, valid })}
          value={this.state.search}
        />
      </form>
    );
  }
}

export default withRouter(injectIntl(GlobalSearch));
