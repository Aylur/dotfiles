/* exported dialog */
const { Gtk } = imports.gi;
const { Theme } = ags.Service;

const row = (title, child) => ({
    type: 'box',
    className: 'row',
    children: [`${title}: `, child],
});

const img = (title, prop) => row(title, {
    type: () => Gtk.FileChooserButton.new(title, Gtk.FileChooserAction.OPEN),
    hexpand: true,
    halign: 'end',
    connections: [['selection-changed', w => Theme.setSetting(prop, w.get_uri().replace('file://', ''))]],
});

const spinbutton = (title, prop, max = 100, min = 0) => row(title, {
    type: () => Gtk.SpinButton.new_with_range(min, max, 1),
    hexpand: true,
    halign: 'end',
    connections: [
        ['value-changed', b => !b._block && Theme.setSetting(prop, b.value)],
        [Theme, b => {
            b._block = true;
            b.value = Theme.getSetting(prop);
            b._block = false;
        }],
    ],
});

const switchbtn = (title, prop) => row(title, {
    type: 'switch',
    halign: 'end',
    hexpand: true,
    onActivate: s => !s._block && Theme.setSetting(prop, s.active),
    connections: [[Theme, s => {
        s._block = true;
        s.active = Theme.getSetting(prop);
        s._block = false;
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
            onAccept: ({ text }) => Theme.setSetting(prop, text),
            valign: 'center',
            connections: [[Theme, w => w.text = Theme.getSetting(prop)]],
        },
        {
            type: () => new Gtk.ColorButton({ alpha: true }),
            valign: 'center',
            connections: [
                ['color-set', w => {
                    w.get_parent().get_children()[0].set_text(w.rgba.to_string());
                    Theme.setSetting(prop, w.rgba.to_string());
                }],
            ],
        },
    ],
});

const text = (title, prop) => row(title, {
    type: 'entry',
    className: 'text',
    hexpand: true,
    halign: 'end',
    connections: [[Theme, w => w.text = Theme.getSetting(prop)]],
    onAccept: ({ text }) => Theme.setSetting(prop, text),
});

const textspinbutton = (title, prop, list) => row(title, {
    type: 'box',
    className: 'text-spin',
    hexpand: true,
    halign: 'end',
    properties: [
        ['values', list],
        ['step', (box, step) => {
            const label = box.get_children()[0];
            const max = box._values.length - 1;
            let index = box._values.indexOf(label.label) + step;

            if (index > max)
                index = 0;

            if (index < 0)
                index = max;

            const value = box._values[index];
            label.label = value;
            Theme.setSetting(prop, value);
        }],
    ],
    children: [
        {
            type: 'label',
            connections: [[Theme, label => label.label = Theme.getSetting(prop)]],
        },
        {
            type: 'button',
            child: { type: 'icon', icon: 'pan-down-symbolic' },
            onClick: btn => {
                const box = btn.get_parent();
                box._step(box, -1);
            },
        },
        {
            type: 'button',
            child: { type: 'icon', icon: 'pan-up-symbolic' },
            onClick: btn => {
                const box = btn.get_parent();
                box._step(box, +1);
            },
        },
    ],

});

class Pages extends ags.Service {
    static { ags.Service.register(this); }
    static instance = new Pages();
    static page = '󰒓 General';
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
                    ...Object.keys(pages).map(page => tab(page)),
                    {
                        type: 'button',
                        className: 'tab',
                        onClick: Theme.reset,
                        child: '󰦛 Reset',
                        hexpand: true,
                    },
                ],
            }],
        },
        {
            type: 'box',
            className: 'content',
            children: [{
                type: 'stack',
                transition: 'slide_left_right',
                items: Object.keys(pages).map(page => [page, pages[page]]),
                connections: [[Pages, stack => {
                    stack.showChild(Pages.page);
                }]],
            }],
        },
        {
            type: 'label',
            wrap: true,
            label: 'These settings override all preset themes. To make them permanent: edit ~/.config/ags/theme/themes.js',
            className: 'disclaimer',
        },
    ],
});

const page = children => ({
    type: 'scrollable',
    child: {
        type: 'box',
        orientation: 'vertical',
        children,
    },
});

var dialog = () => {
    const win = new Gtk.Window({ name: 'settings' });
    win.add(ags.Widget(layout({
        '󰒓 General': page([
            {
                type: 'wallpaper',
                className: 'row',
                hexpand: true,
                vexpand: true,
            },
            img('Wallpaper', 'wallpaper'),
            img('Avatar', 'avatar'),
            spinbutton('Useless Gaps', 'wm_gaps', 128),
            spinbutton('Spacing', 'spacing', 18),
            spinbutton('Roundness', 'radii', 36),
            textspinbutton('Layout', 'layout', ['topbar', 'bottombar', 'unity']),
            textspinbutton('Bar Style', 'bar_style', ['normal', 'floating', 'separated']),
            switchbtn('Screen Corners', 'screen_corners'),
        ]),
        '󰏘 Colors': page([
            textspinbutton('Color Theme', 'color_scheme', ['light', 'dark']),
            ...['Red', 'Green', 'Yellow', 'Blue', 'Magenta', 'Teal', 'Orange']
                .map(c => color(c, c.toLowerCase())),
        ]),
        '󰃟 Theme': page([
            textspinbutton('Theme', 'theme', Object.keys(imports.theme.themes)),
            color('Background Color', 'bg_color'),
            color('Foreground Color', 'fg_color'),
            color('Hovered Foreground Color', 'hover_fg'),
            text('Hyprland Active Border Color', 'hypr_active_border'),
            text('Hyprland Inactive Border Color', 'hypr_inactive_border'),
            color('Accent Color', 'accent'),
            color('Accent Foreground', 'accent_fg'),
            text('Active Gradient', 'active_gradient'),
            color('Widget Background', 'widget_bg'),
            spinbutton('Widget Opacity', 'widget_opacity'),
            color('Border Color', 'border_color'),
            spinbutton('Border Width', 'border_width'),
            spinbutton('Border Opacity', 'border_opacity'),
        ]),
        '󰠱 Miscellaneous': page([
            color('Shadow', 'shadow'),
            switchbtn('Drop Shadow', 'drop_shadow'),
            spinbutton('Transition', 'transition', 1000),
            text('Desktop Clock Position', 'desktop_clock'),
            color('Wallpaper Foreground Color', 'wallpaper_fg'),
        ]),
    })));
    win.set_default_size(700, 600);
    win.connect('delete-event', () => {
        win.hide();
        return true;
    });
    return win;
};
