'use strict';

const { GObject, St, Clutter, GLib, Gio, GnomeDesktop, Shell, NM } = imports.gi;
const Me = imports.misc.extensionUtils.getCurrentExtension()
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const { Media, Player } = Me.imports.mediaPlayer;
const { SliderBox } = Me.imports.systemLevels;
const Mainloop = imports.mainloop;
const Util = imports.misc.util;
const AppFavorites = imports.ui.appFavorites;
const SystemActions = imports.misc.systemActions;

const UserBox = GObject.registerClass(
class UserBox extends St.Bin{
    _init(){
        super._init({
            y_expand: true,
            style_class: 'events-button db-user-box',
        });

        let userIcon = new St.Bin({
            x_align: Clutter.ActorAlign.CENTER,
            style_class: 'db-user-icon',
            style: 'background-image: url("/var/lib/AccountsService/icons/'+ GLib.get_user_name() +'"); background-size: cover;',
        });
        let userName = new St.Label({
            x_align: Clutter.ActorAlign.CENTER,
            text: GLib.get_user_name(),
        });
        this.greet = new St.Label({
            x_align: Clutter.ActorAlign.CENTER,
            text: this.getGreet(),
        });

        let hbox = new St.BoxLayout({
            x_align: Clutter.ActorAlign.CENTER,
            y_align: Clutter.ActorAlign.CENTER,
            style_class: 'db-container',
        });
        let vbox = new St.BoxLayout({
            vertical: true,
            x_align: Clutter.ActorAlign.CENTER,
            y_align: Clutter.ActorAlign.CENTER,
        });
        hbox.add_child(userIcon);
        vbox.add_child(userName);
        vbox.add_child(this.greet);
        hbox.add_child(vbox);
        this.set_child(hbox);
    }
    getGreet(){
        let time = new Date();
        let hour = time.getHours();

        let greet = "Good Evening!";
        if(hour > 6){ greet = "Good Morning!"; }
        if(hour > 12){greet = "Good Afternoon!";}
        if(hour > 18){greet = "Good Evening!";}

        return greet;
    }
    update(){
        this.greet.text = this.getGreet();
    }
});

