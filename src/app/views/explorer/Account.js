import React, { Fragment } from "react";
import { Helmet } from "react-helmet";
import keys from "lodash/keys";
import isEmpty from "lodash/isEmpty";
import { NavLink } from "react-router-dom";
import Clipboard from "react-clipboard.js";
import { injectIntl, FormattedNumber } from "react-intl";
import { TranslatedMessage, withDefault } from "lib/TranslatedMessage";
import { withNetworkData } from "lib/NetworkContext";
import { withNatriconData } from "lib/NatriconContext";
import Currency from "lib/Currency";

import NanoNodeNinja from "lib/NanoNodeNinja";
import Natricon from "app/partials/Natricon";

import AccountLink from "app/partials/AccountLink";
import AccountQR from "app/partials/AccountQR";
import PriceWithConversions from "app/partials/PriceWithConversions";
import NodeNinjaAccount from "app/partials/explorer/account/NodeNinjaAccount";

import AccountHistory from "app/partials/explorer/account/AccountHistory";
import AccountDelegators from "app/partials/explorer/account/AccountDelegators";

import config from "client-config.json";
import withAccountData from "./AccountDataProvider";

class Account extends React.Component {
  state = { uptime: null };

  componentDidMount() {
    this.fetchUptime();
  }

  async fetchUptime() {
    const { account } = this.props;
    const ninja = new NanoNodeNinja(account);
    await ninja.fetch();

    if (ninja.hasAccount()) {
      this.setState({ uptime: ninja.data.uptime });
    }
  }

  hasDelegatedWeight() {
    const { weight } = this.props;
    return Currency.fromRaw(weight) > 0;
  }

  accountTitle() {
    const { formatMessage } = this.props.intl;
    const { account, weight, unopened } = this.props;

    if (account === config.donationAddress) {
      return formatMessage(withDefault({ id: "account.title.donation" }));
    }

    const mnano = Currency.fromRaw(weight);

    if (mnano >= Currency.fromRaw(this.props.network.onlineStake) * 0.001)
      return formatMessage(withDefault({ id: "account.title.rebroadcasting" }));
    if (mnano > 0)
      return formatMessage(withDefault({ id: "account.title.representative" }));
    if (unopened)
      return formatMessage(withDefault({ id: "account.title.unopened" }));
    return formatMessage(withDefault({ id: "account.title.normal" }));
  }

  representativeOnline() {
    const { representative, network } = this.props;
    return keys(network.representativesOnline).includes(representative);
  }

  representativeOnlineStatus() {
    const { formatMessage } = this.props.intl;

    return this.representativeOnline() ? (
      <span className="badge badge-success mr-1">
        <TranslatedMessage id="account.rep.online" />
      </span>
    ) : (
        <span
          className="badge badge-danger mr-1 tooltipped tooltipped-e tooltipped-multiline"
          aria-label={formatMessage(
            withDefault({ id: "account.rep_offline.desc" })
          )}
        >
          <TranslatedMessage id="account.rep.offline" />
        </span>
      );
  }

  accountVersionBadge() {
    const { version } = this.props;
    const { formatMessage } = this.props.intl;

    return (
      <span
        className="badge badge-info mr-1 tooltipped tooltipped-n tooltipped-multiline"
        aria-label={formatMessage(
          withDefault({ id: `account.version.${version}` })
        )}
        style={{ cursor: "help" }}
      >
        Version {version} <i className="fa fa-question-circle" />
      </span>
    );
  }

  representativeOfflineWarning() {
    const { representativesOnline } = this.props.network;
    if (isEmpty(representativesOnline)) return;
    if (!this.hasDelegatedWeight()) return;
    if (!this.state.uptime || this.state.uptime > 95) return;

    return (
      <div className="alert alert-warning">
        <TranslatedMessage
          id="account.rep_offline_warning"
          values={{
            uptime: (
              <Fragment>
                <FormattedNumber
                  value={this.state.uptime}
                  maximumFractionDigits={2}
                />
                %
              </Fragment>
            ),
            link: (
              <a
                href="https://mynano.ninja/"
                target="_blank"
                className="alert-link"
              >
                <TranslatedMessage id="account.rep_offline.warning_link" />
              </a>
            )
          }}
        />
      </div>
    );
  }

