import App from 'resource:///com/github/Aylur/ags/app.js';
import Service from 'resource:///com/github/Aylur/ags/service.js';

class PowerMenu extends Service {
    static {
        Service.register(this, {}, {
            'title': ['string'],
            'cmd': ['string'],
        });
    }

    #title = '';
    #cmd = '';

    get title() { return this.#title; }
    get cmd() { return this.#cmd; }

    /** @param {'sleep' | 'reboot' | 'logout' | 'shutdown'} action */
    action(action) {
        [this.#cmd, this.#title] = {
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
