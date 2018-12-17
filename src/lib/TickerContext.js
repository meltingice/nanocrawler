import React from "react";

import config from "client-config.json";

const TickerContext = React.createContext({
  BTC: {
    price: "0"
  },
  NANO: {
    price: "0"
  },
  USD: {
    price: "0"
  }
});

class TickerProvider extends React.Component {
  state = {
    BTC: { price: "0" },
    NANO: { price: "0" },
    USD: { price: "0" }
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
    const resp = await fetch(`${config.server}/ticker`, {
      mode: "cors"
    });

    const data = (await resp.json()).data;
    return data.quotes;
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
