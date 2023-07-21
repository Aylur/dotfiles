/* exported dialog */
const { Gtk } = imports.gi;
const { Settings } = ags.Service;
const { defaults } = imports.settings.defaults;

const row = (title, child) => ({
    type: 'box',
    className: 'row',
    children: [`${title}: `, child],
});

const img = (title, setting) => row(title, {
    type: () => Gtk.FileChooserButton.new(title, Gtk.FileChooserAction.OPEN),
    hexpand: true,
    halign: 'end',
    connections: [['selection-changed', w => Settings[setting] = w.get_uri().replace('file://', '')]],
});

const spinbutton = (title, prop, max, min = 0) => row(title, {
    type: () => Gtk.SpinButton.new_with_range(min, max, 1),
    setup: w => w.value = Settings.getStyle(prop) || defaults.style[prop],
    hexpand: true,
    halign: 'end',
    connections: [['value-changed', w => {
        if (!w._first)
            return w._first = true;

        Settings.setStyle(prop, w.value);
    }]],
});

const switchbtn = (title, prop) => row(title, {
    type: 'switch',
    active: typeof Settings.getStyle(prop) === 'boolean' ? Settings.getStyle(prop) : defaults.style[prop],
    onActivate: bool => Settings.setStyle(prop, bool),
    halign: 'end',
    hexpand: true,
});

const color = (title, prop) => row(title, {
    type: 'box',
    hexpand: true,
    halign: 'end',
    className: 'color',
    children: [
        {
            type: 'entry',
            onAccept: value => Settings.setStyle(prop, value),
            text: Settings.getStyle(prop) || defaults.style[prop],
            valign: 'center',
        },
        {
            type: () => new Gtk.ColorButton({ alpha: true }),
            setup: w => w.rgba.parse(Settings.getStyle(prop) || defaults.style[prop]),
            valign: 'center',
            connections: [['color-set', w => {
                w.get_parent().get_children()[0].set_text(w.rgba.to_string());
                Settings.setStyle(prop, w.rgba.to_string());
            }]],
        },
    ],
});

const text = (title, prop) => row(title, {
    type: 'entry',
    className: 'text',
    text: Settings.getStyle(prop) || defaults.style[prop],
    hexpand: true,
    halign: 'end',
    onAccept: value => Settings.setStyle(prop, value),
});

class Pages extends ags.Service {
    static { ags.Service.register(this); }
    static instance = new Pages();
    static page = 'General';
    static show(page) {
        Pages.page = page;
        Pages.instance.emit('changed');
    }
}

const tab = page => ({
    type: 'button',
    hexpand: true,
    className: 'tab',
    onClick: () => Pages.show(page),
    child: page,
    connections: [[Pages, b => b.toggleClassName('active', Pages.page === page)]],
});

const layout = pages => ({
    type: 'box',
    orientation: 'vertical',
    className: 'settings',
    hexpand: false,
    children: [
        {
            type: 'box',
            className: 'headerbar',
            valign: 'start',
            children: [{
                type: 'box',
                className: 'tabs',
                children: [
                    tab('General'),
                    tab('Borders'),
                    tab('Colors'),
                    tab('Dark'),
                    tab('Light'),
                    {
                        type: 'button',
                        className: 'tab',
                        onClick: Settings.reset,
                        child: {
                            type: 'font-icon',
                            icon: '󰦛',
                        },
                    },
                ],
            }],
        },
        { type: 'wallpaper', className: 'row', vexpand: true },
        {
            type: 'box',
            className: 'content',
            children: [{
                type: 'dynamic',
                items: [
                    { value: 'General', widget: pages.general },
                    { value: 'Borders', widget: pages.borders },
                    { value: 'Colors', widget: pages.colors },
                    { value: 'Dark', widget: pages.dark },
                    { value: 'Light', widget: pages.light },
                ],
                connections: [[Pages, d => d.update(v => v === Pages.page)]],
            }],
        },
    ],
});

const layoutText = row('Layout', {
    type: 'entry',
    text: Settings.layout || defaults.layout,
    hexpand: true,
    halign: 'end',
    onAccept: value => Settings.layout = value,
});

var dialog = () => {
    const win = new Gtk.Window({ name: 'settings' });
    win.set_default_size(240, 500);
    win.add(ags.Widget(layout({
        general: {
            type: 'box',
            orientation: 'vertical',
            children: [
                img('Wallpaper', 'wallpaper'),
                img('Avatar', 'avatar'),
                spinbutton('Useless Gaps', 'wm_gaps', 128),
                spinbutton('Spacing', 'spacing', 18),
                layoutText,
                switchbtn('Screen Corners', 'screen_corners'),
                {
                    type: 'label',
                    label: 'Layout needs a reload to take effect',
                    valign: 'end',
                },
            ],
        },
        borders: {
            type: 'box',
            orientation: 'vertical',
            children: [
                spinbutton('Border Radius', 'radii', 32),
                spinbutton('Border Width', 'border_width', 5),
                spinbutton('Border Opacity', 'border_opacity', 100),
            ],
        },
        colors: {
            type: 'box',
            orientation: 'vertical',
            children: [
                color('Accent Color', 'accent'),
                color('Accent Foreground', 'accent_fg'),
                text('Active Gradient', 'active_gradient'),
                color('Widget Background', 'bg'),
                spinbutton('Widget Opacity', 'widget_opacity', 100, 4),
            ],
        },
        dark: {
            type: 'box',
            orientation: 'vertical',
            children: [
                color('Background Color', 'dark_bg_color'),
                color('Foreground Color', 'dark_fg_color'),
                color('Hover Foreground', 'dark_hover_fg'),
            ],
        },
        light: {
            type: 'box',
            orientation: 'vertical',
            children: [
                color('Background Color', 'light_bg_color'),
                color('Foreground Color', 'light_fg_color'),
                color('Hover Foreground', 'light_hover_fg'),
            ],
        },
    })));
    return win;
};
