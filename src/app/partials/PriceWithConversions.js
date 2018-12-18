import React, { Fragment } from "react";
import { FormattedNumber } from "react-intl";
import { withTicker } from "lib/TickerContext";
import Currency from "lib/Currency";
import config from "client-config.json";

class PriceWithConversions extends React.PureComponent {
  static defaultProps = {
    currencies: ["base"],
    precision: {
      base: 6,
      btc: 6,
      usd: 2
    }
  };

  get amount() {
    if (this.props.raw) {
      return Currency.fromRaw(this.props.amount);
    }

    return parseFloat(this.props.amount, 10);
  }

  getValueForCurrency(cur) {
    const { ticker } = this.props;
    if (!ticker) return 0;

    switch (cur) {
      case "base":
        return this.amount;
      case "usd":
        return this.amount * parseFloat(ticker.priceUSD, 10);
      case "btc":
        return this.amount * parseFloat(ticker.priceBTC, 10);
      default:
        return new Error(`${cur} is not currently supported`);
    }
  }

  getDisplayValueForCurrency(cur) {
    const value = this.getValueForCurrency(cur);

    switch (cur) {
      case "base":
        return (
          <Fragment key="base">
            <FormattedNumber
              value={value}
              minimumFractionDigits={Math.min(2, this.props.precision.base)}
              maximumFractionDigits={this.props.precision.base}
            />{" "}
            {config.currency.shortName}
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
