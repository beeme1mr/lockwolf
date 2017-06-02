"use strict";

/*
 * Module dependencies
 */
const BbPromise = require("bluebird");
const json = require("body-parser").json;
const dotenv = require("dotenv");
const express = require("express");

global.Promise = BbPromise;
dotenv.config();

/*
 * LockWolf dependencies
 */

const logger = require("./utils/logger");
const api = require("./routes");

/*
 * Startup logic
 */


function start() {
  return BbPromise.resolve()
    .then(() => {
      const app = express();

      app.use(json());

      // Routes
      app.use("/api", api.v1);

      const port = process.env.DAVIS_PORT || 8080;
      logger.info(`Started listening on ${port}.`);
      app.listen(port);

      // Global Error Handler
      app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
        logger.warn(err.message);
        // Syntax Errors are thrown by the json parser
        if (err instanceof SyntaxError) {
          return res.status(400).json({ success: false, message: err.message });
        }

        const code = err.statusCode || 500;
        return res.status(code).json({ success: false, message: err.message });
      });
    })
    .catch((err) => {
      logger.error(err);
      process.exit(1);
    });
}

start();
