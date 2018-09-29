import React, { Fragment } from "react";
import { FormattedNumber } from "react-intl";
import { withTicker } from "lib/TickerContext";
import config from "client-config.json";

class PriceWithConversions extends React.PureComponent {
  static defaultProps = {
    nano: true,
    precision: {
      nano: 6,
      btc: 6,
      usd: 2
    }
  };

  getValueForCurrency(cur) {
    const { amount, ticker } = this.props;
    if (!ticker) return 0;

    switch (cur) {
      case "nano":
        return amount;
      case "usd":
        return amount * parseFloat(ticker.price_usd, 10);
      case "btc":
        return amount * parseFloat(ticker.price_btc, 10);
      default:
        return new Error(`${cur} is not currently supported`);
    }
  }

  getDisplayValueForCurrency(cur) {
    const value = this.getValueForCurrency(cur);

    switch (cur) {
      case "nano":
        return (
          <Fragment key="nano">
            <FormattedNumber
              value={value}
              maximumFractionDigits={this.props.precision.nano}
            />{" "}
            {config.currency}
          </Fragment>
        );
      case "usd":
        return (
          <FormattedNumber
            key="usd"
            value={value}
            style="currency"
            currency="USD"
          />
        );
      case "btc":
        return (
          <Fragment key="btc">
            ₿<FormattedNumber
              value={value}
              maximumFractionDigits={this.props.precision.btc}
            />
          </Fragment>
        );
      default:
        return null;
    }
  }

  getConvertedValues() {
    const { currencies, ticker } = this.props;
    if (!ticker) return null;

    return currencies
      .map(cur => this.getDisplayValueForCurrency(cur))
      .reduce((prev, cur) => [prev, " / ", cur]);
  }

  render() {
    const { currencies } = this.props;

    if (this.props.children) {
      return this.props.children(
        ...currencies.map(cur => this.getDisplayValueForCurrency(cur))
      );
    } else {
      return this.getConvertedValues();
    }
  }
}

export default withTicker(PriceWithConversions);
