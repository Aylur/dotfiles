const { GObject, St, Clutter, Gio, GLib, Shell, GnomeDesktop, UPowerGlib: UPower } = imports.gi;
const Config = imports.misc.config;
const Main = imports.ui.main;
const SystemActions = imports.misc.systemActions;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Mainloop = imports.mainloop;

const SystemLevels = Me.imports.systemLevels;
const { Media, PlayerUIElements } = Me.imports.mediaPlayer;

const Network = imports.ui.status.network;
const Bluetooth = imports.ui.status.bluetooth;
const NightLight = imports.ui.status.nightLight;
const DarkMode = imports.ui.status.darkMode;
const PowerProfiles = imports.ui.status.powerProfiles;

const Volume = imports.ui.status.volume;
const Brightness = imports.ui.status.brightness;
const System = imports.ui.status.system;
const { QuickSlider, QuickToggle } = imports.ui.quickSettings;

const { loadInterfaceXML } = imports.misc.fileUtils;
const DisplayDeviceInterface = loadInterfaceXML('org.freedesktop.UPower.Device');
const PowerManagerProxy = Gio.DBusProxy.makeProxyWrapper(DisplayDeviceInterface);

const NIGHT_LIGHT_MAX = 4700;
const NIGHT_LIGHT_MIN = 1400;

const QuickSettingsSystem = GObject.registerClass(
class QuickSettingsSystem extends St.BoxLayout{
    _init(){
        super._init({ style_class: 'quick-toggles-system' });

        //userBtn
        let userBtn = this._addBtn('', 
            () =>  Shell.AppSystem.get_default().lookup_app('gnome-user-accounts-panel.desktop').activate()
        );
        userBtn.style_class = 'icon-button user-btn';
        userBtn.set_child(new St.Widget({
            y_expand: true,
            style_class: 'user-icon',
            style: 'background-image: url("/var/lib/AccountsService/icons/'+ GLib.get_user_name() +'"); background-size: cover;',
        }));

        this.greet = new St.Label();
        this._setGreet();
        
        let greetBox = new St.BoxLayout({ vertical: true, y_align: Clutter.ActorAlign.CENTER });
        greetBox.add_child(new St.Label({ text: GLib.get_user_name() }));
        greetBox.add_child(this.greet);

        //settings
        let settingsBtn = this._addBtn('org.gnome.Settings-symbolic',
            () => Shell.AppSystem.get_default().lookup_app('org.gnome.Settings.desktop').activate());

        //lock
        let lockBtn = this._addBtn('system-lock-screen-symbolic', 
            () => SystemActions.getDefault().activateAction('lock-screen'));

        //powerOff
        let powerOffBtn = this._addBtn('system-shutdown-symbolic',
            () => SystemActions.getDefault().activateAction('power-off'));

        this.add_child(userBtn);
        this.add_child(greetBox);
        this.add_child(new St.Widget({ x_expand: true }));
        this.add_child(settingsBtn);
        this.add_child(lockBtn);
        this.add_child(powerOffBtn);
    }
    _setGreet(){
        let time = new Date();
        let hour = time.getHours();

        let greet = "Good Evening!";
        if(hour > 6){ greet = "Good Morning!"; }
        if(hour > 12){greet = "Good Afternoon!";}
        if(hour > 18){greet = "Good Evening!";}

        this.greet.text = greet;
    }
    _addBtn(iconName, callback){
        let btn = new St.Button({
            y_align: Clutter.ActorAlign.CENTER,
            style_class: 'icon-button',
            child: new St.Icon({
                icon_name: iconName,
            }),

        })
        btn.connect('clicked', () => {
            callback();
            Main.overview.hide();
            Main.panel.closeQuickSettings();
        });
        return btn;
    }
});

const PowerButton = GObject.registerClass(
class PowerButton extends St.Button{
    _init() {
        super._init({ style_class: 'quick-power' });

        let box = new St.BoxLayout();
        this._icon = new St.Icon();
        this._label = new St.Label();
        box.add_child(this._icon);
        box.add_child(this._label);
        this.set_child(box);

        this._proxy = new PowerManagerProxy(
            Gio.DBus.system,
            'org.freedesktop.UPower',
            '/org/freedesktop/UPower/devices/DisplayDevice',
            (proxy, error) => {
                if (error)
                    console.error(error.message);
                else
                    this._proxy.connect('g-properties-changed', () => this._sync());
                this._sync();
            }
        );

        this.connect('clicked', () => {
            Shell.AppSystem.get_default().lookup_app('gnome-power-panel.desktop').activate();
            Main.overview.hide();
            Main.panel.closeQuickSettings();
        });
    }

    _sync() {
        this.visible = this._proxy.IsPresent;
        if (!this.visible)
            return;

        let chargingState = this._proxy.State === UPower.DeviceState.CHARGING
            ? '-charging' : '';
        let fillLevel = 10 * Math.floor(this._proxy.Percentage / 10);
        const charged =
            this._proxy.State === UPower.DeviceState.FULLY_CHARGED ||
            (this._proxy.State === UPower.DeviceState.CHARGING && fillLevel === 100);

        this._icon.icon_name = charged
            ? 'battery-level-100-charged-symbolic'
            : `battery-level-${fillLevel}${chargingState}-symbolic`;

        this._label.text = `${this._proxy.Percentage}%`;
    }
});

