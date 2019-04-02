import React from "react";
import { apiClient } from "./Client";

const NetworkContext = React.createContext({
  representativesOnline: {}
});

class NetworkProvider extends React.Component {
  state = {
    representativesOnline: {},
    genesisBalance: "0"
  };

  componentDidMount() {
    this.updateData();
  }

  async updateData() {
    const representativesOnline = await apiClient.representativesOnline();
    const genesisBalance = (await apiClient.account(
      config.currency.genesisAccount
    )).balance;

    this.setState({ representativesOnline, genesisBalance }, () => {
      setTimeout(this.updateData.bind(this), 300000);
    });
  }

  render() {
    return (
      <NetworkContext.Provider value={this.state}>
        {this.props.children}
      </NetworkContext.Provider>
    );
  }
}

const withNetworkData = WrappedComponent => {
  return function NetworkConsumer(props) {
    return (
      <NetworkContext.Consumer>
        {network => <WrappedComponent network={network} {...props} />}
      </NetworkContext.Consumer>
    );
  };
};

export { NetworkProvider, withNetworkData };
