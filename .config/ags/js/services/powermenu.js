const { App, Service } = ags;

export default class PowerMenu extends Service {
    static {
        Service.PowerMenu = this;
        Service.register(this);
    }

    static instance = new PowerMenu();

    static action(action) {
        const [cmd, title] = {
            'sleep': ['systemctl suspend', 'Sleep'],
            'reboot': ['systemctl reboot', 'Reboot'],
            'logout': ['pkill Hyprland', 'Log Out'],
            'shutdown': ['shutdown now', 'Shutdown'],
        }[action];

        PowerMenu.instance.cmd = cmd;
        PowerMenu.instance.title = title;
        PowerMenu.instance.emit('changed');
        App.closeWindow('powermenu');
        App.openWindow('verification');
    }
}
