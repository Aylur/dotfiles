const { Service, Widget } = ags;
const { CONFIG_DIR, USER, exec, execAsync, readFile, writeFile } = ags.Utils;
const { setupHyprland } = imports.theme.hyprland;
const { setupScss } = imports.theme.scss;
const { themes } = imports.theme;

class ThemeService extends Service {
    static { Service.register(this); }

    _settingsPath = CONFIG_DIR + '/settings.json';
    _defaultAvatar = `/home/${USER}/Pictures/avatars/donna.jpg`;
    _defaultTheme = Object.keys(themes)[0];

    constructor() {
        super();
        exec('swww init');
        this.setup();
    }

    openSettings() {
        if (!this._dialog)
            this._dialog = imports.theme.dialog.dialog();

        this._dialog.hide();
        this._dialog.show_all();
    }

    setup() {
        const theme = {
            ...themes[this.getSetting('theme')],
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

        this._settings = JSON.parse(readFile(this._settingsPath)) || {};
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
            : themes[this.getSetting('theme')][prop];
    }
}

var Theme = class Theme {
    static { Service.export(this, 'Theme'); }
    static instance = new ThemeService();
    static get themes() { return themes; }

    static reset() { Theme.instance.reset(); }
    static openSettings() { Theme.instance.openSettings(); }
    static getSetting(prop) { return Theme.instance.getSetting(prop); }
    static setSetting(prop, value) { return Theme.instance.setSetting(prop, value); }
};

Widget.widgets['theme/indicator'] = props => Widget({
    ...props,
    type: 'stack',
    transition: 'crossfade',
    items: Object.values(themes).map(({ name, icon }) => [name, {
        type: 'font-icon',
        icon,
    }]),
    connections: [[Theme, stack => stack.showChild(Theme.getSetting('theme'))]],
});

Widget.widgets['theme/toggle'] = props => Widget({
    ...props,
    type: 'button',
    className: 'active',
    properties: [
        ['list', Object.keys(themes)],
        ['current', Theme.getSetting('theme')],
    ],
    onClick: btn => {
        let index = btn._list.indexOf(btn._current) + 1;
        if (index > btn._list.length)
            index = 0;

        btn._current = btn._list[index];
        Theme.setSetting('theme', btn._current);
    },
});

Widget.widgets['theme/selector'] = props => Widget({
    ...props,
    type: 'box',
    orientation: 'vertical',
    children: Object.values(themes).map(({ name, icon }) => ({
        type: 'button',
        onClick: () => Theme.setSetting('theme', name),
        child: {
            type: 'box',
            children: [
                { type: 'font-icon', icon },
                name.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
                {
                    type: 'icon',
                    icon: 'object-select-symbolic',
                    hexpand: true,
                    halign: 'end',
                    connections: [[Theme, icon => icon.visible = Theme.getSetting('theme') === name]],
                },
            ],
        },
    })),
});
