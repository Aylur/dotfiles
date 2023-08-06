const { Service, Widget } = ags;
const { exec, execAsync } = ags.Utils;

// Change this to whatever keyboard you have
// you can check with brightnessctl --list
const KBD = 'asus::kbd_backlight';

class BrightnessService extends Service {
    static { Service.register(this); }

    _kbd = 0;
    _screen = 0;

    get kbd() { return this._kbd; }
    get screen() { return this._screen; }

    set kbd(value) {
        if (value < 0 || value > this._kbdMax)
            return;

        execAsync(`brightnessctl -d ${KBD} s ${value} -q`)
            .then(() => {
                this._kbd = value;
                this.emit('changed');
            })
            .catch(print);
    }

    set screen(percent) {
        if (percent < 0)
            percent = 0;

        if (percent > 1)
            percent = 1;

        execAsync(`brightnessctl s ${percent * 100}% -q`)
            .then(() => {
                this._screen = percent;
                this.emit('changed');
            })
            .catch(print);
    }

    constructor() {
        super();
        this._kbd = Number(exec(`brightnessctl -d ${KBD} g`));
        this._kbdMax = Number(exec(`brightnessctl -d ${KBD} m`));
        this._screen = Number(exec('brightnessctl g')) / Number(exec('brightnessctl m'));
    }
}

class Brightness {
    static { Service.export(this, 'Brightness'); }
    static instance = new BrightnessService();

    static get kbd() { return Brightness.instance.kbd; }
    static get screen() { return Brightness.instance.screen; }
    static set kbd(value) { Brightness.instance.kbd = value; }
    static set screen(value) { Brightness.instance.screen = value; }
}

Widget.widgets['brightness/slider'] = props => Widget({
    ...props,
    type: 'slider',
    connections: [
        [Brightness, slider => {
            if (slider._dragging || slider.has_focus)
                return;

            slider.adjustment.value = Brightness.screen;
        }],
    ],
    onChange: ({ adjustment: { value } }) => Brightness.screen = value,
});

Widget.widgets['brightness/icon'] = props => Widget({
    ...props,
    type: 'icon',
    icon: 'display-brightness-symbolic',
});

Widget.widgets['brightness/percent'] = props => Widget({
    ...props,
    type: 'label',
    connections: [
        [Brightness, label => label.label = `${Math.floor(Brightness.screen * 100)}`],
    ],
});
