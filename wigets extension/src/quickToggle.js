'use strict'

const { GObject, St, Clutter, GLib, Gio, Shell, NM, GnomeDesktop } = imports.gi;
const Me = imports.misc.extensionUtils.getCurrentExtension()
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const { Slider } = imports.ui.slider;
const SystemActions = imports.misc.systemActions;

const DateMenu = Main.panel.statusArea.dateMenu;
const AggregateMenu = Main.panel.statusArea.aggregateMenu;

const { Media, Player } = Me.imports.mediaPlayer;

const Power = imports.ui.status.power;
const Network = imports.ui.status.network;
const Bluetooth = imports.ui.status.bluetooth;

const DARK_MODE_BG_DEST = 'file:///home/demeter/Pictures/Wallpapers/flat-smooth.png';
const LIGHT_MODE_BG_DEST = 'file:///home/demeter/Pictures/Wallpapers/flat-thick.png';

const QuickTogglesTop = GObject.registerClass(
class QuickTogglesTop extends St.BoxLayout{
    _init(){
        super._init({
            y_align: Clutter.ActorAlign.START,
            style_class: 'qt-top-row',
        });

        let userIcon = new St.Bin({
            y_expand: true,
            x_expand: true,
            style_class: 'qt-user-icon',
            style: 'background-image: url("/var/lib/AccountsService/icons/'+ GLib.get_user_name() +'"); background-size: cover;',
        });
        this.userBtn = new St.Button({
            style_class: 'events-button qt-btn',
            x_align: Clutter.ActorAlign.START,
            y_align: Clutter.ActorAlign.CENTER,
            child: userIcon,
        });
        this.userBtn.connect('clicked',
            () => Shell.AppSystem.get_default().lookup_app('gnome-user-accounts-panel.desktop').activate() );

        let userName = new St.Label({
            y_align: Clutter.ActorAlign.END,
            x_align: Clutter.ActorAlign.START,
            text: GLib.get_user_name(),
        });
        this.greet = new St.Label({
            y_align: Clutter.ActorAlign.START,
            x_align: Clutter.ActorAlign.START,
        });
        this._setGreet();
        this.greetBox = new St.BoxLayout({
            vertical: true,
            y_align: Clutter.ActorAlign.CENTER,
        });
        this.greetBox.add_child(userName);
        this.greetBox.add_child(this.greet);

        this.clock = new GnomeDesktop.WallClock();
        this.clock.connect('notify::clock', () => {

        });

        this.settingsBtn = new St.Button({
            x_align: Clutter.ActorAlign.END,
            y_align: Clutter.ActorAlign.CENTER,
            style_class: 'events-button qt-btn',
            child: new St.Icon({
                icon_name: 'org.gnome.Settings-symbolic',
            }),
        });
        this.settingsBtn.connect('clicked',
            () => Shell.AppSystem.get_default().lookup_app('org.gnome.Settings.desktop').activate() );

        this.lockBtn = new St.Button({
            x_align: Clutter.ActorAlign.END,
            y_align: Clutter.ActorAlign.CENTER,
            style_class: 'events-button qt-btn',
            child: new St.Icon({
                icon_name: 'system-lock-screen-symbolic',
            }),
        });
        this.lockBtn.connect('clicked',
            () => SystemActions.getDefault().activateAction('lock-screen') );

        this.powerOffBtn = new St.Button({
            x_align: Clutter.ActorAlign.END,
            y_align: Clutter.ActorAlign.CENTER,
            style_class: 'events-button qt-btn',
            child: new St.Icon({
                icon_name: 'system-shutdown-symbolic',
            }),
        });
        this.powerOffBtn.connect('clicked',
            () => SystemActions.getDefault().activateAction('power-off') );

        this.add_child(this.userBtn);
        this.add_child(this.greetBox);
        this.greetBox.x_expand = true;
        this.add_child(this.settingsBtn);
        this.add_child(this.lockBtn);
        this.add_child(this.powerOffBtn);
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
});

const QuickTogglesBottom = GObject.registerClass(
class QuickTogglesBottom extends St.BoxLayout{
    _init(){
        super._init({
            style_class: 'qt-bot-row',
        });

        //power
        let power = new Power.Indicator();
        let powerBox = new St.BoxLayout();

        power._item.remove_all_children();
        powerBox.add_child(power._item.icon);
        power._item.icon.style  = 'icon-size: 1em';
        powerBox.add_child(power._item.label);

        this.powerBtn = new St.Button({
            x_align: Clutter.ActorAlign.START,
            y_align: Clutter.ActorAlign.CENTER,
            child: powerBox,
        });
        this.powerBtn.connect('clicked',
            () => Shell.AppSystem.get_default().lookup_app('gnome-power-panel.desktop').activate() );

        //clock
        this.clock = new St.Label({
            x_align: Clutter.ActorAlign.START,
            y_align: Clutter.ActorAlign.CENTER,
            text: GLib.DateTime.new_now_local().format('%A | %Y. %m. %d. | %H:%M'),
        });
        this.wallClock = new GnomeDesktop.WallClock();
        this.wallClock.connect('notify::clock', () =>{
            this.clock.text = GLib.DateTime.new_now_local().format('%A | %Y. %m. %d. | %H:%M');
        });

        this.add_child(this.powerBtn);
        this.powerBtn.x_expand = true;
        this.add_child(this.clock);
    }
});

const QuickToggle = GObject.registerClass(
class QuickToggle extends St.Button{
    _init(){
        super._init({
            style_class: 'events-button qt-toggle-btn',
            // x_align: Clutter.ActorAlign.CENTER,
            // x_expand: true,
            can_focus: true,
        });

        let box = new St.BoxLayout({
            vertical: true,
            y_align: Clutter.ActorAlign.CENTER,
        });
        this.set_child(box);

        this.btnIcon = new St.Icon({
            x_align: Clutter.ActorAlign.CENTER,
        });
        this.btnLabel = new St.Button({
            label: '',
            x_align: Clutter.ActorAlign.CENTER,
        });

        box.add_child(this.btnIcon);
        box.add_child(this.btnLabel);
    }
});

const WifiToggle = GObject.registerClass(
class WifiToggle extends QuickToggle{
    _init(){
        super._init();
        this.btnIcon.icon_name = 'network-wireless-connected-symbolic';
        this.btnLabel.label = 'network';

        this.connect('clicked', () => this.toggle() );
        this.btnLabel.connect('clicked', () => this.showDialog() );
    }
    toggle(){
        this.wrapper._toggleWifi();
    }
    showDialog(){
        this.wrapper._showDialog();
    }
    getWrapper(){
        let network = AggregateMenu._network;

        let devices = network._client.get_devices();
        let wifiDevice;
        devices.forEach(element => {
            if(element.device_type === NM.DeviceType.WIFI)
                wifiDevice = element;
        });
        this.wrapper = new Network.NMDeviceWireless(network._client, wifiDevice);

        this.wrapper._client.connectObject(
            'notify::wireless-enabled', this.sync.bind(this),
            'notify::wireless-hardware-enabled', this.sync.bind(this),
            'notify::connectivity', this.sync.bind(this), this);

        this.wrapper._device.connectObject(
            'state-changed', this.sync.bind(this), this);

        this.network = network;
        this.sync();
    }
    sync(){
        this.btnIcon.icon_name = this.wrapper._getMenuIcon();
        this.btnLabel.label = this.wrapper._getStatus();

        if(this.wrapper._client.wireless_enabled)
            this.add_style_pseudo_class('active');
        else this.remove_style_pseudo_class('active');
    }
});

const BluetoothToggle = GObject.registerClass(
class BluetoothToggle extends QuickToggle{
    _init(){
        super._init();

        this.bluetooth = AggregateMenu._bluetooth;

        this.btnLabel.connect('clicked',
            () => Shell.AppSystem.get_default().lookup_app('gnome-bluetooth-panel.desktop').activate() );

        this.connect('clicked', () => {
            if (!this.bluetooth._client.default_adapter_powered) {
                this.bluetooth._proxy.BluetoothAirplaneMode = false;
                this.bluetooth._client.default_adapter_powered = true;
            } else {
                this.bluetooth._proxy.BluetoothAirplaneMode = true;
            }
            this.sync();
        });

        this.bluetooth._client.connect('notify::default-adapter-powered', this.sync.bind(this));
        this.bluetooth._item.label.connect('notify::text',
            () => this.sync().bind(this) );

        this.sync();
    }
    sync(){
        if(this.bluetooth._client.default_adapter_powered){
            this.add_style_pseudo_class('active');
            this.btnIcon.icon_name = 'bluetooth-active-symbolic';
        }
        else{
            this.remove_style_pseudo_class('active');
            this.btnIcon.icon_name = 'bluetooth-disabled-symbolic';
        }
        if(this.btnLabel.label.includes('Bluetooth'))
            this.btnLabel.label = this.bluetooth._item.label.text.replace('Bluetooth','').trim();
        else this.btnLabel.label = this.bluetooth._item.label.text;
    }
});

const PowerProfileToggle = GObject.registerClass(
class PowerProfileToggle extends QuickToggle{
    _init(){
        super._init();
        this.connect('clicked',
            () => this.toggle() );
        
        this.connect('destroy',
            () => this.proxy.disconnect(this.binding));

    }
    getProxy(){
        this.proxy = AggregateMenu._powerProfiles._proxy;
        this.binding = this.proxy.connect('g-properties-changed',
            () => this.sync() );
        this.sync();
    }
    sync(){
        if(this.proxy.ActiveProfile == 'power-saver'){
            this.btnIcon.icon_name = 'power-profile-power-saver-symbolic';
            this.btnLabel.label = 'Saver';
            this.remove_style_pseudo_class('active');
        }
        if(this.proxy.ActiveProfile == 'performance'){
            this.btnIcon.icon_name = 'power-profile-performance-symbolic';
            this.btnLabel.label = 'Perform';
            this.add_style_pseudo_class('active');
        }
        if(this.proxy.ActiveProfile == 'balanced'){
            this.btnIcon.icon_name = 'power-profile-balanced-symbolic';
            this.btnLabel.label = 'Balance';
            this.remove_style_pseudo_class('active');
        }
    }
    toggle(){
        if(this.proxy.ActiveProfile == 'power-saver'){
            this.proxy.ActiveProfile = 'performance';
        }
        else if(this.proxy.ActiveProfile == 'performance'){
            this.proxy.ActiveProfile = 'power-saver';
        }
        else if(this.proxy.ActiveProfile == 'balanced'){
            this.proxy.ActiveProfile = 'power-saver';
        }
        this.sync();
    }
});

const NIGHT_LIGHT_MAX = 4700;
const NIGHT_LIGHT_MIN = 1400;
const NightLightToggle = GObject.registerClass(
class NightLightToggle extends QuickToggle{
    _init(){
        super._init();

        this._settings = new Gio.Settings({
            schema_id: 'org.gnome.settings-daemon.plugins.color',
        });
        this._settings.connect('changed::night-light-enabled',
            () => this.sync());
 
        this.connectObject(
            'destroy', () => this._settings.run_dispose(),
            'clicked', () => this.toggle(),
            this);
        
        this.btnLabel.connect('clicked',
            () => Shell.AppSystem.get_default().lookup_app('gnome-display-panel.desktop').activate() );

        this._slider = new Slider(0)
        this._onSettingsChanged();
        
        this._slider.connect('notify::value',
            () => this._onSliderChanged().bind(this) );
        this._settings.connect('changed::night-light-temperature',
            () => this._onSettingsChanged().bind(this) );

        this.menuItem = new PopupMenu.PopupBaseMenuItem({ activate: false });
        this.menuItem.add_child(new St.Icon({
            icon_name: 'night-light-symbolic',
            style_class: 'popup-menu-icon',
        }));
        this.menuItem.add_child(this._slider);

        this.sync();
        this._onSliderChanged();
    }
    toggle() {
        let enabled = this._settings.get_boolean('night-light-enabled');
        this._settings.set_boolean('night-light-enabled', !enabled);
        this.sync();
    }
    sync(){
        let enabled = this._settings.get_boolean('night-light-enabled');
        if(enabled){
            this.btnIcon.icon_name = 'night-light-symbolic';
            this.btnLabel.label = 'Night';
            this.add_style_pseudo_class('active');
            this.menuItem.show();
        }else{
            this.btnIcon.icon_name = 'night-light-disabled-symbolic';
            this.btnLabel.label = 'Day';
            this.remove_style_pseudo_class('active');
            this.menuItem.hide();
        }
    }
    _onSliderChanged(){
        let value = (1 - this._slider.value) * (NIGHT_LIGHT_MAX - NIGHT_LIGHT_MIN);
        value += NIGHT_LIGHT_MIN;
        this._settings.set_uint('night-light-temperature', value);
    }
    _onSettingsChanged(){
        let value = this._settings.get_uint('night-light-temperature');
        value -= NIGHT_LIGHT_MIN;
        value /= (NIGHT_LIGHT_MAX - NIGHT_LIGHT_MIN);
        this._slider.value = (1 - value);
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
        
        this.btnLabel.reactive = false;

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
            this.btnIcon.icon_name = 'org.gnome.Settings-notifications-symbolic';
            this.btnLabel.label = 'Noisy';
            this.remove_style_pseudo_class('active');
        }else{
            this.btnIcon.icon_name = 'notifications-disabled-symbolic';
            this.btnLabel.label = 'Silent';
            this.add_style_pseudo_class('active');
        }
    }
});

