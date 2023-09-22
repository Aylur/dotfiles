const { Service } = ags;
const { execAsync } = ags.Utils;
const authpy = ags.App.configDir + '/js/lockscreen/auth.py';

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
        execAsync([authpy, password])
            .then(out => {
                this.emit('lock', out !== 'True');
                this.emit('authenticating', false);
            })
            .catch(console.error);
    }
}

const instance = new Lockscreen();
export default class {
    static instance = instance;

    static lockscreen() { instance.lockscreen(); }
    static auth(password) { instance.auth(password); }
}
