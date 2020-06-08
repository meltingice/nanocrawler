import React from "react";
import ReactSVG from "react-svg";
import LoadingNatricon from "app/images/loading-natricon.svg";

import "./Natricon.css";

export default class Natricon extends React.PureComponent {
  state = {
    loaded: false,
    mounted: true
  };

  componentDidMount() {
    const img = document.createElement("img");
    img.onload = () => {
      if (!this.state.mounted) return;
      this.setState({ loaded: true });
    };

    img.src = this.imageUrl;
  }

  componentWillUnmount() {
    this.setState({ mounted: false });
  }

  get imageUrl() {
    const { account } = this.props;
    return `https://natricon.com/api/v1/nano?address=${account}&outline=true&svc=nanocrawler`;
  }

  loadingState() {
    const { account, ...otherProps } = this.props;

    return (
      <ReactSVG
        path={LoadingNatricon}
        className="LoadingNatricon"
        {...otherProps}
      />
    );
  }

  render() {
    const { account, ...otherProps } = this.props;
    if (!this.state.loaded) return this.loadingState();

    return <img alt="natricon" {...otherProps} src={this.imageUrl} />;
  }
}
