import React from 'react'
import accounting from 'accounting'
import Client from '../../lib/Client'

import './AccountWeight.css'

export default class AccountWeight extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      weight: null
    }

    this.client = new Client();
  }

  async componentWillMount() {
    const weight = await this.client.weight();
    this.setState({ weight });
  }

  displayAccount() {
    const { account } = this.props;
    if (!this.props.account) return;

    return `${account.substr(0, 9)}...${account.substr(-5)}`
  }

  displayWeight() {
    const { weight } = this.state;
    if (weight === null) return 0;

    return accounting.formatNumber(Math.round(weight * 1000000.0) / 1000000.0);
  }

  render() {
    return (
      <div className="AccountEntry row justify-content-end mr-0">
        <div className="col p-4 text-sm-right">
          <p className="mb-0">
            <b>Account:</b> <a
              href={`https://nanode.co/account/${this.props.account}`}
              target="_blank"
              className="text-white">{this.displayAccount()}
            </a>
          </p>
          <p className="mb-0"><b>Weight:</b> {this.displayWeight()} NANO</p>
        </div>
      </div>
    )
  }
}