const DarkModeToggle = GObject.registerClass(
class DarkModeToggle extends QuickToggle{
    _init(){
        super._init();

        this._settings = new Gio.Settings({
            schema_id: 'org.gnome.desktop.interface',
        });
        this._settings.connect('changed::color-scheme',
            () => this.sync());

        this.connectObject(
            'destroy', () => this._settings.run_dispose(),
            'clicked', () => this.toggle(),
            this);
        
        this.btnLabel.reactive = false;
        
        this.sync();
    }
    toggle() {
        Main.layoutManager.screenTransition.run();
        const colorScheme = this._settings.get_string('color-scheme');
        if(colorScheme === 'default'){
            this._settings.set_string('color-scheme', 'prefer-dark');
        }
        if(colorScheme === 'prefer-dark'){
            this._settings.set_string('color-scheme', 'default');
        }
        this.sync();
    }
    sync() {
        const colorScheme = this._settings.get_string('color-scheme');
        if(colorScheme === 'default'){
            this.btnIcon.icon_name = 'weather-clear-symbolic';
            this.btnLabel.label = 'Light';
            this.remove_style_pseudo_class('active');
        }
        if(colorScheme === 'prefer-dark'){
            this.btnIcon.icon_name = 'weather-clear-night-symbolic';
            this.btnLabel.label = 'Dark';
            this.add_style_pseudo_class('active');
        }
    }
});

