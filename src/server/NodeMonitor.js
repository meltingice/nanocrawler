import { promisify } from "es6-promisify";
import curl from "curlrequest";

const request = promisify(curl.request.bind(curl));

const TIMEOUT = 5;

export default class NodeMonitor {
  static fromPeerAddress(peer) {
    const match = peer.match(/\[::ffff:(\d+\.\d+\.\d+\.\d+)\]:\d+/);
    if (match) return new NodeMonitor(`http://${match[1]}/api.php`);
    return null;
  }

  constructor(apiUrl) {
    this.apiUrl = apiUrl;
  }

  fetch() {
    console.log("Checking", this.apiUrl);

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
          if (data.nanoNodeAccount) {
            console.log("OK", this.apiUrl);
            resolve({ url: this.apiUrl, data: this.formatData(data) });
          } else {
            reject("Missing nanoNodeAccount data");
          }
        })
        .catch(reject);
    });
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
