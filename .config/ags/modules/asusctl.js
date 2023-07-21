const { Service, Widget } = ags;
const { exec, execAsync } = ags.Utils;

class AsusctlService extends Service {
    static { Service.register(this); }

    nextProfile() {
        execAsync('asusctl profile -n', () => {
            this._profile = exec('asusctl profile -p').trim().split(' ')[3];
            this.emit('changed');
        });
    }

    nextMode() {
        execAsync(`supergfxctl -m ${this._mode === 'Hybrid' ? 'Integrated' : 'Hybrid'}`, () => {
            this._mode = exec('supergfxctl -g').trim();
            this.emit('changed');
        });
    }

    constructor() {
        super();

        this._profile = exec('asusctl profile -p').trim().split(' ')[3];
        this._mode = exec('supergfxctl -g').trim();
    }

    get profile() { return this._profile; }
    get mode() { return this._mode; }
}

class Asusctl {
    static { Service.export(this, 'Asusctl'); }
    static instance = new AsusctlService;
    static nextProfile() { Asusctl.instance.nextProfile(); }
    static nextMode() { Asusctl.instance.nextMode(); }
    static get profile() { return Asusctl.instance.profile; }
    static get mode() { return Asusctl.instance.mode; }
}

Widget.widgets['asusctl/profile-indicator'] = ({
    balanced = { type: 'icon', icon: 'power-profile-balanced-symbolic' },
    quiet = { type: 'icon', icon: 'power-profile-power-saver-symbolic' },
    performance = { type: 'icon', icon: 'power-profile-performance-symbolic' },
}) => Widget({
    type: 'dynamic',
    tooltip: 'Power Profile',
    items: [
        { value: 'Balanced', widget: balanced },
        { value: 'Quiet', widget: quiet },
        { value: 'Performance', widget: performance },
    ],
    connections: [[Asusctl, dynamic => dynamic.update(value => value === Asusctl.profile)]],
});

Widget.widgets['asusctl/profile-toggle'] = props => Widget({
    ...props,
    type: 'button',
    onClick: Asusctl.nextProfile,
    connections: [[Asusctl, button => {
        button.toggleClassName('on', Asusctl.profile === 'Quiet' || Asusctl.profile === 'Performance');
    }]],
});

Widget.widgets['asusctl/mode-indicator'] = ({
    integrated = { type: 'font-icon', icon: '', fontSize: 24, tooltip: 'Integrated Mode' },
    hybrid = { type: 'font-icon', icon: '󰢮', fontSize: 24, tooltip: 'Hybrid Mode' },
}) => Widget({
    type: 'dynamic',
    items: [
        { value: 'Integrated', widget: integrated },
        { value: 'Hybrid', widget: hybrid },
    ],
    halign: 'center', valign: 'center',
    connections: [[Asusctl, w => w.update(v => v === Asusctl.mode)]],
});

Widget.widgets['asusctl/mode-toggle'] = props => Widget({
    ...props,
    type: 'button',
    onClick: Asusctl.nextMode,
    connections: [[Asusctl, button => {
        button.toggleClassName('on', Asusctl.mode === 'Integrated');
    }]],
});
