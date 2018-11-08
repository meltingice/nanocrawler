import React from "react";
import PropTypes from "prop-types";
import { validateAddress, validateBlockHash } from "lib/util";

export default class ValidatedSearch extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
    className: PropTypes.string
  };

  static defaultProps = {
    className: ""
  };

  state = {
    search: "",
    valid: true
  };

  get classes() {
    const { className } = this.props;
    const { search, valid } = this.state;

    if (search.length === 0) return className;
    if (valid) return `is-valid ${className}`;
    return `is-invalid ${className}`;
  }

  onChange(e) {
    const search = e.target.value;

    let type = null;
    if (validateAddress(search)) type = "account";
    if (validateBlockHash(search)) type = "block";

    this.setState({ search, valid: type !== null }, () => {
      if (this.props.onChange) {
        this.props.onChange({ search, type, valid: this.state.valid });
      }
    });
  }

  render() {
    const { className, onChange, ...otherProps } = this.props;

    return (
      <input
        type="text"
        className={this.classes}
        onChange={this.onChange.bind(this)}
        value={this.state.search}
        {...otherProps}
      />
    );
  }
}
