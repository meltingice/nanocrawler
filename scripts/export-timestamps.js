// This is used to export timestamps from NanoCrawler's own system, which
// can then be used to import into other explorers or the Nano node itself.

const fs = require("fs");
const util = require("util");
const redis = require("redis").createClient();
const scan = util.promisify(redis.scan).bind(redis);
const get = util.promisify(redis.get).bind(redis);

const outputFile = process.argv[2] || "timestamps.csv";
const stream = fs.createWriteStream(outputFile);
const HASH_REGEX = /^block_timestamp\/([A-F0-9]{64})$/;

async function fetchNext(cursor) {
  console.log(`Fetching cursor ${cursor}`);
  const resp = await scan(
    cursor,
    "MATCH",
    "block_timestamp/*",
    "COUNT",
    "5000"
  );

  const nextCursor = resp[0];
  const keys = resp[1];
  const done = nextCursor === "0";

  const outputString = await getTimestamps(keys);
  if (!stream.write(outputString, "utf-8") && !done) {
    stream.once("drain", () => fetchNext(nextCursor));
  } else if (!done) {
    fetchNext(nextCursor);
  } else {
    console.log("Done!");
    stream.destroy();
    redis.end(true);
  }
}

async function getTimestamps(keys) {
  const filteredKeys = keys.filter(key => HASH_REGEX.test(key));

  return new Promise((resolve, reject) => {
    let returnValue = [];
    redis.multi(filteredKeys.map(key => ["get", key])).exec((err, replies) => {
      if (err) return resolve([]);

      filteredKeys.forEach((key, index) => {
        const hash = key.match(/^block_timestamp\/([A-F0-9]{64})/)[1];

        // JS uses milliseconds for timestamps, but most other things don't. We drop
        // the extra precision here.
        returnValue.push(
          [hash, Math.round(parseInt(replies[index], 10) / 1000)].join(",")
        );
      });

      resolve(`${returnValue.join("\n")}\n`);
    });
  });
}

fetchNext(0);
