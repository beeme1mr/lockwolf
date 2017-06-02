"use strict";

const BbPromise = require("bluebird"); 

const UserModel = require("../models/user");
const DeviceModel = require("../models/device");

const accessController = require("../controllers/access");

const LWError = require("../utils/error");
const logger = require("../utils/logger");
const deviceUtils = require("../utils/device");

const DEFAULT_MESSAGE = "Oh no!  It looks like you don't have access.";

const lockWolf = {
    authenticate: async (userId, deviceId) => {
        console.time('authenticate');
        logger.info("Attempting to authenticate user");
        if (!userId) {
            throw new LWError("A user ID is required!", 400);
        } else if (!deviceId) {
            throw new LWError("A device ID is required!", 400);
        }

        let authenticated = false;
        let message = DEFAULT_MESSAGE;
        let user, device
        console.time('getUserAndDevice');
        [ user, device ] = await BbPromise.all([
            UserModel.get(userId),
            DeviceModel.get(deviceId)
        ]);
        console.timeEnd('getUserAndDevice');

        if (!user) {
            throw new LWError("It looks like we haven't met.  Please contact the lab administrator for access!");
        } else if (!device) {
            throw new Error("Strange, this device isn't in the system.  Please contact the lab administrator so they can investigate the issue!");
        }

        // Checks if user has passed the cert
        console.time('isCertified');
        const access = !await accessController.isCertified(user, device);
        console.timeEnd('isCertified');

        if (!access) {
            throw new Error(`Hmm, it looks like you haven't passed the required certification in order to use a ${deviceUtils.getFriendlyCategory(device)}.`);
        }

        // Checks if the user is scheduled to use the device
        console.time('isAvailable');
        const availability = await accessController.getAvailability(user, device);
        console.timeEnd('isAvailable');

        if (!availability.available) {
            throw new Error(`Sorry, someone has already reserved the ${deviceUtils.getFriendlyCategory(device)}.`);
        }
        
        const minutesAllocated = availability.minutesAllocated
        authenticated = true;
        message = (availability.minutesAllocated) ?
            `You're all set for the next ${availability.minutesAllocated} minutes, ${user.firstName}!`
            : `You're all set ${user.firstName}!`;
        
        console.timeEnd('authenticate');
        return {
            authenticated,
            message,
            minutesAllocated
        }
    }
};

module.exports = lockWolf;
