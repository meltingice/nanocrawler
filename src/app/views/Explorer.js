import React from "react";
import { Helmet } from "react-helmet";
import { withRouter, Link } from "react-router-dom";
import { TranslatedMessage } from "lib/TranslatedMessage";

import RandomVerifiedAccounts from "app/partials/explorer/RandomVerifiedAccounts";
import ExplorerTopAccounts from "app/partials/explorer/ExplorerTopAccounts";
import RecentBlockStream from "app/partials/explorer/RecentBlockStream";

class Explorer extends React.PureComponent {
  state = {
    search: "",
    error: false
  };

  handleSubmit(e) {
    e.preventDefault();
    const { history } = this.props;
    const { search } = this.state;

    if (/^\w+_[A-Za-z0-9]{59,60}$/.test(search)) {
      history.push(`/explorer/account/${search}`);
    } else if (/[A-F0-9]{64}/.test(search)) {
      history.push(`/explorer/block/${search}`);
    } else {
      this.setState({ error: true });
    }
  }

  render() {
    const { search, error } = this.state;

    return (
      <div className="row justify-content-center my-5 mx-0">
        <Helmet>
          <title>Network Explorer</title>
        </Helmet>

        <div className="col col-md-8">
          <h1>
            <TranslatedMessage id="explorer.title" />
          </h1>

          <hr />

          <form className="my-5" onSubmit={this.handleSubmit.bind(this)}>
            <label>
              <TranslatedMessage id="explorer.form.help" />
            </label>

            <div className="form-row">
              <div className="col-md">
                <input
                  type="text"
                  className={`form-control form-control-lg ${
                    error ? "is-invalid" : ""
                  }`}
                  value={search}
                  onChange={e => this.setState({ search: e.target.value })}
                />
              </div>
              <div className="col-auto mt-2 mt-md-0">
                <button className="btn btn-nano-primary btn-lg">
                  <TranslatedMessage id="search" />
                </button>
              </div>
            </div>
          </form>

          <RandomVerifiedAccounts count={5} />

          <div className="mt-5">
            <ExplorerTopAccounts count={5} />
          </div>

          <div className="mt-5">
            <RecentBlockStream count={10} />
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Explorer);
