const { App, Service } = ags;
const { exec, error } = ags.Utils;
const { Icon, Label, Box, Button } = ags.Widget;

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
            'Log Out': 'pkill Hyprland',
            'Shutdown': 'shutdown now',
        }[action];

        if (!cmd)
            error(`There is no ${action} system action`);

        App.getWindow('powermenu').hide();
        App.getWindow('verification').show();
        System.instance._action = { cmd, action };
        System.instance.emit('changed');
    }
}

const SysButton = (icon, action) => Button({
    onClicked: () => System.action(action),
    child: Box({
        vertical: true,
        children: [
            Icon(icon),
            Label(action),
        ],
    }),
});

export const PopupContent = () => Box({
    homogeneous: true,
    className: 'powermenu',
    children: [
        SysButton('weather-clear-night-symbolic', 'Sleep'),
        SysButton('system-reboot-symbolic', 'Reboot'),
        SysButton('system-log-out-symbolic', 'Log Out'),
        SysButton('system-shutdown-symbolic', 'Shutdown'),
    ],
});

export const Verification = () => Box({
    className: 'verification',
    vertical: true,
    children: [
        Label({
            className: 'title',
            connections: [[System, label => {
                label.label = System.instance._action?.action || '';
            }]],
        }),
        Label({
            className: 'desc',
            label: 'Are you sure?',
        }),
        Box({
            className: 'buttons',
            vexpand: true,
            valign: 'end',
            homogeneous: true,
            children: [
                Button({
                    child: Label('No'),
                    onClicked: () => App.toggleWindow('verification'),
                }),
                Button({
                    child: Label('Yes'),
                    onClicked: () => exec(System.instance._action.cmd),
                }),
            ],
        }),
    ],
});

export const PanelButton = () => Button({
    className: 'powermenu panel-button',
    onClicked: () => App.toggleWindow('powermenu'),
    connections: [[ags.App, (btn, win, visible) => {
        if (win === 'powermenu' || win === 'verification')
            btn.toggleClassName('active', visible);
    }]],
    child: Icon('system-shutdown-symbolic'),
});
