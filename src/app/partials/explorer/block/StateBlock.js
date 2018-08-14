import React, { Fragment } from "react";
import injectClient from "../../../../lib/ClientComponent";
import AccountLink from "../../AccountLink";
import BlockLink from "../../BlockLink";
import PriceWithConversions from "../../PriceWithConversions";
import OptionalField from "../../OptionalField";
import { formatTimestamp } from "../../../../lib/util";

class StateBlock extends React.PureComponent {
  inferBlockSubtype() {
    const { block } = this.props;
    if (parseInt(block.contents.previous, 16) === 0) return "open";
    if (parseInt(block.contents.link, 16) === 0) return "change";
    if (block.source_account === "0") return "send";
    return "receive";
  }

  render() {
    const { block } = this.props;

    return (
      <div className="Block">
        <h4 className="mb-0">
          Block subtype{" "}
          <small className="text-muted">{this.inferBlockSubtype()}</small>
        </h4>
        <p>
          <small>The type of transaction that created this state block</small>
        </p>

        <h4 className="mb-0">
          Account{" "}
          <small>
            <AccountLink
              account={block.contents.account}
              className="text-muted break-word"
              ninja
            />
          </small>
        </h4>
        <p>
          <small>The account represented by this state block</small>
        </p>

        <h4 className="mb-0">
          Amount{" "}
          <small className="text-muted">
            <PriceWithConversions
              amount={block.amount}
              currencies={["nano", "usd", "btc"]}
            />
          </small>
        </h4>
        <p>
          <small>The amount of βNANO that was sent in this transaction</small>
        </p>

        <h4 className="mb-0">
          Balance{" "}
          <small className="text-muted">
            <PriceWithConversions
              amount={block.contents.balance}
              currencies={["nano", "usd", "btc"]}
            />
          </small>
        </h4>
        <p>
          <small>The balance of this account after this transaction</small>
        </p>

        <h4 className="mb-0">
          Representative{" "}
          <small>
            <AccountLink
              account={block.contents.representative}
              className="text-muted break-word"
              ninja
            />
          </small>
        </h4>
        <p>
          <small>The account's representative</small>
        </p>

        {this.getStateBlockExtraInfo()}

        <h4 className="mb-0">
          Date{" "}
          <small className="text-muted">
            <OptionalField value={formatTimestamp(block.timestamp)} />
          </small>
        </h4>
        <p>
          <small>
            The date and time this block was discovered converted to your local
            time
          </small>
        </p>

        <h5 className="mb-0">Previous Block {this.getPreviousBlock(block)}</h5>
        <p>
          <small>The previous block in this account's chain</small>
        </p>

        {this.getLink()}

        <h5>
          Proof of Work{" "}
          <small className="text-muted break-word">{block.contents.work}</small>
        </h5>
        <h5>
          Signature{" "}
          <small className="text-muted break-word">
            {block.contents.signature}
          </small>
        </h5>
      </div>
    );
  }

  getPreviousBlock() {
    const { block } = this.props;
    if (parseInt(block.contents.previous, 16) === 0) {
      return (
        <small className="text-muted">
          None (this block opened the account)
        </small>
      );
    }

    return (
      <small>
        <BlockLink
          hash={block.contents.previous}
          className="text-muted break-word"
        />
      </small>
    );
  }

  getStateBlockExtraInfo() {
    const { block } = this.props;
    const type = this.inferBlockSubtype();
    switch (type) {
      case "open":
      case "receive":
        return (
          <Fragment>
            <h4 className="mb-0">
              Sender{" "}
              <small>
                <AccountLink
                  account={block.source_account}
                  className="text-muted break-word"
                  ninja
                />
              </small>
            </h4>
            <p>
              <small>The account that initiated this transaction</small>
            </p>
          </Fragment>
        );
      case "send":
        return (
          <Fragment>
            <h4 className="mb-0">
              Recipient{" "}
              <small>
                <AccountLink
                  account={block.contents.link_as_account}
                  className="text-muted break-word"
                  ninja
                />
              </small>
            </h4>
            <p>
              <small>The account that will receive this transaction</small>
            </p>
          </Fragment>
        );
      default:
        return null;
    }
  }

  getLink() {
    const { block } = this.props;
    const type = this.inferBlockSubtype();
    let link, meaning;

    switch (type) {
      case "open":
        link = (
          <BlockLink
            hash={block.contents.link}
            className="text-muted break-word"
          />
        );
        meaning = "The corresponding block that started this transaction";
        break;
      case "change":
        link = block.contents.link;
        meaning =
          "Set to all 0's, which happens to be the burn address encoded in hex format";
        break;
      case "send":
        link = block.contents.link;
        meaning = "The destination address encoded in hex format";
        break;
      case "receive":
        link = (
          <BlockLink
            hash={block.contents.link}
            className="text-muted break-word"
          />
        );
        meaning = "The corresponding block that started this transaction";
        break;
    }

    return (
      <Fragment>
        <h5 className="mb-0">
          Link <small className="text-muted break-word">{link}</small>
        </h5>
        <p>
          <small>{meaning}</small>
        </p>
      </Fragment>
    );
  }
}

export default injectClient(StateBlock);
