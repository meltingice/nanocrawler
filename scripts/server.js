require("babel-register")({
  presets: ["env", "react-app"]
});

process.env.BABEL_ENV = "development";
process.env.NODE_ENV = "development";

require("../src/server.api");
