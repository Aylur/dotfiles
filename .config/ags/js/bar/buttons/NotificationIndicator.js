import HoverRevealer from '../../misc/HoverRevealer.js';
const { Box, Label, Icon } = ags.Widget;
const { Notifications } = ags.Service;

export default ({ direction = 'left' } = {}) => Box({
    className: 'notifications panel-button',
    connections: [[Notifications, box => {
        box.visible =
            Notifications.notifications.size > 0 &&
            !Notifications.dnd;
    }]],
    children: [HoverRevealer({
        connections: [[Notifications, revealer => {
            const title = Array.from(Notifications.notifications.values()).pop()?.summary;
            if (revealer._title === title)
                return;

            revealer._title = title;
            revealer.revealChild = true;
            ags.Utils.timeout(3000, () => {
                revealer.revealChild = false;
            });
        }]],
        direction,
        indicator: Icon({
            connections: [[Notifications, icon => {
                icon.icon = Notifications.dnd
                    ? 'notifications-disabled-symbolic'
                    : 'preferences-system-notifications-symbolic';
            }]],
        }),
        child: Label({
            truncate: 'center',
            maxWidthChars: 40,
            connections: [[Notifications, label => {
                label.label = Array.from(Notifications.notifications.values()).pop()?.summary || '';
            }]],
        }),
    })],
});
