import React from "react";
import PropTypes from "prop-types";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import { validateAddress, validateBlockHash } from "lib/util";
import { apiClient } from "lib/Client";

import "react-bootstrap-typeahead/css/Typeahead.css";
import "react-bootstrap-typeahead/css/Typeahead-bs4.css";
import "./ValidatedSearch.css";

export default class ValidatedSearch extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    onSubmit: PropTypes.func
  };

  state = {
    loading: false,
    search: "",
    valid: null,
    searchOptions: []
  };

  onSearch(query) {
    if (validateBlockHash(query)) {
      return this.setState({
        loading: false,
        searchOptions: [query]
      });
    }

    this.setState({ loading: true }, async () => {
      const accounts = await apiClient.search(query);
      this.setState({ loading: false, searchOptions: accounts });
    });
  }

  onChange(search) {
    let type = null;
    if (validateAddress(search)) type = "account";
    if (validateBlockHash(search)) type = "block";

    this.setState({ search: search || "", valid: type !== null }, () => {
      if (this.props.onChange) {
        this.props.onChange({
          search: search || "",
          type,
          valid: this.state.valid
        });
      }
    });
  }

  onKeyDown(e) {
    if (!this.state.valid) return;
    if (e.keyCode === 13) {
      if (this.props.onSubmit) this.props.onSubmit();
    }
  }

  render() {
    return (
      <AsyncTypeahead
        className="ValidatedSearch"
        bsSize={this.props.size}
        onKeyDown={this.onKeyDown.bind(this)}
        placeholder={this.props.placeholder}
        promptText="Type to search for accounts"
        searchText="Searching for accounts..."
        isLoading={this.state.loading}
        isValid={this.state.valid}
        options={this.state.searchOptions}
        onSearch={this.onSearch.bind(this)}
        onInputChange={this.onChange.bind(this)}
        onChange={selections => this.onChange(selections[0])}
      />
    );
  }
}
