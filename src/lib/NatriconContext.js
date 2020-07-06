import React from "react";
import assign from "lodash/assign";
import Cookies from "js-cookie";
import config from "client-config.json";

const NatriconContext = React.createContext({
  enabled: true,
  setNatricon: () => {}
});

class NatriconProvider extends React.Component {
  state = {
    enabled: true
  };

  componentDidMount() {
    this.setNatricon(this.natriconOn());
  }

  natriconOn() {
    let cookieVal = Cookies.get("nanocrawler.natriconOn")
    let enabled
    if (cookieVal === undefined) {
      enabled = config.features.defaultNatriconOn || false
    } else {
      enabled = cookieVal === "true"
    }
    return enabled
  }

  async setNatricon(toOn) {
    this.setState({ enabled: toOn }, () => {
      Cookies.set("nanocrawler.natriconOn", toOn ? "true" : "false", { expires: 365 });
    });
  }

  render() {
    const data = assign({}, this.state, {
      setNatricon: this.setNatricon.bind(this),
      natriconOn: this.natriconOn.bind(this)
    });

    return (
      <NatriconContext.Provider value={data}>
        {this.props.children}
      </NatriconContext.Provider>
    );
  }
}

const withNatriconData = WrappedComponent => {
  return function NatriconConsumer(props) {
    return (
      <NatriconContext.Consumer>
        {natricon => <WrappedComponent natricon={natricon} {...props} />}
      </NatriconContext.Consumer>
    );
  };
};

export { NatriconProvider, withNatriconData };
