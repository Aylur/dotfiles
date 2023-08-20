const { Battery } = ags.Service;
const { Label, Icon, Stack, ProgressBar, Overlay, Box } = ags.Widget;

const icons = charging => ([
    ...Array.from({ length: 9 }, (_, i) => i * 10).map(i => ([
        `${i}`, Icon({
            className: `${i} ${charging ? 'charging' : 'discharging'}`,
            icon: `battery-level-${i}${charging ? '-charging' : ''}-symbolic`,
        }),
    ])),
    ['100', Icon({
        className: `100 ${charging ? 'charging' : 'discharging'}`,
        icon: `battery-level-100${charging ? '-charged' : ''}-symbolic`,
    })],
]);

const Indicators = charging => Stack({
    items: icons(charging),
    connections: [[Battery, stack => {
        stack.shown = `${Math.floor(Battery.percent / 10) * 10}`;
    }]],
});

export const Indicator = ({
    charging = Indicators(true),
    discharging = Indicators(false),
    ...props
} = {}) => Stack({
    ...props,
    className: 'battery',
    items: [
        ['true', charging],
        ['false', discharging],
    ],
    connections: [[Battery, stack => {
        const { charging, charged } = Battery;
        stack.shown = `${charging || charged}`;
        stack.toggleClassName('charging', Battery.charging);
        stack.toggleClassName('charged', Battery.charged);
        stack.toggleClassName('low', Battery.percent < 30);
    }]],
});

export const LevelLabel = props => Label({
    ...props,
    connections: [[Battery, label => label.label = `${Battery.percent}%`]],
});

export const BatteryProgress = props => Box({
    ...props,
    className: 'battery-progress',
    connections: [[Battery, w => {
        w.toggleClassName('half', Battery.percent < 46);
        w.toggleClassName('charging', Battery.charging);
        w.toggleClassName('charged', Battery.charged);
        w.toggleClassName('low', Battery.percent < 30);
    }]],
    children: [Overlay({
        child: ProgressBar({
            hexpand: true,
            connections: [[Battery, progress => {
                progress.fraction = Battery.percent / 100;
            }]],
        }),
        overlays: [Label({
            connections: [[Battery, l => {
                l.label = Battery.charging || Battery.charged
                    ? '󱐋'
                    : `${Battery.percent}%`;
            }]],
        })],
    })],
});
