import React from "react";
import _ from "lodash";
import ReactSVG from "react-svg";
import LoadingMonKey from "app/images/loading-monkey.svg";

import "./MonKey.css";

export default class MonKey extends React.PureComponent {
  state = {
    loaded: false
  };

  componentDidMount() {
    const img = document.createElement("img");
    img.onload = () => {
      this.setState({ loaded: true });
    };

    img.src = this.imageUrl;
  }

  get imageUrl() {
    const { account } = this.props;
    return `https://bananomonkeys.herokuapp.com/image?address=${account}`;
  }

  loadingState() {
    const { account, ...otherProps } = this.props;

    return (
      <ReactSVG
        path={LoadingMonKey}
        className="LoadingMonKey"
        {...otherProps}
      />
    );
  }

  render() {
    const { account, ...otherProps } = this.props;
    if (!this.state.loaded) return this.loadingState();

    return <img {...otherProps} src={this.imageUrl} />;
  }
}
