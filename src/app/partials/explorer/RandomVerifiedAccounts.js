import React, { Fragment } from "react";
import _ from "lodash";

import AccountLink from "../AccountLink";

export default class RandomVerifiedAccounts extends React.Component {
  state = { accounts: [] };

  async componentDidMount() {
    const data = await fetch("https://nanonode.ninja/api/accounts/verified", {
      mode: "cors"
    });
    const accounts = await data.json();

    this.setState({ accounts });
  }

  randomAccounts() {
    return _.sampleSize(this.state.accounts, this.props.count);
  }

  render() {
    return (
      <Fragment>
        <h3 className="mb-0">Verified Accounts</h3>
        <p className="text-muted">
          A random sampling of accounts verified with{" "}
          <a
            href="https://nanonode.ninja"
            target="_blank"
            className="text-muted"
          >
            Nano Node Ninja
          </a>
        </p>

        <hr />

        {this.randomAccounts().map(account => (
          <VerifiedAccount account={account} />
        ))}
      </Fragment>
    );
  }
}

const VerifiedAccount = ({ account }) => {
  return (
    <div className="row">
      <div className="col">
        <h5 className="mb-0">{account.alias}</h5>
        <p>
          <AccountLink account={account.account} className="text-muted" />
        </p>
      </div>
    </div>
  );
};
