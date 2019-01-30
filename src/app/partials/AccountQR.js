import React from "react";
import QRCode from "qrcode";
import config from "client-config.json";

export default class AccountQR extends React.PureComponent {
  state = {
    dataUrl: null
  };

  componentWillMount() {
    this.generateDataUrl();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.account !== this.props.account) {
      this.generateDataUrl();
    }
  }

  async generateDataUrl() {
    const { account } = this.props;
    const dataUrl = await QRCode.toDataURL(this.encodedData);

    this.setState({ dataUrl });
  }

  get encodedData() {
    const { account } = this.props;
    return `${config.currency.qrPrefix}:${account}`;
  }

  render() {
    const { dataUrl } = this.state;
    const { account, ...otherProps } = this.props;
    if (!dataUrl) return null;

    return (
      <a className="d-block" href={this.encodedData}>
        <img src={dataUrl} {...otherProps} />
      </a>
    );
  }
}
