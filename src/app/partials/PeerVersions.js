import React, { Fragment } from "react";
import { TranslatedMessage } from "lib/TranslatedMessage";
import keys from "lodash/keys";
import toPairs from "lodash/toPairs";
import values from "lodash/values";

import "./PeerVersions.css";

const Version = ({ version, count, total }) => {
  return (
    <dd className="position-relative p-3">
      <div
        className="PercentBar"
        style={{ width: `${(count / total) * 100}%` }}
      />

      <div className="VersionName">Version {version} </div>

      <div className="VersionStats">
        {((count / total) * 100).toFixed(2)}% / {count} peers
      </div>
    </dd>
  );
};

export default function PeerVersions({ peers }) {
  const totalPeers = keys(peers).length;
  let versions = {};
  values(peers).forEach(version => {
    if (!versions[version]) versions[version] = 0;
    versions[version]++;
  });

  const sortedVersions = toPairs(versions).sort((a, b) => {
    const aVersion = parseInt(a[0], 10);
    const bVersion = parseInt(b[0], 10);

    if (aVersion > bVersion) return -1;
    if (aVersion < bVersion) return 1;
    return 0;
  });

  return (
    <Fragment>
      <h2>
        <TranslatedMessage id="network.peer_versions" />
      </h2>

      <dl className="PeerVersions">
        {sortedVersions.map(data => (
          <Version
            key={data[0]}
            version={data[0]}
            count={data[1]}
            total={totalPeers}
          />
        ))}
      </dl>
    </Fragment>
  );
}
