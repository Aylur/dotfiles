import themes from '../../themes.js';
import setupScss from './scss.js';
import setupHyprland from './hyprland.js';
import { SettingsDialog } from '../../settingsdialog/SettingsDialog.js';
const { Service } = ags;
const { USER, exec, execAsync, readFile, writeFile, CACHE_DIR } = ags.Utils;
const THEME_CACHE = CACHE_DIR + '/theme-overrides.json';

class ThemeService extends Service {
    static { Service.register(this); }

    _defaultAvatar = `/home/${USER}/Pictures/avatars/donna.jpg`;
    _defaultTheme = themes[0].name;

    constructor() {
        super();
        exec('swww init');
        this.setup();
    }

    openSettings() {
        if (!this._dialog)
            this._dialog = SettingsDialog();

        this._dialog.hide();
        this._dialog.show_all();
    }

    getTheme() {
        return themes.find(({ name }) => name === this.getSetting('theme'));
    }

    setup() {
        const theme = {
            ...this.getTheme(),
            ...this.settings,
        };
        setupScss(theme);
        setupHyprland(theme);
        this.setupOther();
        this.setupWallpaper();
    }

    reset() {
        exec(`rm ${THEME_CACHE}`);
        this._settings = null;
        this.setup();
        this.emit('changed');
    }

    setupOther() {
        const darkmode = this.getSetting('color_scheme') === 'dark';

        if (exec('which gsettings')) {
            const gsettings = 'gsettings set org.gnome.desktop.interface color-scheme';
            execAsync(`${gsettings} "prefer-${darkmode ? 'dark' : 'light'}"`).catch(print);
        }
    }

    setupWallpaper() {
        execAsync([
            'swww', 'img',
            '--transition-type', 'grow',
            '--transition-pos', exec('hyprctl cursorpos').replace(' ', ''),
            this.getSetting('wallpaper'),
        ]).catch(print);
    }

    get settings() {
        if (this._settings)
            return this._settings;

        try {
            this._settings = JSON.parse(readFile(THEME_CACHE));
        } catch (_) {
            this._settings = {};
        }

        return this._settings;
    }

    setSetting(prop, value) {
        const settings = this.settings;
        settings[prop] = value;
        writeFile(JSON.stringify(settings, null, 2), THEME_CACHE).catch(print);
        this._settings = settings;
        this.emit('changed');

        if (prop === 'layout') {
            if (!this._notiSent) {
                this._notiSent = true;
                execAsync(['notify-send', 'Layout Change Needs a Reload']);
            }
            return;
        }

        this.setup();
    }

    getSetting(prop) {
        if (prop === 'theme')
            return this.settings.theme || this._defaultTheme;

        if (prop === 'avatar')
            return this.settings.avatar || this._defaultAvatar;

        return this.settings[prop] !== undefined
            ? this.settings[prop]
            : this.getTheme()[prop];
    }
}

export default class Theme {
    static { Service.Theme = this; }
    static instance = new ThemeService();
    static get themes() { return themes; }

    static setup() { Theme.instance.setup(); }
    static reset() { Theme.instance.reset(); }
    static openSettings() { Theme.instance.openSettings(); }
    static getSetting(prop) { return Theme.instance.getSetting(prop); }
    static setSetting(prop, value) { return Theme.instance.setSetting(prop, value); }
}
