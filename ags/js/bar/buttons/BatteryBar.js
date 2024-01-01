import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import Battery from 'resource:///com/github/Aylur/ags/service/battery.js';
import icons from '../../icons.js';
import FontIcon from '../../misc/FontIcon.js';
import options from '../../options.js';
import PanelButton from '../PanelButton.js';

const Indicator = () => Widget.Stack({
    items: [
        ['false', Widget.Icon({ icon: Battery.bind('icon_name') })],
        ['true', FontIcon(icons.battery.charging)],
    ],
    visible: options.battery.bar.show_icon.bind('value'),
    setup: self => self.hook(Battery, () => {
        self.shown = `${Battery.charging || Battery.charged}`;
    }),
});

const PercentLabel = () => Widget.Revealer({
    transition: 'slide_right',
    reveal_child: options.battery.show_percentage.bind('value'),
    child: Widget.Label({
        label: Battery.bind('percent').transform(p => `${p}%`),
    }),
});

const LevelBar = () => Widget.LevelBar({
    value: Battery.bind('percent').transform(p => p / 100),
    setup: self => self.hook(options.battery.bar.full, () => {
        const full = options.battery.bar.full.value;
        self.vpack = full ? 'fill' : 'center';
        self.hpack = full ? 'fill' : 'center';
    }),
});

const WholeButton = () => Widget.Overlay({
    class_name: 'whole-button',
    child: LevelBar(),
    pass_through: true,
    overlays: [Widget.Box({
        hpack: 'center',
        children: [
            FontIcon({
                icon: icons.battery.charging,
                visible: Battery.bind('charging'),
            }),
            Widget.Box({
                hpack: 'center',
                vpack: 'center',
                child: PercentLabel(),
            }),
        ],
    })],
});

export default () => PanelButton({
    class_name: 'battery-bar',
    on_clicked: () => {
        const v = options.battery.show_percentage.value;
        options.battery.show_percentage.value = !v;
    },
    content: Widget.Box({
        visible: Battery.bind('available'),
        children: options.battery.bar.full.bind('value').transform(full => full
            ? [WholeButton()] : [
                Indicator(),
                PercentLabel(),
                LevelBar(),
            ]),
        setup: self => self.hook(Battery, w => {
            w.toggleClassName('charging', Battery.charging || Battery.charged);
            w.toggleClassName('medium', Battery.percent < options.battery.medium.value);
            w.toggleClassName('low', Battery.percent < options.battery.low.value);
            w.toggleClassName('half', Battery.percent < 48);
        }),
    }),
});
