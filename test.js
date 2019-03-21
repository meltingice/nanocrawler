require("babel-register")({
  presets: ["env", "react-app"]
});

const HistoryScanner = require("./src/server/helpers/HistoryScanner").default;
const scanner = new HistoryScanner(
  "xrb_3jwrszth46rk1mu7rmb4rhm54us8yg1gw3ipodftqtikf5yqdyr7471nsg1k"
);

scanner.update().then(() => {
  console.log("Done!");
});
