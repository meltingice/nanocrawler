import React from "react";
import ConfigContext from "./ConfigContext";

export default class ConfigProvider extends React.PureComponent {
  state = { config: null };

  async componentDidMount() {
    const resp = await fetch("/client-config.json");
    let config = await resp.json();

    try {
      config.ticker = await this.fetchTicker();
    } catch (e) {
      config.ticker = {
        price_usd: 0,
        price_btc: 0,
        percent_change_1h: 0,
        percent_change_24h: 0
      };
    }

    this.setState({ config }, () =>
      setTimeout(this.updateTicker.bind(this), 300000)
    );
  }

  async updateTicker() {
    let { config } = this.state;
    config.ticker = await this.fetchTicker();
    this.setState({ config });

    setTimeout(this.updateTicker.bind(this), 300000);
  }

  async fetchTicker() {
    const resp = await fetch("https://api.coinmarketcap.com/v1/ticker/nano/", {
      mode: "cors"
    });

    return (await resp.json())[0];
  }

  render() {
    const { config } = this.state;

    return (
      <ConfigContext.Provider value={config}>
        {this.props.children}
      </ConfigContext.Provider>
    );
  }
}
