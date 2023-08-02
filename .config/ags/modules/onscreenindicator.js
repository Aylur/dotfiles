const { Service, Widget } = ags;
const { timeout, lookUpIcon, connect } = ags.Utils;

class IndicatorService extends Service {
    static {
        Service.register(this, {
            'popup': ['double', 'string'],
        });
    }

    _delay = 1500;
    _count = 0;

    popup(value, icon) {
        this.emit('popup', value, icon);
        this._count++;
        timeout(this._delay, () => {
            this._count--;

            if (this._count === 0)
                this.emit('popup', -1, icon);
        });
    }

    speaker() {
        const value = ags.Service.Audio.speaker.volume;
        const icon = value => {
            const icons = [];
            icons[0] = 'audio-volume-muted-symbolic';
            icons[1] = 'audio-volume-low-symbolic';
            icons[34] = 'audio-volume-medium-symbolic';
            icons[67] = 'audio-volume-high-symbolic';
            icons[101] = 'audio-volume-overamplified-symbolic';
            for (const i of [101, 67, 34, 1, 0]) {
                if (i <= value * 100)
                    return icons[i];
            }
        };
        this.popup(value, icon(value));
    }

    display() {
        // brightness is async, so lets wait a bit
        timeout(10, () => {
            const value = ags.Service.Brightness.screen;
            const icon = value => {
                const icons = ['󰛩', '󱩎', '󱩏', '󱩐', '󱩑', '󱩒', '󱩓', '󱩔', '󱩕', '󱩖', '󰛨'];
                return icons[Math.ceil(value * 10)];
            };
            this.popup(value, icon(value));
        });
    }

    kbd() {
        // brightness is async, so lets wait a bit
        timeout(10, () => {
            const value = ags.Service.Brightness.kbd;
            this.popup((value * 33 + 1) / 100, 'keyboard-brightness-symbolic');
        });
    }

    connectWidget(widget, callback) {
        connect(this, widget, callback, 'popup');
    }
}

class Indicator {
    static { Service.export(this, 'Indicator'); }
    static instance = new IndicatorService();
    static popup(value, icon) { Indicator.instance.popup(value, icon); }
    static speaker() { Indicator.instance.speaker(); }
    static display() { Indicator.instance.display(); }
    static kbd() { Indicator.instance.kbd(); }
}

Widget.widgets['on-screen-indicator'] = ({ height = 300, width = 48 }) => Widget({
    type: 'box',
    className: 'indicator',
    style: 'padding: 1px;',
    children: [{
        type: 'revealer',
        transition: 'slide_left',
        connections: [[Indicator, (revealer, value) => {
            revealer.reveal_child = value > -1;
        }]],
        child: {
            type: 'progress',
            width,
            height,
            vertical: true,
            connections: [[Indicator, (progress, value) => progress.setValue(value)]],
            child: {
                type: 'dynamic',
                className: 'icon',
                valign: 'start',
                halign: 'center',
                hexpand: true,
                items: [
                    {
                        value: true, widget: {
                            type: 'icon',
                            halign: 'center',
                            size: width,
                            connections: [[Indicator, (icon, _v, name) => icon.icon_name = name || '']],
                        },
                    },
                    {
                        value: false, widget: {
                            type: 'label',
                            halign: 'center',
                            connections: [[Indicator, (lbl, _v, name) => lbl.label = name || '']],
                        },
                    },
                ],
                connections: [[Indicator, (dynamic, _v, name) => {
                    dynamic.update(value => value === !!lookUpIcon(name));
                }]],
            },
        },
    }],
});
