import React from "react";
import ConfigContext from "./ConfigContext";

export default class ConfigProvider extends React.Component {
  state = { config: null };

  async componentDidMount() {
    const resp = await fetch("/client-config.json");
    let config = await resp.json();
    config.ticker = await this.fetchTicker();

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
