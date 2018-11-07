import express from "express";
const app = express();

export default function apiV2(nano) {
  require("./v2/accounts").default(app, nano);

  return app;
}
