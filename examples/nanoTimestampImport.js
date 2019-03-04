// Used to import the Nano timestamp database. Saved here for future reference
// purposes. Also, in case anyone is wondering how to use a massive JSON file.
const fs = require("fs");
const { chain } = require("stream-chain");
const { parser } = require("stream-json");
const { streamObject } = require("stream-json/streamers/StreamObject");
const redis = require("redis").createClient();

let counter = 0;
const pipeline = chain([
  fs.createReadStream("./timestamps.json", {
    encoding: "utf8"
  }),
  parser(),
  streamObject(),
  ({ key, value }) => {
    redis.setnx(`block_timestamp/${key}`, value * 1000);

    counter++;
    if (counter % 1000 === 0) console.log("Processed:", counter);
  }
]);
