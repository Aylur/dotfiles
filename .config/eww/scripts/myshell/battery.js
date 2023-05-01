import { GObject, Gio, UPowerGlib } from './lib.js'
import { PowerManagerProxy } from './dbus.js'

export const Battery = GObject.registerClass({
    Signals: { 'sync': {} }
},
class Battery extends GObject.Object{
    constructor(){
        super();

        this._json = {};
        this._proxy = new PowerManagerProxy(
            Gio.DBus.system,
            'org.freedesktop.UPower',
            '/org/freedesktop/UPower/devices/DisplayDevice',
            () => {
                this._proxy.connect(
                    'g-properties-changed', () => this._sync() );
                this._sync();
            }
        );
    }

    get json(){
        return this._json;
    }

    _sync(){
        if(!this._proxy.IsPresent) return { available: false };

        let percent = this._proxy.Percentage;
        let charging = this._proxy.State === UPowerGlib.DeviceState.CHARGING;
        let charged =
            this._proxy.State === UPowerGlib.DeviceState.FULLY_CHARGED ||
            (this._proxy.State === UPowerGlib.DeviceState.CHARGING && percent === 100);

        
        let icons =          ['', '', '', '', '', '', '', '', '', ''];
        let charging_icons = ['󰢜', '󰂆', '󰂇', '󰂈', '󰢝', '󰂉', '󰢞', '󰂊', '󰂋', '󰂅'];        
        let i = Math.round(percent / 10)-1;
        if(i < 0) i = 0;

        let icon;
        if(charged)           icon = '󰂄';
        else if(charging)     icon = charging_icons[i];
        else if(percent < 10) icon = '󱃍';
        else                  icon = icons[i];

        let state = '';
        if(charged)           state = 'charged';
        else if(charging)     state = 'charging';
        else if(percent < 30) state = 'low';

        this._json = {
            available: true,
            icon,
            percent,
            state
        };
        this.emit('sync');
    }
});
