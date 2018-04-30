import fs from "fs";
import { promisify } from "es6-promisify";
import config from "../../../server-config.json";

const fsStat = promisify(fs.stat);

const dbSize = async () => {
  if (!config.raiblocksDir) return null;

  try {
    const stats = await fsStat(`${config.raiblocksDir}/data.ldb`);
    return stats.size;
  } catch (e) {
    return null;
  }
};

export default dbSize;
