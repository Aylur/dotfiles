'use strict';

const { St, GLib, Shell, Gio, Clutter, GObject, GnomeDesktop, UPowerGlib: UPower } = imports.gi;
const Main = imports.ui.main;
const Me = imports.misc.extensionUtils.getCurrentExtension()
const DateMenu = Main.panel.statusArea.dateMenu;
const Mainloop = imports.mainloop;

const { Slider } = imports.ui.slider;
const { loadInterfaceXML } = imports.misc.fileUtils;
const ByteArray = imports.byteArray;

const UsageSlider = GObject.registerClass(
class UsageSlider extends St.BoxLayout{
    _init(){
        super._init({
            style_class: 'sl-slider',
            y_align: Clutter.ActorAlign.CENTER,
            y_expand: true,
        });

        this.icon = new St.Icon();
        this.slider = new Slider(0);
        this.label = new St.Label({ style: 'width: 1.1em' });
        this.percentChar = new St.Label({ text: '%', style: 'width: 0.8em' });
        this.add_child(this.icon);
        this.add_child(this.slider);
        this.add_child(this.label);
        this.add_child(this.percentChar);

        this.slider.reactive = false;
        this.slider.style = '-slider-handle-radius: 0';

        this.colorSwitchValues = [ 25, 50, 75, ];
                                   //low green
                                  //high red
    }
    updateSlider(){
        this.setUsage();
        this.setColorClass();
    }
    setColorClass(){
        let value = this.slider.value*100;
        this.remove_style_pseudo_class('red');
        this.remove_style_pseudo_class('orange');
        this.remove_style_pseudo_class('yellow');
        this.remove_style_pseudo_class('green');
        if(this.colorSwitchValues[0] < this.colorSwitchValues[2] ){
            if(value >= this.colorSwitchValues[2]) this.add_style_pseudo_class('red');
            else if(value < this.colorSwitchValues[2] && value >= this.colorSwitchValues[1]) this.add_style_pseudo_class('orange');
            else if(value < this.colorSwitchValues[1] && value >= this.colorSwitchValues[0]) this.add_style_pseudo_class('yellow');
            else if(value < this.colorSwitchValues[0]) this.add_style_pseudo_class('green');
        }else{
            if(value >= this.colorSwitchValues[2]) this.add_style_pseudo_class('green');
            else if(value < this.colorSwitchValues[2] && value >= this.colorSwitchValues[1]) this.add_style_pseudo_class('yellow');
            else if(value < this.colorSwitchValues[1] && value >= this.colorSwitchValues[0]) this.add_style_pseudo_class('orange');
            else if(value < this.colorSwitchValues[0]) this.add_style_pseudo_class('red');
        }
    }
});

const DisplayDeviceInterface = loadInterfaceXML('org.freedesktop.UPower.Device');
const PowerManagerProxy = Gio.DBusProxy.makeProxyWrapper(DisplayDeviceInterface);

