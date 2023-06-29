const { App, Window, Widget } = ags;
const { exec } = ags.Utils;

const USER = imports.gi.GLib.get_user_name();

const verificationTitle = Widget({
    type: 'label',
    className: 'title',
});

const verificationDesc = Widget({
    type: 'label',
    className: 'description',
});

let cmd;

var sysAction = function sysAction(action) {
    const title = action;
    const desc = 'Are you sure?';
    switch (action) {
    case 'Sleep': cmd = 'systemctl suspend'; break;
    case 'Reboot': cmd = 'systemctl reboot'; break;
    case 'Log Out': cmd = `loginctl kill-user ${USER}`; break;
    case 'Shutdown': cmd = 'shutdown now'; break;
    default:
        break;
    }
    verificationTitle.label = title;
    verificationDesc.label = desc;
    App.getWindow('powermenu').hide();
    App.toggleWindow('verification');
}

const button = (icon, action) => ({
    type: 'button',
    onClick: () => sysAction(action),
    child: {
        type: 'box',
        orientation: 'vertical',
        children: [
            { type: 'icon', className: 'icon', icon, size: 74 },
            action,
        ],
    },
});

Widget.widgets['powermenu/popup-content'] = () => Widget({
    type: 'box',
    homogeneous: true,
    className: 'powermenu',
    children: [
        button('weather-clear-night-symbolic', 'Sleep'),
        button('system-reboot-symbolic', 'Reboot'),
        button('system-log-out-symbolic', 'Log Out'),
        button('system-shutdown-symbolic', 'Shutdown'),
    ],
});

Widget.widgets['powermenu/verification'] = () => Widget({
    type: 'box',
    className: 'verification',
    orientation: 'vertical',
    children: [
        verificationTitle,
        verificationDesc,
        {
            type: 'box',
            className: 'buttons',
            vexpand: true,
            valign: 'end',
            homogeneous: true,
            children: [
                {
                    type: 'button',
                    child: 'Yes',
                    onClick: () => exec(cmd),
                },
                {
                    type: 'button',
                    child: 'No',
                    onClick: () => App.toggleWindow('verification'),
                },
            ],
        },
    ],
});

Widget.widgets['powermenu/panel-button'] = () => Widget({
    type: 'button',
    className: 'powermenu',
    onClick: () => App.toggleWindow('powermenu'),
    child: {
        type: 'icon',
        icon: 'system-shutdown-symbolic',
    },
});
