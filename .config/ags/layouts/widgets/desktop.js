const { Widget } = ags;
const { Theme, System } = ags.Service;

const menuitem = (child, icon, onActivate) => ({
    type: 'menuitem',
    onActivate,
    child: {
        type: 'box',
        children: [
            {
                type: 'icon',
                icon,
                size: 16,
            },
            {
                type: 'label',
                label: child,
                hexpand: true,
                xalign: 0,
            },
        ],
    },
});

Widget.widgets['desktop'] = props => Widget({
    ...props,
    type: 'eventbox',
    onSecondaryClick: (_, event) => Widget({
        type: 'menu',
        className: 'desktop',
        children: [
            {
                type: 'menuitem',
                child: {
                    type: 'box',
                    children: [
                        {
                            type: 'icon',
                            icon: 'system-shutdown-symbolic',
                            size: 16,
                        },
                        {
                            type: 'label',
                            label: 'System',
                            hexpand: true,
                            xalign: 0,
                        },
                    ],
                },
                submenu: {
                    type: 'menu',
                    children: [
                        menuitem('Shutdown', 'system-shutdown-symbolic', () => System.action('Shutdown')),
                        menuitem('Log Out', 'system-log-out-symbolic', () => System.action('Log Out')),
                        menuitem('Reboot', 'system-reboot-symbolic', () => System.action('Log Out')),
                        menuitem('Sleep', 'weather-clear-night-symbolic', () => System.action('Log Out')),
                    ],
                },
            },
            {
                type: 'menuitem',
                className: 'separator',
            },
            menuitem('Settings', 'org.gnome.Settings-symbolic', Theme.openSettings),
        ],
    }).popup_at_pointer(event),
    child: {
        type: 'box',
        orientation: 'vertical',
        vexpand: true,
        hexpand: true,
        connections: [[Theme, box => {
            const [halign = 'center', valign = 'center', offset = 64] =
                Theme.getSetting('desktop_clock')?.split(' ') || [];

            box.halign = imports.gi.Gtk.Align[halign.toUpperCase()];
            box.valign = imports.gi.Gtk.Align[valign.toUpperCase()];
            box.setStyle(`margin: ${Number(offset)}px;`);
        }]],
        children: [
            {
                type: 'box',
                className: 'clock-box-shadow',
                children: [{
                    type: 'centerbox',
                    className: 'clock-box',
                    children: [
                        {
                            type: 'clock',
                            className: 'clock',
                            halign: 'center',
                            format: '%H',
                        },
                        {
                            type: 'box',
                            className: 'separator-box',
                            orientation: 'vertical',
                            hexpand: true,
                            halign: 'center',
                            children: [
                                { type: 'separator', valign: 'center', vexpand: true },
                                { type: 'separator', valign: 'center', vexpand: true },
                            ],
                        },
                        {
                            type: 'clock',
                            halign: 'center',
                            className: 'clock',
                            format: '%M',
                        },
                    ],
                }],
            },
            {
                type: 'clock',
                className: 'date',
                format: '%B %e. %A',
            },
        ],
    },
});
