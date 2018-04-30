import React from "react";
import { Link } from "react-router-dom";

export default function BlockLink({ hash, short, ...props }) {
  const displayHash = short ? `${hash.substr(0, 10)}...` : hash;
  return (
    <Link to={`/explorer/block/${hash}`} {...props}>
      {displayHash}
    </Link>
  );
}
