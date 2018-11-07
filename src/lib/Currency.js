import BigNumber from "bignumber.js";
import config from "../client-config.json";

export default {
  fromRaw: raw => {
    const value = BigNumber(raw.toString());
    return value.shiftedBy((config.currencyRawPrecision || 30) * -1).toNumber();
  }
};
