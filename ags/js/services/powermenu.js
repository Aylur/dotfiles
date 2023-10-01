import { App, Service } from '../imports.js';

class PowerMenu extends Service {
    static {
        Service.register(this, {}, {
            'title': ['string'],
            'cmd': ['string'],
        });
    }

    get title() { return this._title || ''; }
    get cmd() { return this._cmd || ''; }

    action(action) {
        [this._cmd, this._title] = {
            'sleep': ['systemctl suspend', 'Sleep'],
            'reboot': ['systemctl reboot', 'Reboot'],
            'logout': ['pkill Hyprland', 'Log Out'],
            'shutdown': ['shutdown now', 'Shutdown'],
        }[action];

        this.notify('cmd');
        this.notify('title');
        this.emit('changed');
        App.closeWindow('powermenu');
        App.openWindow('verification');
    }
}

export default new PowerMenu();
