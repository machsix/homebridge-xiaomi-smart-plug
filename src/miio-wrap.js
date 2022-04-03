'use strict';

const network = require('miio/lib/network');

const Device = require('miio/lib/device');
const Placeholder = require('miio/lib/placeholder');
let models = require('miio/lib/models');
const PowerPlug = require('miio/lib/devices/power-plug')

const new_models = {
		"chuangmi.plug.v3"             : require('miio/lib/devices/chuangmi.plug.v1'),
		// "chuangmi.plug.v1"             : require('./devices/chuangmi.plug.v1'),
		// "chuangmi.plug.m1"             : PowerPlug,
		"chuangmi.plug.m3"             : PowerPlug,
		// "chuangmi.plug.v2"             : PowerPlug,
		"chuangmi.plug.hmi205"         : PowerPlug,
		"chuangmi.plug.hmi206"         : PowerPlug,
		"chuangmi.plug.hmi208"         : PowerPlug,
};

models = Object.assign(models, new_models);

module.exports.models = models;

module.exports.device = function(options) {
	let handle = network.ref();
	// Connecting to a device via IP, ask the network if it knows about it
	return network.findDeviceViaAddress(options)
		.then(device => {
			const deviceHandle = {
				ref: network.ref(),
				api: device
			};

			// Try to resolve the correct model, otherwise use the generic device
			const d = models[device.model];
			if(! d) {
				return new Device(deviceHandle);
			} else {
				return new d(deviceHandle);
			}
		})
		.catch(e => {
			if((e.code === 'missing-token' || e.code === 'connection-failure') && options.withPlaceholder) {
				const deviceHandle = {
					ref: network.ref(),
					api: e.device
				};

				return new Placeholder(deviceHandle);
			}

			// Error handling - make sure to always release the handle
			handle.release();

			e.device = null;
			throw e;
		})
		.then(device => {
			// Make sure to release the handle
			handle.release();

			return device.init();
		});
};