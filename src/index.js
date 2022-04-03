const miio = require('./miio-wrap');

module.exports = function (api) {
    api.registerAccessory('homebridge-xiaomi-smart-plug', XiaomiSmartPlug);
};

class XiaomiSmartPlug {
    constructor(log, config, api) {
        // Setup configuration
        this.log = log;
        this.api = api;
        this.config = config;

        this.Service = this.api.hap.Service;
        this.Characteristic = this.api.hap.Characteristic;

        this.name = config['name'] || 'Xiaomi Mi Smart Plug';
        if (!config['ip']) {
            this.log('No IP address define for', this.name);
            return;
        }
        if (!config['token']) {
            this.log('No token define for', this.name);
            return;
        }
        this.ip = config['ip'];
        this.token = config['token'];

        // Setup services
        this.service = new this.Service.Outlet(this.name);
        this.service
            .getCharacteristic(this.Characteristic.On)
            .onGet(this.handleOnGet.bind(this))
            .onSet(this.handleOnSet.bind(this));

        this.listenPlugState().catch((error) => this.log.error(error));
    }

    async getDevice() {
        if (this.device) return this.device;
        this.log('Connect to device at ', this.ip);
        try {
            this.device = await miio.device({
                address: this.ip,
                token: this.token
            });
        } catch (e) {
            this.device = undefined;
            this.log.error('Device is not connected', e);
        }
        return this.device;
    }

    async listenPlugState() {
        const device = await this.getDevice();
        device.on('powerChanged', (isOn) =>
            this.service
                .getCharacteristic(this.Characteristic.On)
                .updateValue(isOn)
        );
    }

    async handleOnGet() {
        try {
            const device = await this.getDevice();
            const power = await device.power();
            this.log('Get state: ', power);
            return power;
        } catch (e) {
            this.log.error('Error getting state', e);
            throw e;
        }
    }

    async handleOnSet(state) {
        this.log('Set state: ', state);
        try {
            const device = await this.getDevice();
            await await device.power(state);
        } catch (e) {
            this.log.error('Error setting state', e);
            throw e;
        }
    }

    getServices() {
        return [this.service];
    }
}
