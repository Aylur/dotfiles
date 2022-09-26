'use strict';

const { St, GObject, Clutter, Pango, Gio, GLib, GnomeDesktop } = imports.gi; 
const Main = imports.ui.main;
const ExtensionUtils = imports.misc.extensionUtils;
const DateMenu = Main.panel.statusArea.dateMenu;

var Extension = class Extension {
    constructor() {
        this.dateMenuBox = DateMenu.get_first_child();
        this.dateMenuPadding = this.dateMenuBox.get_first_child();
        this.dateMenuIndicator = DateMenu._indicator;
        this.dateMenuDate = DateMenu._clockDisplay;
        this.dateMenuMenuBox = DateMenu.menu.box.get_first_child().get_first_child();
        this.calendar = this.dateMenuMenuBox.get_last_child();
        this.notifications = this.dateMenuMenuBox.get_first_child();
    }

    enable() {
        this.settings = ExtensionUtils.getSettings();
        this.settings.connect('changed::date-menu-remove-padding', () => this.update());
        this.settings.connect('changed::date-menu-indicator-position', () => this.update());
        this.settings.connect('changed::date-menu-mirror', () => this.update());
        this.update();

        this.settings.connect('changed::date-menu-date-format', () => this.updateClock());

        //clock
        this.clock = new St.Label({ style_class: 'clock' });
        this.clock.clutter_text.y_align = Clutter.ActorAlign.CENTER;
        this.clock.clutter_text.ellipsize = Pango.EllipsizeMode.NONE;

        this.dateMenuBox.replace_child(this.dateMenuDate, this.clock);
        this.wallclock = new GnomeDesktop.WallClock();
        this.wallclock.connect(
            'notify::clock',
            () => this.updateClock() );
        
        this.updateClock();
    }

    disable() {
        this.reset();

        this.settings = null;
        this.wallclock = null;
        this.dateMenuBox.replace_child(this.clock, this.dateMenuDate);
        this.clock.destroy();
        this.clock = null;
    }

    update(){
        this.reset();

        //position
        this.dateMenuBox.remove_child(this.dateMenuIndicator);
        this.dateMenuBox.remove_child(this.dateMenuPadding);
        if(this.settings.get_int('date-menu-indicator-position') === 0){
            this.dateMenuBox.insert_child_at_index(this.dateMenuIndicator, 0);
            this.dateMenuBox.add_child(this.dateMenuPadding);
        }else{
            this.dateMenuBox.insert_child_at_index(this.dateMenuPadding, 0);
            this.dateMenuBox.add_child(this.dateMenuIndicator);
        }

        //padding
        if(this.settings.get_boolean('date-menu-remove-padding'))
            this.dateMenuBox.remove_child(this.dateMenuPadding);

        //mirror
        if(this.settings.get_boolean('date-menu-mirror')){
            this.dateMenuMenuBox.remove_child(this.calendar);
            this.dateMenuMenuBox.remove_child(this.notifications);
            this.dateMenuMenuBox.add_child(this.calendar);
            this.dateMenuMenuBox.add_child(this.notifications);
        }
    }

    reset(){
        //position reset
        this.dateMenuBox.remove_child(this.dateMenuIndicator);
        this.dateMenuBox.remove_child(this.dateMenuPadding);
        this.dateMenuBox.insert_child_at_index(this.dateMenuPadding, 0);
        this.dateMenuBox.add_child(this.dateMenuIndicator);

        //mirror
        this.dateMenuMenuBox.remove_child(this.calendar);
        this.dateMenuMenuBox.remove_child(this.notifications);
        this.dateMenuMenuBox.add_child(this.notifications);
        this.dateMenuMenuBox.add_child(this.calendar);
    }

    updateClock(){
        this.clock.text = GLib.DateTime.new_now_local().format(this.settings.get_string('date-menu-date-format'));
    }
}