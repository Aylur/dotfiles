const { Service } = ags;
const { exec, execAsync } = ags.Utils;

class AsusctlService extends Service {
    static { Service.register(this); }
    available = true;

    nextProfile() {
        execAsync('asusctl profile -n')
            .then(() => {
                this._profile = exec('asusctl profile -p').split(' ')[3];
                this.emit('changed');
            })
            .catch(console.error);
    }

    setProfile(prof) {
        execAsync(`asusctl profile --profile-set ${prof}`)
            .then(() => {
                this._profile = prof;
                this.emit('changed');
            })
            .catch(console.error);
    }

    nextMode() {
        execAsync(`supergfxctl -m ${this._mode === 'Hybrid' ? 'Integrated' : 'Hybrid'}`)
            .then(() => {
                this._mode = exec('supergfxctl -g');
                this.emit('changed');
            })
            .catch(console.error);
    }

    constructor() {
        super();

        if (exec('which asusctl')) {
            this._profile = exec('asusctl profile -p').split(' ')[3];
            execAsync('supergfxctl -g').then(mode => this._mode = mode);
        }
        else {
            this.available = false;
        }
    }

    get profile() { return this._profile; }
    get mode() { return this._mode || 'Hybrid'; }
}

export default class Asusctl {
    static instance = new AsusctlService();

    static nextProfile() { Asusctl.instance.nextProfile(); }
    static setProfile(prof) { Asusctl.instance.setProfile(prof); }
    static nextMode() { Asusctl.instance.nextMode(); }
    static get profile() { return Asusctl.instance.profile; }
    static get mode() { return Asusctl.instance.mode; }
    static get available() { return Asusctl.instance.available; }
    static get profiles() { return ['Performance', 'Balanced', 'Quiet']; }
}