const QuickToggles = GObject.registerClass(
class QuickToggles extends St.BoxLayout{
    _init(){
        super._init({
            style_class: 'qt-container',
            vertical: true,
        });

        this.wifi = new WifiToggle();
        this.bluetooth = new BluetoothToggle();
        this.powerProfile = new PowerProfileToggle();
        this.dnd = new DoNotDisturbToggle();
        this.nightLight = new NightLightToggle();
        this.darkMode = new DarkModeToggle();

        let row1 = new St.BoxLayout({ style_class: 'qt-container', });
        let row2 = new St.BoxLayout({ style_class: 'qt-container', });
        this.add_child(row1);
        this.add_child(row2);
        row1.add_child(this.wifi);
        row1.add_child(this.bluetooth);
        row1.add_child(this.powerProfile);
        row2.add_child(this.dnd);
        row2.add_child(this.nightLight);
        row2.add_child(this.darkMode);

        this.bluetooth.x_expand = true;
        this.bluetooth.x_align = Clutter.ActorAlign.CENTER;
        this.nightLight.x_expand = true;
        this.nightLight.x_align = Clutter.ActorAlign.CENTER;
    }
    initialize(){
        if(!this.wifi.wrapper)
            this.wifi.getWrapper();
        if(!this.powerProfile.proxy)
            this.powerProfile.getProxy();
        
    }
});

