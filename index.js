"use strict";

let Service, Characteristic, api;

const _http_base = require("homebridge-http-base");
const notifications = _http_base.notifications;
const utils = _http_base.utils;

const packageJSON = require("./package.json");

module.exports = function (homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;

    api = homebridge;

    homebridge.registerAccessory("homebridge-http-moisture-sensor", "HTTP-MOISTURE", HTTP_MOISTURE);
};

function HTTP_MOISTURE(log, config) {
    this.log = log;
    this.name = config.name;
    this.debug = config.debug || false;

    this.homebridgeService = new Service.HumiditySensor(this.name);
    this.homebridgeService.getCharacteristic(Characteristic.CurrentRelativeHumidity)
        .on("get", this.getHumidity.bind(this));
    this.homebridgeService.getCharacteristic(Characteristic.StatusLowBattery)
        .on("get", this.getLowBattery.bind(this));

    /** @namespace config.notificationPassword */
    /** @namespace config.notificationID */
    notifications.enqueueNotificationRegistrationIfDefined(api, log, config.notificationID, config.notificationPassword, this.handleNotification.bind(this));
}

HTTP_MOISTURE.prototype = {
    identify: function (callback) {
        this.log("Identify requested!");
        callback();
    },

    getServices: function () {
        if (!this.homebridgeService)
            return [];

        const informationService = new Service.AccessoryInformation();

        informationService
            .setCharacteristic(Characteristic.Manufacturer, "Andreas Bauer")
            .setCharacteristic(Characteristic.Model, "HTTP Humidity Sensor")
            .setCharacteristic(Characteristic.SerialNumber, "HS01")
            .setCharacteristic(Characteristic.FirmwareRevision, packageJSON.version);

        return [informationService, this.homebridgeService];
    },

    handleNotification: function(body) {
        const characteristic = utils.getCharacteristic(this.homebridgeService, body.characteristic);
        if (!characteristic) {
            this.log("Encountered unknown characteristic when handling notification (or characteristic which wasn't added to the service): " + body.characteristic);
            return;
        }

        if (this.debug)
            this.log("Updating '" + body.characteristic + "' to new value: " + body.value);
        characteristic.updateValue(body.value);
    },

    getHumidity: function (callback) {
        const value = this.homebridgeService.getCharacteristic(Characteristic.CurrentRelativeHumidity).value;
        this.log(`getHumidity() returning cached value ${value}`);
        callback(null, value);
    },

    getLowBattery: function (callback) {
        const value = this.homebridgeService.getCharacteristic(Characteristic.StatusLowBattery).value;
        this.log(`getLowBattery() returning cached value ${value}`);
        callback(null, value);
    },
};
