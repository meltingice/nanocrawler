import React from "react";
import accounting from "accounting";

export default class PriceWithConversions extends React.PureComponent {
  state = {
    ticker: null
  };

  constructor(props) {
    super(props);

    this.fetchData();
  }

  componentWillUpdate(prevProps, prevState) {
    if (prevProps.amount !== this.props.amount) this.fetchData();
  }

  async fetchData() {
    const resp = await fetch("https://api.coinmarketcap.com/v1/ticker/nano/", {
      mode: "cors"
    });
    const ticker = (await resp.json())[0];
    this.setState({ ticker });
  }

  getValueForCurrency(cur) {
    const { amount } = this.props;
    const { ticker } = this.state;
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
        return `${accounting.formatNumber(value, 6)} NANO`;
      case "usd":
        return accounting.formatMoney(value);
      case "btc":
        return accounting.formatMoney(value, "₿", 6);
      default:
        return null;
    }
  }

  getConvertedValues() {
    const { currencies } = this.props;
    const { ticker } = this.state;
    if (!ticker) return null;

    let conversions = currencies.map(cur =>
      this.getDisplayValueForCurrency(cur)
    );
    return conversions.join(" / ");
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