  render() {
    const { account, match, balance, pending, representative, natricon } = this.props;
    return (
      <div className="p-4">
        <Helmet
          key={window.location.href}
          title={`${this.accountTitle()} - ${account}`}
        />
        <div className="row mt-3 align-items-center">
          <div className="col">
            <div className="row flex-nowrap align-items-center">
              {natricon.enabled && <div className="col-auto d-none d-md-block px-0 text-center" style={{ marginRight: "-10px" }}>
                <Natricon
                  account={account}
                  style={{ width: "100px", height: "100px" }}
                />
              </div>}
              <div className="col mb-2">
                <h1 className="mb-0">{this.accountTitle()}</h1>
                <div className="row flex-nowrap align-items-center mw-100 my-2">
                  {natricon.enabled && <div className="col-auto d-block d-md-none pr-0" style={{ marginRight: "-15px" }}>
                    <Natricon
                      account={account}
                      style={{ width: "75px", height: "75px" }}
                    />
                  </div>}
                  <div className="col pl-3" style={{ width: "80%" }}>
                    <p className="text-muted mb-0 break-word">
                      <span className="text-monospace">{account}</span>

                      <span
                        className="tooltipped tooltipped-e ml-1"
                        aria-label="Copy to clipboard"
                      >
                        <Clipboard
                          component="span"
                          style={{ cursor: "pointer" }}
                          data-clipboard-text={account}
                        >
                          <i className="fa fa-clipboard" />
                        </Clipboard>
                      </span>
                    </p>
                  </div>
                </div>

                {this.getRepresentative()}

                <p className="mb-0">
                  {this.representativeOnlineStatus()}
                  {this.accountVersionBadge()}
                </p>
              </div>
            </div>
          </div>
          <div className="col-auto">
            <div className="row">
              <div className="col-auto pr-0">
                <AccountQR account={account} style={{ width: "80px" }} />
              </div>
              <div className="col">
                <PriceWithConversions
                  raw
                  amount={balance}
                  currencies={["base", "usd", "btc"]}
                >
                  {(base, usd, btc) => {
                    return (
                      <Fragment>
                        <ScaledAccountBalance
                          balance={balance}
                          displayValue={base}
                        />

                        <p className="text-muted mb-0">
                          {usd} / {btc}
                        </p>
                        <p className="text-muted mb-0">
                          <FormattedNumber
                            value={Currency.fromRaw(pending)}
                            minimumFractionDigits={2}
                            maximumFractionDigits={6}
                          />{" "}
                          {config.currency.shortName}{" "}
                          <TranslatedMessage id="pending" />
                        </p>
                      </Fragment>
                    );
                  }}
                </PriceWithConversions>
              </div>
            </div>
          </div>
        </div>

        <hr />

        <ul className="nav nav-pills justify-content-center my-3">
          <li className="nav-item">
            <NavLink
              to={`/explorer/account/${account}/history`}
              className="nav-link nano"
              activeClassName="active"
              isActive={(m, l) => match.params.page === "history"}
            >
              <TranslatedMessage id="account.history" />
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to={`/explorer/account/${account}/delegators`}
              className="nav-link nano"
              activeClassName="active"
              isActive={(m, l) => match.params.page === "delegators"}
            >
              <TranslatedMessage id="account.delegators" />
            </NavLink>
          </li>
        </ul>

        {this.representativeOfflineWarning()}

        <NodeNinjaAccount account={account} />

        {this.getAccountContent()}
      </div>
    );
  }

  getRepresentative() {
    const { representative } = this.props;
    if (!representative) return;

    return (
      <p className="text-muted mb-0">
        <TranslatedMessage
          id="account.represented_by"
          values={{
            account: (
              <AccountLink
                account={representative}
                short
                ninja
                className="text-muted"
              />
            )
          }}
        />
      </p>
    );
  }

