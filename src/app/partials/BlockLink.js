import React from "react";
import { Link } from "react-router-dom";

export default function BlockLink({ hash, short, className, ...props }) {
  const displayHash = short ? `${hash.substr(0, 10)}...` : hash;
  const modifiedClass = `text-monospace ${className || ""}`;
  return (
    <Link to={`/explorer/block/${hash}`} className={modifiedClass} {...props}>
      {displayHash}
    </Link>
  );
}
