import React from 'react'
import _ from 'lodash'

import './Peers.css'

export default class Peers extends React.Component {
  constructor(props) {
    super(props);

    this.statTimer = null;
    this.state = {
      peers: {}
    }
  }

  componentWillMount() {
    this.updateStats();
  }

  componentWillUnmount() {
    if (this.statTimer) {
      clearTimeout(this.statTimer);
      this.statTimer = null;
    }
  }

  async updateStats() {
    // const data = await RaiBlocks.peers();
    // this.setState({ peers: data.peers });

    this.statTimer = setTimeout(this.updateStats.bind(this), 5000);
  }

  render() {
    return (
      <div className="p-4">
        <div className="row">
          <div className="col">
            <div className="row align-items-center">
              <div className="col">
                <h1>Peers</h1>
              </div>
              <div className="col col-auto">
                <h4 className="text-muted">{_.keys(this.state.peers).length} connected</h4>
              </div>
            </div>

            <hr />

            <ul className="PeerList">
              {this.getPeerList()}
            </ul>
          </div>
        </div>
      </div>
    )
  }

  getPeerList() {
    return _.map(this.state.peers, (version, peer) => {
      return <li key={peer}>{peer} (version {version})</li>
    });
  }
}
