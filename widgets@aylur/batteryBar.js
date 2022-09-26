'use strict'

const { GObject, St, Clutter, Gio, UPowerGlib: UPower } = imports.gi;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension()
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;

const shellVersion = Math.floor(parseFloat(imports.misc.config.PACKAGE_VERSION));

const { loadInterfaceXML } = imports.misc.fileUtils;
const DisplayDeviceInterface = loadInterfaceXML('org.freedesktop.UPower.Device');
const PowerManagerProxy = Gio.DBusProxy.makeProxyWrapper(DisplayDeviceInterface);

const LevelBar = GObject.registerClass(
class LevelBar extends St.Bin{
    _init(settings){
        super._init({
            y_expand: true,
            x_expand: true,
            y_align: Clutter.ActorAlign.FILL,
            x_align: Clutter.ActorAlign.FILL,
        });
        this.background = new St.BoxLayout({
            style_class: 'level-bar',
            y_align: Clutter.ActorAlign.FILL, //remove this if you want to set fixed heigth
        });
        this.fillLevel = new St.Bin({
            style_class: 'level-fill',
            y_expand: true,
            y_align: Clutter.ActorAlign.FILL,
            x_align: Clutter.ActorAlign.START,
        });
        this.set_child(this.background);
        this.background.add_child(this.fillLevel);

        this.fillLevel.label = new St.Label({
            x_align: Clutter.ActorAlign.CENTER,
            y_align: Clutter.ActorAlign.CENTER,
            x_expand: false,
        });
        this.background.label = new St.Label({
            x_align: Clutter.ActorAlign.START,
            y_align: Clutter.ActorAlign.CENTER,
        });

        this.value = 0;
        this.settings = settings;

        this.background.connect('stage-views-changed', () => this.repaint());
    }
    repaint(){
        if(this.fillLevel.has_allocation()){
            let max = this.background.width;
            let zero = this.background.height;
            //So it doesn't go beyond the border-radius
            //If the border radius isn't 99px (50%)
            //set zero to border-radius*2
    
            // let border_radius = 10;
            // zero = border_radius*2;
    
            this.fillLevel.width = Math.floor( (max-zero)*this.value + zero );
    
            let label = Math.floor(this.value*100).toString() + "%";
            this.fillLevel.label.text = label;
            this.background.label.text = label;

            
            if(this.settings.get_boolean('battery-bar-show-percentage')){
                if(this.value >= 0.5){
                    if(!this.fillLevel.hasLabel){
                        this.fillLevel.set_child(this.fillLevel.label);
                        this.fillLevel.hasLabel = true;
                    }
                    if(this.background.hasLabel){
                        this.background.remove_child(this.background.label);
                        this.background.hasLabel = false;
                    }
                }else{
                    if(this.fillLevel.hasLabel){
                        this.fillLevel.remove_child(this.fillLevel.label);
                        this.fillLevel.hasLabel = false;
                    }
                    if(!this.background.hasLabel){
                        this.background.add_child(this.background.label);
                        this.background.hasLabel = true;
                    }
                }
            }else{
                if(this.fillLevel.hasLabel){
                    this.fillLevel.remove_child(this.fillLevel.label);
                    this.fillLevel.hasLabel = false;
                }
                if(this.background.hasLabel){
                    this.background.remove_child(this.background.label);
                    this.background.hasLabel = false;
                }
            }
        }
    }
});

const BatteryBar = GObject.registerClass(
class BatteryBar extends St.Bin{
    _init(settings){
        super._init({
            style_class: 'battery-bar panel-button',
        });

        this.settings = settings;
        this.width = this.settings.get_int('battery-bar-width');

        this._proxy = new PowerManagerProxy(
            Gio.DBus.system,
            'org.freedesktop.UPower',
            '/org/freedesktop/UPower/devices/DisplayDevice'
        );

        this.binding = this._proxy.connect('g-properties-changed', () => this._sync());
        this.connect('destroy', () => this._proxy.disconnect(this.binding));

        this.level = new LevelBar(this.settings);
        this.icon = new St.Icon({
            style_class: 'system-status-icon'
        });
        let box = new St.BoxLayout();
        if(this.settings.get_int('battery-bar-icon-position') === 0){
            if(this.settings.get_boolean('battery-bar-show-icon')) box.add_child(this.icon);
            box.add_child(this.level);
        }else{
            box.add_child(this.level);
            if(this.settings.get_boolean('battery-bar-show-icon')) box.add_child(this.icon);
        }
        this.set_child(box);

        this._sync();
    }
    _sync(){
        if(this._proxy.IsPresent){
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
    
            if(this._proxy.Percentage < 30)
                this.add_style_pseudo_class('low');
            else
                this.remove_style_pseudo_class('low');
    
            if(this._proxy.State === UPower.DeviceState.CHARGING || this._proxy.State === UPower.DeviceState.FULLY_CHARGED)
                this.add_style_pseudo_class('charging');
            else
                this.remove_style_pseudo_class('charging');
            
            this.level.value = this._proxy.Percentage/100;
            this.level.repaint();
        }else{
            this.hide();
        }
    }
});

var Extension = class Extension{
    constructor() {
        this.panel = [
            Main.panel._leftBox,
            Main.panel._centerBox,
            Main.panel._rightBox
        ]
        if(shellVersion == 42)
            this.stockIndicator = Main.panel.statusArea.aggregateMenu._power;
        if(shellVersion == 43)
            this.stockIndicator = Main.panel.statusArea.quickSettings._system;
    }
    enable(){
        this.settings = ExtensionUtils.getSettings();
        this.settings.connect('changed::battery-bar-position', () => this.addToPanel());
        this.settings.connect('changed::battery-bar-offset', () => this.addToPanel());
        this.settings.connect('changed::battery-bar-show-icon', () => this.addToPanel());
        this.settings.connect('changed::battery-bar-icon-position', () => this.addToPanel());
        this.settings.connect('changed::battery-bar-show-percentage', () => this.addToPanel());
        this.settings.connect('changed::battery-bar-width', () => this.addToPanel());
        this.addToPanel();
        this.stockIndicator.hide();
    }
    disable(){
        this.settings = null;
        this.panelButton.destroy();
        this.panelButton = null;
        this.stockIndicator.show();
    }
    addToPanel(){
        if(this.panelButton){
            this.panelButton.destroy();
            this.panelButton = null;
        }
        this.panelButton = new BatteryBar(this.settings);

        let pos = this.settings.get_int('battery-bar-position');
        let offset = this.settings.get_int('battery-bar-offset');

        this.panel[pos].insert_child_at_index(this.panelButton, offset);

    }
}