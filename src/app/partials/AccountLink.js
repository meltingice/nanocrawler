import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import NanoNodeNinja from "../../lib/NanoNodeNinja";

export default class AccountLink extends React.Component {
  state = { ninjaData: null };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.account !== this.props.account && this.props.ninja) {
      this.fetchNinjaData();
    }
  }

  componentDidMount() {
    if (this.props.ninja) {
      this.fetchNinjaData();
    }
  }

  async fetchNinjaData() {
    const ninja = new NanoNodeNinja(this.props.account);
    await ninja.fetch();
    if (ninja.hasAccount()) {
      this.setState({ ninjaData: ninja.data });
    }
  }

  accountName() {
    const { name, account, short, ninja } = this.props;
    const { ninjaData } = this.state;

    let accountName = name || account;
    if (!name && short) {
      accountName = `${account.substr(0, 9)}...${account.substr(-5)}`;
    }

    if (ninja && ninjaData && ninjaData.alias) {
      accountName = (
        <Fragment>
          <b>{ninjaData.alias}</b> - {accountName}
        </Fragment>
      );
    }

    return accountName;
  }

  render() {
    const { account, name, short, ninja, ...otherProps } = this.props;
    if (!account) return null;

    return (
      <Link
        className="break-word"
        to={`/explorer/account/${account}/history`}
        {...otherProps}
      >
        {this.accountName()}
      </Link>
    );
  }
}
