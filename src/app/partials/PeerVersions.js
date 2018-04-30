import React, { Fragment } from "react";
import _ from "lodash";

import "./PeerVersions.css";

const Version = ({ version, count, total }) => {
  return (
    <dd className="position-relative p-3">
      <div
        className="PercentBar"
        style={{ width: `${count / total * 100}%` }}
      />

      <div className="VersionName">Version {version} </div>

      <div className="VersionStats">
        {(count / total * 100).toFixed(2)}% / {count} peers
      </div>
    </dd>
  );
};

export default function PeerVersions({ peers }) {
  const totalPeers = _.keys(peers).length;
  let versions = {};
  _.values(peers).forEach(version => {
    if (!versions[version]) versions[version] = 0;
    versions[version]++;
  });

  const sortedVersions = _.toPairs(versions).sort((a, b) => {
    if (a[0] > b[0]) return -1;
    if (a[0] < b[0]) return 1;
    return 0;
  });

  return (
    <Fragment>
      <h2>Peer Versions</h2>

      <dl className="PeerVersions">
        {_.map(sortedVersions, data => (
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
