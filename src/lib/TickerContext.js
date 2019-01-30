import React from "react";
import { apiClient } from "lib/Client";

const TickerContext = React.createContext({
  priceUSD: 0,
  priceBTC: 0
});

class TickerProvider extends React.Component {
  state = {
    priceUSD: 0.012,
    priceBTC: 0
  };

  componentDidMount() {
    this.updateTicker();
  }

  async updateTicker() {
    const ticker = await this.fetchTicker();
    const { price_usd } = ticker;
    const priceBTC = this.state.priceUSD / price_usd;
    this.setState({ priceBTC });

    setTimeout(this.updateTicker.bind(this), 900000);
  }

  async fetchTicker() {
    const resp = await fetch(
      "https://api.coinmarketcap.com/v1/ticker/bitcoin/",
      {
        mode: "cors"
      }
    );

    return (await resp.json())[0];
  }

  render() {
    return (
      <TickerContext.Provider value={this.state}>
        {this.props.children}
      </TickerContext.Provider>
    );
  }
}

const withTicker = WrappedComponent => {
  return function TickerConsumer(props) {
    return (
      <TickerContext.Consumer>
        {ticker => <WrappedComponent ticker={ticker} {...props} />}
      </TickerContext.Consumer>
    );
  };
};

export { TickerProvider, withTicker };
