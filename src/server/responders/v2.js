import express from "express";
const app = express();

export default function apiV2(nano) {
  require("./v2/accounts").default(app, nano);
  require("./v2/blocks").default(app, nano);
  require("./v2/representatives").default(app, nano);
  require("./v2/search").default(app, nano);
  require("./v2/ticker").default(app, nano);

  return app;
}
