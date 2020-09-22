# homebridge-http-moisture-sensor

This [Homebridge](https://github.com/nfarina/homebridge) plugin can be used integrate your humidity sensor which has a
http api into HomeKit.

It is adapted from [homebridge-http-humidity-sensor](https://github.com/Supereg/homebridge-http-humidity-sensor) to add support for the `StatusLowBattery` characteristic.

It is NOT published to NPM.

## Installation

First of all you need to have [Homebridge](https://github.com/nfarina/homebridge) installed. Refer to the repo for
instructions.

Then, install this as a local NPM module.

## Configuration

The configuration can contain the following properties:

##### Basic configuration options:

* `accessory` \<string\> **required**: Defines the plugin used and must be set to **"HTTP-HUMIDITY"** for this plugin.
* `name` \<string\> **required**: Defines the name which is later displayed in HomeKit
* `getUrl` \<string |  [urlObject](#urlobject)\> **required**: Defines the url (and other properties when using
    and urlObject) to query the current humidity from the sensor. By default it expects the http server
    to return the humidity in percent.

`homebridge-http-humidity-sensor` imusts be used together with
[homebridge-http-notification-server](https://github.com/Supereg/homebridge-http-notification-server) in order to receive
updates when the state changes at your external program. For details on how to implement those updates and how to
install and configure `homebridge-http-notification-server`, please refer to the
[README](https://github.com/Supereg/homebridge-http-notification-server) of the repository.

This is an example on how to configure `homebridge-http-moisture-sensor` to work with your implementation of the
`homebridge-http-notification-server`.

```json
{
    "accessories": [
        {
          "accessory": "HTTP-MOISTURE",
          "name": "Moisture Sensor",

          "notificationID": "my-humidity-sensor",
          "notificationPassword": "superSecretPassword",
        }
    ]
}
```

* `notificationID` is an per Homebridge instance unique id which must be included in any http request.
* `notificationPassword` is **optional**. It can be used to secure any incoming requests.

To get more details about the configuration have a look at the
[README](https://github.com/Supereg/homebridge-http-notification-server).

**Available characteristics (for the POST body)**

Down here are all characteristics listed which can be updated with an request to the `homebridge-http-notification-server`

* `characteristic` "CurrentRelativeHumidity": expects an int `value` in a range of 0-100
* `characteristic` "StatusLowBattery": expects an int `value` in a range of 0-1