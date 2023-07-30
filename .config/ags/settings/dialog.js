/* exported dialog */
const { Gtk } = imports.gi;
const { Settings } = ags.Service;
const { defaults } = imports.settings.defaults;

const once = (widget, callback) => {
    if (!widget._first)
        return widget._first = true;

    callback(widget);
};

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
    hexpand: true,
    halign: 'end',
    connections: [
        ['value-changed', w => once(w, w => Settings.setStyle(prop, w.value))],
        [Settings, w => w.value = typeof Settings.getStyle(prop) === 'number'
            ? Settings.getStyle(prop) : defaults.style[prop]],
    ],
});

const switchbtn = (title, prop) => row(title, {
    type: 'switch',
    onActivate: ({ active }) => Settings.setStyle(prop, active),
    halign: 'end',
    hexpand: true,
    connections: [[Settings, s => {
        s.active = typeof Settings.getStyle(prop) === 'boolean'
            ? Settings.getStyle(prop)
            : defaults.style[prop];
    }]],
});

const color = (title, prop) => row(title, {
    type: 'box',
    hexpand: true,
    halign: 'end',
    className: 'color',
    children: [
        {
            type: 'entry',
            onAccept: ({ text }) => Settings.setStyle(prop, text),
            valign: 'center',
            connections: [[Settings, w => {
                w.text = Settings.getStyle(prop) || defaults.style[prop];
            }]],
        },
        {
            type: () => new Gtk.ColorButton({ alpha: true }),
            valign: 'center',
            connections: [
                ['color-set', w => {
                    w.get_parent().get_children()[0].set_text(w.rgba.to_string());
                    Settings.setStyle(prop, w.rgba.to_string());
                }],
            ],
        },
    ],
});

const text = (title, prop) => row(title, {
    type: 'entry',
    className: 'text',
    connections: [[Settings, w => w.text = Settings.getStyle(prop) || defaults.style[prop]]],
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
                        tooltip: 'Reset Settings',
                        onClick: Settings.reset,
                        child: {
                            type: 'font-icon',
                            icon: '󰦛',
                        },
                    },
                ],
            }],
        },
        {
            type: 'box',
            className: 'wallpaper-box row',
            children: [{
                type: 'wallpaper',
                hexpand: true,
                vexpand: true,
            }],
        },
        {
            type: 'stack',
            className: 'content',
            transition: 'slide_left_right',
            items: [
                ['General', pages.general],
                ['Borders', pages.borders],
                ['Colors', pages.colors],
                ['Dark', pages.dark],
                ['Light', pages.light],
            ],
            connections: [[Pages, stack => {
                stack.showChild(Pages.page);
            }]],
        },
    ],
});

const layoutRow = row('Layout', {
    type: 'box',
    className: 'layout',
    hexpand: true,
    halign: 'end',
    properties: [
        ['layouts', [
            'topbar', 'bottombar', 'unity',
        ]],
        ['step', (box, step) => {
            const label = box.get_children()[0];
            const max = box._layouts.length - 1;
            let index = box._layouts.indexOf(label.label) + step;

            if (index > max)
                index = 0;

            if (index < 0)
                index = max;

            const layout = box._layouts[index];
            label.label = layout;
            Settings.setStyle('layout', layout);
        }],
    ],
    children: [
        {
            type: 'label',
            label: Settings.getStyle('layout'),
        },
        {
            type: 'button',
            child: { type: 'icon', icon: 'pan-start-symbolic' },
            onClick: btn => {
                const box = btn.get_parent();
                box._step(box, -1);
            },
        },
        {
            type: 'button',
            child: { type: 'icon', icon: 'pan-end-symbolic' },
            onClick: btn => {
                const box = btn.get_parent();
                box._step(box, +1);
            },
        },
    ],
});

var dialog = () => {
    const win = new Gtk.Window({ name: 'settings' });
    win.add(ags.Widget(layout({
        general: {
            type: 'box',
            orientation: 'vertical',
            children: [
                img('Wallpaper', 'wallpaper'),
                img('Avatar', 'avatar'),
                spinbutton('Useless Gaps', 'wm_gaps', 128),
                spinbutton('Spacing', 'spacing', 18),
                layoutRow,
                switchbtn('Screen Corners', 'screen_corners'),
                switchbtn('Floating Bar', 'floating_bar'),
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
    win.set_default_size(600, 500);
    return win;
};
