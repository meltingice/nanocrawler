import { promisify } from "es6-promisify";
import fetchTimeout from "fetch-timeout";

const TIMEOUT = 5 * 1000;

export default class NodeMonitor {
  static fromPeerAddress(peer) {
    const match = peer.match(/\[::ffff:(\d+\.\d+\.\d+\.\d+)\]:\d+/);
    if (match) return new NodeMonitor(`http://${match[1]}/api.php`);
    return null;
  }

  constructor(apiUrl) {
    this.apiUrl = apiUrl;
  }

  async fetch() {
    const resp = await promisify(fetchTimeout)(
      this.apiUrl,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      },
      TIMEOUT
    );

    if (resp.ok) {
      const data = await resp.json();
      if (data.nanoNodeAccount) {
        console.log("OK", this.apiUrl);
        return { url: this.apiUrl, data: this.formatData(data) };
      } else {
        throw new Error("Missing nanoNodeAccount data");
      }
    } else {
      throw new Error(`Received ${resp.status}`);
    }
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
