import React from 'react'
import accounting from 'accounting'
import FontAwesome from 'react-fontawesome'

export default class PriceTicker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null
    }
  }

  componentWillMount() {
    this.fetchData();
  }

  async fetchData() {
    const resp = await fetch("https://api.coinmarketcap.com/v1/ticker/nano/", {
      mode: 'cors'
    })

    const data = await resp.json();
    this.setState({ data: data[0] });

    setTimeout(this.fetchData.bind(this), 300000);
  }

  render() {
    const { data } = this.state;
    if (data === null) return null;

    return (
      <div className="row">
        <div className="col">
          <h5 className="text-sm-center my-0">{accounting.formatMoney(data.price_usd)}</h5>
        </div>
        <div className="col">
          <h5 className="text-sm-center my-0" title="1 hour change">
            <FontAwesome name={this.getChangeSymbol()} /> {data.percent_change_1h}%
          </h5>
        </div>
      </div>
    )
  }

  getChangeSymbol() {
    const { data } = this.state;
    const percentChange = parseFloat(data.percent_change_1h, 10);
    return percentChange >= 0 ? 'arrow-up' : 'arrow-down';
  }
}
