[![npm version](https://badge.fury.io/js/homebridge-xiaomi-smart-plug.svg)](https://badge.fury.io/js/homebridge-xiaomi-smart-plug.svg)
# Homebridge Mi Smart Plug

[Homebridge](https://github.com/nfarina/homebridge) plugin for Xiaomi Smart Plug

![mi](https://i01.appmifile.com/webfile/globalimg/49/77AC4D29-2E0E-325D-2CC9-20E243139E71.jpg)

## Supporting devices

The following ones should be supported as they share the same API [https://github.com/rytilahti/python-miio/blob/master/miio/chuangmi_plug.py](https://github.com/rytilahti/python-miio/blob/master/miio/chuangmi_plug.py)
- MODEL_CHUANGMI_PLUG_V3 = "chuangmi.plug.v3"
- ~~MODEL_CHUANGMI_PLUG_V1 = "chuangmi.plug.v1"~~
- MODEL_CHUANGMI_PLUG_M1 = "chuangmi.plug.m1"
- MODEL_CHUANGMI_PLUG_M3 = "chuangmi.plug.m3"
- MODEL_CHUANGMI_PLUG_V2 = "chuangmi.plug.v2"
- MODEL_CHUANGMI_PLUG_HMI205 = "chuangmi.plug.hmi205" [[Walmart]](https://www.walmart.com/ip/Xiaomi-Mi-Smart-Plug-1-Pack/295288889)
- MODEL_CHUANGMI_PLUG_HMI206 = "chuangmi.plug.hmi206"
- MODEL_CHUANGMI_PLUG_HMI208 = "chuangmi.plug.hmi208"

## Get your token and IP

Good luck!!! (Because it's the hard part), some links to help you:

* https://github.com/jghaanstra/com.xiaomi-miio/blob/master/docs/obtain_token.md
* https://github.com/mediter/miio/blob/master/docs/ios-token-without-reset.md

## Installation

```
npm install -g homebridge-xiaomi-smart-plug
```


## Example Configuration

```json
{
  "accessories": [
    {
    "accessory": "homebridge-xiaomi-smart-plug", // don't change this
    "name": "My Smart Plug",
    "ip": "192.168.0.101",
    "token": "6591d0ad2003ddd2da75815f5d7def26"
    }
  ]
}
```

## Thanks to
[homebridge-mi-led-desk-lamp](https://github.com/moifort/homebridge-mi-led-desk-lamp)