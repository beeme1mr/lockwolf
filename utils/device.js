"use strict";

const device = {
    getFriendlyCategory: (device) => {
        return (device.subtype) ? `${device.subtype} ${device.type}` : device.type;
    },

    getCategory: (device) => {
        return (device.subtype) ?
            `${device.subtype}_${device.type}`.toLowerCase().replace(" ", "_") : device.type.toLowerCase().replace(" ", "_");
    }
};

module.exports = device;
