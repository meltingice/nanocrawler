import BigNumber from "bignumber.js";
import config from "../client-config.json";

export default {
  fromRaw: raw => {
    const value = BigNumber(raw.toString());
    return value.shiftedBy((config.currency.precision || 30) * -1).toNumber();
  },

  toRaw: mvalue => {
    const value = BigNumber(mvalue.toString());
    return value.shiftedBy(config.currency.precision || 30).toString(10);
  },

  addRaw: (...values) => {
    return values
      .map(v => BigNumber(v.toString()))
      .reduce((acc, v) => acc.plus(v))
      .toString(10);
  },

  subtractRaw: (...values) => {
    return values
      .map(v => BigNumber(v.toString()))
      .reduce((acc, v) => acc.minus(v))
      .toString(10);
  }
};
