import PanelButton from '../PanelButton.js';
import { SystemTray, Widget } from '../../imports.js';
import Gdk from 'gi://Gdk';

const SysTrayItem = item => PanelButton({
    content: Widget.Icon({ binds: [['icon', item, 'icon']] }),
    binds: [['tooltipMarkup', item, 'tooltip-markup']],
    setup: btn => {
        const id = item.menu.connect('popped-up', menu => {
            btn.toggleClassName('active');
            menu.connect('notify::visible', menu => {
                btn.toggleClassName('active', menu.visible);
            });
            menu.disconnect(id);
        });
    },
    onPrimaryClick: btn =>
        item.menu.popup_at_widget(btn, Gdk.Gravity.SOUTH, Gdk.Gravity.NORTH, null),
    onSecondaryClick: btn =>
        item.menu.popup_at_widget(btn, Gdk.Gravity.SOUTH, Gdk.Gravity.NORTH, null),
});

export default () => Widget.Box({
    binds: [['children', SystemTray, 'items', i => i.map(SysTrayItem)]],
});
