import React from "react";
import { injectIntl } from "react-intl";
import { withRouter } from "react-router-dom";
import { withDefault } from "lib/TranslatedMessage";

class GlobalSearch extends React.PureComponent {
  state = {
    search: ""
  };

  onSubmit(e) {
    const { search } = this.state;
    const { history } = this.props;

    e.preventDefault();
    history.push(`/explorer/auto/${search}`);
    this.setState({ search: "" });
  }

  render() {
    const { formatMessage } = this.props.intl;
    return (
      <form className="ml-2" onSubmit={this.onSubmit.bind(this)}>
        <input
          type="text"
          className="form-control"
          placeholder={formatMessage(withDefault({ id: "search" }))}
          value={this.state.search}
          onChange={e => this.setState({ search: e.target.value })}
        />
      </form>
    );
  }
}

export default withRouter(injectIntl(GlobalSearch));
