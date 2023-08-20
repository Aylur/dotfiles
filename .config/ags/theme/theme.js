import { FontIcon } from '../modules/misc.js';
import { setupScss } from './scss.js';
import { setupHyprland } from './hyprland.js';
import themes from './themes.js';
import App from 'resource:///com/github/Aylur/ags/app.js';
import Service from 'resource:///com/github/Aylur/ags/service/service.js';
import { USER, exec, execAsync, readFile, writeFile } from 'resource:///com/github/Aylur/ags/utils.js';
import { Stack, Box, Icon, Label, Button } from 'resource:///com/github/Aylur/ags/widget.js';
import { SettingsDialog } from './dialog.js';

class ThemeService extends Service {
    static { Service.register(this); }

    _settingsPath = App.configDir + '/settings.json';
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
        exec(`rm ${this._settingsPath}`);
        this._settings = null;
        this.setup();
        this.emit('changed');
    }

    setupOther() {
        const darkmode = this.getSetting('color_scheme') === 'dark';

        const gsettings = 'gsettings set org.gnome.desktop.interface color-scheme';
        execAsync(`${gsettings} "prefer-${darkmode ? 'dark' : 'light'}"`).catch(print);

        const wezterm = `/home/${USER}/.config/wezterm`;
        execAsync(`cp ${wezterm}/charm${darkmode ? '' : '-light'}.lua ${wezterm}/theme.lua`).catch(print);
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
            this._settings = JSON.parse(readFile(this._settingsPath));
        } catch (_) {
            this._settings = {};
        }

        return this._settings;
    }

    setSetting(prop, value) {
        const settings = this.settings;
        settings[prop] = value;
        writeFile(JSON.stringify(settings, null, 2), this._settingsPath).catch(print);
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

export class Theme {
    static { Service.export(this, 'Theme'); }
    static instance = new ThemeService();
    static get themes() { return themes; }

    static reset() { Theme.instance.reset(); }
    static openSettings() { Theme.instance.openSettings(); }
    static getSetting(prop) { return Theme.instance.getSetting(prop); }
    static setSetting(prop, value) { return Theme.instance.setSetting(prop, value); }
}

export const Indicator = props => Stack({
    ...props,
    transition: 'crossfade',
    items: themes.map(({ name, icon }) =>
        [name, FontIcon({ icon })]),
    connections: [[Theme, stack => stack.shown = Theme.getSetting('theme')]],
});

export const Toggle = props => Button({
    ...props,
    className: 'active',
    properties: [
        ['list', themes],
        ['current', Theme.getSetting('theme')],
    ],
    onClicked: btn => {
        let index = btn._list.indexOf(btn._current) + 1;
        if (index > btn._list.length)
            index = 0;

        btn._current = btn._list[index];
        Theme.setSetting('theme', btn._current);
    },
});

export const Selector = props => Box({
    ...props,
    vertical: true,
    children: themes.map(({ name, icon }) => Button({
        onClicked: () => Theme.setSetting('theme', name),
        child: Box({
            children: [
                FontIcon({ icon }),
                Label(name.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')),
                Icon({
                    icon: 'object-select-symbolic',
                    hexpand: true,
                    halign: 'end',
                    connections: [[Theme, icon => icon.visible = Theme.getSetting('theme') === name]],
                }),
            ],
        }),
    })),
});
