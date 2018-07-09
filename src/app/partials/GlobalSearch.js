import React from "react";
import { withRouter } from "react-router-dom";

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
    return (
      <form className="ml-2" onSubmit={this.onSubmit.bind(this)}>
        <input
          type="text"
          className="form-control"
          placeholder="Search for a Nano address or tx"
          value={this.state.search}
          onChange={e => this.setState({ search: e.target.value })}
        />
      </form>
    );
  }
}

export default withRouter(GlobalSearch);
