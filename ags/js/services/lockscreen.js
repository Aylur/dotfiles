import Service from 'resource:///com/github/Aylur/ags/service.js';
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';
import App from 'resource:///com/github/Aylur/ags/app.js';
const authpy = App.configDir + '/js/lockscreen/auth.py';

class Lockscreen extends Service {
    static {
        Service.register(this, {
            'lock': ['boolean'],
            'authenticating': ['boolean'],
        });
    }

    lockscreen() { this.emit('lock', true); }

    /** @param {string} password */
    auth(password) {
        this.emit('authenticating', true);
        Utils.execAsync([authpy, password])
            .then(out => {
                this.emit('lock', out !== 'True');
                this.emit('authenticating', false);
            })
            .catch(err => console.error(err));
    }
}

export default new Lockscreen();
