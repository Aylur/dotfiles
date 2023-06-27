const { Service, Widget } = ags;
const { exec, execAsync } = ags.Utils;

class BrightnessService extends Service {
    static { Service.register(this); }

    _kbd = 0;
    _screen = 0;

    get kbd() { return this._kbd; }
    get screen() { return this._screen; }

    set kbd(value) {
        if (value < 0 || value > this._kbdMax)
            return;

        execAsync(`brightnessctl -d asus::kbd_backlight s ${value} -q`, () => {
            this._kbd = value;
            this.emit('changed');
        }, console.log);
    }

    set screen(percent) {
        if (percent < 0)
            percent = 0;

        if (percent > 100)
            percent = 100;

        execAsync(`brightnessctl s ${percent}% -q`, () => {
            this._screen = percent;
            this.emit('changed');
        }, console.log);
    }

    constructor() {
        super();
        this._kbd = Number(exec('brightnessctl -d asus::kbd_backlight g'));
        this._kbdMax = Number(exec('brightnessctl -d asus::kbd_backlight m'))
        this._screen = Number(exec('brightnessctl g')) / Number(exec('brightnessctl m')) * 100;
    }
}

var Brightness = class Brightness {
    static { Service.export(this, 'Brightness'); }
    static _instance = new BrightnessService();

    static connect(widget, callback) {
        Brightness._instance.listen(widget, callback);
    }

    static get kbd() {
        return Brightness._instance.kbd;
    }
    static get screen() {
        return Brightness._instance.screen;
    }

    static set kbd(value) {
        Brightness._instance.kbd = value;
    }

    static set screen(value) {
        Brightness._instance.screen = value;
    }
}

Widget.widgets['brightness/slider'] = props => Widget({
    ...props,
    type: 'slider',
    connections: [
        [Brightness, slider => {
            if (slider._dragging || slider.has_focus)
                return;

            if (typeof Brightness.screen === 'number')
                slider.adjustment.value = Brightness.screen;
        }],
    ],
    onChange: value => Brightness.screen = value,
});

Widget.widgets['brightness/icon'] = props => Widget({
    ...props,
    type: 'icon',
    icon: 'display-brightness-symbolic',
});

Widget.widgets['brightness/percent'] = props => Widget({
    ...props,
    type: 'label',
    label: '0',
    connections: [
        [Brightness, label => label.label = `${Math.floor(Brightness.screen)}`],
    ]
})
