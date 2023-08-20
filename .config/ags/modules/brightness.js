const { Service } = ags;
const { exec, execAsync } = ags.Utils;
const { Icon, Label, Slider } = ags.Widget;

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

export const BrightnessSlider = props => Slider({
    ...props,
    drawValue: false,
    hexpand: true,
    connections: [
        [Brightness, slider => {
            slider.value = Brightness.screen;
        }],
    ],
    onChange: ({ value }) => Brightness.screen = value,
});

export const Indicator = props => Icon({
    ...props,
    icon: 'display-brightness-symbolic',
});

export const PercentLabel = props => Label({
    ...props,
    connections: [
        [Brightness, label => label.label = `${Math.floor(Brightness.screen * 100)}%`],
    ],
});
