import { Service, Utils, App } from '../imports.js';
const authpy = App.configDir + '/js/lockscreen/auth.py';

class Lockscreen extends Service {
    static {
        Service.register(this, {
            'lock': ['boolean'],
            'authenticating': ['boolean'],
        });
    }

    lockscreen() { this.emit('lock', true); }

    auth(password) {
        this.emit('authenticating', true);
        Utils.execAsync([authpy, password])
            .then(out => {
                this.emit('lock', out !== 'True');
                this.emit('authenticating', false);
            })
            .catch(console.error);
    }
}

export default new Lockscreen();
