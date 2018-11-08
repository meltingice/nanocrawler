// Account utilities from NanoVault
// https://github.com/cronoh/nanovault/blob/master/src/app/services/util.service.ts#L217

import moment from "moment";
import * as blake from "blakejs";

export function formatTimestamp(timestamp) {
  if (!timestamp) return null;
  return moment(parseInt(timestamp, 10)).format("MMM D, YYYY HH:mm:ss");
}
