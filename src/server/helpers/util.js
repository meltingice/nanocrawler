import { Nano } from "nanode";
import { redisGet } from "./redisFetch";
import config from "../../../server-config.json";

const nano = new Nano({ url: config.nodeHost });

export function accountIsValid(account) {
  return /^(xrb_|nano_)/.test(account);
}

export async function getTimestampForHash(hash) {
  try {
    const timestamp = await redisGet(`block_timestamp/beta/${hash}`);
    if (timestamp) {
      return timestamp;
    }
  } catch (e) {}

  return null;
}

export async function processBlock(hash, block) {
  block.amount = nano.convert.fromRaw(block.amount, "mrai");
  block.contents = JSON.parse(block.contents);

  if (parseInt(block.contents.previous, 16) === 0) {
    block.contents.subtype = "open";
  } else {
    const resp = await nano.rpc("account_history", {
      account: block.block_account,
      head: hash,
      raw: true,
      count: 1
    });

    block.contents.subtype = resp.history[0].subtype;
  }

  switch (block.contents.type) {
    case "send":
      block.contents.balance = nano.convert.fromRaw(
        parseInt(block.contents.balance, 16).toString(),
        "mrai"
      );
      break;
    case "state":
      block.contents.balance = nano.convert.fromRaw(
        block.contents.balance,
        "mrai"
      );
      break;
  }

  return block;
}
