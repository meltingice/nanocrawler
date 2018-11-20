import { Nano } from "nanode";
import express from "express";
import morgan from "morgan";
import cors from "cors";

import apiV1 from "./server/responders/v1";
import apiV2 from "./server/responders/v2";

import config from "../server-config.json";

const app = express();
const nano = new Nano({ url: config.nodeHost });

app.use(morgan("combined"));
app.use(cors());

app.use(apiV1(nano));
app.use("/v2", apiV2(nano));

app.get("/", (req, res) => {
  res.redirect(config.clientUrl);
});

app.use(function(err, req, res, next) {
  if (err.status) {
    res.status(err.status).send({ error: err.message });
  } else {
    console.error(err.stack);
    res.status(500).send({ error: err.message });
  }
});

app.listen(config.serverPort || 3001);
