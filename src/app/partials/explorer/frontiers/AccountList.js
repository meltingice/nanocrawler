import React, { Fragment } from "react";
import { FormattedNumber } from "react-intl";
import VisibilitySensor from "react-visibility-sensor";
import AccountLink from "app/partials/AccountLink";
import PriceWithConversions from "app/partials/PriceWithConversions";
import { apiClient } from "lib/Client";
import Currency from "lib/Currency";

class Account extends React.PureComponent {
  state = {
    weight: null,
    loading: false
  };

  visibilityChanged(visible) {
    const { weight, loading } = this.state;
    if (weight === null && !loading && visible) {
      this.loadWeight();
    }
  }

  loadWeight() {
    this.setState({ loading: true }, async () => {
      const weight = await apiClient.weight(this.props.account);
      this.setState({ weight: Currency.fromCents(weight), loading: false });
    });
  }

  accountWeight() {
    const { weight, loading } = this.state;

    if (!loading && weight > 0) {
      return (
        <p className="mb-0">
          <span className="badge badge-info">Representative</span>{" "}
          <span className="text-muted">
            <FormattedNumber value={weight} maximumFractionDigits={6} /> NANO
            weight
          </span>
        </p>
      );
    }

    return null;
  }

  render() {
    const { account, balance, rank } = this.props;

    return (
      <VisibilitySensor onChange={this.visibilityChanged.bind(this)}>
        <div className="row align-items-center">
          <div className="col-md-8 mb-2 mb-lg-0">
            <div className="row align-items-center">
              <div className="col-auto">
                <h4 className="mb-0">
                  #<FormattedNumber value={rank} />
                </h4>
              </div>
              <div className="col-lg">
                <p className="mb-0">
                  <AccountLink
                    account={account}
                    ninja
                    className="text-dark break-word"
                  />
                </p>

                {this.accountWeight()}
              </div>
            </div>
          </div>
          <div className="col text-left text-md-right">
            <PriceWithConversions cents amount={balance}>
              {base => (
                <Fragment>
                  <h5 className="mb-0">{base}</h5>
                </Fragment>
              )}
            </PriceWithConversions>
          </div>
        </div>
      </VisibilitySensor>
    );
  }
}

export default function AccountList({ perPage, page, accounts }) {
  return (
    <div className="row">
      <div className="col">
        {accounts.map((account, i) => (
          <Fragment key={account.account}>
            <Account {...account} rank={perPage * (page - 1) + i + 1} />
            <hr />
          </Fragment>
        ))}
      </div>
    </div>
  );
}
