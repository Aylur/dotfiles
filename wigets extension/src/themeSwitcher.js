'use strict'

const { GObject, St, Gio, GLib } = imports.gi;
const Me = imports.misc.extensionUtils.getCurrentExtension()

const GTK_CONF_DARK = 
`@define-color accent_bg_color #8e9fc8;
@define-color accent_fg_color black;
@define-color accent_color #8e9fc8;
@define-color destructive_bg_color #bb6271;
@define-color destructive_fg_color black;
@define-color destructive_color #bb6271;
@define-color success_bg_color @green_5;
@define-color success_fg_color white;
@define-color success_color @green_1;
@define-color warning_bg_color #cd9309;
@define-color warning_fg_color rgba(0, 0, 0, 0.8);
@define-color warning_color @yellow_2;
@define-color error_bg_color #bb6271;
@define-color error_fg_color black;
@define-color error_color #bb6271;
@define-color window_bg_color #242424;
@define-color window_fg_color white;
@define-color view_bg_color #242424;
@define-color view_fg_color white;
@define-color headerbar_bg_color #242424;
@define-color headerbar_fg_color white;
@define-color headerbar_border_color white;
@define-color headerbar_backdrop_color @window_bg_color;
@define-color headerbar_shade_color rgba(0, 0, 0, 0.36);
@define-color card_bg_color rgba(255, 255, 255, 0.08);
@define-color card_fg_color white;
@define-color card_shade_color rgba(0, 0, 0, 0.36);
@define-color popover_bg_color #383838;
@define-color popover_fg_color white;
@define-color shade_color rgba(0, 0, 0, 0.36);
@define-color scrollbar_outline_color rgba(0, 0, 0, 0.5);

@define-color blue_1 #99c1f1;
@define-color blue_2 #62a0ea;
@define-color blue_3 #3584e4;
@define-color blue_4 #1c71d8;
@define-color blue_5 #1a5fb4;
@define-color green_1 #8ff0a4;
@define-color green_2 #57e389;
@define-color green_3 #33d17a;
@define-color green_4 #2ec27e;
@define-color green_5 #26a269;
@define-color yellow_1 #f9f06b;
@define-color yellow_2 #f8e45c;
@define-color yellow_3 #f6d32d;
@define-color yellow_4 #f5c211;
@define-color yellow_5 #e5a50a;
@define-color orange_1 #ffbe6f;
@define-color orange_2 #ffa348;
@define-color orange_3 #ff7800;
@define-color orange_4 #e66100;
@define-color orange_5 #c64600;
@define-color red_1 #f66151;
@define-color red_2 #ed333b;
@define-color red_3 #e01b24;
@define-color red_4 #c01c28;
@define-color red_5 #a51d2d;
@define-color purple_1 #dc8add;
@define-color purple_2 #c061cb;
@define-color purple_3 #9141ac;
@define-color purple_4 #813d9c;
@define-color purple_5 #613583;
@define-color brown_1 #cdab8f;
@define-color brown_2 #b5835a;
@define-color brown_3 #986a44;
@define-color brown_4 #865e3c;
@define-color brown_5 #63452c;
@define-color light_1 #ffffff;
@define-color light_2 #f6f5f4;
@define-color light_3 #deddda;
@define-color light_4 #c0bfbc;
@define-color light_5 #9a9996;
@define-color dark_1 #77767b;
@define-color dark_2 #5e5c64;
@define-color dark_3 #3d3846;
@define-color dark_4 #241f31;
@define-color dark_5 #000000;
`;
const GTK_CONF_LIGHT = 
`@define-color accent_bg_color #85b5ef;
@define-color accent_fg_color black;
@define-color accent_color #85b5ef;
@define-color destructive_bg_color #ec767c;
@define-color destructive_fg_color black;
@define-color destructive_color #ec767c;
@define-color success_bg_color @green_5;
@define-color success_fg_color white;
@define-color success_color @green_1;
@define-color warning_bg_color #cd9309;
@define-color warning_fg_color rgba(0, 0, 0, 0.8);
@define-color warning_color @yellow_2;
@define-color error_bg_color #ec767c;
@define-color error_fg_color black;
@define-color error_color #ec767c;
@define-color window_bg_color ivory;
@define-color window_fg_color black;
@define-color view_bg_color ivory;
@define-color view_fg_color black;
@define-color headerbar_bg_color ivory;
@define-color headerbar_fg_color black;
@define-color headerbar_border_color black;
@define-color headerbar_backdrop_color @window_bg_color;
@define-color headerbar_shade_color rgba(0, 0, 0, 0.36);
@define-color card_bg_color #c2daf6;
@define-color card_fg_color black;
@define-color card_shade_color rgba(0, 0, 0, 0.36);
@define-color popover_bg_color ivory;
@define-color popover_fg_color black;
@define-color shade_color rgba(0, 0, 0, 0.36);
@define-color scrollbar_outline_color rgba(0, 0, 0, 0.5);

@define-color blue_1 #99c1f1;
@define-color blue_2 #62a0ea;
@define-color blue_3 #3584e4;
@define-color blue_4 #1c71d8;
@define-color blue_5 #1a5fb4;
@define-color green_1 #8ff0a4;
@define-color green_2 #57e389;
@define-color green_3 #33d17a;
@define-color green_4 #2ec27e;
@define-color green_5 #26a269;
@define-color yellow_1 #f9f06b;
@define-color yellow_2 #f8e45c;
@define-color yellow_3 #f6d32d;
@define-color yellow_4 #f5c211;
@define-color yellow_5 #e5a50a;
@define-color orange_1 #ffbe6f;
@define-color orange_2 #ffa348;
@define-color orange_3 #ff7800;
@define-color orange_4 #e66100;
@define-color orange_5 #c64600;
@define-color red_1 #f66151;
@define-color red_2 #ed333b;
@define-color red_3 #e01b24;
@define-color red_4 #c01c28;
@define-color red_5 #a51d2d;
@define-color purple_1 #dc8add;
@define-color purple_2 #c061cb;
@define-color purple_3 #9141ac;
@define-color purple_4 #813d9c;
@define-color purple_5 #613583;
@define-color brown_1 #cdab8f;
@define-color brown_2 #b5835a;
@define-color brown_3 #986a44;
@define-color brown_4 #865e3c;
@define-color brown_5 #63452c;
@define-color light_1 #ffffff;
@define-color light_2 #f6f5f4;
@define-color light_3 #deddda;
@define-color light_4 #c0bfbc;
@define-color light_5 #9a9996;
@define-color dark_1 #77767b;
@define-color dark_2 #5e5c64;
@define-color dark_3 #3d3846;
@define-color dark_4 #241f31;
@define-color dark_5 #000000;
`;

