import { NM, Gio, GObject } from './lib.js'

Gio._promisify(NM.Client, 'new_async');
Gio._promisify(NM.DeviceWifi.prototype, 'request_scan_async');

const WifiStyles = {
    '󰪎': 'none',
    '󰤮': 'low',
    '󰤯': 'low',
    '󰤟': 'low',
    '󰤢': 'medium',
    '󰤥': 'medium',
    '󰤨': 'high'
}

export const Network = GObject.registerClass({
    Signals: { 'sync': {} }
},
class Network extends GObject.Object{
    constructor() {
        super();

        this._json = {};
        this._getClient();
    }

    get json() { return this._json }

    _getDevice(devType) {
        return this._client
            .get_devices()
            .find(device => device.get_device_type() === devType);
    }

    async _getClient() {
        this._client = await NM.Client.new_async(null);
        this._client.connect('notify::wireless-enabled',      this._sync.bind(this));
        this._client.connect('notify::connectivity',          this._sync.bind(this)); 
        this._client.connect('notify::primary-connection',    this._sync.bind(this)); 
        this._client.connect('notify::activating-connection', this._sync.bind(this));

        this._wifi = this._getDevice(NM.DeviceType.WIFI);
        if(this._wifi) {
            this._wifi.connect('notify::active-access-point', this._activeAp.bind(this));
            this._wifi.connect('access-point-added', (_, ap) => this._apAdded(ap));
            this._wifi.connect('access-point-removed', (_, ap) => this._apRemoved(ap));
        }

        this._activeAp();
        this._sync();
    }

    _apAdded(ap) {
        //TODO
    }

    _apRemoved(ap) {
        //TODO
    }

    _activeAp() {
        if(this._ap) this._ap.disconnect(this._apBind);
        this._ap = this._wifi?.get_active_access_point();
        if(!this._ap) return;
        this._apBind = this._ap.connect('notify::strength', this._sync.bind(this));
        this._sync();
    }

    _sync() {
        const mainConnection =
            this._client.get_primary_connection() ||
            this._client.get_activating_connection();

        const primary_type = mainConnection?.type || null; // 802-11-wireless ; 802-3-ethernet
        const internet = this._client.connectivity === NM.ConnectivityState.FULL;

        let wifi = {
            primary: primary_type === '802-11-wireless',
            enabled: this._client.wireless_enabled,
            state: this._client.wireless_enabled ? 'on' : 'off',
            ssid: this._ap && NM.utils_ssid_to_utf8(
                this._ap.get_ssid().get_data() ) || 'Unknown',
            strength: this._client.wireless_enabled && mainConnection ? `${this._ap?.strength}%` : '󰂭' , 
            icon: ['󰤮', '󰤯', '󰤟', '󰤢', '󰤥', '󰤨'][Math.ceil(this._ap?.strength/20)]
        };
        if(!internet) {
            wifi.strength = '󰪎'
            wifi.icon = '󰪎'
        }
        wifi.style = WifiStyles[wifi.icon];

        let wired  ={ 
            primary: primary_type === '802-3-ethernet',
            icon: internet ? '󰛳' : '󰪎'
        }

        this._json = {
            primary:  { '802-3-ethernet': 'wired', '802-11-wireless': 'wifi' }[primary_type] || 'none',
            none: { icon: '󰤮' },
            wifi,
            wired,
        };
        this.emit('sync')
    }

})
