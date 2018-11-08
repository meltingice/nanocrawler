import express from "express";
const app = express();

export default function apiV1(nano) {
  require("./v1/accounts").default(app, nano);
  require("./v1/api").default(app, nano);
  require("./v1/blocks").default(app, nano);
  require("./v1/network").default(app, nano);
  require("./v1/peers").default(app, nano);
  require("./v1/representatives").default(app, nano);
  require("./v1/system").default(app, nano);

  return app;
}
