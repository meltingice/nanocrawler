import React from 'react'

export default function AccountLink({ account }) {
  return <a href={`https://nanode.co/account/${account}`} target="_blank">{account}</a>
}
