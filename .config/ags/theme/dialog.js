import Gtk from 'gi://Gtk';
import { Theme } from './theme.js';
import themes from './themes.js';
import { Wallpaper } from '../modules/wallpaper.js';
const { Box, Stack, Label, Icon, Button, Scrollable, Entry, Widget } = ags.Widget;

const Row = (title, child) => Box({
    className: 'row',
    children: [Label(`${title}: `), child],
});

const Img = (title, prop) => Row(title, Widget({
    title,
    type: Gtk.FileChooserButton,
    hexpand: true,
    halign: 'end',
    connections: [['selection-changed',
        w => Theme.setSetting(prop, w.get_uri().replace('file://', ''))]],
}));

const SpinButton = (title, prop, max = 100, min = 0) => Row(title, Widget({
    type: Gtk.SpinButton,
    setup: w => {
        w.set_range(min, max);
        w.set_increments(1, 1);
    },
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
}));

const SwitchButton = (title, prop) => Row(title, Widget({
    type: Gtk.Switch,
    halign: 'end',
    hexpand: true,
    connections: [
        [Theme, s => {
            s._block = true;
            s.active = Theme.getSetting(prop);
            s._block = false;
        }],
        ['notify::active', s => !s._block && Theme.setSetting(prop, s.active)],
    ],
}));

const Color = (title, prop) => Row(title, Box({
    hexpand: true,
    halign: 'end',
    className: 'color',
    children: [
        Entry({
            onAccept: ({ text }) => Theme.setSetting(prop, text),
            valign: 'center',
            connections: [[Theme, w => w.text = Theme.getSetting(prop)]],
        }),
        Widget({
            type: Gtk.ColorButton,
            alpha: true,
            valign: 'center',
            connections: [
                ['color-set', w => {
                    w.get_parent().children[0].set_text(w.rgba.to_string());
                    Theme.setSetting(prop, w.rgba.to_string());
                }],
            ],
        }),
    ],
}));

const Text = (title, prop) => Row(title, Entry({
    className: 'text',
    hexpand: true,
    halign: 'end',
    connections: [[Theme, w => w.text = Theme.getSetting(prop)]],
    onAccept: ({ text }) => Theme.setSetting(prop, text),
}));

const TextSpinButton = (title, prop, list) => Row(title, Box({
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
        Label({
            connections: [[Theme, label => label.label = Theme.getSetting(prop)]],
        }),
        Button({
            child: Icon('pan-down-symbolic'),
            onClicked: btn => {
                const box = btn.get_parent();
                box._step(box, -1);
            },
        }),
        Button({
            child: Icon('pan-up-symbolic'),
            onClicked: btn => {
                const box = btn.get_parent();
                box._step(box, +1);
            },
        }),
    ],
}));

class Pages extends ags.Service {
    static { ags.Service.register(this); }
    static instance = new Pages();
    static page = '󰒓 General';
    static show(page) {
        Pages.page = page;
        Pages.instance.emit('changed');
    }
}

const Tab = page => Button({
    hexpand: true,
    className: 'tab',
    onClicked: () => Pages.show(page),
    child: Label(page),
    connections: [[Pages, b => b.toggleClassName('active', Pages.page === page)]],
});

const Layout = pages => Box({
    vertical: true,
    className: 'settings',
    hexpand: false,
    children: [
        Box({
            className: 'headerbar',
            valign: 'start',
            children: [Box({
                className: 'tabs',
                children: [
                    ...Object.keys(pages).map(page => Tab(page)),
                    Button({
                        className: 'tab',
                        onClicked: Theme.reset,
                        child: Label('󰦛 Reset'),
                        hexpand: true,
                    }),
                ],
            })],
        }),
        Box({
            className: 'content',
            children: [Stack({
                transition: 'slide_left_right',
                items: Object.keys(pages).map(page => [page, pages[page]]),
                connections: [[Pages, stack => {
                    stack.shown = Pages.page;
                }]],
            })],
        }),
        Label({
            wrap: true,
            className: 'disclaimer',
            label: 'These settings override all preset themes. ' +
                'To make them permanent: edit ~/.config/ags/theme/themes.js',
        }),
    ],
});

const Page = children => Scrollable({
    child: Box({
        vertical: true,
        children,
    }),
});

export const SettingsDialog = () => Widget({
    type: Gtk.Window,
    name: 'settings',
    child: Layout({
        '󰒓 General': Page([
            Wallpaper({
                className: 'row',
                hexpand: true,
                vexpand: true,
            }),
            Img('Wallpaper', 'wallpaper'),
            Img('Avatar', 'avatar'),
            SpinButton('Useless Gaps', 'wm_gaps', 128),
            SpinButton('Spacing', 'spacing', 18),
            SpinButton('Roundness', 'radii', 36),
            TextSpinButton('Layout', 'layout', ['topbar', 'bottombar']),
            TextSpinButton('Bar Style', 'bar_style', ['normal', 'floating', 'separated']),
            SwitchButton('Screen Corners', 'screen_corners'),
        ]),
        '󰏘 Colors': Page([
            TextSpinButton('Color Theme', 'color_scheme', ['light', 'dark']),
            ...['Red', 'Green', 'Yellow', 'Blue', 'Magenta', 'Teal', 'Orange']
                .map(c => Color(c, c.toLowerCase())),
        ]),
        '󰃟 Theme': Page([
            TextSpinButton('Theme', 'theme', themes.map(t => t.name)),
            Color('Background Color', 'bg_color'),
            Color('Foreground Color', 'fg_color'),
            Color('Hovered Foreground Color', 'hover_fg'),
            Text('Hyprland Active Border Color', 'hypr_active_border'),
            Text('Hyprland Inactive Border Color', 'hypr_inactive_border'),
            Color('Accent Color', 'accent'),
            Color('Accent Foreground', 'accent_fg'),
            Text('Active Gradient', 'active_gradient'),
            Color('Widget Background', 'widget_bg'),
            SpinButton('Widget Opacity', 'widget_opacity'),
            Color('Border Color', 'border_color'),
            SpinButton('Border Width', 'border_width'),
            SpinButton('Border Opacity', 'border_opacity'),
        ]),
        '󰠱 Miscellaneous': Page([
            Color('Shadow', 'shadow'),
            SwitchButton('Drop Shadow', 'drop_shadow'),
            SpinButton('Transition', 'transition', 1000),
            Text('Desktop Clock Position', 'desktop_clock'),
            Color('Wallpaper Foreground Color', 'wallpaper_fg'),
        ]),
    }),
    connections: [['delete-event', win => {
        win.hide();
        return true;
    }]],
    setup: win => win.set_default_size(700, 600),
});
