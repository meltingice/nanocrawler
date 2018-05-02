import React, { Fragment } from "react";

const OptionalField = ({ value, children }) => {
  if (!value) return <i className="text-muted">Unknown</i>;
  if (!children) return <Fragment>{value}</Fragment>;
  return children(value);
};

export default OptionalField;
