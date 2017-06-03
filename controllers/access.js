"use strict";

const moment = require("moment-round");

const AccessModel = require("../models/access");

const calendarController = require("./calendar");

const deviceUtils = require("../utils/device");
const LWError = require("../utils/error");
const logger = require("../utils/logger");

// Changing for demo purposes
const MAX_TIME_REQUIRED = 1;
const MIN_CUTOFF_TIME = 1;

const access = {
    /**
     * check is a user has passed the required certifications
     */
    isCertified: async (user, device) => {
        logger.debug("Checking to see if the user is certified.");
        const deviceCategory = deviceUtils.getCategory(device);
        logger.debug(`Checking if '${user.firstName}' has access to '${deviceCategory}'.`)
        const access = await AccessModel.query({ userId: user.id }).filter("deviceCategory").eq(deviceCategory).limit(1).exec();

        return (access.length !== 1);
    },

    getAvailability: async (user, device) => {
        let available = false;
        let minutesAllocated = null;
        logger.debug("Checking to see if the device is available.");
        const nextEvent = await calendarController.getNextEvent(device);

        if (nextEvent) {
            logger.debug("There's an event scheduled.  Checking to see that affects the user.");
            if (user.id === nextEvent.summary) {
                logger.debug("The user has scheduled the next event");
                if (moment().isBetween(moment(nextEvent.start.dateTime).subtract(MAX_TIME_REQUIRED, "minutes"), moment(nextEvent.end.dateTime).subtract(MIN_CUTOFF_TIME, "minutes"))) {
                    available = true;
                    minutesAllocated = moment(moment(nextEvent.end.dateTime)).diff(moment(), "minutes");
                } else {
                    logger.info("but it's too far in the future!");
                    // TODO add new event to cal
                    available = true;
                    minutesAllocated = moment(moment().ceil(30, "minutes").add(30, "minutes")).diff(moment(), "minutes");
                }
            } else {
                const timeAvailable = moment(nextEvent.start.dateTime).diff(moment(), 'minutes');
                logger.info(`The user '${user.id}' has scheduled to device in ${timeAvailable} minute(s).`);
                if (timeAvailable >= MAX_TIME_REQUIRED) {
                    //TODO add new event to cal
                    logger.info("Great, we can add you in.");
                    available = true;
                    minutesAllocated = timeAvailable;
                } else {
                    logger.info("Sorry, someone else is scheduled to use this device soon.");
                }
            }
        } else {
            //TODO add new event to cal
            logger.debug("It's available.");
            available = true;
            //minutesAllocated = moment(moment().ceil(30, "minutes").add(30, "minutes")).diff(moment(), "minutes");
            // Changed for demo purposes
            minutesAllocated = 15;
        }

        return {
            available,
            minutesAllocated
        }
    }
}

module.exports = access;
