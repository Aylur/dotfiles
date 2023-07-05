// I am using Gnome's gsettings, but you don't have to
// you can edit the service to use a variable as a state

const { Service, Widget, App } = ags;
const { exec, CONFIG_DIR, timeout, execAsync } = ags.Utils;

const _setting = d => `gsettings ${d} org.gnome.desktop.interface color-scheme`;
const set = style => exec(`${_setting('set')} "${style}"`);
const style = () => exec(_setting('get')).trim();
const isDark = () => style() === "'prefer-dark'";

const _wezterm = imports.gi.GLib.get_user_config_dir()+'/wezterm';

function light() {
    set('prefer-light');
    App.applyCss(CONFIG_DIR+'/light.css');
    execAsync(['bash', '-c', `cp ${_wezterm}/charm-light.lua ${_wezterm}/theme.lua`]);
}

function dark() {
    set('prefer-dark');
    App.applyCss(CONFIG_DIR+'/dark.css');
    execAsync(['bash', '-c', `cp ${_wezterm}/charm.lua ${_wezterm}/theme.lua`]);
}

class Style extends Service {
    static {
        Service.register(this);
        Service.export(this, 'Style');
    }

    static instance = new Style();

    static toggle() {
        isDark() ? light() : dark();
        Style.instance.emit('changed');
    }

    constructor() {
        super();
        isDark() ? dark() : light();
        timeout(10, () => this.emit('changed'));
    }
}

Widget.widgets['style/toggle'] = props => Widget({
    ...props,
    type: 'button',
    hexpand: true,
    onClick: Style.toggle,
    connections: [[Style, button => {
        button.toggleClassName('on', isDark());
    }]],
});

Widget.widgets['style/indicator'] = props => Widget({
    ...props,
    type: 'dynamic',
    items: [
        { value: false, widget: { type: 'icon', icon: 'weather-clear-symbolic' } },
        { value: true, widget: { type: 'icon', icon: 'weather-clear-night-symbolic' } },
    ],
    connections: [[Style, dynamic => {
        dynamic.update(value => value === isDark());
    }]],
});
