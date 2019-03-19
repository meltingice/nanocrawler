require("babel-register")({
  presets: ["env", "react-app"]
});

const HistoryScanner = require("./src/server/helpers/HistoryScanner").default;
const scanner = new HistoryScanner(
  "xrb_1epochfo6oqad7mgn6rcikgka9bps43nedz1kpm1t35e579mregxgf6srhpd"
);

scanner.update().then(() => {
  console.log("Done!");
});
