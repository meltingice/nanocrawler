import React from "react";
import "./AccountLink.css";

export default function AccountLink({ account, short }) {
  let accountName = account;
  if (short) accountName = `${account.substr(0, 9)}...${account.substr(-5)}`;

  return (
    <a
      className="AccountLink"
      href={`https://nanode.co/account/${account}`}
      target="_blank"
    >
      {accountName}
    </a>
  );
}
