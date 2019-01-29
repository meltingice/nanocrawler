import React from "react";
import Cookies from "js-cookie";
import AccountLink from "./partials/AccountLink";
import config from "../client-config.json";

export default class DonationAlert extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: Cookies.get("nanocrawler.donation_alert_dismissed") !== "1"
    };
  }

  onDismiss() {
    this.setState({ open: false }, () => {
      Cookies.set("nanocrawler.donation_alert_dismissed", "1", { expires: 7 });
    });
  }

  render() {
    if (!this.state.open) return null;

    return (
      <div
        className="row mt-5 mx-auto justify-content-center"
        style={{ maxWidth: "1680px" }}
      >
        <div className="col">
          <div
            className="alert alert-secondary alert-dismissible fade show"
            role="alert"
          >
            NanoCrawler is a free-to-use service that has a strict no-ads
            policy, but incurs monthly server costs. If you find it
            useful, please{" "}
            <AccountLink
              account={config.donationAddress}
              name="consider donating"
              className="alert-link"
            />.
            <button
              type="button"
              className="close"
              data-dismiss="alert"
              aria-label="Close"
              onClick={this.onDismiss.bind(this)}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
}
