import React from "react";

import ChangeBlock from "./network/ChangeBlock";
import OpenBlock from "./network/OpenBlock";
import ReceiveBlock from "./network/ReceiveBlock";
import SendBlock from "./network/SendBlock";
import StateBlock from "./network/StateBlock";

export default function BlockByTypeStats({ type, count }) {
  switch (type) {
    case "change":
      return <ChangeBlock count={count} />;
    case "open":
      return <OpenBlock count={count} />;
    case "receive":
      return <ReceiveBlock count={count} />;
    case "send":
      return <SendBlock count={count} />;
    case "state":
      return <StateBlock count={count} />;
    default:
      return null;
  }
}
