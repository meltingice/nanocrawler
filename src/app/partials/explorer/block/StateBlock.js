import React, { Fragment } from "react";
import { TranslatedMessage } from "lib/TranslatedMessage";
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
          <TranslatedMessage id="block.state.subtype" />{" "}
          <small className="text-muted">{this.inferBlockSubtype()}</small>
        </h4>
        <p>
          <small>
            <TranslatedMessage id="block.state.subtype.desc" />
          </small>
        </p>

        <h4 className="mb-0">
          <span className="text-capitalize">
            <TranslatedMessage id="account" />
          </span>{" "}
          <small>
            <AccountLink
              account={block.contents.account}
              className="text-muted break-word"
              ninja
            />
          </small>
        </h4>
        <p>
          <small>
            <TranslatedMessage id="block.state.account" />
          </small>
        </p>

        <h4 className="mb-0">
          <span className="text-capitalize">
            <TranslatedMessage id="amount" />
          </span>{" "}
          <small className="text-muted">
            <PriceWithConversions
              amount={block.amount}
              currencies={["nano", "usd", "btc"]}
            />
          </small>
        </h4>
        <p>
          <small>
            <TranslatedMessage id="block.send.amount_desc" />
          </small>
        </p>

        <h4 className="mb-0">
          <span className="text-capitalize">
            <TranslatedMessage id="balance" />
          </span>{" "}
          <small className="text-muted">
            <PriceWithConversions
              amount={block.contents.balance}
              currencies={["nano", "usd", "btc"]}
            />
          </small>
        </h4>
        <p>
          <small>
            <TranslatedMessage id="block.balance.desc" />
          </small>
        </p>

        <h4 className="mb-0">
          <span className="text-capitalize">
            <TranslatedMessage id="representative" />
          </span>{" "}
          <small>
            <AccountLink
              account={block.contents.representative}
              className="text-muted break-word"
              ninja
            />
          </small>
        </h4>
        <p>
          <small>
            <TranslatedMessage id="block.state.rep.desc" />
          </small>
        </p>

        {this.getStateBlockExtraInfo()}

        <h4 className="mb-0">
          <span className="text-capitalize">
            <TranslatedMessage id="date" />
          </span>{" "}
          <small className="text-muted">
            <OptionalField value={formatTimestamp(block.timestamp)} />
          </small>
        </h4>
        <p>
          <small>
            <TranslatedMessage id="block.timestamp.desc" />
          </small>
        </p>

        <h5 className="mb-0">
          <TranslatedMessage id="block.previous" />{" "}
          {this.getPreviousBlock(block)}
        </h5>
        <p>
          <small>
            <TranslatedMessage id="block.previous.desc" />
          </small>
        </p>

        {this.getLink()}

        <h5>
          <TranslatedMessage id="block.pow" />{" "}
          <small className="text-muted break-word">{block.contents.work}</small>
        </h5>
        <h5>
          <TranslatedMessage id="block.signature" />{" "}
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
          <TranslatedMessage id="block.state.previous.none" />
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
              <TranslatedMessage id="block.sender" />{" "}
              <small>
                <AccountLink
                  account={block.source_account}
                  className="text-muted break-word"
                  ninja
                />
              </small>
            </h4>
            <p>
              <small>
                <TranslatedMessage id="block.sender.desc" />
              </small>
            </p>
          </Fragment>
        );
      case "send":
        return (
          <Fragment>
            <h4 className="mb-0">
              <TranslatedMessage id="block.recipient" />{" "}
              <small>
                <AccountLink
                  account={block.contents.link_as_account}
                  className="text-muted break-word"
                  ninja
                />
              </small>
            </h4>
            <p>
              <small>
                <TranslatedMessage id="block.recipient.desc" />
              </small>
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
        meaning = <TranslatedMessage id="block.state.link.open" />;
        break;
      case "change":
        link = block.contents.link;
        meaning = <TranslatedMessage id="block.state.link.change" />;
        break;
      case "send":
        link = block.contents.link;
        meaning = <TranslatedMessage id="block.state.link.send" />;
        break;
      case "receive":
        link = (
          <BlockLink
            hash={block.contents.link}
            className="text-muted break-word"
          />
        );
        meaning = <TranslatedMessage id="block.state.link.receive" />;
        break;
    }

    return (
      <Fragment>
        <h5 className="mb-0">
          <TranslatedMessage id="block.link" />{" "}
          <small className="text-muted break-word">{link}</small>
        </h5>
        <p>
          <small>{meaning}</small>
        </p>
      </Fragment>
    );
  }
}

export default injectClient(StateBlock);
