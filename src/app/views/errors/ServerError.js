import React from "react";

export default function ServerError() {
  return (
    <div className="row my-5 justify-content-center">
      <div className="col-6 text-center">
        <h1 className="display-1">500</h1>
        <h3>
          The server either encountered an error or is unable to fulfill your
          request
        </h3>
      </div>
    </div>
  );
}
