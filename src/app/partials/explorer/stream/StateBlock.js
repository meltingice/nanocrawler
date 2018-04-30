import React from "react";
import SendBlock from "./SendBlock";
import ReceiveBlock from "./ReceiveBlock";

export default function StateBlock({ event }) {
  if (event.is_send) {
    return <SendBlock event={event} />;
  } else {
    return <ReceiveBlock event={event} />;
  }
}