const ThemeSwitcher = GObject.registerClass(
class ThemeSwitcher extends St.Widget{
    _init(){
        super._init();

        this._settingsInterface = new Gio.Settings({ schema_id: 'org.gnome.desktop.interface', });
        this._settingsBackground = new Gio.Settings({ schema_id: 'org.gnome.desktop.background', });

        this._lightBgUri = this._settingsBackground.get_string('picture-uri');
        this._darkBgUri = this._settingsBackground.get_string('picture-uri-dark');

        this._settingsInterface.connect('changed::color-scheme', () => this._onSchemeChanged());
        this._settingsBackground.connect('changed::picture-uri', () => this._onPictureChanged());
        this._settingsBackground.connect('changed::picture-uri-dark', () => this._onPictureChanged());

        this.connectObject(
            'destroy', () => this._settingsInterface.run_dispose(),
            'destroy', () => this._settingsBackground.run_dispose(),
            this);
    }
    _onSchemeChanged(){
        const colorScheme = this._settingsInterface.get_string('color-scheme');
        if(colorScheme === 'default'){
            this.lightMode();
        }
        if(colorScheme === 'prefer-dark'){
            this.darkMode();
        }
    }
    _onPictureChanged(){
        this._lightBgUri = this._settingsBackground.get_string('picture-uri');
        this._darkBgUri = this._settingsBackground.get_string('picture-uri-dark');
        const colorScheme = this._settingsInterface.get_string('color-scheme');
        if(colorScheme === 'default'){
            this.lightMode();
        }
        if(colorScheme === 'prefer-dark'){
            this.darkMode();
        }
    }
    darkMode(){
        GLib.spawn_command_line_sync('dconf write /org/gnome/shell/extensions/panel-corners/panel-corners true');
        GLib.spawn_command_line_sync('dconf write /org/gnome/shell/extensions/tiling-assistant/maximize-with-gap false');
        GLib.spawn_command_line_sync('dconf write /org/gnome/shell/extensions/tiling-assistant/screen-top-gap 8');
        GLib.spawn_command_line_sync('dconf write /org/gnome/shell/extensions/tiling-assistant/screen-bottom-gap 8');
        GLib.spawn_command_line_sync('dconf write /org/gnome/shell/extensions/tiling-assistant/screen-left-gap 8');
        GLib.spawn_command_line_sync('dconf write /org/gnome/shell/extensions/tiling-assistant/screen-right-gap 8');

        GLib.spawn_command_line_sync('dconf write /org/gnome/shell/extensions/rounded-window-corners/border-width \"uint32 1\"');
        GLib.spawn_command_line_sync('dconf write /org/gnome/shell/extensions/rounded-window-corners/border-color \"(0.3, 0.3, 0.3, 1.0)\"');

        this.wsThumbnail(this._darkBgUri);
        GLib.spawn_command_line_sync('dconf write /org/gnome/shell/extensions/user-theme/name \'\"Smooth\"\' ');

        this.gtkConfig('dark');
        
        this._settingsInterface.set_string('gtk-theme', 'adw-gtk3-dark');
        this._settingsInterface.set_string('icon-theme', 'Adw++');
        this._settingsInterface.set_string('cursor-theme', 'Qogir-dark');
    }
    lightMode(){
        GLib.spawn_command_line_sync('dconf write /org/gnome/shell/extensions/panel-corners/panel-corners false');
        GLib.spawn_command_line_sync('dconf write /org/gnome/shell/extensions/tiling-assistant/maximize-with-gap true');
        GLib.spawn_command_line_sync('dconf write /org/gnome/shell/extensions/tiling-assistant/screen-top-gap 0');
        GLib.spawn_command_line_sync('dconf write /org/gnome/shell/extensions/tiling-assistant/screen-bottom-gap 8');
        GLib.spawn_command_line_sync('dconf write /org/gnome/shell/extensions/tiling-assistant/screen-left-gap 8');
        GLib.spawn_command_line_sync('dconf write /org/gnome/shell/extensions/tiling-assistant/screen-right-gap 8');

        GLib.spawn_command_line_sync('dconf write /org/gnome/shell/extensions/rounded-window-corners/border-width \"uint32 2\"');
        GLib.spawn_command_line_sync('dconf write /org/gnome/shell/extensions/rounded-window-corners/border-color \"(0.0, 0.0, 0.0, 1.0)\"');

        this.wsThumbnail(this._lightBgUri);
        GLib.spawn_command_line_sync('dconf write /org/gnome/shell/extensions/user-theme/name \'\"Ivory\"\' ');

        this.gtkConfig('light');

        this._settingsInterface.set_string('gtk-theme', 'adw-gtk3');
        this._settingsInterface.set_string('icon-theme', 'Crayon');
        this._settingsInterface.set_string('cursor-theme', 'Qogir');
    }
    wsThumbnail(background){
        let dest = 'file:///home/'+GLib.get_user_name()+'/.local/share/gnome-shell/extensions/user-theme@gnome-shell-extensions.gcampax.github.com/stylesheet.css';
        let css = '.workspace-thumbnail{ background-image: url(\"'+ background +'\"); background-size: cover;}\n';
        const file = Gio.File.new_for_uri(dest);
        if(file.query_exists(null)){
            const [, contents, etag] = file.load_contents(null);
    
            const decoder = new TextDecoder('utf-8');
            let contentsString = decoder.decode(contents);
    
            contentsString += css;
            file.replace_contents(contentsString, null, false,
            Gio.FileCreateFlags.REPLACE_DESTINATION, null);
        }
    }
    gtkConfig(scheme){
        let gtk3Dest = 'file:///home/'+GLib.get_user_name()+'/.config/gtk-3.0/gtk.css';
        let gtk4Dest = 'file:///home/'+GLib.get_user_name()+'/.config/gtk-4.0/gtk.css';
        const gtk3 = Gio.File.new_for_uri(gtk3Dest);
        const gtk4 = Gio.File.new_for_uri(gtk4Dest);
        if(!gtk3.query_exists(null))
            gtk3.create(Gio.FileCreateFlags.NONE, null);
        if(!gtk4.query_exists(null))
            gtk4.create(Gio.FileCreateFlags.NONE, null);

        if(scheme === 'dark'){
            gtk3.replace_contents(GTK_CONF_DARK, null, false,
            Gio.FileCreateFlags.REPLACE_DESTINATION, null);
            gtk4.replace_contents(GTK_CONF_DARK, null, false,
            Gio.FileCreateFlags.REPLACE_DESTINATION, null);
        }
        if(scheme === 'light'){
            gtk3.replace_contents(GTK_CONF_LIGHT, null, false,
            Gio.FileCreateFlags.REPLACE_DESTINATION, null);
            gtk4.replace_contents(GTK_CONF_LIGHT, null, false,
            Gio.FileCreateFlags.REPLACE_DESTINATION, null);
        }
    }
});

class Extension{
    enable(){
        this.themeSwitcher = new ThemeSwitcher();
    }
    disable(){
        this.themeSwitcher.destroy();
        this.themeSwitcher = null;
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