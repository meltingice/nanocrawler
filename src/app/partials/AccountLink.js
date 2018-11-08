import React, { Fragment } from "react";
import VisibilitySensor from "react-visibility-sensor";
import { Link } from "react-router-dom";
import NanoNodeNinja from "lib/NanoNodeNinja";

export default class AccountLink extends React.PureComponent {
  state = { ninjaData: null, loading: false };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.account !== this.props.account && this.props.ninja) {
      this.setState({ ninjaData: null, loading: false });
    }
  }

  async fetchNinjaData() {
    this.setState({ loading: true }, async () => {
      const ninja = new NanoNodeNinja(this.props.account);
      await ninja.fetch();
      this.setState({
        loading: false,
        ninjaData: ninja.hasAccount() ? ninja.data : false
      });
    });
  }

  accountName() {
    const { name, account, short, ninja } = this.props;
    const { ninjaData } = this.state;

    let accountName = name || account;
    if (!name && short) {
      accountName = `${account.substr(0, 9)}...${account.substr(-5)}`;
    }

    accountName = <span className="text-monospace">{accountName}</span>;

    if (ninja && ninjaData && ninjaData.alias) {
      accountName = (
        <Fragment>
          <b>{ninjaData.alias}</b> - {accountName}
        </Fragment>
      );
    }

    return accountName;
  }

  visibilityChanged(visible) {
    const { ninja } = this.props;
    if (!ninja) return;

    const { loading, ninjaData } = this.state;

    if (visible && !loading && ninjaData === null) {
      this.fetchNinjaData();
    }
  }

  render() {
    const {
      account,
      name,
      short,
      ninja,
      delegators,
      ...otherProps
    } = this.props;
    if (!account) return null;

    return (
      <VisibilitySensor onChange={this.visibilityChanged.bind(this)}>
        <Link
          className="break-word"
          to={`/explorer/account/${account}/${
            delegators ? "delegators" : "history"
          }`}
          {...otherProps}
        >
          {this.accountName()}
        </Link>
      </VisibilitySensor>
    );
  }
}
