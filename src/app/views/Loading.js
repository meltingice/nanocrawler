import React from "react";
import "./Loading.css";

export default function Loading({ error, pastDelay }) {
  if (!pastDelay) return null;

  return (
    <div id="Loading" className="text-center">
      <h2 className="text-muted">Loading...</h2>
    </div>
  );
}
