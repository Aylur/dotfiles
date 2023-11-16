import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import Battery from 'resource:///com/github/Aylur/ags/service/battery.js';
import icons from '../../icons.js';
import FontIcon from '../../misc/FontIcon.js';
import options from '../../options.js';
import PanelButton from '../PanelButton.js';

const Indicator = () => Widget.Stack({
    items: [
        ['false', Widget.Icon({ binds: [['icon', Battery, 'icon-name']] })],
        ['true', FontIcon(icons.battery.charging)],
    ],
    connections: [[Battery, stack => {
        stack.shown = `${Battery.charging || Battery.charged}`;
    }]],
});

const PercentLabel = () => Widget.Revealer({
    transition: 'slide_right',
    binds: [['reveal-child', options.battery.show_percentage]],
    child: Widget.Label({
        binds: [['label', Battery, 'percent', p => `${p}%`]],
    }),
});

const LevelBar = () => Widget.LevelBar({
    vpack: 'center',
    binds: [['value', Battery, 'percent', p => p / 100]],
});

export default () => {
    const revaler = PercentLabel();

    return PanelButton({
        class_name: 'battery-bar',
        on_clicked: () => {
            const v = options.battery.show_percentage.value;
            options.battery.show_percentage.value = !v;
        },
        content: Widget.Box({
            binds: [['visible', Battery, 'available']],
            connections: [[Battery, w => {
                w.toggleClassName('charging', Battery.charging || Battery.charged);
                w.toggleClassName('medium', Battery.percent < options.battery.medium.value);
                w.toggleClassName('low', Battery.percent < options.battery.low.value);
                w.toggleClassName('half', Battery.percent < 48);
            }]],
            children: [
                Indicator(),
                Widget.Box({ child: revaler }),
                LevelBar(),
            ],
        }),
    });
};
