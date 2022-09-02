'use strict'

const { GObject, St, Clutter, Gio, UPowerGlib: UPower } = imports.gi;
const Me = imports.misc.extensionUtils.getCurrentExtension()
const Main = imports.ui.main;
const AggregateMenu = Main.panel.statusArea.aggregateMenu;

const { Slider } = imports.ui.slider;
const { loadInterfaceXML } = imports.misc.fileUtils;
const BUS_NAME = 'org.freedesktop.UPower';
const OBJECT_PATH = '/org/freedesktop/UPower/devices/DisplayDevice';
const DisplayDeviceInterface = loadInterfaceXML('org.freedesktop.UPower.Device');
const PowerManagerProxy = Gio.DBusProxy.makeProxyWrapper(DisplayDeviceInterface);

const PowerBar = GObject.registerClass(
class PowerBar extends St.BoxLayout{
    _init(){
        super._init({
            style_class: 'panel-button',
            style: 'background-color: transparent; box-shadow: none; border-color: transparent;',
        });

        this.icon = new St.Icon({
            style_class: 'system-status-icon',
        })
        this.label = new St.Label({
            y_align: Clutter.ActorAlign.CENTER,
            style_class: 'system-status-icon',
        });
        this.slider = new Slider(0);
        this.slider.reactive = false;
        this.slider.style = '-slider-handle-radius: 0';
        this.slider.add_style_class_name('bb-slider');

        this.add_child(this.icon);
        this.add_child(this.slider);
        this.add_child(this.label);

        this._proxy = new PowerManagerProxy(Gio.DBus.system, BUS_NAME, OBJECT_PATH,
            (proxy, error) => {
                if (error) {
                    log(error.message);
                } else {
                    this._proxy.connect('g-properties-changed',
                        this._sync.bind(this));
                }
                this._sync();
        });

    }
    _sync(){
        if(this._proxy.IsPresent){}

        // The icons
        let chargingState = this._proxy.State === UPower.DeviceState.CHARGING
            ? '-charging' : '';
        let fillLevel = 10 * Math.floor(this._proxy.Percentage / 10);
        const charged =
            this._proxy.State === UPower.DeviceState.FULLY_CHARGED ||
            (this._proxy.State === UPower.DeviceState.CHARGING && fillLevel === 100);
        
        this.icon.icon_name = charged
            ? 'battery-level-100-charged-symbolic'
            : `battery-level-${fillLevel}${chargingState}-symbolic`;

        this.icon.fallback_icon_name = this._proxy.IconName;
        this.label.text = _('%d\u2009%%').format(this._proxy.Percentage);
        this.slider.value = this._proxy.Percentage/100;
        
        if(charged || fillLevel > 99){
            this.hide();
            AggregateMenu._power.show();
        }else{
            this.show();
            AggregateMenu._power.hide();
        }

        this.slider.remove_style_pseudo_class('low');
        if(this._proxy.Percentage < 30)
            this.slider.add_style_pseudo_class('low');

        this.slider.remove_style_pseudo_class('charging');
        if(this._proxy.State === UPower.DeviceState.CHARGING)
            this.slider.add_style_pseudo_class('charging');
    }
});

class Extension{
    constructor(){

    }
    enable(){
        this.powerBar = new PowerBar();
        this.powerBar.slider.width = 100;

        let offset = 3;
        let nChildren = Main.panel._rightBox.get_n_children();
        const order = Math.clamp(nChildren - offset, 0, nChildren);
        Main.panel._rightBox.insert_child_at_index(this.powerBar, order);

        this.substituteIcon = new St.Icon({
            icon_name: 'org.gnome.tweaks-symbolic',
            style_class: 'system-status-icon',
        });
        AggregateMenu._power.hide();
        AggregateMenu._indicators.add_child(this.substituteIcon);
    }
    disable(){
        AggregateMenu._power.show();
        AggregateMenu._indicators.remove_child(this.substituteIcon);

        this.powerBar.destroy();
        this.powerBar = null;
    }
}

let extension;

var enable = () => {
    extension = new Extension();
    extension.enable();
}

var disable = () => {
    extension.disable();
    extension = null;
}