const MediaBox = GObject.registerClass(
class MediaBox extends St.Button{
    _init(){
        super._init({
            x_expand: true,
            y_expand: true,
            style_class: 'events-button db-media',
            track_hover: false,
            reactive: false,
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
            this.player.style_class = 'db-container';
            this.player.y_align = Clutter.ActorAlign.CENTER;
            this.player.x_expand = true;
            this.set_child(this.player);
        }else{
            this.set_child(new St.Label({
                text: 'Nothing Playing',
                y_align: Clutter.ActorAlign.CENTER,
                x_align: Clutter.ActorAlign.CENTER,
            }));
        }
    }
});

const LinkButton = GObject.registerClass(
class LinkButton extends St.Button{
    _init(icon, link){
        super._init({
            child: new St.Icon({
                gicon: Gio.icon_new_for_string(
                    Me.dir.get_path() + '/media/'+icon+'-symbolic.svg'
                ),
                style_class: 'db-link-icon',
            }),
            style_class: 'events-button db-link-btn',
            x_expand: true,
        });
        this.connect('clicked', () => Util.spawnCommandLine('xdg-open '+link));
    }
});

const LinkBox = GObject.registerClass(
class LinkBox extends St.Button{
    _init(){
        super._init({
            style_class: 'db-container',
            x_expand: true,
        });

        this.links = [
            new LinkButton('reddit', 'https://www.reddit.com/'),
            new LinkButton('youtube', 'https://www.youtube.com/'),
            new LinkButton('github', 'https://www.github.com/'),
            new LinkButton('gmail', 'https://www.gmail.com/'),
            new LinkButton('canvas', 'https://canvas.elte.hu/belepes/'),
            new LinkButton('ncore', 'https://ncore.pro/login.php'),
        ];

        let box = new St.BoxLayout({ style_class: 'db-container' });
        this.links.forEach(ch => { box.add_child(ch); });
        this.set_child(box);
    }
});

const ClockBox = GObject.registerClass(
class ClockBox extends St.BoxLayout{
    _init(){
        super._init({
            style_class: 'events-button db-clock-box',
            x_expand: true,
        });
        this.clock = new St.Label({
            style_class: 'db-clock',
            y_align: Clutter.ActorAlign.CENTER,
            x_align: Clutter.ActorAlign.CENTER,
            x_expand: true,
        });
        this.date = new St.Label();
        this.day = new St.Label();

        let vbox = new St.BoxLayout({
            vertical: true,
            y_align: Clutter.ActorAlign.CENTER,
            x_align: Clutter.ActorAlign.CENTER,
            x_expand: true,
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
    }
});

const AppBtn = GObject.registerClass(
class AppBtn extends St.Button{
    _init(app){
        super._init({
            style_class: 'message-media-control db-app-btn',
            x_expand: true,
            child: new St.Icon({
                gicon: app.get_icon(),
                style_class: 'db-app-icon',
            }),
        });
        this.connect('clicked', () => app.activate());
    }
});

const AppBox = GObject.registerClass(
class AppBox extends St.BoxLayout{
    _init(){
        super._init({
            vertical: true,
            style_class: 'events-button db-container',
            y_expand: true,
            x_expand: false,
        });
        this.rows = [
            new St.BoxLayout({ style_class: 'db-container', y_expand: true, y_align: Clutter.ActorAlign.CENTER }),
            new St.BoxLayout({ style_class: 'db-container', y_expand: true, y_align: Clutter.ActorAlign.CENTER }),
            new St.BoxLayout({ style_class: 'db-container', y_expand: true, y_align: Clutter.ActorAlign.CENTER }),
        ]
        this.add_child(this.rows[0]);
        this.add_child(this.rows[1]);
        this.add_child(this.rows[2]);
    }
    reload(){
        this.rows.forEach(row => { row.remove_all_children(); });
        let favs = AppFavorites.getAppFavorites().getFavorites();
        for (let i = 0; i < 9; i++) {
            if(favs[i]){
                if(i<3){ this.rows[0].add_child(new AppBtn(favs[i])); }
                else if(i<6){ this.rows[1].add_child(new AppBtn(favs[i])); }
                else if(i<9){ this.rows[2].add_child(new AppBtn(favs[i])); }
            }
        }
    }
});

const SysBtn = GObject.registerClass(
class SysBtn extends St.Button{
    _init(icon, callback){
        super._init({
            style_class: 'message-media-control ',
            child: new St.Icon({
                icon_name: icon,
                style_class: 'db-sys-icon',
            }),
            y_expand: true,
        });
        this.connect('clicked', callback);
    }
});

const SysBox = GObject.registerClass(
class SysBox extends St.BoxLayout{
    _init(){
        super._init({
            style_class: 'db-container',
        });

        this.wifi = new SysBtn('network-wireless-connected-symbolic', () => this._showNetworkDialog());

        let settings = new St.BoxLayout({ style_class: 'db-container events-button', });
        settings.add_child(this.wifi);
        settings.add_child(new SysBtn('bluetooth-active-symbolic', () => Shell.AppSystem.get_default().lookup_app('gnome-bluetooth-panel.desktop').activate()));
        settings.add_child(new SysBtn('org.gnome.Settings-symbolic', () => Shell.AppSystem.get_default().lookup_app('org.gnome.Settings.desktop').activate()));
        
        let sysActs = new St.BoxLayout({ style_class: 'db-container events-button', });
        sysActs.add_child(new SysBtn('system-reboot-symbolic', () => SystemActions.getDefault().activateAction('restart')));
        sysActs.add_child(new SysBtn('weather-clear-night-symbolic', () => SystemActions.getDefault().activateAction('suspend')));
        sysActs.add_child(new SysBtn('system-log-out-symbolic', () => SystemActions.getDefault().activateAction('logout')));
        sysActs.add_child(new SysBtn('system-shutdown-symbolic', () => SystemActions.getDefault().activateAction('power-off')));

        this.add_child(settings);
        this.add_child(sysActs);
    }
    getNetworkWrapper(){
        let network = Main.panel.statusArea.aggregateMenu._network;

        let devices = network._client.get_devices();
        let wifiDevice;
        devices.forEach(element => {
            if(element.device_type === NM.DeviceType.WIFI)
                wifiDevice = element;
        });
        this.wrapper = new imports.ui.status.network.NMDeviceWireless(network._client, wifiDevice);

        this.wrapper._client.connectObject(
            'notify::wireless-enabled', this._syncWifiIcon.bind(this),
            'notify::wireless-hardware-enabled', this._syncWifiIcon.bind(this),
            'notify::connectivity', this._syncWifiIcon.bind(this), this);

        this.wrapper._device.connectObject(
            'state-changed', this._syncWifiIcon.bind(this), this);

        this.network = network;
        this._syncWifiIcon();
    }
    _syncWifiIcon(){
        this.wifi.get_child().icon_name = this.wrapper._getMenuIcon();
    }
    _showNetworkDialog(){
        this.wrapper._showDialog();
    }
});

const DashBoardModal = GObject.registerClass(
class DashBoardModal extends imports.ui.modalDialog.ModalDialog{
    _init(){
        super._init({
            shellReactive: true,
        });

        let closeBtn = this.addButton({
            action: () => this.close(),
            label: 'x',
            key: Clutter.KEY_Escape,
        });
        closeBtn.hide();
        let monitor = Main.layoutManager.primaryMonitor;
        this.dialogLayout.height = monitor.height;
        this.dialogLayout.width = monitor.width;
        this.dialogLayout.connect('button-press-event', () => this.close() );

        //UI
        this.userBox = new UserBox();
        this.slidersBox = new SliderBox();
        this.slidersBox.style_class = 'events-button db-container db-sliders';
        this.mediaBox = new MediaBox();
        this.linkBox = new LinkBox();
        this.clockBox = new ClockBox();
        this.appBox = new AppBox();
        this.sysBox = new SysBox();

        let leftBox = new St.BoxLayout({ style_class: 'db-container db-left-box', });
        leftBox.add_child(this.userBox);
        leftBox.add_child(this.slidersBox);
        this.slidersBox.x_expand = true;

        let row1 = new St.BoxLayout({ style_class: 'db-container', });
        row1.add_child(this.clockBox);
        row1.add_child(this.sysBox);

        let rightBox = new St.BoxLayout({ vertical: true, style_class: 'db-container', });
        rightBox.add_child(row1);

        let vbox = new St.BoxLayout({ vertical: true, style_class: 'db-container' });
        vbox.add_child(this.mediaBox);
        vbox.add_child(this.linkBox);

        let row2 = new St.BoxLayout({ style_class: 'db-container', });
        row2.add_child(vbox);
        row2.add_child(this.appBox);

        rightBox.add_child(row1);
        rightBox.add_child(row2);

        let mainBox = new St.BoxLayout({ style_class: 'db-container', vertical: true });
        mainBox.add_child(rightBox);
        mainBox.add_child(leftBox);
        this.contentLayout.add_child(mainBox);
        this.contentLayout.add_style_class_name('db-dashboard-content');
        this.dialogLayout._dialog.add_style_class_name('db-dashboard');
    }
    open(){
        let sliders = this.slidersBox;
        function update(){
            sliders.updateSliders();
            return true;
        }
        sliders.updateSliders();
        this.timeout = Mainloop.timeout_add_seconds(1.0, update);
        this.appBox.reload();
        this.sysBox.getNetworkWrapper();
        this.userBox.update();
        super.open();
    }
    close(){
        Mainloop.source_remove(this.timeout);
        super.close();
    }
});

const DashBoardPanelButton = GObject.registerClass(
class DashBoardPanelButton extends St.Button{
    _init(){
        super._init({ style_class: 'panel-button', });
        this.set_child(new St.Icon({
            fallback_icon_name: 'org.gnome.Settings-applications-symbolic',
            gicon: Gio.icon_new_for_string(Me.dir.get_path()+'/media/fedora-logo-f-symbolic.svg'),
            style_class: 'system-status-icon',
        }));

        this.connect('clicked', () => this._showDialog());

        this.connect('destroy', ()=>{
                if(this.dialog)
                    this.dialog.close();
        });
    }
    _showDialog(){
        this.dialog = new DashBoardModal();
        this.dialog.open();
    }
});

class Extension{
    constructor(){}
    enable(){
        this.panelButton = new DashBoardPanelButton();
        Main.panel._leftBox.insert_child_at_index(this.panelButton, 0);
    }
    disable(){
        this.panelButton.destroy();
        this.panelButton = null;
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