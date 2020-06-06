import React, { Fragment } from "react";
import Natricon from "app/partials/Natricon";
import { withNatriconData } from "lib/NatriconContext";

function HistoryEntry({ natricon, type, transactionAccount, account, amount, date, block }) {
  return (
    <Fragment>
      <div className="row align-items-center">
        <div className="col-12 col-lg-1">
          <div className="row align-items-center">
            <div className="col">
              <b className="d-lg-none">{type}</b>
              <span className="d-none d-lg-inline">{type}</span>
            </div>
            {natricon.enabled &&
              <div className="col-auto d-block d-lg-none">
                <Natricon account={transactionAccount} style={{ width: "50px" }} />
              </div>
            }
          </div>
        </div>
        {natricon.enabled && <div className="d-none d-lg-block col-lg-1 px-0 text-center">
          <Natricon account={transactionAccount} style={{ maxWidth: "75px" }} />
        </div>}
        <div className="col-12 col-lg-6 mt-1 mt-lg-0">
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

export default withNatriconData(HistoryEntry);