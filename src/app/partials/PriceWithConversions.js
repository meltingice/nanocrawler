import React, { Fragment } from "react";
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

  getConvertedValues() {
    const { amount, usd, btc } = this.props;
    const { ticker } = this.state;
    if (!ticker) return;

    let conversions = [];
    if (usd)
      conversions.push(
        accounting.formatMoney(amount * parseFloat(ticker.price_usd, 10))
      );
    if (btc)
      conversions.push(
        accounting.formatMoney(
          amount * parseFloat(ticker.price_btc, 10),
          "₿",
          6
        )
      );

    return ` / ${conversions.join(" / ")}`;
  }

  render() {
    const { amount } = this.props;

    return (
      <Fragment>
        {accounting.formatNumber(amount, 6)} NANO {this.getConvertedValues()}
      </Fragment>
    );
  }
}
