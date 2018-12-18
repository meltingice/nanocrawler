import React from "react";
import { FormattedNumber } from "react-intl";
import PropTypes from "prop-types";
import range from "lodash/range";
import last from "lodash/last";

export default class Pagination extends React.PureComponent {
  static propTypes = {
    page: PropTypes.number.isRequired,
    totalCount: PropTypes.number.isRequired,
    perPage: PropTypes.number.isRequired,
    onPageSelected: PropTypes.func.isRequired
  };

  selectPage(e, page) {
    e.preventDefault();
    this.props.onPageSelected(page);
  }

  totalPages() {
    return Math.ceil(this.props.totalCount / this.props.perPage);
  }

  visiblePageRange() {
    const firstPage = Math.max(this.props.page - 2, 1);
    const lastPage = Math.min(firstPage + 5, this.totalPages() + 1);

    return range(firstPage, lastPage);
  }

  getFirstLink() {
    if (this.visiblePageRange()[0] === 1) return;
    return (
      <li key={1} className="page-item">
        <a className="page-link" href="#" onClick={e => this.selectPage(e, 1)}>
          « First
        </a>
      </li>
    );
  }

  getLastLink() {
    if (last(this.visiblePageRange()) === this.totalPages()) return;
    return (
      <li key={this.totalPages()} className="page-item">
        <a
          className="page-link"
          href="#"
          onClick={e => this.selectPage(e, this.totalPages())}
        >
          Last »
        </a>
      </li>
    );
  }

  getPages() {
    return this.visiblePageRange().map(page => {
      let classes = ["page-item"];
      if (this.props.page == page) classes.push("active");

      return (
        <li key={page} className={classes.join(" ")}>
          <a
            className="page-link"
            href="#"
            onClick={e => this.selectPage(e, page)}
          >
            <FormattedNumber value={page} />
          </a>
        </li>
      );
    });
  }

  render() {
    if (this.props.totalCount <= this.props.perPage) return <span />;

    return (
      <ul className="pagination">
        {this.getFirstLink()}
        {this.getPages()}
        {this.getLastLink()}
      </ul>
    );
  }
}
