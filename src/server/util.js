import { Nano } from "nanode";
import config from "../../server-config.json";

const nano = new Nano({ url: config.nodeHost });

export function accountIsValid(account) {
  return /^(xrb_|nano_)/.test(account);
}

export function processBlock(block) {
  block.amount = nano.convert.fromRaw(block.amount, "mrai");
  block.contents = JSON.parse(block.contents);

  switch (block.contents.type) {
    case "send":
    case "state":
      block.contents.balance = nano.convert.fromRaw(
        parseInt(block.contents.balance, 16).toString(),
        "mrai"
      );
      break;
  }

  return block;
}
