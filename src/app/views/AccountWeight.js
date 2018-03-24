import React from 'react'
import FontAwesome from 'react-fontawesome'
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

  displayWeight() {
    const { weight } = this.state;
    if (weight === null) return 0;

    return Math.round(weight * 1000000.0) / 1000000.0;
  }

  render() {
    return (
      <div className="AccountEntry row justify-content-end mr-0">
        <div className="col-md-6 p-4 text-sm-right">
          <b>Account weight:</b> {this.displayWeight()}
        </div>
      </div>
    )
  }
}
