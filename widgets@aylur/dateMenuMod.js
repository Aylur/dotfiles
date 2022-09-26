'use strict';

const { St, GObject, Clutter, Pango, Gio, GLib, GnomeDesktop } = imports.gi; 
const Main = imports.ui.main;
const ExtensionUtils = imports.misc.extensionUtils;
const DateMenu = Main.panel.statusArea.dateMenu;

var Extension = class Extension {
    constructor() {
        this.panelBox = DateMenu.get_first_child();
        this.padding = this.panelBox.get_first_child();
        this.indicator = DateMenu._indicator;
        this.dateLabel = DateMenu._clockDisplay;
        this.panelBoxChildren = this.panelBox.get_children();

        this.menuBox = DateMenu.menu.box.get_first_child().get_first_child();
        this.calendar = this.menuBox.get_last_child();
        this.notifications = this.menuBox.get_first_child();
    }

    enable() {
        this.settings = ExtensionUtils.getSettings();
        this.settings.connect('changed::date-menu-remove-padding', () => this.reload());
        this.settings.connect('changed::date-menu-indicator-position', () => this.reload());
        this.settings.connect('changed::date-menu-mirror', () => this.reload());
        this.settings.connect('changed::date-menu-hide-notifications', () => this.reload());
        this.settings.connect('changed::date-menu-date-format', () => this.updateClock());

        //clock
        this.clock = new St.Label({ style_class: 'clock' });
        this.clock.clutter_text.y_align = Clutter.ActorAlign.CENTER;
        this.clock.clutter_text.ellipsize = Pango.EllipsizeMode.NONE;

        this.wallclock = new GnomeDesktop.WallClock();
        this.wallclock.connect(
            'notify::clock',
            () =>  this.updateClock());
        
        this.updateClock();
        this.reload();
    }

    disable() {
        this.reset();

        this.settings = null;
        this.wallclock = null;
    }

    updateClock(){
        this.clock.text = GLib.DateTime.new_now_local().format(this.settings.get_string('date-menu-date-format'));
    }
    reload(){
        this.reset();

        //position
        this.panelBox.remove_all_children();

        let pos = this.settings.get_int('date-menu-indicator-position');
        let padding = this.settings.get_boolean('date-menu-remove-padding');

        if(pos === 0){
            this.panelBox.add_child(this.indicator);
            this.panelBox.add_child(this.clock);
            if(!padding) this.panelBox.add_child(this.padding);
        }else if(pos === 1){
            if(!padding) this.panelBox.add_child(this.padding);
            this.panelBox.add_child(this.clock);
            this.panelBox.add_child(this.indicator);
        }else{
            this.panelBox.add_child(this.clock);
        }

        //mirror
        if(this.settings.get_boolean('date-menu-mirror')){
            this.menuBox.remove_child(this.calendar);
            this.menuBox.remove_child(this.notifications);
            this.menuBox.add_child(this.calendar);
            this.menuBox.add_child(this.notifications);
        }

        //notifications
        if(this.settings.get_boolean('date-menu-hide-notifications'))
            this.menuBox.remove_child(this.notifications);
    }

    reset(){
        //position reset
        this.panelBox.remove_all_children();
        this.panelBoxChildren.forEach(ch => {
            this.panelBox.add_child(ch);
        });

        //mirror reset
        this.menuBox.remove_child(this.calendar);
        this.menuBox.remove_child(this.notifications);
        this.menuBox.add_child(this.notifications);
        this.menuBox.add_child(this.calendar);
    }
}