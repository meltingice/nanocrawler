import { Nano } from "nanode";
import { redisGet } from "./redisFetch";
import config from "../../../server-config.json";
import Currency from "../../lib/Currency";

const nano = new Nano({ url: config.nodeHost });

export function accountIsValid(account) {
  return /^\w+_[A-Za-z0-9]{59,60}$/.test(account);
}

export function blockIsValid(hash) {
  return /^[A-F0-9]{64}$/.test(hash);
}

export async function getTimestampForHash(hash) {
  try {
    const timestamp = await redisGet(`block_timestamp/${hash}`);
    if (timestamp) {
      return timestamp;
    }
  } catch (e) {}

  return null;
}

export async function processBlock(hash, block, convert = false) {
  if (convert) {
    block.amount = Currency.fromRaw(block.amount);
  }

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

  if (convert) {
    switch (block.contents.type) {
      case "send":
        block.contents.balance = Currency.fromRaw(
          parseInt(block.contents.balance, 16).toString()
        );
        break;
      case "state":
        block.contents.balance = Currency.fromRaw(block.contents.balance);
        break;
    }
  }

  return block;
}
