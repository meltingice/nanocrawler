import React from "react";
import SendBlock from "./SendBlock";
import ReceiveBlock from "./ReceiveBlock";
import OpenBlock from "./OpenBlock";

export default function StateBlock({ event }) {
  if (event.is_send) {
    return <SendBlock event={event} />;
  } else {
    if (parseInt(event.block.previous, 16) === 0) {
      return <OpenBlock event={event} />;
    }

    return <ReceiveBlock event={event} />;
  }
}
