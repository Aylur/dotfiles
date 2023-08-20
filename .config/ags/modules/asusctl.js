import { FontIcon } from './misc.js';
const { Service } = ags;
const { exec, execAsync } = ags.Utils;
const { Icon, Stack, Button } = ags.Widget;

class AsusctlService extends Service {
    static { Service.register(this); }
    available = true;

    nextProfile() {
        execAsync('asusctl profile -n')
            .then(() => {
                this._profile = exec('asusctl profile -p').split(' ')[3];
                this.emit('changed');
            })
            .catch(logError);
    }

    nextMode() {
        execAsync(`supergfxctl -m ${this._mode === 'Hybrid' ? 'Integrated' : 'Hybrid'}`)
            .then(() => {
                this._mode = exec('supergfxctl -g');
                this.emit('changed');
            })
            .catch(logError);
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

class Asusctl {
    static { Service.export(this, 'Asusctl'); }
    static instance = new AsusctlService;
    static nextProfile() { Asusctl.instance.nextProfile(); }
    static nextMode() { Asusctl.instance.nextMode(); }
    static get profile() { return Asusctl.instance.profile; }
    static get mode() { return Asusctl.instance.mode; }
    static get available() { return Asusctl.instance.available; }
}

export const ProfileIndicator = ({
    balanced = Icon('power-profile-balanced-symbolic'),
    quiet = Icon('power-profile-power-saver-symbolic'),
    performance = Icon('power-profile-performance-symbolic'),
    ...rest
} = {}) => Stack({
    ...rest,
    tooltipText: 'Power Profile',
    items: [
        ['Balanced', balanced],
        ['Quiet', quiet],
        ['Performance', performance],
    ],
    connections: [[Asusctl, stack => stack.shown = Asusctl.profile]],
});

export const ProfileToggle = props => Button({
    ...props,
    onClicked: Asusctl.nextProfile,
    connections: [[Asusctl, button => {
        button.toggleClassName('on', Asusctl.profile === 'Quiet' || Asusctl.profile === 'Performance');
    }]],
});

export const ModeIndicator = ({
    integrated = FontIcon({ icon: '', tooltipText: 'Integrated Mode' }),
    hybrid = FontIcon({ icon: '󰢮', tooltipText: 'Hybrid Mode' }),
    ...rest
} = {}) => Stack({
    ...rest,
    halign: 'center',
    valign: 'center',
    items: [
        ['Integrated', integrated],
        ['Hybrid', hybrid],
    ],
    connections: [[Asusctl, stack => stack.shown = Asusctl.mode]],
});

export const ModeToggle = props => Button({
    ...props,
    onClicked: Asusctl.nextMode,
    connections: [[Asusctl, button => {
        button.toggleClassName('on', Asusctl.mode === 'Integrated');
    }]],
});