  getAccountContent() {
    const {
      match,
      unopened,
      account,
      history,
      pendingTransactions,
      blockCount,
      loadMore,
      hasMore,
      weight
    } = this.props;

    // TODO - change me
    let tunopened = false;
    let thistory = [{ "type": "send", "account": "nano_3jwrszth46rk1mu7rmb4rhm54us8yg1gw3ipodftqtikf5yqdyr7471nsg1k", "amount": "2000000000000000000000000000000000000", "local_timestamp": "1574084399", "height": "13", "hash": "707CAA0DBEB16C486EE37C03409D663ACE501D2985CC72ACD6903CECACF3189C" }, { "type": "send", "account": "nano_3jwrszth46rk1mu7rmb4rhm54us8yg1gw3ipodftqtikf5yqdyr7471nsg1k", "amount": "400000000000000000000000000000000000", "local_timestamp": "1573811710", "height": "12", "hash": "56569C595ED2AAD44D7F7A51160B6173B02223DFC5515673B0008F554F8B6519" }, { "type": "send", "account": "nano_3jwrszth46rk1mu7rmb4rhm54us8yg1gw3ipodftqtikf5yqdyr7471nsg1k", "amount": "300000000000000000000000000000000000", "local_timestamp": "1573773108", "height": "11", "hash": "3FC82DC0BBC7A49283D135C52E18244941D443DEB8C02B0A656BFB2C149EB2E5" }, { "type": "send", "account": "nano_3jwrszth46rk1mu7rmb4rhm54us8yg1gw3ipodftqtikf5yqdyr7471nsg1k", "amount": "400000000000007345764011035850609487", "local_timestamp": "1572962480", "height": "10", "hash": "00216358247619748B7D3D706BE90E3923A343F36BA60FD5F3BAB4B13D33B0A0" }, { "type": "send", "account": "nano_3jwrszth46rk1mu7rmb4rhm54us8yg1gw3ipodftqtikf5yqdyr7471nsg1k", "amount": "200000000000000000000000000000000000", "local_timestamp": "1571666716", "height": "9", "hash": "1C067C141BC3B74B02EC1549DB5CBDFEF6E160793D1FD94F43515F50EE76A601" }, { "type": "send", "account": "nano_3jwrszth46rk1mu7rmb4rhm54us8yg1gw3ipodftqtikf5yqdyr7471nsg1k", "amount": "400000000000000000000000000000000000", "local_timestamp": "1571376870", "height": "8", "hash": "1085C10015254C8954F92EEA5525F4D29B7441DF9B3AC68B7C692798021FC388" }, { "type": "send", "account": "nano_3jwrszth46rk1mu7rmb4rhm54us8yg1gw3ipodftqtikf5yqdyr7471nsg1k", "amount": "600000000000000000000000000000000000", "local_timestamp": "1569749069", "height": "7", "hash": "CC56A2B3130EA5D34156A95F9138A4C88F720871A278C9DBD805AB189E964903" }, { "type": "send", "account": "nano_3jwrszth46rk1mu7rmb4rhm54us8yg1gw3ipodftqtikf5yqdyr7471nsg1k", "amount": "200000000000000000000000000000000000", "local_timestamp": "1569741272", "height": "6", "hash": "DF7A4363F543C26FCAFB56D859FDA3FD23D3B3019914768F1A31F06945920564" }, { "type": "receive", "account": "nano_3xinwsdt57qo5bcysock15do87r9fuepq84erab5udm6wekymq9e9tiin8hw", "amount": "6000000000000000000000000000000", "local_timestamp": "1569741261", "height": "5", "hash": "BDE3F2036213541EB771E0CB27BC012C7F34DE29D73132B9556F6B70710E350C" }, { "type": "send", "account": "nano_3jwrszth46rk1mu7rmb4rhm54us8yg1gw3ipodftqtikf5yqdyr7471nsg1k", "amount": "200000000000000000000000000000000000", "local_timestamp": "1569479594", "height": "4", "hash": "1D6ADCAA350E63A38FCB12EC3B810580C22050D0FA0CB4BCDDFA62B8D3454EE9" }, { "type": "receive", "account": "nano_14cuejfpr58epnpxenirusimsrbwxbecin7a3izq1injptecc31qsjwquoe6", "amount": "5185355824306007345764011035850609487", "local_timestamp": "1568806531", "height": "3", "hash": "B42BDCE82B55BEB0602C1E374B8A14CE13A153A6E757CD832013E0A603E640F4" }, { "type": "send", "account": "nano_3jwrszth46rk1mu7rmb4rhm54us8yg1gw3ipodftqtikf5yqdyr7471nsg1k", "amount": "666000000000000000000000000000000", "local_timestamp": "1568805188", "height": "2", "hash": "AC08696267C4DB72C03AB3F4309C7C3268D79B8945C02B2BA262DE724707FB7B" }, { "type": "receive", "account": "nano_14cuejfpr58epnpxenirusimsrbwxbecin7a3izq1injptecc31qsjwquoe6", "amount": "888000000000000000000000000000000", "local_timestamp": "1568805079", "height": "1", "hash": "0EF9B910283D2D72ACA1E40C6363633E59E0405B60FD6B98F722D2FD60A9F73B" }];

    switch (match.params.page) {
      case "history":
        return this.props.loading ? (
          <Loading />
        ) : (
            <AccountHistory
              unopened={tunopened}
              history={thistory}
              pendingTransactions={pendingTransactions}
              blockCount={blockCount}
              loadMore={loadMore}
              hasMore={hasMore}
            />
          );
      case "delegators":
        return <AccountDelegators account={account} weight={weight} />;
    }
  }
}

const ScaledAccountBalance = ({ balance, displayValue }) => {
  const mbalance = Currency.fromRaw(balance).toString();
  if (mbalance.length > 12) return <h5 className="mb-0">{displayValue}</h5>;
  return <h3 className="mb-0">{displayValue}</h3>;
};

const Loading = () => (
  <div className="my-5 text-center">
    <h2 className="text-muted">Loading transactions...</h2>
  </div>
);

export default withNatriconData(withAccountData(withNetworkData(injectIntl(Account))));
