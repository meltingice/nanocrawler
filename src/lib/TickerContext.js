import React from "react";
import { apiClient } from "lib/Client";

const TickerContext = React.createContext({
  priceUSD: 0,
  priceBTC: 0
});

class TickerProvider extends React.Component {
  state = {
    priceUSD: 0,
    priceBTC: 0
  };

  componentDidMount() {
    this.updateTicker();
  }

  async updateTicker() {
    const ticker = await this.fetchTicker();
    this.setState({ ...ticker });

    setTimeout(this.updateTicker.bind(this), 900000);
  }

  async fetchTicker() {
    const ticker = await apiClient.ticker();
    this.setState({
      priceUSD: ticker.USD,
      priceBTC: ticker.BTC
    });
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
