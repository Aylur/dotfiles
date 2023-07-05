const { App, Widget, Service } = ags;
const { exec, error } = ags.Utils;

const USER = imports.gi.GLib.get_user_name();

class System extends Service {
    static {
        Service.register(this);
        Service.export(this, 'System');
    }

    static instance = new System();

    static action(action) {
        const cmd = {
            'Sleep': 'systemctl suspend',
            'Reboot': 'systemctl reboot',
            'Log Out': `loginctl kill-user ${USER}`,
            'Shutdown': 'shutdown now',
        }[action];

        if (!cmd)
            error(`There is no ${action} system action`);

        App.getWindow('powermenu').hide();
        App.getWindow('verification').show();
        System.instance._action = { cmd, action };
        System.instance.emit('changed')
    }
}

const button = (icon, action) => ({
    type: 'button',
    onClick: () => System.action(action),
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
        {
            type: 'label',
            connections: [[System, label => {
                label.label = System.instance._action?.action || '';
            }]]
        },
        {
            type: 'label',
            label: 'Are you sure?',
        },
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
                    onClick: () => exec(System.instance._action.cmd),
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