const PowerSlider = GObject.registerClass(
class PowerSlider extends UsageSlider{
    _init(){
        super._init();

        this.colorSwitchValues = [ 75, 50, 25 ];

        this._proxy = new PowerManagerProxy(Gio.DBus.system,
            'org.freedesktop.UPower',
            '/org/freedesktop/UPower/devices/DisplayDevice',
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
        this.label.text = this._proxy.Percentage.toString();
        this.slider.value = this._proxy.Percentage/100;
        
        if(fillLevel > 99){
            this.label.text = 'F';
        }
        this.setColorClass();
    }
    setUsage(){}
});

const CpuSlider = GObject.registerClass(
class CpuSlider extends UsageSlider{
    _init(){
        super._init();

        this.icon.icon_name = 'computer-chip-symbolic';

        this.lastCPUTotal = 0;
        this.lastCPUUsed = 0;
    }
    setUsage(){
        //stolen from here
        //https://github.com/eeeeeio/gnome-shell-extension-nano-system-monitor/blob/master/src/extension.js
        let currentCPUUsage = 0;
      
        try {
            const inputFile = Gio.File.new_for_path("/proc/stat");
            const fileInputStream = inputFile.read(null);
            const dataInputStream = new Gio.DataInputStream({
                base_stream: fileInputStream
            });
      
            let currentCPUUsed = 0;
            let currentCPUTotal = 0;
            let line = null;
            let length = 0;
      
            while (([line, length] = dataInputStream.read_line(null)) && line != null) {
                if (line instanceof Uint8Array) {
                    line = ByteArray.toString(line).trim();
                } else {
                    line = line.toString().trim();
                }
                
                const fields = line.split(/\W+/);
                
                if (fields.length < 2) {
                    continue;
                }
            
                const itemName = fields[0];
                if (itemName == "cpu" && fields.length >= 5) {
                    const user = Number.parseInt(fields[1]);
                    const system = Number.parseInt(fields[3]);
                    const idle = Number.parseInt(fields[4]);
                    currentCPUUsed = user + system;
                    currentCPUTotal = user + system + idle;
                    break;
                }
            }
      
            fileInputStream.close(null);
      
            // Avoid divide by zero
            if (currentCPUTotal - this.lastCPUTotal !== 0) {
                currentCPUUsage =
                    (currentCPUUsed - this.lastCPUUsed) / (currentCPUTotal - this.lastCPUTotal);
            }
      
            this.lastCPUTotal = currentCPUTotal;
            this.lastCPUUsed = currentCPUUsed;
        } catch (e) {
            logError(e);
        }

        this.slider.value = currentCPUUsage;
        this.label.text = Math.floor(currentCPUUsage*100).toString();
    }
});

const RamSlider = GObject.registerClass(
class RamSlider extends UsageSlider{
    _init(){
        super._init();

        this.icon.icon_name = 'application-x-firmware-symbolic';

    }
    setUsage(){
        let currentMemoryUsage = 0;
        try {
            const inputFile = Gio.File.new_for_path("/proc/meminfo");
            const fileInputStream = inputFile.read(null);
            const dataInputStream = new Gio.DataInputStream({
                base_stream: fileInputStream
            });
    
            let memTotal = -1;
            let memAvailable = -1;
            let line = null;
            let length = 0;
            
            while (([line, length] = dataInputStream.read_line(null)) && line != null) {
                if (line instanceof Uint8Array) {
                    line = ByteArray.toString(line).trim();
                } else {
                    line = line.toString().trim();
                }
                const fields = line.split(/\W+/);
                if (fields.length < 2) {
                    break;
                }
                const itemName = fields[0];
                const itemValue = Number.parseInt(fields[1]);
                if (itemName == "MemTotal") {
                    memTotal = itemValue;
                }
                if (itemName == "MemAvailable") {
                    memAvailable = itemValue;
                }
                if (memTotal !== -1 && memAvailable !== -1) {
                    break;
                }
            }
            fileInputStream.close(null);
            if (memTotal !== -1 && memAvailable !== -1) {
                const memUsed = memTotal - memAvailable;
                currentMemoryUsage = memUsed / memTotal;
            }
        }catch (e) {
            logError(e);
        }

        this.slider.value = currentMemoryUsage;
        this.label.text = Math.floor(currentMemoryUsage*100).toString();
    }
});

const TempSlider = GObject.registerClass(
class TempSlider extends UsageSlider{
    _init(){
        super._init();

        this.icon.icon_name = 'temperature-symbolic';
        this.percentChar.text = '\˚';
        this.colorSwitchValues = [ 50, 65, 80 ];

    }
    setUsage(){
        let temperature = 0;
        try {
            const inputFile = Gio.File.new_for_path("/sys/class/thermal/thermal_zone0/temp");
            const fileInputStream = inputFile.read(null);
            const dataInputStream = new Gio.DataInputStream({
                base_stream: fileInputStream
            });

            let [line, length] = dataInputStream.read_line(null);
            if (line instanceof Uint8Array)
                line = ByteArray.toString(line).trim();
            else  line = line.toString().trim();

            temperature = Number.parseInt(line) / 100000;
            fileInputStream.close(null);
        }catch (e) {
            logError(e);
        }

        this.slider.value = temperature;
        this.label.text = Math.floor(temperature*100).toString();
    }
});

const DirSlider = GObject.registerClass(
class DirSlider extends UsageSlider{
    _init(){
        super._init();

        this.icon.icon_name = 'drive-harddisk-symbolic';
        this.colorSwitchValues = [ 40, 60, 80 ];
    }
    setUsage(){
        let [ ok, out, err, exit ] = GLib.spawn_command_line_sync('df');
        if (out instanceof Uint8Array)
            out = ByteArray.toString(out).trim();
        else out = out.toString().trim();

        let max = 0;
        let used = 0;

        let lines = out.split(/\n/);
        lines.forEach(line => {
            const fields = line.split(/\s+/);
            if(fields[5] == '/'){
                max = Number.parseInt(fields[1]) / Math.pow(1024,2);
                used = Number.parseInt(fields[2]) / Math.pow(1024,2);

                max = Math.floor(max);
                used = Math.floor(used);
            }
        });

        this.slider.value = used/max;
        this.label.text = Math.floor((used/max)*100).toString();
    }
});

var SliderBox = GObject.registerClass(
class SliderBox extends St.BoxLayout{
    _init(){
        super._init({
            style_class: 'events-button sl-slider-box',
            vertical: true,
        });

        this.sliders = [
            new PowerSlider(),
            new DirSlider(),
            new CpuSlider(),
            new RamSlider(),
            new TempSlider(),
        ];

        this.sliders.forEach(s => {
            this.add_child(s);
        });
    }
    updateSliders(){
        this.sliders.forEach(s => {
            s.updateSlider();
        });
        return true;
    }
});

const ClockBox = GObject.registerClass(
class ClockBox extends St.BoxLayout{
    _init(){
        super._init();
        this.clock = new St.Label({
            style_class: 'sl-clock',
            y_align: Clutter.ActorAlign.CENTER,
        });
        this.date = new St.Label({
        });
        this.day = new St.Label({
        });

        let vbox = new St.BoxLayout({
            vertical: true,
            y_align: Clutter.ActorAlign.CENTER,
        });
        vbox.add_child(this.day);
        vbox.add_child(this.date);
        this.add_child(this.clock);
        this.add_child(vbox);

        this.wallclock = new GnomeDesktop.WallClock();
        this.wallclock.connect(
            'notify::clock',
            () => this.updateClock() );
    
        this.updateClock();
    }
    updateClock(){
        //b - short month; m - month num; d- day num; A - day name;
        this.clock.text = GLib.DateTime.new_now_local().format('%H:%M ');
        this.date.text = GLib.DateTime.new_now_local().format('%Y. %m. %d.');
        this.day.text = GLib.DateTime.new_now_local().format('%A');
        DateMenu._clockDisplay.text = GLib.DateTime.new_now_local().format('%H:%M | %a:%d');
    }
});

class Extension{
    constructor(){
        this.calendarHBox = DateMenu.menu.box.get_first_child().get_first_child();
        this.calendarColumn = this.calendarHBox.get_last_child();
        this.stockClock = this.calendarColumn.get_first_child();
    }
    enable(){
        this.clock = new ClockBox();
        this.clock.style_class = this.stockClock.style_class;
        this.sliders = new SliderBox();

        this.calendarColumn.add_child(this.sliders);
        this.calendarColumn.replace_child(this.stockClock, this.clock);

        this.calendarHBox.remove_child(this.calendarColumn);
        this.calendarHBox.insert_child_at_index(this.calendarColumn, 0);
    }
    disable(){
        this.calendarColumn.remove_child(this.sliders);
        this.calendarColumn.replace_child(this.clock, this.stockClock);

        this.calendarHBox.remove_child(this.calendarColumn);
        this.calendarHBox.insert_child_at_index(this.calendarColumn, 1);

        this.clock.destroy();
        this.clock = null;
        this.sliders.destroy();
        this.sliders = null;
    }
};

let extension;
let timeout;
let stateBinding;
let closedBinding;

var enable = () => {
    extension = new Extension();
    extension.enable();

    function update(){
        extension.sliders.updateSliders();
        return true;
    }
    
    stateBinding = DateMenu.menu.connect('open-state-changed', () => {
        extension.sliders.updateSliders();
        if(!timeout)
            timeout = Mainloop.timeout_add_seconds(1.0, update);
    });
    closedBinding = DateMenu.menu.connect('menu-closed', () => {
        if(timeout){
            Mainloop.source_remove(timeout);
            timeout = undefined;
        }
    });
}
var disable = () => {
    extension.disable();
    extension = null;
    if(timeout)
        Mainloop.source_remove(timeout);
}