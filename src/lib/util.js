// Account utilities from NanoVault
// https://github.com/cronoh/nanovault/blob/master/src/app/services/util.service.ts#L217

import moment from "moment";
import * as blake from "blakejs";

export function formatTimestamp(timestamp) {
  if (!timestamp) return null;
  return moment(parseInt(timestamp, 10)).format("MMM D, YYYY h:mm:ssa");
}

export function keyToPublicAccountId(accountHex) {
  const keyBytes = uint4ToUint8(hexToUint4(accountHex)); // For some reason here we go from u, to hex, to 4, to 8??
  const checksum = uint5ToString(
    uint4ToUint5(uint8ToUint4(blake.blake2b(keyBytes, null, 5).reverse()))
  );
  const account = uint5ToString(uint4ToUint5(hexToUint4(`0${accountHex}`)));

  return `xrb_${account}${checksum}`;
}

function uint4ToUint8(uintValue) {
  const length = uintValue.length / 2;
  const uint8 = new Uint8Array(length);
  for (let i = 0; i < length; i++)
    uint8[i] = uintValue[i * 2] * 16 + uintValue[i * 2 + 1];

  return uint8;
}

function uint4ToUint5(uintValue) {
  var length = uintValue.length / 5 * 4;
  var uint5 = new Uint8Array(length);
  for (let i = 1; i <= length; i++) {
    let n = i - 1;
    let m = i % 4;
    let z = n + (i - m) / 4;
    let right = uintValue[z] << m;
    let left;
    if ((length - i) % 4 === 0) left = uintValue[z - 1] << 4;
    else left = uintValue[z + 1] >> (4 - m);
    uint5[n] = (left + right) % 32;
  }
  return uint5;
}

function uint8ToUint4(uintValue) {
  const uint4 = new Uint8Array(uintValue.length * 2);
  for (let i = 0; i < uintValue.length; i++) {
    uint4[i * 2] = (uintValue[i] / 16) | 0;
    uint4[i * 2 + 1] = uintValue[i] % 16;
  }

  return uint4;
}

function uint5ToString(uint5) {
  const letter_list = "13456789abcdefghijkmnopqrstuwxyz".split("");
  let string = "";
  for (let i = 0; i < uint5.length; i++) string += letter_list[uint5[i]];

  return string;
}

function hexToUint4(hexValue) {
  const uint4 = new Uint8Array(hexValue.length);
  for (let i = 0; i < hexValue.length; i++)
    uint4[i] = parseInt(hexValue.substr(i, 1), 16);

  return uint4;
}
