import React, { Fragment } from "react";
import fromPairs from "lodash/fromPairs";
import toPairs from "lodash/toPairs";
import map from "lodash/map";
import { Helmet } from "react-helmet";
import { FormattedNumber } from "react-intl";
import { withTicker } from "lib/TickerContext";

const fiatCurrencies = ["EUR", "USD", "VEF"];
const cryptoCurrencies = ["BTC", "NANO"];
const currencyPrecision = {
  BTC: 8,
  NANO: 6,
  USD: 6,
  VEF: 2,
  BAN: 2,
  BANANO: 2,
  default: 6
};

const precisionFor = cur =>
  currencyPrecision[cur.toUpperCase()] || currencyPrecision.default;

class ExchangeRates extends React.PureComponent {
  state = {
    value: 1
  };

  getHighlightedCurrencies() {
    const { ticker } = this.props;
    const { value } = this.state;

    return cryptoCurrencies.concat(fiatCurrencies).map(cur => (
      <h1 key={cur}>
        {cur === "NANO" ? (
          <Fragment>
            NANO{" "}
            <FormattedNumber
              value={parseFloat(ticker[cur].price, 10) * value}
              maximumFractionDigits={precisionFor("NANO")}
            />
          </Fragment>
        ) : (
          <FormattedNumber
            value={parseFloat(ticker[cur].price, 10) * value}
            style="currency"
            currency={cur}
            maximumFractionDigits={precisionFor(cur)}
          />
        )}
      </h1>
    ));
  }

  getOtherCurrencies() {
    const { ticker } = this.props;
    const { value } = this.state;

    const otherCurrencies = fromPairs(
      toPairs(ticker).filter(
        d => !fiatCurrencies.includes(d[0]) && !cryptoCurrencies.includes(d[0])
      )
    );

    return map(otherCurrencies, (data, cur) => (
      <h3 key={cur}>
        <FormattedNumber
          value={parseFloat(ticker[cur].price, 10) * value}
          style="currency"
          currency={cur}
          maximumFractionDigits={precisionFor(cur)}
        />
      </h3>
    ));
  }

  bananoPerNano() {
    const { ticker } = this.props;
    return 1.0 / ticker.NANO.price;
  }

  render() {
    const { config } = this.props;

    return (
      <div className="row my-5 mx-0">
        <Helmet>
          <title>Banano Exchange Rates</title>
        </Helmet>
        <div className="col">
          <div className="row justify-content-center">
            <div className="col-12 col-md-10">
              <div className="row align-items-center">
                <div className="col">
                  <h1>Exchange Rates</h1>
                </div>
                <div className="col-auto">
                  <h4>
                    1 NANO ={" "}
                    <FormattedNumber
                      value={this.bananoPerNano()}
                      style="currency"
                      currency="BAN"
                      maximumFractionDigits={precisionFor("BAN")}
                    />
                  </h4>
                </div>
              </div>

              <hr />
            </div>
          </div>

          <div className="row justify-content-center mt-3">
            <div className="col-12 col-md-5">
              <div className="input-group mb-2">
                <input
                  type="number"
                  className="form-control form-control-lg"
                  min="0"
                  value={this.state.value || ""}
                  onChange={e =>
                    this.setState({
                      value: e.target.value
                        ? parseFloat(e.target.value, 10)
                        : null
                    })
                  }
                />
                <div className="input-group-append">
                  <div className="input-group-text">BAN</div>
                </div>
              </div>
              <p className="text-muted">Price data provided by Mercatox.</p>
            </div>
            <div className="col-12 col-md-5">
              {this.getHighlightedCurrencies()}
              <hr />
              {this.getOtherCurrencies()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withTicker(ExchangeRates);
