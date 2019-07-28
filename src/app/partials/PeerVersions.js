import React, { Fragment } from "react";
import keys from "lodash/keys";
import toPairs from "lodash/toPairs";
import values from "lodash/values";
import { FormattedNumber } from "react-intl";
import { TranslatedMessage } from "lib/TranslatedMessage";
import { withNetworkData } from "lib/NetworkContext";
import Currency from "lib/Currency";
import config from "client-config.json";

import "./PeerVersions.css";

const Version = ({ version, count, weight, total }) => {
  return (
    <dd className="position-relative row py-1 align-items-center">
      <div
        className="PercentBar"
        style={{ width: `${(count / total) * 100}%` }}
      />

      <div className="col position-relative PeerData pl-4">
        Protocol version {version}
        <br />
        <small>
          Voting weight:{" "}
          <FormattedNumber
            value={Currency.fromRaw(weight)}
            maximumFractionDigits={2}
          />{" "}
          {config.currency.shortName}
        </small>
      </div>

      <div className="col-auto position-relative PeerData">
        {((count / total) * 100).toFixed(2)}% / {count} peers
      </div>
    </dd>
  );
};

const PeerVersions = ({ network }) => {
  const { peers } = network;
  const totalPeers = peers.length;

  let versions = {};
  peers.forEach(peer => {
    if (!versions[peer.protocol_version])
      versions[peer.protocol_version] = { count: 0, weight: "0" };
    versions[peer.protocol_version].count++;

    if (peer.weight) {
      versions[peer.protocol_version].weight = Currency.addRaw(
        versions[peer.protocol_version].weight,
        peer.weight
      );
    }
  });

  const sortedVersions = toPairs(versions).sort((a, b) => {
    const aVersion = parseInt(a[0], 10);
    const bVersion = parseInt(b[0], 10);

    if (aVersion > bVersion) return -1;
    if (aVersion < bVersion) return 1;
    return 0;
  });

  const percentUDP =
    (peers.filter(peer => peer.type === "udp").length / totalPeers) * 100.0;
  const percentTCP =
    (peers.filter(peer => peer.type === "tcp").length / totalPeers) * 100.0;

  return (
    <Fragment>
      <h2 className="mb-0">
        <TranslatedMessage id="network.peer_versions.title" />
      </h2>

      <p className="text-muted">
        <TranslatedMessage id="network.peer_versions.desc" />
      </p>

      <h3>
        <FormattedNumber value={percentUDP} maximumFractionDigits={2} />%{" "}
        <small className="text-muted">UDP</small>{" "}
        <FormattedNumber value={percentTCP} maximumFractionDigits={2} />%{" "}
        <small className="text-muted">TCP</small>
      </h3>

      <dl className="PeerVersions mt-3">
        {sortedVersions.map(data => (
          <Version
            key={data[0]}
            version={data[0]}
            count={data[1].count}
            weight={data[1].weight}
            total={totalPeers}
          />
        ))}
      </dl>
    </Fragment>
  );
};

export default withNetworkData(PeerVersions);
