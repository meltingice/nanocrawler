import config from "../server-config.json";
import startNetworkDataUpdates from "./server/nanoNodeMonitorPeers";

if (config.networkUpdatesEnabled) startNetworkDataUpdates();
