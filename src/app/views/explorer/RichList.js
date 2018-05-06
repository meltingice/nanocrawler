import React, { Fragment } from "react";
import _ from "lodash";
import accounting from "accounting";
import injectClient from "../../../lib/ClientComponent";

import AccountLink from "../../partials/AccountLink";
import PriceWithConversions from "../../partials/PriceWithConversions";

class RichList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      accounts: [],
      officialRepresentatives: {}
    };
  }

  async componentDidMount() {
    const accounts = await this.props.client.richList();
    const officialRepresentatives = await this.props.client.officialRepresentatives();
    this.setState({ accounts, officialRepresentatives });
  }

  render() {
    const { officialRepresentatives } = this.state;

    return (
      <div className="p-4">
        <div className="row justify-content-center my-5 mx-0">
          <div className="col col-md-10">
            <h1 className="mb-0">Largest Accounts</h1>
            <p className="text-muted">Sorted by balance</p>

            <hr />

            {this.state.accounts.map(account => (
              <TopAccount
                key={account.account}
                account={account}
                officialRepresentatives={officialRepresentatives}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
}

const TopAccount = ({ account, officialRepresentatives }) => {
  const repStatus = _.keys(officialRepresentatives).includes(
    account.representative
  )
    ? "text-danger"
    : "text-muted";

  return (
    <Fragment>
      <div className="row">
        <div className="col">
          <h5 className="mb-0">
            <AccountLink
              account={account.account}
              className="text-dark break-word"
              ninja
            />
          </h5>
          <p className={repStatus}>
            Represented by{" "}
            <AccountLink
              account={account.representative}
              className={`${repStatus} break-word`}
              ninja
              short
            />
          </p>
        </div>
        <div className="col-auto text-right">
          <PriceWithConversions
            amount={account.balance}
            currencies={["nano", "usd", "btc"]}
            precision={{ nano: 0, usd: 2, btc: 2 }}
          >
            {(nano, usd, btc) => (
              <Fragment>
                <h5 className="mb-0">{nano}</h5>

                <p className="text-muted mb-0">
                  {usd} / {btc}
                </p>
              </Fragment>
            )}
          </PriceWithConversions>
        </div>
      </div>

      <hr />
    </Fragment>
  );
};

export default injectClient(RichList);
