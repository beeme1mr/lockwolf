// global modules
const Router = require("express").Router;

// LockWolf modules
const LWError = require("../utils/error");

// routes
const access = require("./access");

const v1 = Router();

v1.use("/access", access);

// Global API 404
v1.use((req, res, next) => { next(new LWError("Invalid route!", 404)); }); // eslint-disable-line no-unused-vars

module.exports.v1 = v1;