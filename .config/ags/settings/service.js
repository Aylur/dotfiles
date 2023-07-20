/* exported Settings */

const { Service, App } = ags;
const { CONFIG_DIR, USER, readFile, writeFile, execAsync, exec } = ags.Utils;
const { defaults } = imports.settings.defaults;

class SettingsService extends Service {
    static { Service.register(this); }

    _path = CONFIG_DIR+'/settings.json';
    _open = false;

    constructor() {
        super();

        exec('swww init');
        this.setupStyle();
        this.setupWallpaper();
        this.setupDarkmode();
    }

    reset() {
        exec(`rm ${CONFIG_DIR}/settings.json`);
        this._settings = null;
        this.setupStyle();
        this.setupWallpaper();
        this.setupDarkmode();
        this.emit('changed');
    }

    openSettings() {
        const dialog = imports.settings.dialog.dialog();
        App.windows.set('settings', dialog);
        dialog.connect('hide', () => {
            dialog.destroy();
            App.windows.delete('settings');
        });
        dialog.show_all();
    }

    setSetting(name, value) {
        const settings = this.settings;
        settings[name] = value;
        writeFile(JSON.stringify(settings, null, 2), this._path);
        this._settings = settings;
        this.emit('changed');

        if (name === 'darkmode')
            this.setupDarkmode();

        if (name === 'wallpaper')
            this.setupWallpaper();
    }

    setStyle(prop, value) {
        const style = this.settings.style || {};
        style[prop] = value;
        this.setSetting('style', style);
        this.setupStyle();
    }

    setupStyle() {
        const style = this.settings.style || {};
        const defs = defaults.style;
        const sed = (variable, file, value) => exec(
            `sed -i "/\$${variable}: /c\\\$${variable}: ${value};" ${CONFIG_DIR}/scss/${file}.scss`,
        );

        ['wm_gaps', 'spacing', 'radii', 'border_width']
            .forEach(v => sed(v, 'variables', `${style[v] || defs[v]}px`));

        ['accent', 'accent_fg', 'bg', 'border_opacity', 'widget_opacity']
            .forEach(v => sed(v, 'variables', style[v] || defs[v]));

        ['dark_bg_color', 'dark_fg_color', 'dark_hover_fg']
            .forEach(v => sed(v.substring(5), 'dark', style[v] || defs[v]));

        ['light_bg_color', 'light_fg_color', 'light_hover_fg']
            .forEach(v => sed(v.substring(6), 'light', style[v] || defs[v]));

        const getValue = variable => style[variable] || defs[variable];
        execAsync(`hyprctl keyword decoration:rounding ${getValue('radii')}`);
        execAsync(`hyprctl keyword general:border_size ${getValue('border_width')}`);
        execAsync(`hyprctl keyword general:gaps_out ${getValue('wm_gaps')}`);
        execAsync(`hyprctl keyword general:gaps_in ${getValue('wm_gaps')/2}`);

        exec(`sassc ${CONFIG_DIR}/scss/dark.scss ${CONFIG_DIR}/dark.css`);
        exec(`sassc ${CONFIG_DIR}/scss/light.scss ${CONFIG_DIR}/light.css`);

        App.applyCss(`${CONFIG_DIR}/${this.darkmode ? 'dark' : 'light'}.css`);
    }

    setupDarkmode() {
        const gsettings = 'gsettings set org.gnome.desktop.interface color-scheme';
        execAsync(`${gsettings}, "prefer-${this.darkmode ? 'dark' : 'light'}"`);

        const wezterm = `/home/${USER}/.config/wezterm`;
        execAsync(`cp ${wezterm}/charm${this.darkmode ? '' : '-light'}.lua ${wezterm}/theme.lua`);

        App.applyCss(`${CONFIG_DIR}/${this.darkmode ? 'dark' : 'light'}.css`);
    }

    setupWallpaper() {
        execAsync([
            'swww', 'img',
            '--transition-type', 'grow',
            '--transition-pos', exec('hyprctl cursorpos').replace(' ', ''),
            this.settings.wallpaper || defaults.wallpaper,
        ]);
    }

    get settings() {
        if (this._settings)
            return this._settings;

        this._settings = JSON.parse(readFile(this._path)) || {};
        return this._settings;
    }

    get darkmode() {
        if (this.settings.darkmode === false)
            return false;

        return defaults.darkmode;
    }
}

var Settings = class Settings {
    static { Service.export(this, 'Settings'); }
    static instance = new SettingsService();

    static openSettings() { Settings.instance.openSettings(); }

    static reset() { Settings.instance.reset(); }

    static setStyle(prop, value) { Settings.instance.setStyle(prop, value); }
    static getStyle(prop) { return Settings.instance.settings.style?.[prop]; }

    static get darkmode() { return Settings.instance.darkmode; }
    static set darkmode(v) { Settings.instance.setSetting('darkmode', v); }

    static get wallpaper() { return Settings.instance.settings.wallpaper || defaults.wallpaper; }
    static set wallpaper(v) { Settings.instance.setSetting('wallpaper', v); }

    static get layout() { return Settings.instance.settings.layout || defaults.layout; }
    static set layout(v) { Settings.instance.setSetting('layout', v); }

    static get preferredMpris() { return Settings.instance.settings.preferredMpris || defaults.preferredMpris; }
    static set preferredMpris(v) { Settings.instance.setSetting('preferredMpris', v); }

    static get avatar() { return Settings.instance.settings.avatar || defaults.avatar; }
    static set avatar(v) { Settings.instance.setSetting('avatar', v); }

    static get userName() { return Settings.instance.settings.userName || defaults.userName; }
    static set userName(v) { Settings.instance.setSetting('userName', v); }
};
