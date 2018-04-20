import React from "react";
import QRCode from "qrcode";

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
    const dataUrl = await QRCode.toDataURL(`xrb:${account}`);
    this.setState({ dataUrl });
  }

  render() {
    const { dataUrl } = this.state;
    const { account, ...otherProps } = this.props;
    if (!dataUrl) return null;

    return <img src={dataUrl} {...otherProps} />;
  }
}
