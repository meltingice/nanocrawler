import React from 'react'

export default function BlockLink({ hash }) {
  return <a href={`https://nanode.co/block/${hash}`} target="_blank">{hash.substr(0, 10)}...</a>
}