const MediaPlayer = GObject.registerClass(
class MediaPlayer extends St.Bin{
    _init(){
        super._init({
            style_class: 'qt-container',
        });
        this.media = new Media();
        this.media.connect('updated',
            () => this.sync() );
                
        this.sync();
    }
    sync(){
        let player = this.media.getFavPlayer();
        if(player){
            this.player = new Player(player._busName);
            this.player.style_class = 'qt-container events-button';
            this.player.remove_child(this.player.volumeBox);
            this.set_child(this.player);
            this.show();
        }else{
            this.hide();
        }
    }
});

const Notifications = GObject.registerClass(
class Notifications extends St.BoxLayout{
    _init(){
        super._init({
            vertical: true,
            style_class: 'qt-container',
        });

        this._settings = new Gio.Settings({
            schema_id: 'org.gnome.desktop.notifications',
        });
        this._settings.connect('changed::show-banners',
            () => this.sync());
        this.connectObject(
            'destroy', () => this._settings.run_dispose(),
            this);

        this._getMessageList();
        this.placeHolderBinding = this.messageList._placeholder.connect('notify::visible',
            () => this.sync());
        this.connect('destroy',
            () => this._resetMessagList());

        this.label = new St.Label({
            x_align: Clutter.ActorAlign.START,
        });
        this.icon = new St.Icon({
            style_class: 'qt-notification-icon',
        });

        this.dndButton = new St.Button({ style_class: 'button qt-container', });
        this.dndButton.connect('clicked', () => this.toggle() );
        let dndContent = new St.BoxLayout();
        dndContent.add_child(this.icon);
        dndContent.add_child(this.label);
        this.dndButton.set_child(dndContent);

        let box = new St.BoxLayout();
        box.add_child(this.dndButton);
        box.add_child(this.messageList._clearButton);
        this.add_child(box);
        this.messageListBox = new St.BoxLayout();
        this.messageListBox.add_child(this.messageList);
        this.add_child(this.messageListBox);

        this.sync();
    }
    toggle() {
        let enabled = this._settings.get_boolean('show-banners');
        this._settings.set_boolean('show-banners', !enabled);
        this.sync();
    }
    sync(){
        if(this.messageList._placeholder.visible){
            this.icon.icon_name = 'notifications-disabled-symbolic';
            this.label.text = 'There are no Notifications';
            this.messageListBox.hide();
        }else{
            this.icon.icon_name = 'org.gnome.Settings-notifications-symbolic';
            this.label.text = 'Notifications';
            this.messageListBox.show();
        }
        if(!this._settings.get_boolean('show-banners')){
            this.icon.icon_name = 'notifications-disabled-symbolic';
            this.label.text = 'Notifications are disabled';
            this.dndButton.add_style_pseudo_class('active');
        }else{
            this.dndButton.remove_style_pseudo_class('active');
        }
    }
    _getMessageList(){
        this.messageListParent = DateMenu._messageList.get_parent();
        this.messageListParent.remove_child(DateMenu._messageList);

        this.messageList = DateMenu._messageList;

        this.clearButtonParent = this.messageList._clearButton.get_parent()
        this.clearButtonParent.hide();
        this.clearButtonParent.remove_child(this.messageList._clearButton);
    }
    _resetMessagList(){
        this.messageList._placeholder.disconnect(this.placeHolderBinding);
        DateMenu._messageList._clearButton.get_parent().remove_child(DateMenu._messageList._clearButton);
        DateMenu._messageList.get_parent().remove_child(DateMenu._messageList);

        this.messageListParent.insert_child_at_index(DateMenu._messageList, 0);
        this.clearButtonParent.add_child(DateMenu._messageList._clearButton);
        this.clearButtonParent.show();  
    }
});

