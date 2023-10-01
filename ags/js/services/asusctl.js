import { Service, Utils } from '../imports.js';

class Asusctl extends Service {
    static {
        Service.register(this, {}, {
            'profile': ['string', 'r'],
            'mode': ['string', 'r'],
        });
    }

    nextProfile() {
        Utils.execAsync('asusctl profile -n')
            .then(() => {
                this._profile = Utils.exec('asusctl profile -p').split(' ')[3];
                this.changed('profile');
            })
            .catch(console.error);
    }

    setProfile(prof) {
        Utils.execAsync(`asusctl profile --profile-set ${prof}`)
            .then(() => {
                this._profile = prof;
                this.changed('profile');
            })
            .catch(console.error);
    }

    nextMode() {
        Utils.execAsync(`supergfxctl -m ${this._mode === 'Hybrid' ? 'Integrated' : 'Hybrid'}`)
            .then(() => {
                this._mode = Utils.exec('supergfxctl -g');
                this.changed('profile');
            })
            .catch(console.error);
    }

    constructor() {
        super();

        if (Utils.exec('which asusctl')) {
            this.available = true;
            this._profile = Utils.exec('asusctl profile -p').split(' ')[3];
            Utils.execAsync('supergfxctl -g').then(mode => this._mode = mode);
        }
        else {
            this.available = false;
        }
    }

    get profiles() { return ['Performance', 'Balanced', 'Quiet']; }
    get profile() { return this._profile; }
    get mode() { return this._mode || 'Hybrid'; }
}

export default new Asusctl();
