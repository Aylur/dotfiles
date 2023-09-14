import Notification from '../misc/Notification.js';
const { Notifications } = ags.Service;
const { Box, Revealer, Window } = ags.Widget;
const { timeout } = ags.Utils;

const Popups = () => Box({
    vertical: true,
    properties: [
        ['map', new Map()],
        ['dismiss', (box, id, force = false) => {
            if (!id || !box._map.has(id))
                return;

            if (box._map.get(id)._hovered.value && !force)
                return;

            if (box._map.size - 1 === 0)
                box.get_parent().reveal_child = false;

            timeout(200, () => {
                box._map.get(id)?.destroy();
                box._map.delete(id);
            });
        }],
        ['notify', (box, id) => {
            if (!id || Notifications.dnd)
                return;

            box._map.delete(id);
            box._map.set(id, Notification(Notifications.getNotification(id)));
            box.children = Array.from(box._map.values()).reverse();
            timeout(10, () => {
                box.get_parent().revealChild = true;
            });
        }],
    ],
    connections: [
        [Notifications, (box, id) => box._notify(box, id), 'notified'],
        [Notifications, (box, id) => box._dismiss(box, id), 'dismissed'],
        [Notifications, (box, id) => box._dismiss(box, id, true), 'closed'],
    ],
});

const PopupList = ({ transition = 'slide_down' } = {}) => Box({
    className: 'notifications-popup-list',
    style: 'padding: 1px',
    children: [
        Revealer({
            transition,
            child: Popups(),
        }),
    ],
});

export default monitor => Window({
    monitor,
    name: `notifications${monitor}`,
    anchor: 'top',
    child: PopupList(),
});
