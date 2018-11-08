import React from "react";
import { injectIntl } from "react-intl";
import { withRouter } from "react-router-dom";
import { withDefault } from "lib/TranslatedMessage";

import ValidatedSearch from "./ValidatedSearch";

class GlobalSearch extends React.PureComponent {
  state = {
    search: "",
    valid: false,
    type: null
  };

  onSubmit(e) {
    e.preventDefault();

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
          clearOnEnter
          className="form-control"
          placeholder={formatMessage(withDefault({ id: "search" }))}
          onChange={({ search, valid, type }) =>
            this.setState({ search, valid, type })
          }
        />
      </form>
    );
  }
}

export default withRouter(injectIntl(GlobalSearch));