const QuickTogglesBottom = GObject.registerClass(
class QuickTogglesBottom extends St.BoxLayout{
    _init(){
        super._init({ style_class: 'quick-toggles-bottom' });

        //clock
        this.clock = new St.Label({
            text: GLib.DateTime.new_now_local().format('%A | %Y. %m. %d. | %H:%M'),
        });
        this.wallClock = new GnomeDesktop.WallClock();
        this.wallClock.connect('notify::clock', () =>{
            this.clock.text = GLib.DateTime.new_now_local().format('%A | %Y. %m. %d. | %H:%M');
        });

        this.add_child(new PowerButton());
        this.add_child(new St.Widget({ x_expand: true }));
        this.add_child(this.clock);
    }
});

const NightLightSlider = GObject.registerClass(
class NightLightSlider extends QuickSlider {
    _init() {
        super._init({ iconName: 'night-light-symbolic' });        
        this._settings = new Gio.Settings({ schema_id: 'org.gnome.settings-daemon.plugins.color' });
        this._settings.connect('changed::night-light-enabled', () => this._sync());
        this._settings.connect('changed::night-light-temperature', () => this._settingsChanged());

        this.slider.connect('notify::value', () => this._sliderChanged());
        this._sync();
    }
    _sliderChanged(){
        let value = (1 - this.slider.value) * (NIGHT_LIGHT_MAX - NIGHT_LIGHT_MIN);
        value += NIGHT_LIGHT_MIN;
        this._settings.set_uint('night-light-temperature', value);
    }
    _settingsChanged(){
        let value = this._settings.get_uint('night-light-temperature');
        value -= NIGHT_LIGHT_MIN;
        value /= (NIGHT_LIGHT_MAX - NIGHT_LIGHT_MIN);
        this.slider.value = (1 - value);
    }
    _sync() {
        this._settings.get_boolean('night-light-enabled')?
            this.show() : this.hide();
    }
});
    

const SliderBox = GObject.registerClass(
class SliderBox extends St.BoxLayout{
    _init(){
        super._init({
            vertical: true,
            reactive: true,
            style_class: 'button quick-slider-box'
        });

        this.volume = new Volume.Indicator();
        this.output = this.volume._output;
        this.input = this.volume._input;
        this.brightness = new Brightness.Indicator();

        this.add_child(this.output);
        this.add_child(this.output.menu.actor);
        this.add_child(this.input);
        this.add_child(this.input.menu.actor);
        this.add_child(this.brightness.quickSettingsItems[0]);
        this.add_child(new NightLightSlider())
    }
});

const MediaBox = GObject.registerClass(
class MediaBox extends St.Bin{
    _init(prefer){
        super._init({
            reactive: true,
            style_class: 'button'
        });

        this.media = new Media(prefer);
        this.media.connect('updated', () => this._sync());

        let elements = new PlayerUIElements();
        let box = new St.BoxLayout({ style_class: 'media-container' });
        let vbox = new St.BoxLayout({
            vertical: true,
            style_class: 'media-container',
            y_align: Clutter.ActorAlign.CENTER,
            x_align: Clutter.ActorAlign.CENTER,
            x_expand: true
        });
        vbox.add_child(elements.titleBox);
        vbox.add_child(elements.controlsBox);
        vbox.add_child(elements.volumeBox);
        box.add_child(elements.mediaCover);
        box.add_child(vbox);
        this.set_child(box);
        this.playerUI = elements;
        this._sync();
    }
    _sync(){
        let player = this.media.getPlayer();
        if(player){
            this.playerUI.setPlayer(player);
            this.show();
        }else{
            this.hide();
        }
    }
});

