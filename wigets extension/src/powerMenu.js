'use strict'

const { GObject, St, Clutter } = imports.gi;
const Me = imports.misc.extensionUtils.getCurrentExtension()
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const SystemActions = imports.misc.systemActions;
const { ModalDialog } = imports.ui.modalDialog;

const DateMenu = Main.panel.statusArea.dateMenu;

const PowerButton = GObject.registerClass(
class PowerButton extends St.Button{
    _init(powerIcon, powerLabel, action, parentDialog){
        super._init({
            style_class: 'pm-btn button',
            track_hover: true,
            can_focus: true,
        });

        this.pIcon = new St.Icon({
            icon_name: powerIcon,
            x_align: Clutter.ActorAlign.CENTER,
        });
        this.pLabel = new St.Label({
            text: powerLabel,
            x_align: Clutter.ActorAlign.CENTER,
        });

        this.box = new St.BoxLayout({
            vertical: true,
        });
        this.box.add_child(this.pIcon);
        this.box.add_child(this.pLabel);
        this.set_child(this.box);

        this.connect('clicked', () => {
            SystemActions.getDefault().activateAction(action);
            if(parentDialog)
                parentDialog.close();
        });
    }
});

const PowerButtonRound = GObject.registerClass(
class PowerButtonRound extends St.BoxLayout{
    _init(powerIcon, powerLabel, action, parentDialog){
        super._init({
            vertical: true,
        });

        let btn = new St.Button({
            style_class: 'pm-btn-round button',
            track_hover: true,
            can_focus: true,
        })
        btn.set_child(new St.Icon({
            icon_name: powerIcon,
            x_align: Clutter.ActorAlign.CENTER,
            y_align: Clutter.ActorAlign.CENTER,
        }));
        let label = new St.Label({
            text: powerLabel,
            x_align: Clutter.ActorAlign.CENTER,
        });


        this.add_child(btn);
        this.add_child(label);

        btn.connect('clicked', () => {
            SystemActions.getDefault().activateAction(action)
            if(parentDialog)
                parentDialog.close();
        });
    }
});

const PowerDialog = GObject.registerClass(
class PowerDialog extends ModalDialog{
    _init(){
        super._init({
            shellReactive: true,
        });

        this.contentLayout.style_class = 'pm-content';
        let btn = this.addButton({
            action: () => this.close(),
            label: _('Cancel'),
            key: Clutter.KEY_Escape,
        });
        btn.style_class = 'pm-close-btn button';
        btn.set_child(new St.Icon({ icon_name: 'window-close-symbolic' }));
        btn.x_align = Clutter.ActorAlign.END;
        this.buttonLayout.remove_actor(btn);
        
        let monitor = Main.layoutManager.primaryMonitor;
        this.dialogLayout.height = monitor.height;
        this.dialogLayout.width = monitor.width;
        this.dialogLayout.style = 'background-color: rgba(0,0,0,0.6)';
        this.dialogLayout.connect('button-press-event', () => this.close() );

        let _colsBox = new St.BoxLayout({ style_class: 'pm-container', });
        let _col1 = new St.BoxLayout({ style_class: 'pm-container', vertical: true });
        let _col2 = new St.BoxLayout({ style_class: 'pm-container', vertical: true });
        _col1.add_child(new PowerButtonRound('system-shutdown-symbolic', 'Shutdown', 'power-off', this));
        _col1.add_child(new PowerButtonRound('system-log-out-symbolic', 'Log Out', 'logout', this));
        _col2.add_child(new PowerButtonRound('system-reboot-symbolic', 'Restart', 'restart', this));
        _col2.add_child(new PowerButtonRound('weather-clear-night-symbolic', 'Suspend', 'suspend', this));

        let _middleRow = new St.BoxLayout()

        let padding1 = new St.Widget();
        padding1.add_constraint(new Clutter.BindConstraint({
            source: btn,
            coordinate: Clutter.BindCoordinate.SIZE,
        }));
        let padding2 = new St.Widget();
        padding2.add_constraint(new Clutter.BindConstraint({
            source: btn,
            coordinate: Clutter.BindCoordinate.SIZE,
        }));
        let padding3 = new St.Widget();
        padding3.add_constraint(new Clutter.BindConstraint({
            source: btn,
            coordinate: Clutter.BindCoordinate.SIZE,
        }));

        _colsBox.add_child(_col1);
        _colsBox.add_child(_col2);
        _middleRow.add_child(padding1);
        _middleRow.add_child(_colsBox);
        _middleRow.add_child(padding2)
        this.contentLayout.add_child(btn);
        this.contentLayout.add_child(_middleRow);
        this.contentLayout.add_child(padding3);
    }
});

const PowerMenu = GObject.registerClass(
class PowerMenu extends St.Button {
    _init() {
        super._init({
            style_class: 'panel-button',
        });

        this.set_child(new St.Icon({
            icon_name: 'system-shutdown-symbolic',
            style_class: 'system-status-icon',
        }));

        this.connect('button-press-event',
            () => this._showDialog());

        this.connect('destroy', ()=>{
                if(this.dialog)
                    this.dialog.close();
        });
    }
    _showDialog(){
        this.dialog = new PowerDialog();
        this.dialog.open();
    }
});

class Extension {
    constructor(){
        this.stockSystemMenu = Main.panel.statusArea.aggregateMenu._system.menu.box;
    }
    enable() {
        this.stockSystemMenu.hide();

        this._panelButton = new PowerMenu();
        let offset = 0;
        let nChildren = Main.panel._rightBox.get_n_children();
        const order = Math.clamp(nChildren - offset, 0, nChildren);
        Main.panel._rightBox.insert_child_at_index(this._panelButton, order);
    }
    disable() {
        this.stockSystemMenu.show();
        Main.panel._rightBox.remove_child(this._panelButton);
        this._panelButton.destroy();
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