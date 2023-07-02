const { GObject } = imports.gi;
const { Service, Widget } = ags;
const { timeout, lookUpIcon } = ags.Utils;

class IndicatorService extends Service {
    static {
        Service.register(this, {
            'popup': [GObject.TYPE_DOUBLE, GObject.TYPE_STRING],
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
                this.emit('popup', -1, '');
        });
    }
}

var Indicator = class Indicator {
    static { Service.export(this, 'Indicator'); }
    static _instance = new IndicatorService();

    static connect(widget, callback) {
        const id = Indicator._instance.connect('popup', (_s, iconName, value) => {
            callback(widget, iconName, value);
        });
        widget.connect('destroy', () => Indicator._instance.disconnect(id));
    }

    static popup(value, icon) {
        Indicator._instance.popup(value, icon);
    }

    static speaker() {
        const value = ags.Service.Audio.speaker.volume;
        const icon = value => {
            const icons = [];
            icons[0] = 'audio-volume-muted-symbolic';
            icons[1] = 'audio-volume-low-symbolic';
            icons[34] = 'audio-volume-medium-symbolic';
            icons[67] = 'audio-volume-high-symbolic';
            icons[101] = 'audio-volume-overamplified-symbolic';
            for (const i of [101, 67, 34, 1, 0]) {
                if (i <= value*100)
                    return icons[i];
            }
        };
        Indicator.popup(value, icon(value));
    }

    static display() {
        // brightness is async, so lets wait a bit
        timeout(10, () => {
            const value = imports.widgets.brightness.Brightness.screen;
            const icon = value => {
                const icons = ['󰛩', '󱩎', '󱩏', '󱩐', '󱩑', '󱩒', '󱩓', '󱩔', '󱩕', '󱩖', '󰛨'];
                return icons[Math.ceil(value*10)];
            };
            Indicator.popup(value, icon(value));
        });
    }

    static kbd() {
        // brightness is async, so lets wait a bit
        timeout(10, () => {
            const value = imports.widgets.brightness.Brightness.kbd;
            Indicator.popup((value*33+1)/100, 'keyboard-brightness-symbolic');
        });
    }
};

Widget.widgets['on-screen-indicator/vertical'] = ({ iconSize = 48, height = 300, ...props }) => Widget({
    ...props,
    type: 'box',
    style: `
        padding: 1px;
    `,
    children: [{
        type: 'revealer',
        transition: 'slide_left',
        connections: [[Indicator, (revealer, value) => {
            revealer.reveal_child = value > -1;
        }]],
        child: {
            type: 'box',
            className: 'indicator',
            style: `
                min-width: ${iconSize}px;
                min-height: ${height}px;
            `,
            children: [{
                type: 'box',
                className: 'fill',
                valign: 'end',
                hexpand: true,
                connections: [[Indicator, (box, value) => {
                    if (value < 0)
                        return;

                    const preferred = (height-iconSize) * (value) + iconSize;
                    if (!box._height) {
                        box._height = preferred;
                        box.setStyle(`min-height: ${box._height}px;`);
                        return;
                    }

                    const frames = 10;
                    const goal = preferred - box._height;
                    const step = goal/frames;

                    for (let i=0; i<frames; ++i) {
                        timeout(5*i, () => {
                            box._height += step;
                            box.setStyle(`min-height: ${box._height}px;`);
                        });
                    }
                }]],
                children: [{
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
                                size: iconSize,
                                connections: [[Indicator, (icon, _v, name) => icon.icon_name = name]],
                            },
                        },
                        {
                            value: false, widget: {
                                type: 'label',
                                halign: 'center',
                                connections: [[Indicator, (lbl, _v, name) => lbl.label = name]],
                            },
                        },
                    ],
                    connections: [[Indicator, (dynamic, _v, name) => {
                        dynamic.update(value => value === !!lookUpIcon(name));
                    }]],
                }],
            }],
        },
    }],
});
