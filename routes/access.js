"use strict";

const Router = require("express").Router;

const lockwolf = require("../core");

const LWError = require("../utils/error");
const logger = require("../utils/logger");

const accessRoute = Router();

accessRoute.post("/", async (req, res, next) => {
  try {
    const access = await lockwolf.authenticate(req.body.user, req.body.device);

    return res.status(200).json(access);
  } catch (err) {
    return res.status(200).json({
        authenticated: false,
        message: err.message,
    });
  }
});

module.exports = accessRoute;