class Extension {
    constructor() {
        this.aM = AggregateMenu.menu.box;
        this.stockMpris = DateMenu._messageList._mediaSection;
        this.shouldShow = this.stockMpris._shouldShow;
    }

    enable() {
        AggregateMenu.menu.box.add_style_class_name('qt-stock-menu');
        AggregateMenu.menu.box.add_style_class_name('qt-container');

        //remove
        this.children = this.aM.get_children();
        this.aM.remove_all_children();

        this.stockMpris.visible = false;
        this.stockMpris._shouldShow = () => false;

        //add
        this.binding = AggregateMenu.menu.connect('open-state-changed',
            () => this.update() );

        this.qtTop = new QuickTogglesTop();
        this.qtBtns = new QuickToggles();
        this.mediaPlayer = new MediaPlayer();
        this.qtBottom = new QuickTogglesBottom();
        // this.notifications = new Notifications();

        this.sliderBox = new St.BoxLayout({
            vertical: true,
            style_class: 'events-button qt-slider-container',
        });
        this.sliderBox.add_child(AggregateMenu._volume.menu.box);
        this.sliderBox.add_child(AggregateMenu._brightness.menu.box);
        this.sliderBox.add_child(this.qtBtns.nightLight.menuItem);


        this.aM.add_child(this.qtTop);
        this.aM.add_child(this.sliderBox);
        this.aM.add_child(this.mediaPlayer);
        this.aM.add_child(this.qtBtns);
        this.aM.add_child(this.qtBottom);
        // this.aM.add_child(this.notifications);
    }
    disable() {
        //remove
        AggregateMenu.menu.box.remove_style_class_name('qt-stock-menu');
        AggregateMenu.menu.box.remove_style_class_name('qt-container');
        AggregateMenu.menu.disconnect(this.binding);

        this.aM.remove_all_children();
        this.sliderBox.remove_all_children();
        this.qtTop = null;
        this.qtBtns = null;
        this.mediaPlayer.destroy();
        this.mediaPlayer = null;
        // this.notifications.destroy();
        // this.notifications = null;

        //add back
        this.children.forEach(ch => {
            this.aM.add_child(ch);
        });

        this.stockMpris._shouldShow = this.shouldShow;
        this.stockMpris.visible = this.stockMpris._shouldShow();
    }
    update(){
        this.qtBtns.initialize();
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