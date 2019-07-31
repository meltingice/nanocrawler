import React from "react";
import { apiClient } from "./Client";

const NetworkContext = React.createContext({
  representativesOnline: {},
  peers: [],
  onlineStake: "0"
});

class NetworkProvider extends React.Component {
  state = {
    representativesOnline: {},
    peers: [],
    onlineStake: "0"
  };

  componentDidMount() {
    this.updateData();
  }

  async updateData() {
    const representativesOnline = await apiClient.representativesOnline();
    const peers = await apiClient.peers();
    const confirmationQuorum = await apiClient.confirmationQuorum();

    this.setState(
      {
        representativesOnline,
        peers,
        onlineStake: confirmationQuorum.online_stake_total
      },
      () => {
        setTimeout(this.updateData.bind(this), 300000);
      }
    );
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
