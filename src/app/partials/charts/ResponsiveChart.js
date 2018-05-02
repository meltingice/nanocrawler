import React from "react";
import ReactDOM from "react-dom";

export default class ResponsiveChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = { componentWidth: 0 };
    this.ref = React.createRef();
  }

  componentDidMount() {
    this.updateComponentWidth();
    window.addEventListener("resize", this.updateComponentWidth.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateComponentWidth.bind(this));
  }

  updateComponentWidth() {
    this.setState({
      componentWidth: this.ref.current.getBoundingClientRect().width
    });
  }

  render() {
    return (
      <div ref={this.ref}>{this.props.children(this.state.componentWidth)}</div>
    );
  }
}
