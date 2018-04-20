export function accountIsValid(account) {
  return /^(xrb_|nano_)/.test(account);
}
