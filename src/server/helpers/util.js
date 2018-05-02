import { Nano } from "nanode";
import { redisGet } from "./redisFetch";
import config from "../../../server-config.json";

const nano = new Nano({ url: config.nodeHost });

export function accountIsValid(account) {
  return /^(xrb_|nano_)/.test(account);
}

export async function addTimestampToBlock(block) {
  try {
    const timestamp = await redisGet(`block_timestamp/${block.hash}`);
    if (timestamp) {
      block.timestamp = timestamp;
    }
  } catch (e) {}

  return block;
}

export async function processBlock(block) {
  block = await addTimestampToBlock(block);

  block.amount = nano.convert.fromRaw(block.amount, "mrai");
  block.contents = JSON.parse(block.contents);

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
