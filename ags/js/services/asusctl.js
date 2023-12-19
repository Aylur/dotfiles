import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';
import Service from 'resource:///com/github/Aylur/ags/service.js';

class Asusctl extends Service {
    static {
        Service.register(this, {}, {
            'profile': ['string', 'r'],
            'mode': ['string', 'r'],
        });
    }

    profiles = Object.freeze(['Performance', 'Balanced', 'Quiet']);
    #profile = 'Balanced';
    #mode = 'Hyprid';

    nextProfile() {
        Utils.execAsync('asusctl profile -n')
            .then(() => {
                this.#profile = Utils.exec('asusctl profile -p').split(' ')[3];
                this.changed('profile');
            })
            .catch(console.error);
    }

    /** @param {'Performance' | 'Balanced' | 'Quiet'} prof */
    setProfile(prof) {
        Utils.execAsync(`asusctl profile --profile-set ${prof}`)
            .then(() => {
                this.#profile = prof;
                this.changed('profile');
            })
            .catch(console.error);
    }

    nextMode() {
        Utils.execAsync(`supergfxctl -m ${this.#mode === 'Hybrid' ? 'Integrated' : 'Hybrid'}`)
            .then(() => {
                this.#mode = Utils.exec('supergfxctl -g');
                this.changed('profile');
            })
            .catch(console.error);
    }

    constructor() {
        super();

        if (Utils.exec('which asusctl')) {
            this.available = true;
            this.#profile = Utils.exec('asusctl profile -p').split(' ')[3];
            Utils.execAsync('supergfxctl -g').then(mode => this.#mode = mode);
        }
        else {
            this.available = false;
        }
    }

    get profile() { return this.#profile; }
    get mode() { return this.#mode; }
}

export default new Asusctl();
