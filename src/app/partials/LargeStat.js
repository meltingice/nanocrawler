import React from 'react'

export default ({ value, text }) => {
  let displayValue;
  if (value === null) {
    displayValue = <span className="text-muted">...</span>;
  } else {
    displayValue = value;
  }

  return (
    <h3>{displayValue} {text}</h3>
  )
}
