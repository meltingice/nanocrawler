import React, { Fragment } from "react";
import { TranslatedMessage } from "lib/TranslatedMessage";
import AccountLink from "../../AccountLink";
import BlockLink from "../../BlockLink";
import PriceWithConversions from "../../PriceWithConversions";
import OptionalField from "../../OptionalField";
import RawBlockContents from "./RawBlockContents";
import { formatTimestamp } from "lib/util";
import config from "client-config.json";

export default class StateBlock extends React.Component {
  render() {
    const { block } = this.props;

    return (
      <div>
        <h4 className="mb-0">
          <TranslatedMessage id="block.state.subtype" />{" "}
          <small className="text-muted">{block.contents.subtype}</small>
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
              raw
              amount={block.amount}
              currencies={["base", "usd", "btc"]}
              precision={{ base: 20, btc: 6, usd: 4 }}
            />
          </small>
        </h4>
        <p className="text-muted mb-0">
          <small>{block.amount} raw</small>
        </p>
        <p>
          <small>
            <TranslatedMessage
              id="block.send.amount_desc"
              values={{ currencyShortName: config.currency.shortName }}
            />
          </small>
        </p>

        <h4 className="mb-0">
          <span className="text-capitalize">
            <TranslatedMessage id="balance" />
          </span>{" "}
          <small className="text-muted">
            <PriceWithConversions
              raw
              amount={block.contents.balance}
              currencies={["base", "usd", "btc"]}
            />
          </small>
        </h4>
        <p className="text-muted mb-0">
          <small>{block.contents.balance} raw</small>
        </p>
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
            <OptionalField
              value={formatTimestamp(block.timestamp, block.local_timestamp)}
            />
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

        <RawBlockContents block={block} className="mt-5" />
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
    switch (block.contents.subtype) {
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
    let link, meaning;

    switch (block.contents.subtype) {
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
      case "epoch":
        link = block.contents.link;
        meaning = <TranslatedMessage id="block.state.link.epoch" />;
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
