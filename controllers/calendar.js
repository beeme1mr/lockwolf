"use strict";

const Calenduh = require('calenduh');
const _ = require("lodash");
const moment = require("moment");

const logger = require("../utils/logger");
const deviceUtils = require("../utils/device");

const cal = new Calenduh('./client_secret.json');

const calendar = {
    getNextEvent: async (device) => {
        const deviceCalendar = await getCalendar(device);
        if (deviceCalendar) {
            const nextEvent = await cal.events(deviceCalendar.id, {
                timeMin: (new Date()).toISOString(),
                maxResults: 1,
                singleEvents: true,
                orderBy: 'startTime'
            });

            if (nextEvent.length === 1) {
                return nextEvent[0];
            }
        }

        logger.debug(`Unable to find an upcoming event for '${device.id}'.`);
        return null;
    },

    addNewEvent: async (user, device, startDateTime , endDateTime) => {
        const deviceCalendar = await getCalendar(device);
        if (deviceCalendar) {
            logger.debug("Adding calendar event");
            await cal.createEvent(deviceCalendar.id, user.id, startDateTime, endDateTime);
        } else {
            logger.warn("No calendar found");
        }
    },

    clearNextEvent: async (device) => {
        const nextEvent = await calendar.getNextEvent(device);
        if (nextEvent) {
            const deviceCalendar = await getCalendar(device);
            logger.debug(`Removing ${nextEvent.id} from ${deviceCalendar.id}.`);
            await cal.deleteEvent(deviceCalendar.id, nextEvent.id)
        }
    }
}

async function getCalendar(device) {
    const deviceCategory = deviceUtils.getCategory(device);
    const calendarList = await cal.calendarList();
    return _.find(calendarList, c => c.summary === deviceCategory);
}

module.exports = calendar;
