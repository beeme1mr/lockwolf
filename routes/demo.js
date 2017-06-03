"use strict";

const Router = require("express").Router;

const demoController = require("../controllers/demo");

const LWError = require("../utils/error");
const logger = require("../utils/logger");

const demoRoute = Router();

demoRoute.put("/scenario1", async (req, res, next) => {
  try {
    // We haven't meet the user
    await demoController.scenario1();
    return res.sendStatus(202);
  } catch (err) {
    logger.error(err);
    return res.sendStatus(500);
  }
});

demoRoute.put("/scenario2", async (req, res, next) => {
  try {
    // User doesn't have access
    await demoController.scenario2();
    return res.sendStatus(202);
  } catch (err) {
    logger.error(err);
    return res.sendStatus(500);
  }
});

demoRoute.put("/scenario3", async (req, res, next) => {
  try {
    // Another user is scheduled to use the device
    await demoController.scenario3();
    return res.sendStatus(202);
  } catch (err) {
    logger.error(err);
    return res.sendStatus(500);
  }
});

demoRoute.put("/scenario4", async (req, res, next) => {
  try {
    // Authorized for 10 minutes (seconds);
    await demoController.scenario4();
    return res.sendStatus(202);
  } catch (err) {
    logger.error(err);
    return res.sendStatus(500);
  }
});

module.exports = demoRoute;