import React from 'react'
import FontAwesome from 'react-fontawesome'
import './AccountEntry.css'

export default class AccountEntry extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      edit: false
    }
  }

  render() {
    let content = null;
    if (this.state.edit) {
      content = this.editMode();
    } else {
      content = this.displayMode();
    }

    return (
      <div className="AccountEntry row justify-content-end mr-0">
        <div className="col-md-6 p-4 text-sm-right">{content}</div>
      </div>
    )
  }

  emptyState() {
    return (
      <span onClick={() => this.setState({ edit: true })}>
        <FontAwesome name="pencil" /> Add your representative account to enable more features
      </span>
    )
  }

  editMode() {
    const { account, onChange } = this.props;

    return (
      <div className="row align-items-center">
        <div className="col">
          <input
            className="form-control"
            placeholder="Enter account: xrb_"
            value={account}
            onChange={e => onChange(e.target.value)}
          />
        </div>
        <div className="col col-auto pl-0">
          <span onClick={() => this.setState({ edit: false })}>
            <FontAwesome name="check" /> Done
          </span>
        </div>
      </div>
    )
  }

  displayMode() {
    const { account } = this.props;
    if (!account || account.length === 0) return this.emptyState();

    const truncatedAccount = account.substr(0, 16);

    return (
      <span>
        <b>Active account:</b> {truncatedAccount}...&nbsp;
        <span onClick={() => this.setState({ edit: true })}><FontAwesome name="pencil" /></span>
      </span>
    )
  }
}
