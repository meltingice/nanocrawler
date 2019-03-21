import { promisify } from "util";
import curl from "curlrequest";
import config from "../../server-config.json";

const request = promisify(curl.request.bind(curl));

const TIMEOUT = 30;

export default class NodeMonitor {
  static fromPeerAddress(peer) {
    const match = peer.match(/\[(?:\:\:ffff\:)?(.+)\]:\d+/);
    if (match)
      return new NodeMonitor(`http://${match[1]}/api.php`, "discovered");
    return null;
  }

  constructor(apiUrl, source = "") {
    this.apiUrl = apiUrl;
    this.source = source;
  }

  fetch() {
    console.log("Checking", `(${this.source})`, this.apiUrl);

    return new Promise((resolve, reject) => {
      return request({
        url: this.apiUrl,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        timeout: TIMEOUT
      })
        .then(resp => {
          const data = JSON.parse(resp);
          if (data && data.nanoNodeAccount) {
            if (this.currencyOk(data)) {
              console.log("OK", `(${this.source})`, this.apiUrl);
              resolve({ url: this.apiUrl, data: this.formatData(data) });
            } else {
              throw new Error(`Currency does not match for ${this.apiUrl}`);
            }
          } else {
            throw new Error(`Missing nanoNodeAccount data for ${this.apiUrl}`);
          }
        })
        .catch(reject);
    });
  }

  currencyOk(data) {
    return !data.currency || data.currency === config.monitorCurrencyName;
  }

  formatData(data) {
    data.currentBlock = parseInt(
      data.currentBlock.toString().replace(/[^\d\.]/g, ""),
      10
    );
    data.uncheckedBlocks = parseInt(
      data.uncheckedBlocks.toString().replace(/[^\d\.]/g, ""),
      10
    );
    data.numPeers = parseInt(
      data.numPeers.toString().replace(/[^\d\.]/g, ""),
      10
    );

    if (data.votingWeight) {
      data.votingWeight = parseFloat(
        data.votingWeight.toString().replace(/[^\d\.]/g, ""),
        10
      );
    }

    return data;
  }
}
