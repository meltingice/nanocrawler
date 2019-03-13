import { exec } from "child_process";
import { promisify } from "util";
import pidusage from "pidusage";

const pExec = promisify(exec);

let RAI_PID;

export default async function getStats() {
  if (!RAI_PID) await discoverPid();

  try {
    return await pidusage(RAI_PID);
  } catch (e) {
    console.log(e.message);
    RAI_PID = null;
    return {};
  }
}

async function discoverPid() {
  try {
    RAI_PID = (await pExec(
      "systemctl show -p MainPID --value rpc_nano_node"
    )).stdout.trim();

    console.log("nano_node:", RAI_PID);
  } catch (e) {
    console.log(e.message);
  }
}
