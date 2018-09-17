import React from "react";
import _ from "lodash";
import Cookies from "js-cookie";
import ConfigContext from "./ConfigContext";

export default class ConfigProvider extends React.Component {
  state = { config: null };

  constructor(props) {
    super(props);

    const language =
      Cookies.get("nanocrawler.locale") ||
      (navigator.languages && navigator.languages[0]) ||
      navigator.language ||
      navigator.userLanguage;

    this.state = {
      config: null,
      language
    };
  }

  async componentDidMount() {
    const resp = await fetch("/client-config.json");
    const config = await resp.json();

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

  setLanguage(language) {
    this.setState({ language }, () => {
      Cookies.set("nanocrawler.locale", language);
    });
  }

  render() {
    let { config } = this.state;

    if (config) {
      config = _.merge({}, config, {
        locale: {
          language: this.state.language,
          setLanguage: this.setLanguage.bind(this)
        }
      });
    }

    return (
      <ConfigContext.Provider value={config}>
        {this.props.children}
      </ConfigContext.Provider>
    );
  }
}
