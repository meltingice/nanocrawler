import config from "../server-config.json";
import startRichListUpdates from "./server/richList";

if (config.calculateRichList) startRichListUpdates();
