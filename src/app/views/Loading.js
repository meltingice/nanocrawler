import React from "react";
import "./Loading.css";

export default React.memo(function Loading() {
  return (
    <div id="Loading" className="text-center">
      <h2 className="text-muted">Loading...</h2>
    </div>
  );
});
