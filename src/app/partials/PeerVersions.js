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

  return (
    <Fragment>
      <h2>Peer Versions</h2>

      <dl className="PeerVersions">
        {_.map(versions, (count, version) => (
          <Version
            key={version}
            version={version}
            count={count}
            total={totalPeers}
          />
        ))}
      </dl>
    </Fragment>
  );
}
