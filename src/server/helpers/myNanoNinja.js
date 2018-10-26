import { promisify } from "es6-promisify";
import curl from "curlrequest";

const request = promisify(curl.request.bind(curl));
const TIMEOUT = 5;

export async function getNinjaData(account) {
  const resp = await request({
    url: `https://mynano.ninja/api/accounts/${account}`,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    timeout: TIMEOUT
  });

  return JSON.parse(resp);
}
