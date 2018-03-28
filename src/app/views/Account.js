import React from 'react'
import Client from '../../lib/Client'

export default class Account extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    }
  }

  render() {
    return (
      <div className="p-4">
        <div className="row">
          <div className="col">
            <h1>Account</h1>
          </div>
        </div>

        <hr />
      </div>
    )
  }
}
