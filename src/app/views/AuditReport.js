import React from "react";

export default class AuditReport extends React.Component {
  state = {
    agreed: false
  };

  render() {
    return (
      <div className="row justify-content-center my-5 mx-0">
        <div className="col-8">
          <h6>To view audit report you have to agree to the following</h6>
          <p>
            In connection with NOS Stablecoin Limited, PricewaterhouseCoopers
            (“we”) understand that third parties, including, but not limited to,
            stablecoin holders and other prospective customers of NOS Stablecoin
            Limited (“you”), have requested a copy of our Report of factual
            findings in connection with the Escrow Holdings Report prepared by
            the management of NOS Stablecoin Limited dated [insert date] (the
            “Report”).
          </p>
          <p>
            NOS Stablecoin Limited (“our client”), to whom the Report is
            addressed, has confirmed that a copy of the Report may be provided
            to you.{" "}
          </p>
          <p>
            We will allow a copy of the Report to be made available to you but
            only on the basis that you agree that:
          </p>

          <ol>
            <li>
              We accept no liability (including liability for negligence) to you
              in relation to the Report. The Report is provided to you for
              information purposes only. If you do rely on the Report, you do so
              entirely at your own risk.
            </li>
            <li>
              You will not bring a claim against us which relates to the
              provision of the Report to you.
            </li>
            <li>
              Neither the Report, nor information obtained from it, may be made
              available to anyone else without our prior written consent, except
              where required by law or regulation.
            </li>
            <li>
              The Report was prepared with our client’s interests in mind. It
              was not prepared with your interests in mind or for your use. The
              Report is not a substitute for any enquiries that you should make.
            </li>
          </ol>

          <p>
            This letter and any dispute arising from it, whether contractual or
            non-contractual, will be governed by Maltese law and be subject to
            the exclusive jurisdiction of the Maltese courts.
          </p>

          <hr />

          <form
            className="form-inline"
            action="https://docsend.com/view/hz8s6ca"
          >
            <div className="form-check mr-3">
              <input
                id="agree-to-terms"
                type="checkbox"
                className="form-check-input"
                checked={this.state.agreed}
                onChange={e => this.setState({ agreed: e.target.checked })}
              />{" "}
              <label className="form-check-label" for="agree-to-terms">
                I agree
              </label>
            </div>

            <button className="btn btn-primary" disabled={!this.state.agreed}>
              View
            </button>
          </form>
        </div>
      </div>
    );
  }
}
