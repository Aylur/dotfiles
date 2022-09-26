'use strict'

const { GObject, St, Clutter } = imports.gi;
const ExtensionUtils = imports.misc.extensionUtils;
const Main = imports.ui.main;
const SystemActions = imports.misc.systemActions;
const ModalDialog = imports.ui.modalDialog;

const PowerButton = GObject.registerClass(
class PowerButton extends St.Button{
    _init(powerIcon, powerLabel, action, parentDialog){
        super._init({
            style_class: 'button button-rectangle',
            can_focus: true,
        });

        let icon = new St.Icon({
            icon_name: powerIcon,
            x_align: Clutter.ActorAlign.CENTER,
        });
        let label = new St.Label({
            text: powerLabel,
            x_align: Clutter.ActorAlign.CENTER,
        });
        let box = new St.BoxLayout({
            vertical: true,
            y_align: Clutter.ActorAlign.CENTER,
        });
        box.add_child(icon);
        box.add_child(label);
        this.set_child(box);

        this.connect('clicked', () => {
            SystemActions.getDefault().activateAction(action);
            if(parentDialog)
                parentDialog.close();
        });
    }
});

const PowerButtonRound = GObject.registerClass(
class PowerButtonRound extends St.Button{
    _init(powerIcon, powerLabel, action, parentDialog){
        super._init({
            style_class: 'button-round-container'
        });

        let icon = new St.Button({
            can_focus: true,
            style_class: 'button button-round',
            child: new St.Icon({
                icon_name: powerIcon
            }),
            x_align: Clutter.ActorAlign.CENTER,
        })
        let label = new St.Label({
            text: powerLabel,
            x_align: Clutter.ActorAlign.CENTER,
            y_align: Clutter.ActorAlign.END
        });
        let box = new St.BoxLayout({
            vertical: true,
            y_align: Clutter.ActorAlign.CENTER
        });
        box.add_child(icon);
        box.add_child(label);
        this.set_child(box);

        icon.connect('clicked', () => {
            SystemActions.getDefault().activateAction(action)
            if(parentDialog)
                parentDialog.close();
        });
    }
});

const PowerDialog = GObject.registerClass(
class PowerDialog extends ModalDialog.ModalDialog{
    _init(settings){
        super._init();
        this.settings = settings;

        this.dialogLayout._dialog.add_style_class_name('power-menu');
        this.contentLayout.add_style_class_name('power-menu-content');

        let btn = this.addButton({
            action: () => this.close(),
            label: _('Cancel'),
            key: Clutter.KEY_Escape,
        });
        btn.hide();
        
        let monitor = Main.layoutManager.primaryMonitor;
        this.dialogLayout.height = monitor.height;
        this.dialogLayout.width = monitor.width;
        this.dialogLayout.connect('button-press-event', () => this.close() );

        this._buildUI();
    }
    _buildUI(){
        switch (this.settings.get_int('power-menu-layout')) {
            case 0: this.layout2x2(); break;
            default: this.layout1x4(); break;
        }
    }
    layout2x2(){
        let hbox1 = new St.BoxLayout({ style_class: 'container' });
        let hbox2 = new St.BoxLayout({ style_class: 'container' });
        switch (this.settings.get_int('power-menu-style')) {
            case 0:
                hbox1.add_child(new PowerButtonRound('system-reboot-symbolic', 'Restart', 'restart', this));
                hbox1.add_child(new PowerButtonRound('system-shutdown-symbolic', 'Shutdown', 'power-off', this));
                hbox2.add_child(new PowerButtonRound('weather-clear-night-symbolic', 'Suspend', 'suspend', this));
                hbox2.add_child(new PowerButtonRound('system-log-out-symbolic', 'Log Out', 'logout', this));
                break;
            default:
                hbox1.add_child(new PowerButton('system-reboot-symbolic', 'Restart', 'restart', this));
                hbox1.add_child(new PowerButton('system-shutdown-symbolic', 'Shutdown', 'power-off', this));
                hbox2.add_child(new PowerButton('weather-clear-night-symbolic', 'Suspend', 'suspend', this));
                hbox2.add_child(new PowerButton('system-log-out-symbolic', 'Log Out', 'logout', this));
                break;
        }
        this.contentLayout.add_child(hbox1);
        this.contentLayout.add_child(hbox2);
    }
    layout1x4(){
        let hbox = new St.BoxLayout({ style_class: 'container' });
        switch (this.settings.get_int('power-menu-style')) {
            case 0:
                hbox.add_child(new PowerButtonRound('weather-clear-night-symbolic', 'Suspend', 'suspend', this));
                hbox.add_child(new PowerButtonRound('system-log-out-symbolic', 'Log Out', 'logout', this));
                hbox.add_child(new PowerButtonRound('system-reboot-symbolic', 'Restart', 'restart', this));
                hbox.add_child(new PowerButtonRound('system-shutdown-symbolic', 'Shutdown', 'power-off', this));
                break;
            default:
                hbox.add_child(new PowerButton('weather-clear-night-symbolic', 'Suspend', 'suspend', this));
                hbox.add_child(new PowerButton('system-log-out-symbolic', 'Log Out', 'logout', this));
                hbox.add_child(new PowerButton('system-reboot-symbolic', 'Restart', 'restart', this));
                hbox.add_child(new PowerButton('system-shutdown-symbolic', 'Shutdown', 'power-off', this));
                break;
        }
        this.contentLayout.add_child(hbox);
    }
});

const PowerMenu = GObject.registerClass(
class PowerMenu extends St.Button {
    _init(settings) {
        super._init({
            style_class: 'panel-button power-menu-button',
            child: new St.Icon({
                icon_name: 'system-shutdown-symbolic',
                style_class: 'system-status-icon',
            })
        });

        this.settings = settings;

        this.connect('button-press-event',
            () => this._showDialog());

        this.connect('destroy', ()=>{
                if(this.dialog)
                    this.dialog.close();
        });
    }
    _showDialog(){
        this.dialog = new PowerDialog(this.settings);
        this.dialog.open();
    }
});

var Extension = class Extension {
    constructor() {}

    enable() {
        this.settings = ExtensionUtils.getSettings();

        this._panelButton = new PowerMenu(this.settings);
        this.addToPanel();
        
        this.settings.connect('changed::power-menu-position', () => this.addToPanel());
    }

    disable() {
        this._panelButton.destroy();
        this._panelButton = null;
        this.settings = null;
    }

    addToPanel(){
        switch (this.settings.get_int('power-menu-position')) {
            case 0:
                if(this._panelButton){
                    this._panelButton.destroy();
                    this._panelButton = null;
                }
                this._panelButton = new PowerMenu(this.settings);
                Main.panel._rightBox.insert_child_at_index(this._panelButton, -1);
                break;
        
            default:
                if(this._panelButton){
                    this._panelButton.destroy();
                    this._panelButton = null;
                }
                this._panelButton = new PowerMenu(this.settings);
                Main.panel._leftBox.insert_child_at_index(this._panelButton, 0);
                break;
        }
    }
}