const DoNotDisturbToggle = GObject.registerClass(
class DoNotDisturbToggle extends QuickToggle{
    _init(){
        super._init();

        this._settings = new Gio.Settings({
            schema_id: 'org.gnome.desktop.notifications',
        });
        this._settings.connect('changed::show-banners',
            () => this.sync());
 
        this.connectObject(
            'destroy', () => this._settings.run_dispose(),
            'clicked', () => this.toggle(),
            this);

        this.sync();
    }
    toggle() {
        let enabled = this._settings.get_boolean('show-banners');
        this._settings.set_boolean('show-banners', !enabled);
        this.sync();
    }
    sync(){
        let enabled = this._settings.get_boolean('show-banners');
        if(enabled){
            this._icon.icon_name = 'org.gnome.Settings-notifications-symbolic';
            this._label.text = 'Noisy';
            this.checked = false;
        }else{
            this._icon.icon_name = 'notifications-disabled-symbolic';
            this._label.text = 'Silent';
            this.checked = true;
        }
    }
});
    
const QuickToggles = GObject.registerClass(
class QuickToggles extends St.BoxLayout{
    _init(){
        super._init({
            style_class: 'quick-toggles-grid',
            vertical: true,
            x_expand: true
        });

        if (Config.HAVE_NETWORKMANAGER){
            let network = new Network.Indicator();
            
            this.networkMenu = network._wirelessToggle.menu.actor;
            this.networkMenu.clear_constraints();
            this.networkMenu.add_style_class_name('wifi-menu');   

            this.networkToggle = network._wirelessToggle;
            this.networkToggle.add_style_class_name('quick-toggle-long');
            this.networkToggle._label.x_expand = true;
            this.networkToggle.x_expand = true;
        }


        if (Config.HAVE_BLUETOOTH){
            let bt = new Bluetooth.Indicator();
            this.bluetooth = bt.quickSettingsItems[0];

            this.bluetooth.add_style_class_name('quick-toggle-long');
            this.bluetooth._label.x_expand = true;
            this.bluetooth.x_expand = true;
            this.bluetooth.show();
            this.bluetooth.connect('notify::visible', () => bluetooth.quickSettingsItems[0].show() );
        }

        let powerProfiles = new PowerProfiles.Indicator();
        let nightLight = new NightLight.Indicator();
        let darkMode = new DarkMode.Indicator();
        let dnd = new DoNotDisturbToggle();

        powerProfiles.quickSettingsItems[0]._menuButton.hide();
        powerProfiles.quickSettingsItems[0]._label.hide();
        nightLight.quickSettingsItems[0]._label.hide();
        darkMode.quickSettingsItems[0]._label.hide();
        powerProfiles.quickSettingsItems[0]._label.hide();
        dnd._label.hide();

        powerProfiles.quickSettingsItems[0]._icon.x_expand = true;
        nightLight.quickSettingsItems[0]._icon.x_expand = true;
        darkMode.quickSettingsItems[0]._icon.x_expand = true;
        powerProfiles.quickSettingsItems[0]._icon.x_expand = true;
        dnd._icon.x_expand = true;

        let row1 = new St.BoxLayout({ style_class: 'quick-toggles-grid', y_expand: true });
        let row2 = new St.BoxLayout({ style_class: 'quick-toggles-grid', y_expand: true });

        if(Config.HAVE_BLUETOOTH){
            row1.add_child(dnd);
            row1.add_child(nightLight.quickSettingsItems[0]);
            row1.add_child(powerProfiles.quickSettingsItems[0]);
    
            row2.add_child(darkMode.quickSettingsItems[0]);
            row2.add_child(this.bluetooth);
        }else{
            row1.add_child(dnd);
            row1.add_child(nightLight.quickSettingsItems[0]);

            row2.add_child(powerProfiles.quickSettingsItems[0]);
            row2.add_child(darkMode.quickSettingsItems[0]);
        }

        this.add_child(row1);
        this.add_child(row2);
        if(Config.HAVE_NETWORKMANAGER){
            this.networkToggle.y_expand = true;
            this.add_child(this.networkToggle);
        }
    }
});

const LevelsBox = GObject.registerClass(
class LevelsBox extends St.BoxLayout{
    _init(){
        super._init({
            style_class: 'levels-container button',
            reactive: true
        });

        this.levels = [
            new SystemLevels.CpuLevel(true),
            new SystemLevels.RamLevel(true),
            new SystemLevels.TempLevel(true),
        ];

        this.levels.forEach(s => {
            this.add_child(s);
        });

        this.connect('destroy', () => this.stopTimeout());
    }
    startTimeout(){
        this.timeout = Mainloop.timeout_add_seconds(1.0, this.updateLevels.bind(this));
    }
    stopTimeout(){
        if(this.timeout)
            Mainloop.source_remove(this.timeout);
    }
    updateLevels(){
        this.levels.forEach(l => {
            l.updateLevel();
        });
        return true;
    }
});

