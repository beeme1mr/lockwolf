"use strict";

const BbPromise = require("bluebird");
const moment = require("moment");

const userModel = require("../models/user");
const deviceModel = require("../models/device");
const accessModel = require("../models/access");

const calendarController = require("../controllers/calendar");

const logger = require("../utils/logger");

const user1 = {
  id: "12823229131246",
  firstName: "Mike"
}

const user2 = {
  id: "64116251115188",
  firstName: "Kevin"
}

const device1 = {
  id: "00000000aeff9b9d",
  type: "projector",
  subtype: "overhead"
}

const access1 = {
  userId: "12823229131246",
  deviceCategory: "overhead_projector"
}

const demo = {
  // Haven't met user
  scenario1: async () => {
    logger.info("Simulates a unknown user.");
    return clearAll();
  },
  // User isn't authorized
  scenario2: async () => {
    logger.info("simulates an authorized user.");
    await clearAll();
    const demoUser1 = new userModel(user1);
    const demoDevice1 = new deviceModel(device1);
    return BbPromise.all([
      demoUser1.save(),
      demoDevice1.save()
    ]);
  },
  scenario3: async () => {
    logger.info("Another user has already registered to use the system.");
    await BbPromise.all([
      clearAll(),
      calendarController.clearNextEvent(device1),
    ]);

    const demoUser1 = new userModel(user1);
    const demoUser2 = new userModel(user2);
    const demoDevice1 = new deviceModel(device1);
    const demoAccess1 = new accessModel(access1);

    return BbPromise.all([
      demoUser1.save(),
      demoUser2.save(),
      demoDevice1.save(),
      demoAccess1.save(),
      calendarController.addNewEvent(user2, device1, moment().subtract(30, "minutes"), moment().add(30, "minutes")),
    ]);
  },
  scenario4: async () => {
    await BbPromise.all([
      clearAll(),
      calendarController.clearNextEvent(device1),
    ]);

    const demoUser1 = new userModel(user1);
    const demoUser2 = new userModel(user2);
    const demoDevice1 = new deviceModel(device1);
    const demoAccess1 = new accessModel(access1);

    return BbPromise.all([
      demoUser1.save(),
      demoUser2.save(),
      demoDevice1.save(),
      demoAccess1.save()
    ]);
  }
}

async function clearAll() {
  return BbPromise.all([
    clearUsers(),
    clearDevices(),
    clearAccess(),
  ])
}

async function clearUsers() {
  logger.debug("Clearing users");
  return userModel.batchDelete([
    user1,
    user2
  ]);
}

async function clearDevices() {
  logger.debug("Clearing devices");
  return deviceModel.batchDelete([
    device1
  ]);
}

async function clearAccess() {
  logger.debug("Clearing access table");
  return accessModel.batchDelete([
    access1
  ]);
}

module.exports = demo;
