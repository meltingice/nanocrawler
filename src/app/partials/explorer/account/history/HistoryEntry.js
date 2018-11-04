import React, { Fragment } from "react";

export default function HistoryEntry({ type, account, amount, date, block }) {
  return (
    <Fragment>
      <div className="row align-items-center">
        <div className="col-12 col-lg-1">
          <b className="d-lg-none">{type}</b>
          <span className="d-none d-lg-inline">{type}</span>
        </div>
        <div className="col-12 col-lg-7 mt-1 mt-lg-0">
          {account}
          <br />
          {block}
        </div>
        <div className="col mt-1 mt-lg-0">
          <div className="row align-items-center">
            <div className="col">{amount}</div>
            <div className="col-auto text-right">
              <small className="d-sm-none">{date}</small>
              <span className="d-none d-sm-inline">{date}</span>
            </div>
          </div>
        </div>
      </div>
      <hr />
    </Fragment>
  );
}
