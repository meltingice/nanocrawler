import React from "react";
import { Link } from "react-router-dom";
import "./AccountLink.css";

export default function AccountLink({ account, short, ...props }) {
  let accountName = account;
  if (short) accountName = `${account.substr(0, 9)}...${account.substr(-5)}`;

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
