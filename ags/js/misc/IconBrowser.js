import { Widget } from '../imports.js';
import Gtk from 'gi://Gtk';

export default () => {
    const selected = Widget.Label({
        style: 'font-size: 1.2em;',
    });

    const flowbox = Widget({
        type: Gtk.FlowBox,
        min_children_per_line: 10,
        connections: [['child-activated', (_, { child }) => {
            selected.label = child.iconName;
        }]],
        setup: self => {
            Gtk.IconTheme.get_default().list_icons(null).sort().map(icon => {
                !icon.endsWith('.symbolic') && self.insert(Widget.Icon({
                    icon,
                    size: 38,
                }), -1);
            });

            self.show_all();
        },
    });

    const entry = Widget.Entry({
        onChange: ({ text }) => flowbox.get_children().forEach(child => {
            child.visible = child.child.iconName.includes(text);
        }),
    });

    return Widget({
        name: 'icons',
        type: Gtk.Window,
        visible: true,
        child: Widget.Box({
            style: 'padding: 30px;',
            spacing: 20,
            vertical: true,
            children: [
                entry,
                Widget.Scrollable({
                    hscroll: 'never',
                    vscroll: 'always',
                    hexpand: true,
                    vexpand: true,
                    style:
                        'min-width: 500px;' +
                        'min-height: 500px;',
                    child: flowbox,
                }),
                selected,
            ],
        }),
    });
};
