const { Service, Widget } = ags;
const { exec, applyCss, CONFIG_DIR, timeout, execAsync } = ags.Utils;

const _setting = d => `gsettings ${d} org.gnome.desktop.interface color-scheme`;
const set = style => exec(`${_setting('set')} "${style}"`);
const style = () => exec(_setting('get')).trim();
const isDark = () => style() === "'prefer-dark'";

const _wezterm = imports.gi.GLib.get_user_config_dir()+'/wezterm';
class StyleService extends Service {
    static { Service.register(this); }


    light() {
        set('prefer-light');
        applyCss(CONFIG_DIR+'/light.css');
        execAsync(['bash', '-c', `cp ${_wezterm}/charm-light.lua ${_wezterm}/theme.lua`]);
    }

    dark() {
        set('prefer-dark');
        applyCss(CONFIG_DIR+'/dark.css');
        execAsync(['bash', '-c', `cp ${_wezterm}/charm.lua ${_wezterm}/theme.lua`]);
    }

    toggle() {
        isDark() ? this.light() : this.dark();
        this.emit('changed');
    }

    constructor() {
        super();
        this.toggle();
        this.toggle();
        timeout(10, () => this.emit('changed'));
    }
}

class Style {
    static { Service.export(this, 'Style'); }
    static _instance = new StyleService();

    static toggle() {
        Style._instance.toggle();
    }

    static connect(widget, callback) {
        Style._instance.listen(widget, callback);
    }

    static isDark() {
        return isDark();
    }
}

Widget.widgets['style/toggle'] = props => Widget({
    ...props,
    type: 'button',
    hexpand: true,
    onClick: Style.toggle,
    connections: [[Style, button => {
        button.toggleClassName(isDark(), 'on');
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
