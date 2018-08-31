import config from "../server-config.json";
import networkTps from "./server/networkTps";

if (config.calculateNetworkTps) networkTps();
