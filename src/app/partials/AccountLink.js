import React from "react";
import { Link } from "react-router-dom";
import "./AccountLink.css";

export default function AccountLink({ account, name, short, ...props }) {
  if (!account) return null;

  let accountName = name || account;
  if (!name && short)
    accountName = `${account.substr(0, 9)}...${account.substr(-5)}`;

  return (
    <Link
      className="AccountLink"
      to={`/explorer/account/${account}`}
      {...props}
    >
      {accountName}
    </Link>
  );
}
