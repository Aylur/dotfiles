import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import SystemTray from 'resource:///com/github/Aylur/ags/service/systemtray.js';
import PanelButton from '../PanelButton.js';
import Gdk from 'gi://Gdk';

/** @param {import('types/service/systemtray').TrayItem} item */
const SysTrayItem = item => PanelButton({
    class_name: 'tray-item',
    content: Widget.Icon({ binds: [['icon', item, 'icon']] }),
    binds: [['tooltipMarkup', item, 'tooltip-markup']],
    setup: self => {
        const id = item.menu?.connect('popped-up', menu => {
            self.toggleClassName('active');
            menu.connect('notify::visible', menu => {
                self.toggleClassName('active', menu.visible);
            });
            menu.disconnect(id);
        });

        if (id)
            self.connect('destroy', () => item.menu?.disconnect(id));
    },

    // @ts-expect-error popup_at_widget missing from types?
    on_primary_click: btn => item.menu?.popup_at_widget(
        btn, Gdk.Gravity.SOUTH, Gdk.Gravity.NORTH, null),

    // @ts-expect-error popup_at_widget missing from types?
    on_secondary_click: btn => item.menu?.popup_at_widget(
        btn, Gdk.Gravity.SOUTH, Gdk.Gravity.NORTH, null),
});

export default () => Widget.Box({
    binds: [['children', SystemTray, 'items', i => i.map(SysTrayItem)]],
});
