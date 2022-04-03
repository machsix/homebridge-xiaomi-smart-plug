const miio = require('miio');

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
            .onGet(this.getState.bind(this))
            .onSet(this.setState.bind(this));

        this.checkPlugState().catch((error) => this.log.error(error));
    }

    async getDevice() {
        if (this.device) return this.device;
        this.log('Connect to device');
        try {
            this.device = await miio.device({
                address: this.ip,
                token: this.token
            });
        } catch (e) {
            this.device = undefined;
            this.log.error('Device not connected', e);
        }
        return this.device;
    }

    async checkPlugState() {
        const device = await this.getDevice();
        device
            .miioCall('get_prop', ['power'])
            .then((isOn) => {
                this.service
                    .getCharacteristic(this.Characteristic.On)
                    .updateValue(isOn === 'on');
            })
            .catch((e) => {
                throw e;
            });
    }

    async getState(callback) {
        this.log('Get state...');
        try {
            const device = await this.getDevice();
            const power =
                (await device.miioCall('get_prop', ['power'])) === 'on';
            callback(null, power);
        } catch (e) {
            this.log.error('Error getting state', e);
            callback(e);
        }
    }

    async setState(state, callback) {
        this.log('Set state to', state);
        try {
            const device = await this.getDevice();
            await await device.miioCall('set_power', [state ? 'on' : 'off']);
            callback(null);
        } catch (e) {
            this.log.error('Error setting state', e);
            callback(e);
        }
    }

    getServices() {
        return [this.service];
    }
}
