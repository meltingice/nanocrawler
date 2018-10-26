import _ from "lodash";
import redisFetch from "./redisFetch";

export default async function networkStats() {
  const data = await redisFetch("nanoNodeMonitorPeerData", 10, async () => {
    return [];
  });

  return new NetworkStats(data);
}

function _median(arr) {
  const sortedArr = arr.sort();
  if (sortedArr.length % 2 === 0) {
    return Math.round(
      (sortedArr[Math.floor((arr.length - 1) / 2)] +
        sortedArr[Math.ceil((arr.length - 1) / 2)]) /
        2
    );
  } else {
    return sortedArr[(arr.length - 1) / 2];
  }
}

class NetworkStats {
  constructor(data) {
    this.peers = data.filter(
      peer => peer.data.votingWeight && peer.data.votingWeight >= 0
    );
  }

  get meanBlockCount() {
    return Math.round(_.mean(this.currentBlocks()));
  }

  get medianBlockCount() {
    return _median(this.currentBlocks());
  }

  get maxBlockCount() {
    return _.max(this.currentBlocks());
  }

  get minBlockCount() {
    return _.min(this.currentBlocks());
  }

  currentBlocks() {
    return _.compact(
      this.peers.map(peer => parseInt(peer.data.currentBlock, 10))
    );
  }
}