const Notifications = GObject.registerClass(
class Notifications extends St.BoxLayout{
    _init(){
        super._init({
            vertical: true,
            style_class: 'popup-menu-content quick-settings'
        });

        let datemenu = new imports.ui.dateMenu.DateMenuButton();
        datemenu._messageList.get_parent().remove_child(datemenu._messageList);

        this.notificationList = datemenu._messageList._notificationSection;
        this.notificationList._list.connect('actor-added', () => this._syncCounter());
        this.notificationList._list.connect('actor-removed', () => this._syncCounter());

        this.clearBtn = datemenu._messageList._clearButton;
        this.list = datemenu._messageList._scrollView;
        this.mediaSection = datemenu._messageList._mediaSection;
        this.clearBtn.get_parent().remove_child(this.clearBtn);
        this.list.get_parent().remove_child(this.list);
        this.mediaSection.get_parent().remove_child(this.mediaSection);
        this.clearBtn.add_style_class_name('clear-button');

        this.clearBtn.connect('notify::reactive', () => {
            this.clearBtn.reactive ? this.show() : this.hide();
        });
        if(!this.clearBtn.reactive) this.hide();


        let hbox = new St.BoxLayout();
        hbox.add_child(new St.Label({ text: _('Notifications'), y_align: Clutter.ActorAlign.CENTER }));
        hbox.add_child(this.clearBtn)

        this.add_child(hbox);
        this.add_child(this.list);

        // notification indicator
        this.indicator = new St.BoxLayout();
        this.icon = new St.Icon({ style_class: 'system-status-icon' });
        this.counter = new St.Label({ y_align: Clutter.ActorAlign.CENTER });
        this.indicator.add_child(this.icon);
        this.indicator.add_child(this.counter);

        Main.panel.statusArea.quickSettings._indicators.add_child(this.indicator);

        this._settings = new Gio.Settings({
            schema_id: 'org.gnome.desktop.notifications',
        });
        this._settings.connect('changed::show-banners',
            () => this._syncIndicator());

        this._syncIndicator();
        this._syncCounter();
 
        this.connect('destroy', () => {
            this._settings.run_dispose();
        });
    }
    _syncIndicator(){
        if(this._settings.get_boolean('show-banners')){
            this.icon.icon_name = 'org.gnome.Settings-notifications-symbolic';
            this._syncCounter();
        }else{
            this.counter.hide();
            this.icon.icon_name = 'notifications-disabled-symbolic';
        }
    }
    _syncCounter(){
        let count = this.notificationList._messages.length;
        if(count > 0){
            this.counter.text = `${count}`;
            this.counter.show();
            this.icon.show();
        }
        else{
            this.counter.hide();
            this.icon.hide();
        }
    }
});

var Extension = class Extension {
    constructor() {
        this.qs = Main.panel.statusArea.quickSettings;
        this.qsChildren = this.qs.menu.box.get_children();
    }

    enable() {
        this.settings = ExtensionUtils.getSettings();

        this.qs.menu.box.remove_all_children();
        this.qs.menu.box.add_style_class_name('quick-settings-main');

        let box1 = new St.BoxLayout({
            vertical: true,
            style_class: 'popup-menu-content quick-settings',
        });

        let box2 = new St.BoxLayout({
            vertical: true,
            style_class: 'popup-menu-content quick-settings',
        });

        this.quickToggles = new QuickToggles();
        this.levelsBox = new LevelsBox();
        let hbox = new St.BoxLayout({ style_class: 'hbox' });
        hbox.add_child(this.quickToggles);
        hbox.add_child(this.levelsBox);
        
        box1.add_child(new QuickSettingsSystem());
        box1.add_child(new SliderBox());
        box1.add_child(new MediaBox(this.settings.get_boolean('media-player-prefer')));
        box1.add_child(new QuickTogglesBottom());

        box2.add_child(hbox);
        box2.add_child(this.quickToggles.networkMenu);

        this.qs.menu.box.add_child(box2);
        this.qs.menu.box.add_child(box1);
        this.qs.menu.box.add_child(new Notifications());

        let maxHeight = Main.layoutManager.primaryMonitor.height - 50;
        this.qs.menu.box.style = `max-height: ${maxHeight}px; `;

        Main.panel.statusArea.quickSettings.menu.connect('open-state-changed', (self, open) => {
            if(open) this.levelsBox.startTimeout();
            else this.levelsBox.stopTimeout();
        });
        this.levelsBox.updateLevels();

        //if I want to interject other extensions
        Main.panel.aylur = this;
    }

    disable() {
        this.qs.menu.box.destroy_all_children();
        this.qs.menu.box.remove_all_children();
        this.quickToggles = null;
        this.levelsBox = null;
        this.settings = null;

        this.qs.menu.box.remove_style_class_name('quick-settings-main')
        this.qsChildren.forEach(ch => {
            this.qs.menu.box.add_child(ch);
        });
    }
}