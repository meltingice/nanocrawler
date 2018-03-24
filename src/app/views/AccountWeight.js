import React from 'react'
import './AccountWeight.css'

export default class AccountWeight extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      weight: null
    }
  }

  async componentWillMount() {
    const resp = await fetch("http://localhost:3001/weight");
    const data = await resp.json();
    this.setState({ weight: data.weight });
  }

  displayAccount() {
    const { account } = this.props;
    if (!this.props.account) return;

    return `${account.substr(0, 9)}...${account.substr(-5)}`
  }

  displayWeight() {
    const { weight } = this.state;
    if (weight === null) return 0;

    return Math.round(weight * 1000000.0) / 1000000.0;
  }

  render() {
    return (
      <div className="AccountEntry row justify-content-end mr-0">
        <div className="col p-4 text-sm-right">
          <p className="mb-0"><b>Account:</b> {this.displayAccount()}</p>
          <p className="mb-0"><b>Weight:</b> {this.displayWeight()}</p>
        </div>
      </div>
    )
  }
}
