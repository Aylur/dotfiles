/* exported Settings */

const { Service, App } = ags;
const { CONFIG_DIR, USER, readFile, writeFile, execAsync, exec } = ags.Utils;

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
        const s = this.settings.style || {};
        const check = (v, fallback) => v !== undefined ? v : fallback;

        [// scss
            ['wm_gaps', 'gaps', 16, true],
            ['spacing', 'spacing', 6, true],
            ['radii', 'radius', 9, true],
            ['border_width', 'borderWidth', 1, true],
            ['border_opacity', 'borderOpacity', 97],
            ['accent', 'accent', '$blue'],
            ['accent_fg', 'accentFg', '#141414'],
            ['bg', 'widgetBg', '$fg_color'],
            ['widget_opacity', 'widgetOpacity', 94],
        ].forEach(([scss, style, fallback, px]) => {
            exec(`sed -i "/\$${scss}: /c\\\$${scss}: ${check(s[style], fallback)}${px ? 'px' : ''};" ${CONFIG_DIR+'/scss/variables.scss'}`);
        });

        [// dark scss
            ['bg_color', 'darkBg', '#171717'],
            ['fg_color', 'darkFg', '#eee'],
            ['hover_fg', 'darkHoverFg', '#f1f1f1'],
        ].forEach(([scss, style, fallback]) => {
            exec(`sed -i "/\$${scss}: /c\\\$${scss}: ${check(s[style], fallback)};" ${CONFIG_DIR+'/scss/dark.scss'}`);
        });

        [// light scss
            ['bg_color', 'lightBg', '#fff'],
            ['fg_color', 'lightFg', '#171717'],
            ['hover_fg', 'lightHoverFg', '#131313'],
        ].forEach(([scss, style, fallback]) => {
            exec(`sed -i "/\$${scss}: /c\\\$${scss}: ${check(s[style], fallback)};" ${CONFIG_DIR+'/scss/light.scss'}`);
        });

        execAsync(`hyprctl keyword decoration:rounding ${check(s.radius, 9)}`);
        execAsync(`hyprctl keyword general:border_size ${check(s.borderWidth, 1)}`);
        execAsync(`hyprctl keyword general:gaps_out ${check(s.gaps, 16)}`);
        execAsync(`hyprctl keyword general:gaps_in ${check(s.gaps/2, 8)}`);

        exec(`sassc ${CONFIG_DIR}/scss/dark.scss ${CONFIG_DIR}/dark.css`);
        exec(`sassc ${CONFIG_DIR}/scss/light.scss ${CONFIG_DIR}/light.css`);
        App.applyCss(`${CONFIG_DIR}/${this.settings.darkmode ? 'dark' : 'light'}.css`);
    }

    setupDarkmode() {
        const dark = !!this.settings.darkmode;

        const gsettings = 'gsettings set org.gnome.desktop.interface color-scheme';
        execAsync(`${gsettings}, "prefer-${dark ? 'dark' : 'light'}"`);

        const wezterm = `/home/${USER}/.config/wezterm`;
        execAsync(`cp ${wezterm}/charm${dark ? '' : '-light'}.lua ${wezterm}/theme.lua`);

        App.applyCss(`${CONFIG_DIR}/${dark ? 'dark' : 'light'}.css`);
    }

    setupWallpaper() {
        execAsync([
            'swww', 'img',
            '--transition-type', 'grow',
            '--transition-pos', exec('hyprctl cursorpos').replace(' ', ''),
            this.settings.wallpaper,
        ]);
    }

    get settings() {
        if (this._settings)
            return this._settings;

        this._settings = JSON.parse(readFile(this._path)) || {};
        return this._settings;
    }
}

var Settings = class Settings {
    static { Service.export(this, 'Settings'); }
    static instance = new SettingsService();

    static openSettings() { Settings.instance.openSettings(); }

    static setStyle(prop, value) { Settings.instance.setStyle(prop, value); }
    static getStyle(prop) { return Settings.instance.settings.style?.[prop]; }

    static get darkmode() { return Settings.instance.settings.darkmode || false; }
    static set darkmode(v) { Settings.instance.setSetting('darkmode', v); }

    static get wallpaper() { return Settings.instance.settings.wallpaper; }
    static set wallpaper(v) { Settings.instance.setSetting('wallpaper', v); }

    static get layout() { return Settings.instance.settings.layout || 'topbar'; }
    static set layout(v) { Settings.instance.setSetting('layout', v); }

    static get preferredMpris() { return Settings.instance.settings.preferredMpris || 'spotify'; }
    static set preferredMpris(v) { Settings.instance.setSetting('preferredMpris', v); }

    static get avatar() { return Settings.instance.settings.avatar; }
    static set avatar(v) { Settings.instance.setSetting('avatar', v); }

    static get userName() { return Settings.instance.settings.userName || USER; }
    static set userName(v) { Settings.instance.setSetting('userName', v); }
};
