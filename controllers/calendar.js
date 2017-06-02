"use strict";

const Calenduh = require('calenduh');
const _ = require("lodash");
const moment = require("moment");

const logger = require("../utils/logger");
const deviceUtils = require("../utils/device");

const cal = new Calenduh('./client_secret.json');

const calendar = {
    getNextEvent: async (device) => {
        const deviceCategory = deviceUtils.getCategory(device);
        const calendarList = await cal.calendarList();
        const deviceCalendar = _.find(calendarList, c => c.summary === deviceCategory);
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
    }
}

module.exports = calendar;
