'use strict';

const { St, GObject, Clutter, Gio } = imports.gi;
const Main = imports.ui.main;
const Me = imports.misc.extensionUtils.getCurrentExtension()
const DateMenu = Main.panel.statusArea.dateMenu;

const MessageIndicator = GObject.registerClass(
class MessageIndicator extends St.Button{
    _init(){
        super._init({
            style_class: 'panel-button',
        });

        DateMenu._indicator.get_parent().remove_child(DateMenu._indicator);
        this.icon = DateMenu._indicator;
        this.icon.style_class = 'system-status-icon';
        this.box = new St.BoxLayout();
        this.box.add_child(this.icon);
        this.set_child(this.box);

        this.binding = DateMenu._indicator.connect('notify::visible',
            () => this.sync());

        this._settings = new Gio.Settings({
            schema_id: 'org.gnome.desktop.notifications',
        });
        this._settings.connect('changed::show-banners',
            () => this.sync());
    
        this.connectObject(
            'destroy', () => this._settings.run_dispose(),
            'clicked', () => this.sync(true),
            this);

        this.sync();
    }
    sync(close){
        if(this._settings.get_boolean('show-banners')){
            this.icon.icon_name = 'org.gnome.Settings-notifications-symbolic';
            if(close)
                this.hide();
            else{
                if(!DateMenu._indicator.visible)
                    this.hide();
                else this.show();
            }
        }else{
            this.icon.icon_name = 'notifications-disabled-symbolic';
            this.show();
        }
    }
    resetIndicator(){
        DateMenu._indicator.disconnect(this.binding);
        this.box.remove_child(this.icon);
        DateMenu.get_first_child().add_child(this.icon);
        this.icon.style_class = '';
    }
});

class Extension{
    constructor(){
        this.box = DateMenu.get_first_child();
        this.padding = this.box.get_first_child();
        this.indicator = this.box.get_last_child();
    }
    enable(){
        this._panelButton = new MessageIndicator();
        DateMenu.get_first_child().insert_child_at_index(this._panelButton,0);
        this._panelButton.style = 'margin: 0';

        //remove
        this.box.remove_child(this.padding);
    }
    disable(){
        this._panelButton.resetIndicator();
        this._panelButton.destroy();
        this._panelButton = null;

        this.box.insert_child_at_index(this.padding, 0);
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