import { GObject, GnomeBluetooth } from './lib.js'

const STATES = {
    [GnomeBluetooth.AdapterState.ABSENT]: 'absent',
    [GnomeBluetooth.AdapterState.ON]: 'on',
    [GnomeBluetooth.AdapterState.TURNING_ON]: 'on',
    [GnomeBluetooth.AdapterState.OFF]: 'off',
    [GnomeBluetooth.AdapterState.TURNING_OFF]: 'off',
}

const ICONS = {
    absent: '󰂲',
    off: '󰂲',
    on: '󰂯',
    'audio-headset': '󰋋',
}

export const Bluetooth = GObject.registerClass({
    Signals: { 'sync': {} }
},
class Bluetooth extends GObject.Object{
    constructor() {
        super();

        this._json = {};
        this._devices = new Map();
        this._connections = new Map();
        this._client = new GnomeBluetooth.Client();
        this._client.connect('notify::default-adapter-state', this._sync.bind(this));
        this._client.connect('device-added', this._deviceAdded.bind(this));
        this._client.connect('device-removed', this._deviceRemoved.bind(this));
        this._getDevices().forEach(device => this._deviceAdded(_, device));
        this._sync();
    }

    get json() { return this._json }

    _deviceAdded(_, device) {
        if(this._devices.has(device.address)) return;

        let connections = [];
        [
            'address',
            'alias',
            'battery-level',
            'battery-percentage',
            'connected',
            'icon',
            'name',
            'paired',
            'truested'
        ]
        .forEach(prop => connections.push(
            device.connect(`notify::${prop}`, this._sync.bind(this))
        ));
        this._connections.set(device.address, connections);

        this._devices.set(device.address, device);
        this._sync();
    }

    _deviceRemoved(_, device) {
        if(!this._devices.has(device.address)) return;

        this._connections.get(device.address).forEach(id => device.disconnect(id));
        this._connections.delete(device.address);
        this._devices.delete(device.address);
        this._sync();
    }

    _getDevices() {
        let devices = [];
        const deviceStore = this._client.get_devices();

        for(let i=0; i<deviceStore.get_n_items(); ++i) {
            const device = deviceStore.get_item(i);

            if (device.paired || device.trusted)
                devices.push(device);
        }
        
        return devices;
    }

    _sync() {
        this._json.state = STATES[this._client.default_adapter_state];
        this._json.icon = ICONS[this._json.state];
        this._json.connected_devices = [];
        this._json.devices = [];
        for (const [_, device] of this._devices) {
            let item = {
                address: device.address,
                alias: device.alias,
                battery_level: device.battery_level,
                battery_percentage: device.battery_percentage,
                connected: device.connected,
                icon: ICONS[device.icon],
                name: device.name,
                paired: device.paired,
                trusted: device.trusted
            };
            this._json.devices.push(item);
            if(device.connected) this._json.connected_devices.push(item);
        }

        this.emit('sync');
    }
})
